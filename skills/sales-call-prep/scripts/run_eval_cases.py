#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
DATASET = ROOT / "enrich_seller_dataset.json"
SKILL = ROOT / "skills" / "sales-call-prep" / "SKILL.md"
REFERENCES = ROOT / "skills" / "sales-call-prep" / "references"
EVALS = ROOT / "skills" / "sales-call-prep" / "evals" / "evals.json"


def assert_true(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> None:
    assert_true(DATASET.exists(), "enrich_seller_dataset.json must exist")
    data = json.loads(DATASET.read_text(encoding="utf-8"))
    seller = next((record for record in data["records"] if str(record["glid"]) == "42473394"), None)
    assert_true(seller is not None, "demo GLID 42473394 must exist")
    assert_true(seller.get("pain_points"), "demo seller must include pain points")
    assert_true(seller.get("sales_service_history"), "demo seller must include service history")
    assert_true(seller.get("categories_bl_last_6_months"), "demo seller must include category/product signals")

    skill_text = SKILL.read_text(encoding="utf-8")
    for required in ["Evidence", "Sources", "issue resolution", "category/product"]:
        assert_true(required.lower() in skill_text.lower(), f"SKILL.md should mention {required}")

    for name in ["pitch-rules.md", "output-contract.md", "evidence-and-safety.md", "evaluation-cases.md"]:
        assert_true((REFERENCES / name).exists(), f"missing reference file: {name}")

    assert_true(EVALS.exists(), "missing canonical evals/evals.json")
    evals = json.loads(EVALS.read_text(encoding="utf-8"))
    assert_true(evals.get("skill_name") == "sales-call-prep", "evals skill_name must match skill")
    cases = evals.get("evals", [])
    assert_true(len(cases) >= 3, "evals/evals.json should contain at least 3 cases")
    for case in cases:
        assert_true(case.get("id"), "each eval case needs an id")
        assert_true(case.get("prompt"), f"eval case {case.get('id')} needs a prompt")
        assert_true(case.get("expected_output"), f"eval case {case.get('id')} needs expected_output")

    top_category = seller["categories_bl_last_6_months"][0]
    print("sales-call-prep eval passed")
    print(f"Demo seller: {seller['seller_identity']['company_name']} ({seller['glid']})")
    print(f"Top MCAT: {top_category['mcat_name']} | rank {top_category['rank']}")
    print(f"Primary product: {', '.join(top_category.get('primary_products', []))}")
    print(f"Eval cases: {len(cases)}")


if __name__ == "__main__":
    main()
