# Evidence And Safety

## Evidence Hierarchy

Use evidence in this order:

1. Seller service history and recent notes.
2. Repeated pain points.
3. Enriched category/product data.
4. Performance snapshot.
5. IndiaMART domain documents.
6. Inference from the above, explicitly marked as inference.

## Evidence Formatting

- Write evidence as short human-readable bullets.
- Summarize seller records; do not display raw JSON or Python dict text.
- Include dates when present.
- Tie evidence directly to the recommendation.
- Keep source labels compact.

## Safety Constraints

- Do not expose unmasked phone numbers or emails.
- Do not invent ledger, payment, receipt, WebERP, renewal, or legal details.
- Do not guarantee seller outcomes such as fixed enquiry growth or guaranteed conversion.
- Say "data not available" when a requested field is absent.
- Do not blame internal teams or make accusatory statements.

## Inference Language

Use plain caveats:

- "This is an inference, not a guarantee."
- "Based on recent history..."
- "The safer first step is..."
- "The data suggests..."
