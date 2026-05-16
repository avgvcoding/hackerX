from __future__ import annotations

import json
import urllib.error
import urllib.request
from typing import Any

from .config import settings
from .models import SourceChunk


class LLMClient:
    def __init__(self) -> None:
        self.api_key = settings.llm_gateway_api_key
        self.base_url = settings.llm_base_url
        self.primary_model = settings.llm_primary_model
        self.fallback_model = settings.llm_fallback_model
        self.timeout = settings.llm_timeout_seconds

    @property
    def configured(self) -> bool:
        return bool(self.api_key)

    def complete(self, messages: list[dict[str, str]]) -> tuple[str, str, str, dict[str, str | None]]:
        if not self.api_key:
            return (
                "local_fallback",
                "local-template",
                self._local_from_messages(messages),
                {
                    "gateway_error": "IM_LLM_GATEWAY_API_KEY is not loaded",
                    "models_tried": None,
                    "generation_path": "local_template_without_gateway_key",
                },
            )

        last_error: Exception | None = None
        models_tried: list[str] = []
        for model in [self.primary_model, self.fallback_model]:
            models_tried.append(model)
            try:
                return (
                    "gateway",
                    model,
                    self._call_gateway(model, messages),
                    {
                        "gateway_error": None,
                        "models_tried": ", ".join(models_tried),
                        "generation_path": "im_llm_gateway_chat_completions",
                    },
                )
            except Exception as exc:
                last_error = exc
                continue
        fallback = self._local_from_messages(messages)
        if last_error:
            fallback = (
                "## Gateway Status\n"
                f"The LLM Gateway key was loaded, but live generation failed and local fallback was used. Last error: {type(last_error).__name__}.\n\n"
                + fallback
            )
        return (
            "local_fallback",
            "local-template",
            fallback,
            {
                "gateway_error": type(last_error).__name__ if last_error else "Unknown gateway error",
                "models_tried": ", ".join(models_tried),
                "generation_path": "local_template_after_gateway_failure",
            },
        )

    def _call_gateway(self, model: str, messages: list[dict[str, str]]) -> str:
        payload = json.dumps({"model": model, "messages": messages, "temperature": 0.2}).encode("utf-8")
        request = urllib.request.Request(
            f"{self.base_url}/chat/completions",
            data=payload,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as response:
                data = json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            raise RuntimeError(f"Gateway HTTP {exc.code}") from exc
        return data["choices"][0]["message"]["content"]

    def _local_from_messages(self, messages: list[dict[str, str]]) -> str:
        user = messages[-1]["content"] if messages else ""
        lower = user.lower()
        if "pre-call brief" in lower:
            return LOCAL_BRIEF_TEMPLATE
        if "sales/service pitch" in lower or "generate a sales" in lower:
            return LOCAL_PITCH_TEMPLATE
        return LOCAL_CHAT_TEMPLATE


def source_footer(sources: list[SourceChunk]) -> str:
    if not sources:
        return "No retrieved sources."
    return "\n".join(f"- {source.source}" for source in sources[:6])


LOCAL_BRIEF_TEMPLATE = """## Client Snapshot
Use the selected seller profile as the source of truth. Start with company, GLID, contact person, city/state, customer type, package indicators, business type, and product count.

## Account Health
Review 7/30/90 day calls, replies, callbacks, Lead Manager percentage, category score, and product changes. Highlight strong activity first, then mention weak or risky signals.

## Recent History
Summarize the latest servicing and upsell notes. Give priority to repeated issues and pending follow-ups.

## Key Pain Points
Focus on buy lead consumption, export lead visibility, category mismatch, product rejection, email verification/bounce, and panel usage if present.

## Recommended Call Objective
Use a service-first optimization call. Resolve repeated issues before moving into package or upsell discussion.

## Suggested Opening
Start by acknowledging the recent issue and the seller's current activity. Then ask permission to verify the account setup and lead flow.

## Risks / Avoid Points
Do not reveal unmasked contact details. Do not claim ledger, query, or receipt details unless visible. Avoid cold upsell before addressing unresolved service issues.

## Sources
Local fallback used. Retrieved sources are returned separately by the API."""


LOCAL_PITCH_TEMPLATE = """## Opening
Namaste, main IndiaMART se bol raha hoon. Aapke account ki recent activity aur service history dekh kar call kar raha hoon taaki pehle open issues close kar sakein.

## Context Acknowledgement
History me Buy Lead consumption, export lead visibility, category preference, product rejection, ya email verification jaise points visible ho sakte hain. Inko call ke start me acknowledge karein.

## Main Value Pitch
Goal ye hai ki seller ko relevant enquiries milein, products clearly list hon, aur Lead Manager/callback follow-up disciplined rahe.

## Issue-Resolution Angle
Pehle current blocker verify karein: Buy Lead panel, category preference, product specifications, email status, and response workflow.

## Likely Objections And Responses
- "Leads relevant nahi hain": category preference aur MCAT mapping review karte hain.
- "Response kam hai": product quality, city/category fit, and follow-up speed check karte hain.
- "Product reject ho raha hai": product names/specifications clean karte hain.

## Next Step
Call ke end me one concrete action fix karein: category cleanup, product correction, email verification, ya follow-up meeting.

## Follow-up Note
Seller ke latest pain point, action owner, and next follow-up date note karein.

## Sources
Local fallback used. Retrieved sources are returned separately by the API."""


LOCAL_CHAT_TEMPLATE = """## Direct Answer
Use the seller profile, sales/service history, pain points, and IndiaMART retrieved docs to answer. The most useful answer should be tied to what the salesperson should say or check next.

## Evidence
Refer to recent history, performance snapshot, and retrieved IndiaMART context. If a field is unavailable, say so.

## Suggested Salesperson Action
Lead with the most recent or repeated issue, then connect it to a concrete next step.

## Sources
Local fallback used. Retrieved sources are returned separately by the API."""


llm_client = LLMClient()
