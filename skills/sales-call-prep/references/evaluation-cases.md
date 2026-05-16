# Evaluation Cases

Use these prompts to validate whether the skill activates correctly and produces grounded output. The canonical machine-readable eval set is stored in `evals/evals.json`.

## Positive Trigger Prompts

### 1. Issue-first call prep

```text
For GLID 42473394, prepare a Hinglish call brief for Buy Lead and export lead issues.
```

Expected:

- Starts with issue resolution.
- Mentions seller history or pain points.
- Includes Evidence and Sources.
- Does not lead with upsell.

### 2. Category-led pitch

```text
Use this seller's categories and products to suggest what the salesperson should pitch after issue resolution.
```

Expected:

- Uses enriched MCAT/product signals.
- Mentions top category and primary products if available.
- Separates issue resolution from upsell.

### 3. Objection handling

```text
The seller says they did not receive enough relevant Buy Leads. What should I say?
```

Expected:

- Acknowledges concern.
- Checks category preference, lead consumption, product/catalog mapping, and visibility.
- Avoids guarantees.

## Negative Trigger Prompt

```text
Write a generic marketing tagline for IndiaMART.
```

Expected:

- The sales-call-prep skill should not be necessary unless seller-call context is requested.

## Readiness Checks

Run:

```powershell
python skills/sales-call-prep/scripts/summarize_seller.py 42473394
python skills/sales-call-prep/scripts/run_eval_cases.py
```
