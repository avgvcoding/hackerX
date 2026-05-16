# IndiaMART Sales Call Prep Chatbot

Full-stack hackathon MVP for preparing IndiaMART salespeople before seller calls.

## What It Does

- Search/select a seller by GLID, company, city, or contact.
- Shows seller identity, account status, contact context, performance, pain points, and recent service history.
- Uses IndiaMART docs from `docs/` and seller data from `seller_dataset.json` for local RAG.
- Generates pre-call briefs, pitches, and seller-specific answers in English, Hinglish, or Hindi.
- Uses IndiaMART LLM Gateway when `IM_LLM_GATEWAY_API_KEY` is set.
- Falls back to local templates if the LLM key is missing or the gateway fails.

## Run Locally

Backend:

```powershell
& 'C:\Users\avira\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

Frontend:

```powershell
.\node_modules\.bin\vite.CMD --host 127.0.0.1
```

Open:

```text
http://127.0.0.1:5173
```

If your local `npm` works, `npm run dev` is equivalent. In this workspace the direct Vite binary is the reliable path.

## LLM Gateway Config

Copy `.env.example` to `.env` or set these variables in your shell:

```text
IM_LLM_GATEWAY_API_KEY=
IM_LLM_BASE_URL=https://imllm.intermesh.net/v1
IM_LLM_PRIMARY_MODEL=openai/gpt-5.4
IM_LLM_FALLBACK_MODEL=anthropic/claude-sonnet-4-6
IM_EMBEDDING_MODEL=openai/text-embedding-3-large
IM_LLM_TIMEOUT_SECONDS=45
```

Do not commit real keys.

## Demo GLID

Use `42473394` for the authentic WebERP-inspected seller.
