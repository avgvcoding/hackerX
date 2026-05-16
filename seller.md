# Seller Data Guide For AI Sales Chatbot

This file describes the seller/client data we will use for the AI sales-call-preparation chatbot, what each data group means, and how an AI model should use it.

The detailed example context for one browsed seller is stored in `seller_data_context.md`.

## Goal

The chatbot should help a salesperson prepare before calling an IndiaMART seller. Given a GLID, it should generate a grounded client brief, answer seller-specific questions, identify likely pain points, and create a call pitch in English, Hinglish, or Hindi.

The bot should behave like a sales-prep assistant, not only a generic chat interface.

## Primary Input

- `GLID`: Unique seller/customer identifier.

The GLID is used to fetch all available seller details from internal systems such as WebERP.

## Data Groups To Use

### 1. Seller Identity

This defines who the seller is.

Useful fields:

- GLID.
- Company ID.
- STS company ID.
- Company name.
- Contact person name.
- Owner/CEO/proprietor name.
- Designation.
- City, state, country, PIN.
- Customer type.
- Business type.
- Turnover range.
- Employee count.
- Parent/related company information.

How the AI should use it:

- Personalize the call opening.
- Identify whether the seller is small, medium, high-value, or established.
- Choose tone and pitch depth.
- Mention relevant geography or business type when useful.
- Avoid generic greetings when a named contact is available.

Example use:

> "You are calling Star Enterprises, a manufacturer from Ghaziabad, associated with IndiaMART since 2017."

### 2. Account Status

This tells the current account condition and lifecycle stage.

Useful fields:

- Active/enabled status.
- Created date.
- Last updated date.
- Package/customer category.
- Service indicators.
- Paid URL.
- Website.
- Product/catalog URLs.
- Assigned sales or servicing executive, if available.

How the AI should use it:

- Detect account maturity.
- Identify whether the seller is new, long-term, active, recently updated, or stale.
- Give call strategy based on lifecycle.
- Decide whether the call should focus on onboarding, servicing, retention, upsell, renewal, or issue resolution.

Example use:

> "This is a long-running enabled account, so the pitch should acknowledge existing usage before suggesting improvements."

### 3. Contact Context

This contains communication channels and contact reliability signals.

Useful fields:

- Primary email.
- Alternate email.
- Primary mobile.
- Alternate mobile.
- Phone.
- PNS number.
- PNS incoming number.
- Email verification or bounce indicators from history.

How the AI should use it:

- Identify preferred or recently used contact routes.
- Warn the salesperson if email bounce or verification issues exist.
- Avoid exposing unmasked contact values unless securely available.
- Suggest call channel and fallback channel.

Privacy rule:

- If WebERP shows masked phone/email values, the bot must keep them masked.
- The bot must not invent or reveal full contact details.

Example use:

> "Recent history shows email verification and bounce issues, so confirm the active email before discussing lead delivery."

### 4. Performance Snapshot

This is the quick health summary visible in the top bar.

Useful fields:

- BL active days.
- All enquiry activity.
- Calls.
- Lead Manager percentage.
- Callbacks.
- Replies.
- Connection/attempt counts.
- Product additions.
- Product deactivations.
- Category score.
- Product count.
- Recent connect and meeting recency.

How the AI should use it:

- Produce a quick account health score.
- Highlight positive signals for the salesperson.
- Identify low activity or weak conversion areas.
- Generate data-backed talking points.
- Compare 7-day, 30-day, and 90-day trends when available.

Example use:

> "The seller has strong recent activity and a high category score, so the call should focus on improving lead relevance and resolving blockers rather than basic activation."

### 5. Sales And Service History

This is the most important grounding source for call preparation.

Useful fields:

- Call/meeting date and time.
- Activity type: servicing, upsell, answered, missed call, appointment, invoice, SMS, etc.
- Employee who handled the interaction.
- Contact channel used.
- Comments from previous calls or meetings.
- Appointment status.
- Follow-up instructions.
- Activity-level metrics such as buy leads, replies, callbacks, MCAT changes, product changes, BL NI.

How the AI should use it:

- Summarize recent interactions chronologically.
- Extract unresolved issues.
- Identify recurring complaints.
- Detect buyer-lead, product, category, email, login, and response-quality concerns.
- Recommend what to say and what not to repeat.
- Generate follow-up-aware pitches.

Example use:

> "Do not start with a cold upsell. First acknowledge the previously reported export buy lead and product rejection issues."

### 6. Pain Points

Pain points are derived from sales/service history and performance data.

Common pain categories:

