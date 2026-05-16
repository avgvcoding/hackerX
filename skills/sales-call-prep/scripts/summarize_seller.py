#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
ENRICHED_DATASET = ROOT / "enrich_seller_dataset.json"
BASELINE_DATASET = ROOT / "seller_dataset.json"


def dataset_path() -> Path:
    return ENRICHED_DATASET if ENRICHED_DATASET.exists() else BASELINE_DATASET


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: summarize_seller.py <glid>")
    glid = sys.argv[1]
    data = json.loads(dataset_path().read_text(encoding="utf-8"))
    seller = next((record for record in data["records"] if str(record["glid"]) == glid), None)
    if seller is None:
        raise SystemExit(f"GLID not found: {glid}")
    identity = seller["seller_identity"]
    performance = seller["performance_snapshot"]
    pains = ", ".join(point["category"] for point in seller.get("pain_points", [])[:4])
    categories = seller.get("categories_bl_last_6_months", [])[:3]
    print(f"{identity['company_name']} ({glid})")
    print(f"{identity['contact_person']} | {identity['city']}, {identity['state']} | {identity['customer_type']}")
    print(f"Category score: {performance.get('category_score')} | Products: {performance.get('product_count')}")
    print(f"Pain points: {pains}")
    if categories:
        print("Top category/product signals:")
        for category in categories:
            products = ", ".join(category.get("primary_products") or category.get("secondary_products") or [])
            print(
                f"- {category.get('mcat_name')} | rank {category.get('rank')} | "
                f"{category.get('no_of_products')} products | "
                f"{category.get('pur_bl_t_last_6m')} Buy Lead demand | {products}"
            )


if __name__ == "__main__":
    main()
