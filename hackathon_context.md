# IndiaMART Internal AI Hackathon Context

## Event

- Name: IndiaMART 10X Productivity AI Hackathon.
- Theme: Build AI that 10X's how IndiaMART works.
- Format: Internal hackathon at IndiaMART HQ, Noida.
- Dates: 15-16 May 2026.
- Team: HackerX.
- Team members:
  - Aviral Gupta
  - Chitransh Kumar
  - Vikas Pandey

## Core Submission Requirements

The submission is made through the team solution page and requires:

1. Project title.
2. Short pitch, one sentence.
   - Minimum: 20 characters.
   - Maximum: 280 characters.
3. Problem statement.
   - Optional.
   - Markdown supported.
4. Technical journey / skills.md narrative.
   - Required.
   - Markdown supported.
   - Directly evaluated under the "Skilled Solution" rubric axis.
5. Skill folder URL.
   - Required.
   - Must be a folder, not only a single file.
   - Accepted formats: public GitHub repo URL or Google Drive folder URL.
6. Demo video URL.
   - Required.
   - 5-10 minutes.
   - Accepted platforms: YouTube, Google Drive, Loom, Vimeo.
7. Impact analysis.
   - Required.
   - Minimum: 100 characters.

## Skill Folder Format

Expected canonical structure:

```text
your-skill/
  SKILL.md
  scripts/
  references/
  assets/
```

- `SKILL.md` is required.
- `scripts/`, `references/`, and `assets/` are optional.
- For GitHub submissions, the platform walks the repo tree and renders every `SKILL.md`, up to 5 for multi-skill bundles.
- For Google Drive submissions, the platform embeds the folder view.

## Judging Rubric

Each submission is scored across 5 axes, 1-5 points each, for a maximum of 25.

1. Impact / Reach and Scalability
   - How many people the solution can meaningfully help.
2. Pinch Metrics / Problem Statement Quality
   - How sharply the problem is defined.
   - Concrete numbers matter: users affected, hours saved, percentage reduction, faster turnaround time, cost reduction, accuracy gain.
3. Solution Completeness
   - How much of the stated problem scope the solution actually covers.
4. Solution Robustness / Logic and Accuracy
   - Real-world reliability, edge cases, data grounding, durability, and correctness.
5. Skilled Solution / skills.md Quality
   - Quality of the reusable skill artifact and the technical journey narrative.
   - This is 20% of the total score.

## Demo Video Guidance

The recommended 5-10 minute demo structure:

1. Problem, 30-60 seconds.
   - Who has the pain?
   - How often does it happen?
   - What number proves it matters?
2. Proof / why now, around 30 seconds.
   - Why was this hard earlier?
   - What changed technically or operationally?
3. Solution demo, 2-4 minutes.
   - Show the agent doing the work.
   - Prefer live workflow over slides.
   - Use realistic IndiaMART sales context.
4. Impact, around 30 seconds.
   - Show time saved, users impacted, quality improvement, faster TAT, or adoption potential.

Avoid:

- Long talking-head intros.
- Feature lists without workflow.
- Architecture diagram first.
- Vague impact claims.

## Proposed Project Direction

Build a sales-call preparation chatbot for IndiaMART salespeople.

### High-Level Concept

A salesperson enters a GLID, the unique customer identifier. The system fetches and organizes relevant client/seller details from internal sources, then provides:

- A client intelligence summary.
- A chatbot for salesperson questions about the client.
- Pre-call preparation guidance.
- Sales pitch generation based on the call objective.
- Language support:
  - English
  - Hinglish, using English alphabets with Hindi words
  - Hindi

### Candidate User Workflow

1. Salesperson enters GLID.
2. System retrieves client details from internal pages/data sources.
3. System generates a structured pre-call brief.
4. Salesperson provides call context, such as renewal, upsell, inactive seller, complaint follow-up, catalog improvement, or lead conversion.
5. Chatbot answers client-specific questions.
6. Chatbot generates a pitch, suggested talking points, likely objections, and recommended next best actions.
7. Salesperson can switch output language.

### Rubric Positioning

Impact:

- Target users are IndiaMART salespeople and servicing teams.
- Potentially high reach if reusable across seller calling workflows.

Pinch Metrics:

- Frame the pain as time spent gathering client context before a call.
- Capture target metrics such as average pre-call prep time, number of calls per salesperson per day, missed personalization, and follow-up quality.

Solution Completeness:

- Cover GLID lookup, account summary, history, package/status details, performance indicators, chatbot Q&A, pitch generation, and multilingual output.

Solution Robustness:

- Use source-grounded answers.
- Display the fields used to generate answers.
- Avoid unsupported claims.
- Add clear fallback when data is missing or stale.

Skilled Solution:

- Package the reusable behavior as a skill, for example `sales-call-prep`.
- Include instructions, data contracts, scripts for fetching/summarizing client data, references for pitch rules, and sample GLID fixtures.

## Potential Skill Name

`sales-call-prep`

## Skill Trigger Description Draft

Use this skill when a user wants to prepare for a sales or servicing call with an IndiaMART client using a GLID or seller profile. It fetches and summarizes customer context, answers client-specific questions, and generates sales pitches, objections handling, and next-best actions in English, Hinglish, or Hindi.

## Key Build Principle

The product should not only be a chatbot. It should be a structured sales-prep workspace with a grounded chatbot inside it. Judges should see:

- Data pulled from the client page.
- Clear client summary.
- Evidence-backed answers.
- Actionable sales pitch.
- Measurable time saved.
- Reusable skill folder that another IndiaMART team can run after the hackathon.
