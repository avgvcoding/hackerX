from __future__ import annotations

from backend.app.data_store import seller_store
from backend.app.rag import rag_index


def assert_true(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> None:
    assert_true(len(seller_store.records) == 400, "dataset must contain 400 sellers")
    first = seller_store.records[0]
    assert_true(first["glid"] == "42473394", "original seller must remain first")
    assert_true(first["record_type"] == "original", "first seller must be marked original")
    assert_true(first.get("categories_bl_last_6_months"), "enriched category data must be loaded")
    assert_true(seller_store.get("42473394") is not None, "known GLID should resolve")
    assert_true(len(rag_index.doc_chunks) > 10, "docs should be indexed")
    trustseal = rag_index.search("TrustSEAL paid services", top_k=5)
    pns = rag_index.search("PNS sales servicing", top_k=5)
    product = rag_index.search("product rejection seller pain", glid="42473394", top_k=8)
    categories = rag_index.search("Steel Drag Chain primary products category", glid="42473394", top_k=8)
    assert_true(any("paid_services" in chunk.source or "glossary" in chunk.source for chunk in trustseal), "TrustSEAL retrieval failed")
    assert_true(any("sales_and_servicing" in chunk.source or "glossary" in chunk.source for chunk in pns), "PNS retrieval failed")
    assert_true(any(chunk.kind == "seller" for chunk in product), "seller pain retrieval failed")
    assert_true(
        any("categories_products" in chunk.source for chunk in categories),
        "seller category/product retrieval failed",
    )
    print("backend smoke tests passed")


if __name__ == "__main__":
    main()
