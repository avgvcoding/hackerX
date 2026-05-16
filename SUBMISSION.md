# HackerX Submission Notes

Use this file to fill the hackathon submission form quickly. Replace the demo video URL and repository URL before final submit.

## Project Title

HackerX: AI Sales Assistant for IndiaMART Seller Calls

## Short Pitch

HackerX turns seller history, pain points, and category/product demand into grounded call briefs, issue-first pitches, and next-best actions for IndiaMART salespeople.

## Problem We Are Solving

IndiaMART sales and servicing teams handle seller conversations where useful context is spread across profile data, servicing history, Buy Lead usage, catalog quality, package details, and category demand. Before a call, a salesperson has to decide what happened recently, what problem should be solved first, what can be pitched safely, and what evidence supports the recommendation.

The pain is not only "generate a pitch"; the harder problem is avoiding the wrong pitch. If a seller has unresolved Buy Lead, export lead, email, category, or product rejection issues, the call should start with issue resolution. If the seller has strong category demand and enough products, the pitch should use that MCAT/product context instead of generic package language.

HackerX reduces that prep burden by converting GLID-level seller data into a call-ready workspace with evidence, sources, and actionable suggestions.

## Technical Journey / Skills.md Narrative

We built a reusable sales-call-prep skill and a working full-stack application around it.

The system starts with a seller GLID. The backend loads enriched seller records from `enrich_seller_dataset.json`, including profile, package, performance, pain points, servicing history, and category/product demand for the last six months. It then indexes IndiaMART domain documents from `docs/` and creates seller-specific chunks for pain points, history, and category/product signals.

For every brief, pitch, or chat answer, the prompt builder follows a service-first workflow:

1. Read seller data first.
2. Retrieve relevant IndiaMART domain context second.
3. Prefer unresolved recent pain points over upsell.
4. Use enriched MCAT/product demand to shape the issue-resolution or upsell angle.
5. Cite evidence and source context.
6. Avoid exposing unmasked contact details or inventing unavailable WebERP/payment data.

The React UI exposes the workflow as a salesperson workspace: seller details, performance, history, category signals, AI briefs, pitches, chat, evidence, and compact suggestion chips. The chat keeps recent context within the active session so follow-up questions remain grounded.

The required skill artefact lives in `skills/sales-call-prep/`. It follows the canonical folder structure:

- `SKILL.md` describes when the skill should activate and the operational workflow.
- `scripts/summarize_seller.py` produces a deterministic seller summary from the dataset.
- `scripts/run_eval_cases.py` checks demo-data readiness and evidence coverage.
- `references/` documents pitch rules, output contract, evidence policy, and evaluation cases.
- `assets/call-brief-template.md` provides a reusable output scaffold.

This makes the solution portable: the app is the demo surface, but the skill folder is the reusable operating procedure that can be loaded by an agent runtime for seller-call preparation in other IndiaMART workflows.

## Impact Analysis

HackerX targets a repeated seller-servicing workflow rather than a one-time automation. If used by sales and servicing teams, the same assistant can help prepare calls for renewal, issue resolution, category optimization, catalog cleanup, Buy Lead education, and upsell readiness.

Expected measurable impact:

- Prep time reduction: a salesperson can get a call brief and next-best action in seconds instead of manually scanning seller history, pain points, category data, and domain notes.
- Better first-call resolution: repeated service issues are surfaced before upsell, reducing generic or mistimed pitches.
- Higher pitch relevance: category/product demand from the enriched dataset lets the salesperson talk about the seller's actual MCATs and products.
- Better seller experience: answers include evidence and source context, which makes calls more specific and less repetitive.
- Scalable workflow: the same skill can be reused across seller retention, catalog quality, Buy Lead education, and servicing escalation use cases.

For rubric positioning, this is a systemic internal productivity and seller-experience solution: it can support many sales/servicing users and many sellers because the workflow is GLID-driven and data-backed.

## Skill Folder URL

Paste the public GitHub URL to:

```text
https://github.com/<your-org-or-user>/<repo>/tree/main/skills/sales-call-prep
```

## Demo Video Structure

Use this 5-10 minute structure:

1. Problem: show that seller-call context is scattered and pitches can be wrong if issues are unresolved.
2. Proof: open GLID `42473394` and show pain points, history, category/product signals, and evidence.
3. Solution: generate a brief, create a pitch, ask a chat follow-up, and show evidence/sources.
4. Robustness: show local fallback or evidence rules, then run `backend/tests/smoke_test.py` and `skills/sales-call-prep/scripts/run_eval_cases.py`.
5. Impact: explain seconds-to-brief, issue-first handling, category-led upsell, and portability of the skill folder.
