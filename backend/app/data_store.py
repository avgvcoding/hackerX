from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .config import settings


class SellerStore:
    def __init__(self, dataset_path: Path = settings.seller_dataset_path) -> None:
        self.dataset_path = dataset_path
        self.metadata: dict[str, Any] = {}
        self.records: list[dict[str, Any]] = []
        self.by_glid: dict[str, dict[str, Any]] = {}
        self.load()

    def load(self) -> None:
        raw = json.loads(self.dataset_path.read_text(encoding="utf-8"))
        self.metadata = raw.get("metadata", {})
        self.records = raw.get("records", [])
        self.by_glid = {str(record["glid"]): record for record in self.records}

    def get(self, glid: str) -> dict[str, Any] | None:
        return self.by_glid.get(str(glid))

    def search(self, query: str | None, limit: int = 25) -> list[dict[str, Any]]:
        if not query:
            return self.records[:limit]
        q = query.strip().lower()
        scored: list[tuple[int, dict[str, Any]]] = []
        for record in self.records:
            identity = record.get("seller_identity", {})
            categories = record.get("categories_bl_last_6_months", [])
            category_terms: list[str] = []
            for category in categories[:8]:
                category_terms.extend(
                    str(x or "")
                    for x in [
                        category.get("mcat_name"),
                        category.get("rank"),
                        category.get("service"),
                    ]
                )
                category_terms.extend(str(x or "") for x in category.get("primary_products", [])[:3])
                category_terms.extend(str(x or "") for x in category.get("secondary_products", [])[:3])
            haystack = " ".join(
                str(x or "")
                for x in [
                    record.get("glid"),
                    identity.get("company_name"),
                    identity.get("contact_person"),
                    identity.get("city"),
                    identity.get("state"),
                    identity.get("customer_type"),
                    identity.get("business_type"),
                    *category_terms,
                ]
            ).lower()
            if q in haystack:
                score = 100 if str(record.get("glid")) == q else haystack.count(q)
                scored.append((score, record))
        scored.sort(key=lambda item: item[0], reverse=True)
        return [record for _, record in scored[:limit]]


seller_store = SellerStore()
