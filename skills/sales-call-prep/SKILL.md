---
name: sales-call-prep
description: Use this skill when a salesperson or servicing agent needs to prepare for an IndiaMART seller call using a GLID, seller profile, sales/service history, pain points, performance, category/product demand, or IndiaMART domain documents. It returns grounded call briefs, issue-first pitches, seller-specific chat answers, objection handling, evidence, and next-best actions in English, Hinglish, or Hindi.
---

# Sales Call Prep

Prepare seller-call guidance that is specific, evidence-backed, and safe to use in a live IndiaMART sales or servicing call.

## Inputs

- GLID or seller identifier.
- Seller identity, package, account status, contact context, and performance snapshot.
- Sales/service history and pain points.
- Enriched category/product signals such as MCAT, rank, product count, primary products, secondary products, Buy Lead demand, and service.
- IndiaMART domain context from docs or reference files.
- Optional call objective, language, salesperson question, or desired output type.

## Outputs

- Pre-call brief.
- Seller-specific sales pitch.
- Chat answer with recent conversation context.
- Objection handling.
- Next-best action list.
- Evidence and sources.
- Follow-up note when useful.

## Core Workflow

1. Resolve the seller by GLID or closest available seller identifier.
2. Read seller data before using generic domain knowledge.
3. Identify active pain points from recent history, repeated issues, performance gaps, contact readiness, category mismatch, product/catalog problems, Buy Lead concerns, export lead concerns, or renewal/upsell signals.
4. Read category/product demand signals before recommending an upsell angle.
5. Retrieve IndiaMART domain context only after seller context is understood.
6. Decide the call stance:
   - Use issue resolution first when unresolved pain points exist.
   - Use category/product optimization when MCAT demand is high but products, mapping, or preferences need cleanup.
   - Use upsell only after the seller's current issue and category fit are addressed.
7. Generate the requested output using the output contract in `references/output-contract.md`.
8. Attach evidence and source references for all important claims.

## Decision Rules

- Treat recent unresolved service issues as higher priority than upsell.
- Prefer repeated pain points over one-off signals.
- Use enriched MCAT/product data to choose the concrete talking point.
- Use the seller's actual package/service context when available.
- Mark inference clearly when a recommendation is derived rather than directly stated.
- Say when data is unavailable instead of inventing it.
- Never expose unmasked phone numbers, unmasked emails, payment identifiers, ledger details, or WebERP-only facts unless provided safely in the input.

## Language Rules

- English: concise, business-ready, and action oriented.
- Hinglish: Hindi in English alphabets; preserve IndiaMART terms such as Buy Lead, Lead Manager, TrustSEAL, Category, MCAT, Package, and PNS.
- Hindi: natural Hindi while preserving IndiaMART product and service terms where translation would reduce clarity.

## Reference Files

- `references/pitch-rules.md`: service-first pitch rules and Hinglish examples.
- `references/output-contract.md`: required sections for briefs, pitches, and chat answers.
- `references/evidence-and-safety.md`: evidence hierarchy, citation rules, and safety constraints.
- `references/evaluation-cases.md`: positive and negative test prompts for demo validation.
- `evals/evals.json`: canonical Agent Skills eval set with prompts and expected outputs.

## Scripts

- `scripts/summarize_seller.py <glid>`: print a deterministic seller summary using the enriched dataset when present.
- `scripts/run_eval_cases.py`: run lightweight readiness checks for the demo seller and skill evidence coverage.

## Assets

- `assets/call-brief-template.md`: reusable scaffold for a call brief output.

## Demo Prompt

For GLID `42473394`, answer:

```text
I want to call the client regarding Buy Lead and export lead issues. What should I discuss first, and give me a Hinglish pitch?
```

Expected behavior:

- Start with issue resolution.
- Mention recent Buy Lead/export lead visibility concerns.
- Use category/product signals such as Steel Drag Chain when relevant.
- Give clear salesperson actions.
- Include Evidence and Sources.