- Buy lead consumption issues.
- Export buy lead issues.
- Product rejection.
- Category mismatch.
- Low enquiry or low response concerns.
- Email bounce or verification issues.
- Login or panel usage issues.
- Pending follow-up.
- Cashback/package concerns.

How the AI should use it:

- Rank issues by recency and repetition.
- Connect each pain point to a suggested action.
- Prepare objection handling.
- Decide whether the call should be service-first or upsell-first.

Example use:

> "The strongest call angle is issue resolution plus optimization, not direct package upsell."

## Recommended AI Output Structure

For every GLID, the model should generate:

1. **Client Snapshot**
   - Who the seller is.
   - Location, business type, package, tenure.

2. **Account Health**
   - Active status.
   - Recent activity.
   - Category score.
   - Product count.
   - Lead/reply/callback performance.

3. **Recent History Summary**
   - Last 3-5 meaningful interactions.
   - Who spoke to the client.
   - What was discussed.
   - Whether follow-up is pending.

4. **Pain Points**
   - Ranked list of visible issues.
   - Evidence from history.

5. **Suggested Call Objective**
   - Servicing, renewal, upsell, issue resolution, catalog improvement, lead optimization, etc.

6. **Sales Pitch**
   - Personalized opening.
   - Main talking points.
   - Suggested next action.

7. **Objection Handling**
   - Likely objections.
   - Suggested response.

8. **Language Variant**
   - English.
   - Hinglish.
   - Hindi.

## Language Handling

The salesperson should be able to request:

- English.
- Hinglish, with Hindi words written using English alphabets.
- Hindi.

The model should preserve business terms such as:

- Buy lead.
- Lead Manager.
- Category preference.
- Product rejection.
- Callback.
- Enquiry.
- Export leads.
- Package.
- Cashback.
- Trust Seal.
- IM STAR.

For Hinglish, the output should sound natural for an IndiaMART sales call.

Example:

> "Sir, aapke account me activity kaafi strong hai, lekin history me buy lead consumption aur export leads ka issue baar-baar aa raha hai. Main pehle woh resolve karwa deta hoon, phir package optimization discuss karte hain."

## Grounding Rules

The AI model must:

- Use only available seller data.
- Clearly say when data is missing or inaccessible.
- Not invent full contact details if only masked values are visible.
- Not invent payment, ledger, query, or receipt details when the relevant page is inaccessible or empty.
- Prefer recent history over old history.
- Treat repeated issues as higher priority.
- Surface source-like evidence in short form, such as dates and activity types.

## Data Quality Notes

Some fields may be blank, masked, inaccessible, or inconsistent across WebERP sections.

Examples:

- Top bar may show one designation while contact page shows another.
- Some pages may require permissions.
- History comments may contain typos or informal notes.
- Contact details may be masked.
- A direct page may be blank even when a tab exists.

The bot should handle this gracefully:

- Do not fail if one field is missing.
- Use the strongest available source.
- Mention uncertainty only when it matters for the salesperson.

## Suggested Internal Data Shape

```json
{
  "glid": "string",
  "seller_identity": {
    "company_name": "string",
    "contact_person": "string",
    "designation": "string",
    "city": "string",
    "state": "string",
    "business_type": "string",
    "turnover_range": "string",
    "employee_count": "string",
    "customer_type": "string"
  },
  "account_status": {
    "status": "string",
    "created_date": "string",
    "updated_date": "string",
    "package_indicators": ["string"],
    "paid_url": "string",
    "website": "string"
  },
  "contact_context": {
    "primary_email": "string",
    "alternate_email": "string",
    "primary_mobile": "string",
    "alternate_mobile": "string",
    "pns_number": "string",
    "pns_incoming_number": "string"
  },
  "performance_snapshot": {
    "seven_day": {},
    "thirty_day": {},
    "ninety_day": {},
    "category_score": "string",
    "product_count": "string"
  },
  "history": [
    {
      "date": "string",
      "activity_type": "string",
      "employee": "string",
      "contact_channel": "string",
      "comment": "string",
      "metrics": {}
    }
  ],
  "pain_points": [
    {
      "category": "string",
      "evidence": ["string"],
      "suggested_action": "string"
    }
  ]
}
```

## MVP Recommendation

For the hackathon MVP, prioritize:

1. GLID input.
2. Seller summary card.
3. Performance snapshot.
4. Recent history digest.
5. Pain point extraction.
6. Chatbot Q&A grounded in seller data.
7. Pitch generator with English, Hinglish, and Hindi output.

This is enough to show measurable time saved for salespeople and strong completeness for the hackathon rubric.
