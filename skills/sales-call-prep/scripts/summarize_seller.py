#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
DATASET = ROOT / "seller_dataset.json"


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: summarize_seller.py <glid>")
    glid = sys.argv[1]
    data = json.loads(DATASET.read_text(encoding="utf-8"))
    seller = next((record for record in data["records"] if str(record["glid"]) == glid), None)
    if seller is None:
        raise SystemExit(f"GLID not found: {glid}")
    identity = seller["seller_identity"]
    performance = seller["performance_snapshot"]
    pains = ", ".join(point["category"] for point in seller.get("pain_points", [])[:4])
    print(f"{identity['company_name']} ({glid})")
    print(f"{identity['contact_person']} | {identity['city']}, {identity['state']} | {identity['customer_type']}")
    print(f"Category score: {performance.get('category_score')} | Products: {performance.get('product_count')}")
    print(f"Pain points: {pains}")


if __name__ == "__main__":
    main()
