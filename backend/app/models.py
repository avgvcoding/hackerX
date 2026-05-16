from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


Language = Literal["English", "Hinglish", "Hindi"]


class SearchRequest(BaseModel):
    query: str
    glid: str | None = None
    top_k: int = Field(default=6, ge=1, le=20)


class GenerationRequest(BaseModel):
    glid: str
    language: Language = "English"
    call_objective: str = "Issue resolution"
    salesperson_context: str | None = None


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    glid: str
    messages: list[ChatMessage]
    language: Language = "English"
    call_objective: str = "Issue resolution"


class SourceChunk(BaseModel):
    id: str
    source: str
    title: str
    text: str
    score: float
    kind: Literal["doc", "seller"]


class GenerationResponse(BaseModel):
    mode: Literal["gateway", "local_fallback"]
    model: str
    content: str
    sources: list[SourceChunk]
    diagnostics: dict[str, str | None] = Field(default_factory=dict)


class HealthResponse(BaseModel):
    status: str
    sellers: int
    docs: int
    seller_chunks: int
    total_chunks: int
    llm_configured: bool
    primary_model: str
    fallback_model: str
    base_url: str
    llm_status: str
    rag_status: str


SellerRecord = dict[str, Any]
