from __future__ import annotations

import math
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from .config import settings
from .data_store import seller_store
from .models import SourceChunk


TOKEN_RE = re.compile(r"[a-zA-Z0-9][a-zA-Z0-9_+\-.]*")
HEADING_RE = re.compile(r"^(#{1,4})\s+(.+?)\s*$")


@dataclass
class RawChunk:
    id: str
    source: str
    title: str
    text: str
    kind: str


def tokenize(text: str) -> list[str]:
    return [match.group(0).lower() for match in TOKEN_RE.finditer(text)]


def compact(value: object, limit: int = 900) -> str:
    text = str(value)
    return text if len(text) <= limit else text[: limit - 3] + "..."


class RAGIndex:
    def __init__(self, docs_dir: Path = settings.docs_dir) -> None:
        self.docs_dir = docs_dir
        self.doc_chunks: list[RawChunk] = []
        self.seller_chunks: list[RawChunk] = []
        self.chunks: list[RawChunk] = []
        self.term_freqs: list[Counter[str]] = []
        self.idf: dict[str, float] = {}
        self.avg_len = 1.0
        self.rebuild()

    def rebuild(self) -> None:
        self.doc_chunks = self._load_doc_chunks()
        self.seller_chunks = self._load_seller_chunks()
        self.chunks = self.doc_chunks + self.seller_chunks
        self._build_stats()

    def _load_doc_chunks(self) -> list[RawChunk]:
        chunks: list[RawChunk] = []
        for path in sorted(self.docs_dir.glob("*.md")):
            text = path.read_text(encoding="utf-8", errors="ignore")
            chunks.extend(self._chunk_markdown(path, text))
        return chunks

    def _chunk_markdown(self, path: Path, text: str) -> list[RawChunk]:
        chunks: list[RawChunk] = []
        heading_stack: list[tuple[int, str]] = []
        current_heading = path.stem
        current_lines: list[str] = []

        def flush() -> None:
            nonlocal current_lines, current_heading
            body = "\n".join(line.rstrip() for line in current_lines).strip()
            if not body:
                current_lines = []
                return
            for index, part in enumerate(self._split_long_text(body)):
                chunk_id = f"docs/{path.name}#{slugify(current_heading)}-{len(chunks)}-{index}"
                chunks.append(
                    RawChunk(
                        id=chunk_id,
                        source=f"docs/{path.name}#{current_heading}",
                        title=current_heading,
                        text=part,
                        kind="doc",
                    )
                )
            current_lines = []

        for line in text.splitlines():
            heading = HEADING_RE.match(line)
            if heading:
                flush()
                level = len(heading.group(1))
                title = heading.group(2).strip()
                heading_stack = [(lvl, txt) for lvl, txt in heading_stack if lvl < level]
                heading_stack.append((level, title))
                current_heading = " > ".join(txt for _, txt in heading_stack)
            else:
                current_lines.append(line)
        flush()
        return chunks

    def _split_long_text(self, text: str, max_chars: int = 1800) -> list[str]:
        if len(text) <= max_chars:
            return [text]
        paras = [p.strip() for p in text.split("\n\n") if p.strip()]
        out: list[str] = []
        current = ""
        for para in paras:
            if len(current) + len(para) + 2 > max_chars and current:
                out.append(current.strip())
                current = para
            else:
                current = f"{current}\n\n{para}".strip()
        if current:
            out.append(current.strip())
        return out

    def _load_seller_chunks(self) -> list[RawChunk]:
        chunks: list[RawChunk] = []
        for record in seller_store.records:
            glid = str(record["glid"])
            identity = record.get("seller_identity", {})
            account = record.get("account_status", {})
            performance = record.get("performance_snapshot", {})
            history = record.get("sales_service_history", [])
            pain_points = record.get("pain_points", [])
            company = identity.get("company_name", glid)
            seller_sections = {
                "identity": compact(identity, 1400),
                "account_status": compact(account, 1400),
                "performance": compact(performance, 1600),
                "history": compact(history[:8], 2400),
                "pain_points": compact(pain_points, 1800),
            }
            for name, text in seller_sections.items():
                chunks.append(
                    RawChunk(
                        id=f"seller_dataset.json:{glid}.{name}",
                        source=f"seller_dataset.json:{glid}.{name}",
                        title=f"{company} {name.replace('_', ' ')}",
                        text=text,
                        kind="seller",
                    )
                )
        return chunks

    def _build_stats(self) -> None:
        self.term_freqs = [Counter(tokenize(chunk.text + " " + chunk.title)) for chunk in self.chunks]
        doc_freq: defaultdict[str, int] = defaultdict(int)
        lengths = []
        for tf in self.term_freqs:
            lengths.append(sum(tf.values()))
            for term in tf:
                doc_freq[term] += 1
        total = max(len(self.chunks), 1)
        self.avg_len = sum(lengths) / max(len(lengths), 1)
        self.idf = {term: math.log(1 + (total - freq + 0.5) / (freq + 0.5)) for term, freq in doc_freq.items()}

    def search(self, query: str, glid: str | None = None, top_k: int = 8) -> list[SourceChunk]:
        query_tokens = tokenize(query)
        if glid:
            query_tokens += [str(glid)]
        if not query_tokens:
            return []

        results: list[SourceChunk] = []
        for idx, chunk in enumerate(self.chunks):
            if glid and chunk.kind == "seller" and f":{glid}." not in chunk.source:
                continue
            score = self._bm25(query_tokens, self.term_freqs[idx])
            if score > 0:
                results.append(
                    SourceChunk(
                        id=chunk.id,
                        source=chunk.source,
                        title=chunk.title,
                        text=chunk.text[:1200],
                        score=round(score, 4),
                        kind=chunk.kind,  # type: ignore[arg-type]
                    )
                )
        results.sort(key=lambda item: item.score, reverse=True)
        return results[:top_k]

    def _bm25(self, query_tokens: Iterable[str], tf: Counter[str]) -> float:
        k1 = 1.5
        b = 0.75
        doc_len = sum(tf.values()) or 1
        score = 0.0
        for term in query_tokens:
            freq = tf.get(term, 0)
            if not freq:
                continue
            idf = self.idf.get(term, 0.0)
            denom = freq + k1 * (1 - b + b * doc_len / self.avg_len)
            score += idf * (freq * (k1 + 1)) / denom
        return score


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:80] or "section"


rag_index = RAGIndex()

