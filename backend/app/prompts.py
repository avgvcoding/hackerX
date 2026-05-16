from __future__ import annotations

import json
from typing import Any

from .models import SourceChunk


SYSTEM_PROMPT = """You are an IndiaMART sales-call-preparation assistant.
Use seller data first, IndiaMART documents second, and general reasoning only when explicitly marked as inference.
Never reveal or invent unmasked phone numbers or emails. Keep masked values masked.
If data is missing or inaccessible, say so directly.
Prefer recent and repeated pain points.
Every brief, pitch, and answer must cite evidence from seller history, performance, or IndiaMART docs.
For Hinglish, write Hindi words in English alphabets and keep business terms such as Buy Lead, Lead Manager, TrustSEAL, Category, Callback, Package.
For Hindi, keep IndiaMART business terms readable and do not translate product names awkwardly."""


def context_block(seller: dict[str, Any], sources: list[SourceChunk]) -> str:
    slim_seller = {
        "glid": seller.get("glid"),
        "record_type": seller.get("record_type"),
        "seller_identity": seller.get("seller_identity"),
        "account_status": seller.get("account_status"),
        "contact_context": seller.get("contact_context"),
        "performance_snapshot": seller.get("performance_snapshot"),
        "sales_service_history": seller.get("sales_service_history", [])[:8],
        "pain_points": seller.get("pain_points"),
        "model_usage_notes": seller.get("model_usage_notes"),
    }
    source_text = "\n\n".join(
        f"[{idx + 1}] {source.source}\nTitle: {source.title}\n{source.text}" for idx, source in enumerate(sources)
    )
    return "SELLER DATA:\n" + json.dumps(slim_seller, ensure_ascii=False, indent=2) + "\n\nRETRIEVED CONTEXT:\n" + source_text


def brief_prompt(seller: dict[str, Any], sources: list[SourceChunk], language: str, objective: str) -> list[dict[str, str]]:
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": f"""{context_block(seller, sources)}

Create a pre-call brief in {language}.
Call objective: {objective}.

Use this exact structure:
## Client Snapshot
## Account Health
## Recent History
## Key Pain Points
## Recommended Call Objective
## Suggested Opening
## Risks / Avoid Points
## Sources

Keep it crisp and useful for a salesperson who has 30 seconds before calling.""",
        },
    ]


def pitch_prompt(
    seller: dict[str, Any],
    sources: list[SourceChunk],
    language: str,
    objective: str,
    salesperson_context: str | None,
) -> list[dict[str, str]]:
    extra = salesperson_context or "No extra salesperson context provided."
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": f"""{context_block(seller, sources)}

Generate a sales/service pitch in {language}.
Call objective: {objective}.
Salesperson context: {extra}

Use this exact structure:
## Opening
## Context Acknowledgement
## Main Value Pitch
## Issue-Resolution Angle
## Likely Objections And Responses
## Next Step
## Follow-up Note
## Sources""",
        },
    ]


def chat_prompt(
    seller: dict[str, Any],
    sources: list[SourceChunk],
    language: str,
    objective: str,
    messages: list[dict[str, str]],
) -> list[dict[str, str]]:
    conversation = "\n".join(f"{m['role']}: {m['content']}" for m in messages[-8:])
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": f"""{context_block(seller, sources)}

Call objective: {objective}
Language: {language}

Conversation:
{conversation}

Answer the latest user question using:
## Direct Answer
## Evidence
## Suggested Salesperson Action
## Sources""",
        },
    ]

