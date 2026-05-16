from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .data_store import seller_store
from .llm import llm_client
from .models import ChatRequest, GenerationRequest, GenerationResponse, HealthResponse, SearchRequest
from .prompts import brief_prompt, chat_prompt, pitch_prompt
from .rag import rag_index


app = FastAPI(title="IndiaMART Sales Call Prep API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    llm_status = "Gateway key loaded" if llm_client.configured else "No gateway key loaded; local fallback active"
    rag_status = f"Ready: {len(rag_index.doc_chunks)} document chunks + {len(rag_index.seller_chunks)} seller chunks"
    return HealthResponse(
        status="ok",
        sellers=len(seller_store.records),
        docs=len(rag_index.doc_chunks),
        seller_chunks=len(rag_index.seller_chunks),
        total_chunks=len(rag_index.chunks),
        llm_configured=llm_client.configured,
        primary_model=settings.llm_primary_model,
        fallback_model=settings.llm_fallback_model,
        base_url=settings.llm_base_url,
        llm_status=llm_status,
        rag_status=rag_status,
    )


@app.get("/api/sellers")
def search_sellers(query: str | None = None, limit: int = 25) -> dict:
    records = seller_store.search(query, limit=min(limit, 100))
    return {"records": [summary(record) for record in records]}


@app.get("/api/sellers/{glid}")
def get_seller(glid: str) -> dict:
    seller = seller_store.get(glid)
    if not seller:
        raise HTTPException(status_code=404, detail=f"Seller GLID {glid} not found")
    return seller


@app.post("/api/rag/search")
def rag_search(request: SearchRequest) -> dict:
    chunks = rag_index.search(request.query, glid=request.glid, top_k=request.top_k)
    return {"chunks": chunks}


@app.post("/api/brief", response_model=GenerationResponse)
def generate_brief(request: GenerationRequest) -> GenerationResponse:
    seller = require_seller(request.glid)
    query = f"{request.call_objective} pre-call brief seller pains IndiaMART TrustSEAL Buy Lead PNS category product quality"
    sources = rag_index.search(query, glid=request.glid, top_k=8)
    mode, model, content, diagnostics = llm_client.complete(
        brief_prompt(seller, sources, request.language, request.call_objective)
    )
    return GenerationResponse(mode=mode, model=model, content=content, sources=sources, diagnostics=diagnostics)


@app.post("/api/pitch", response_model=GenerationResponse)
def generate_pitch(request: GenerationRequest) -> GenerationResponse:
    seller = require_seller(request.glid)
    query = f"{request.call_objective} pitch objection handling buy lead category product rejection email verification IndiaMART"
    sources = rag_index.search(query, glid=request.glid, top_k=8)
    mode, model, content, diagnostics = llm_client.complete(
        pitch_prompt(seller, sources, request.language, request.call_objective, request.salesperson_context)
    )
    return GenerationResponse(mode=mode, model=model, content=content, sources=sources, diagnostics=diagnostics)


@app.post("/api/chat", response_model=GenerationResponse)
def chat(request: ChatRequest) -> GenerationResponse:
    seller = require_seller(request.glid)
    latest = request.messages[-1].content if request.messages else ""
    sources = rag_index.search(latest or request.call_objective, glid=request.glid, top_k=8)
    mode, model, content, diagnostics = llm_client.complete(
        chat_prompt(
            seller,
            sources,
            request.language,
            request.call_objective,
            [message.model_dump() for message in request.messages],
        )
    )
    return GenerationResponse(mode=mode, model=model, content=content, sources=sources, diagnostics=diagnostics)


def require_seller(glid: str) -> dict:
    seller = seller_store.get(glid)
    if not seller:
        raise HTTPException(status_code=404, detail=f"Seller GLID {glid} not found")
    return seller


def summary(record: dict) -> dict:
    identity = record.get("seller_identity", {})
    performance = record.get("performance_snapshot", {})
    return {
        "glid": record.get("glid"),
        "record_type": record.get("record_type"),
        "company_name": identity.get("company_name"),
        "contact_person": identity.get("contact_person"),
        "city": identity.get("city"),
        "state": identity.get("state"),
        "customer_type": identity.get("customer_type"),
        "business_type": identity.get("business_type"),
        "product_count": performance.get("product_count"),
        "category_score": performance.get("category_score"),
    }
