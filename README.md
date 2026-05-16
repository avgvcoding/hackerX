# HackerX: AI Sales Assistant for IndiaMART Seller Calls

This project is a full-stack AI sales assistant that prepares IndiaMART sales and servicing teams for seller calls. It combines seller profile data, sales/service history, pain points, enriched category/product demand, and IndiaMART domain documents to generate grounded call briefs, pitches, chat answers, evidence, and next-best actions.

## One-Sentence Pitch

It turns scattered seller history, category demand, and servicing signals into a grounded call plan so IndiaMART salespeople can resolve issues first and upsell with the right product/category context.

## Problem

Salespeople often enter seller calls without a single, reliable view of what happened recently, which category matters most, which issue should be solved first, and what evidence supports the recommendation. That creates avoidable prep time, repeated context gathering, generic pitches, and weaker seller experience.

This project focuses on a high-frequency seller-servicing workflow:

- Prepare for calls using GLID-level seller context.
- Identify unresolved service and Buy Lead issues before pitching.
- Use enriched MCAT/category/product demand to decide where to focus.
- Produce seller-specific Hinglish/English/Hindi talking points with evidence.
- Keep the salesperson inside one chat workspace instead of jumping across notes, docs, and datasets.

## Why It Scores Well Against The Rubric

| Rubric axis | How this repo addresses it |
| --- | --- |
| Impact | Built for repeat use by IndiaMART sales and servicing teams across seller calls, not a one-off demo. The same pattern can support renewal, retention, quality, catalog, and servicing workflows. |
| Pinch Metrics | Targets measurable prep-time reduction, fewer generic pitches, faster issue triage, and better first-call resolution by using seller history plus category/product signals. |
| Completeness | Includes a working React app, FastAPI backend, local RAG, enriched seller dataset, chat workflow, evidence rendering, skill folder, scripts, references, and smoke tests. |
| Robustness | Uses seller data first, retrieves IndiaMART docs second, cites evidence, masks sensitive details, handles missing LLM keys with deterministic local fallbacks, and includes test/eval scripts. |
| Skilled Solution | Ships a canonical `skills/sales-call-prep` folder with `SKILL.md`, `scripts/`, `references/`, and `assets/` so the workflow is portable to agent runtimes. |

## Product Capabilities

- Seller search by GLID, company, city, or contact.
- Seller profile, package, account, contact, performance, pain point, and history panels.
- Enriched category/product intelligence from `enrich_seller_dataset.json`.
- AI-generated pre-call brief and sales pitch.
- Chat interface that retains recent context within the active chat session.
- Short pain-point/category suggestion chips above the chatbox.
- Evidence-first answers with compact seller-source rendering.
- Local RAG over IndiaMART domain documents in `docs/`.
- IndiaMART LLM Gateway integration when credentials are available.
- Local fallback generation when the gateway key is absent or unavailable.

## Architecture

```text
React + Vite UI
  src/App.tsx
  src/components/*
        |
        | REST JSON
        v
FastAPI backend
  backend/app/main.py
  backend/app/prompts.py
  backend/app/rag.py
  backend/app/data_store.py
        |
        +-- Seller data: enrich_seller_dataset.json
        +-- Domain docs: docs/*.md
        +-- Optional LLM: IndiaMART LLM Gateway
        +-- Fallback: deterministic local templates
```

## Repository Map

```text
backend/                    FastAPI API, RAG, prompt construction, LLM gateway client
src/                        React frontend
docs/                       IndiaMART domain knowledge used by local RAG
skills/sales-call-prep/     Hackathon skill artefact submitted as a folder
public/assets/              UI assets
enrich_seller_dataset.json  Primary enriched seller dataset with category/product signals
seller_dataset.json         Baseline seller dataset fallback
backend/tests/              Smoke tests for data loading and retrieval
```

## Skill Artefact

The required hackathon skill folder is:

```text
skills/sales-call-prep/
  SKILL.md
  scripts/
  references/
  assets/
```

Use this folder URL as the "Skill folder" submission link after pushing to GitHub.

## Run Locally

### 1. Install Dependencies

```powershell
pnpm install
```

```powershell
python -m pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill the gateway key if available:

```text
IM_LLM_GATEWAY_API_KEY=
IM_LLM_BASE_URL=https://imllm.intermesh.net/v1
IM_LLM_PRIMARY_MODEL=openai/gpt-5.4
IM_LLM_FALLBACK_MODEL=anthropic/claude-sonnet-4-6
IM_EMBEDDING_MODEL=openai/text-embedding-3-large
IM_LLM_TIMEOUT_SECONDS=45
```

The app runs without a key by using local fallback templates.

### 3. Start Backend

```powershell
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

### 4. Start Frontend

```powershell
pnpm dev
```

Open:

```text
http://127.0.0.1:5173
```

## Demo Data

Use GLID `42473394` for the main demo seller. This seller includes:

- Repeated Buy Lead/export lead pain points.
- Service and seller history signals.
- Category/product demand signals such as Steel Drag Chain, Energy Chain, and related products.
- Enough evidence for issue-first call planning and category-led upsell.

## Verification

Frontend:

```powershell
pnpm build
```

Backend smoke test:

```powershell
$env:PYTHONPATH='.'
python backend/tests/smoke_test.py
```

Skill scripts:

```powershell
python skills/sales-call-prep/scripts/summarize_seller.py 42473394
python skills/sales-call-prep/scripts/run_eval_cases.py
```

## Submission Copy

See `SUBMISSION.md` for copy-ready text for:

- Project title.
- Short pitch.
- Problem statement.
- Technical journey / skills.md narrative.
- Impact analysis.
- Demo video structure.

## Notes For GitHub Submission

- Do not commit `.env` or real gateway keys.
- Do not commit raw demo videos; upload the video to YouTube, Loom, Vimeo, or Drive and paste the URL in the submission form.
- The repository should be public or accessible to the hackathon judge account before final submission.
