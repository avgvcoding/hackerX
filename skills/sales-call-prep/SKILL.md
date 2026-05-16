---
name: sales-call-prep
description: Use this skill when a salesperson wants to prepare for an IndiaMART seller call using a GLID, seller profile, service history, performance snapshot, and IndiaMART domain documents. It produces grounded pre-call briefs, seller-specific Q&A, pitches, objection handling, and next-best actions in English, Hinglish, or Hindi.
---

# Sales Call Prep

Use this skill to help IndiaMART sales and servicing teams prepare before calling a seller.

## Inputs

- GLID.
- Seller identity.
- Account status.
- Contact context.
- Performance snapshot.
- Sales/service history.
- Pain points.
- IndiaMART domain context from references and docs.
- Optional salesperson context: reason for call, package/renewal/issue focus, preferred language.

## Workflow

1. Resolve the seller by GLID.
2. Read seller identity, account status, contact context, performance, recent history, and pain points.
3. Retrieve IndiaMART domain context relevant to the call objective.
4. Identify the highest-priority call angle:
   - unresolved service issue
   - Buy Lead optimization
   - category preference correction
   - product/catalog cleanup
   - email/PNS/contact readiness
   - renewal or upsell
5. Generate a salesperson-ready response.

## Output Formats

### Pre-call Brief

- Client snapshot.
- Account health.
- Recent history.
- Key pain points.
- Recommended call objective.
- Suggested opening.
- Risks / avoid points.
- Sources.

### Sales Pitch

- Opening.
- Context acknowledgement.
- Main value pitch.
- Issue-resolution angle.
- Likely objections and responses.
- Next step.
- Follow-up note.
- Sources.

### Chat Answer

- Direct answer.
- Evidence.
- Suggested salesperson action.
- Sources.

## Grounding Rules

- Use seller data first.
- Use IndiaMART domain docs second.
- Mark anything inferred as inference.
- Do not reveal unmasked phone numbers or emails.
- Do not invent payment, ledger, query, receipt, or WebERP details.
- Prefer recent and repeated pain points.
- Mention unavailable/inaccessible data directly.

## Language Rules

- English: concise, business-ready sales language.
- Hinglish: Hindi words in English alphabets, with IndiaMART business terms preserved.
- Hindi: natural Hindi with terms like Buy Lead, Lead Manager, TrustSEAL, Category, Package preserved where useful.

## Demo Prompt

For GLID `42473394`, answer:

> What should I discuss first with this seller, and generate a Hinglish pitch for resolving Buy Lead and export lead issues?

