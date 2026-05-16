# Prompt For ChatGPT: IndiaMART Research Docs

Use this prompt in ChatGPT with internet/browsing enabled. Attach any relevant screenshots, PDFs, PPTs, IndiaMART pages, product notes, internal workflow screenshots, or deck files before sending.

```text
You are helping me collect IndiaMART-specific background documents for an internal IndiaMART AI hackathon project.

Important project context:
I am building a sales-call-preparation solution for IndiaMART salespeople. The actual AI design, seller JSON schema, chatbot behavior, and implementation will be handled separately. Your job is only to research and document IndiaMART-related business/domain context so the solution has accurate IndiaMART grounding.

Do not create generic AI documentation.
Do not explain how LLMs, RAG, prompts, or chatbot architecture work.
Do not create seller-data schemas unless they are directly about IndiaMART terminology or business entities.

Use:
- Public internet sources about IndiaMART.
- Any attachments I provide in this chat, including images, screenshots, PDFs, PPTs, or internal notes.

Rules:
- Use internet search.
- Prefer official IndiaMART pages, investor relations, annual reports, help/support pages, public product pages, and reliable business sources.
- Include source links for public information.
- If using user-provided attachments, cite them as "User-provided attachment" and mention slide/page/image if possible.
- Do not invent facts. If something is inferred, clearly mark it as an inference.
- Output large, separate Markdown documents that I can save as `.md` files.
- Keep everything focused on IndiaMART and its seller/sales/business context.

Create the following separate Markdown documents:

1. `indiamart_company_overview.md`

Purpose:
Explain IndiaMART as a company and marketplace.

Include:
- What IndiaMART does.
- Its role in Indian B2B commerce.
- Buyer-seller marketplace model.
- Key business segments or platform areas.
- Publicly available company scale metrics, if available.
- Major public milestones.
- Revenue/business model at a high level.
- Important terminology used by IndiaMART.
- Source links.

2. `indiamart_seller_ecosystem.md`

Purpose:
Explain IndiaMART from the seller/supplier perspective.

Include:
- Who sellers/suppliers are on IndiaMART.
- Why businesses list on IndiaMART.
- What a seller profile/listing generally contains.
- How catalog, products, categories, city/location, business type, and trust signals matter.
- What seller visibility and discoverability mean in this marketplace.
- Common seller goals: getting enquiries, calls, leads, visibility, credibility, product promotion.
- Publicly available details on seller onboarding, supplier benefits, seller support, or seller services.
- Source links.

3. `indiamart_buyer_and_lead_flow.md`

Purpose:
Document how buyer demand and seller leads work in the IndiaMART context.

Include:
- How buyers search/discover suppliers.
- What enquiries, calls, buy leads, direct enquiries, and callbacks mean in a B2B marketplace context.
- What signals may matter for matching buyers with sellers.
- How seller response quality and lead handling may impact business outcomes.
- Any public information about IndiaMART buyer enquiry flow or supplier lead generation.
- Important caveat: if exact internal lead logic is not public, do not invent it. Explain only public facts and clearly mark reasonable inferences.
- Source links.

4. `indiamart_paid_services_and_packages.md`

Purpose:
Collect IndiaMART-specific context around paid seller services/packages.

Include:
- Publicly visible paid seller services, subscriptions, promotional products, TrustSEAL, catalog/listing offerings, or similar concepts.
- What these services appear to promise sellers.
- How paid services may relate to visibility, trust, enquiries, catalog quality, or lead generation.
- Any publicly available pricing/package/product information if available.
- Explain terms that appeared in our WebERP context if public sources support them:
  - STAR
  - PRIME
  - IMA
  - TrustSEAL
  - Mini Dynamic Catalog / MDC
  - Buy Lead Credits
  - Foreign Buy Leads / Export Leads
- If a term is internal or not publicly documented, mark it as "observed in internal context, public definition not found."
- Source links.

5. `indiamart_catalog_and_product_quality.md`

Purpose:
Document IndiaMART catalog/listing/product-quality context.

Include:
- What product listings look like on IndiaMART.
- Why product names, categories, specifications, images, city, and descriptions matter.
- What public guidance exists for suppliers about creating good listings, products, or catalogs.
- How poor catalog quality could affect seller outcomes.
- Concepts related to category mapping, product rejection, unclear product names, incomplete specifications, duplicate/incorrect products.
- If public sources do not define exact internal quality rules, clearly separate public facts from inferred operational relevance.
- Source links.

6. `indiamart_sales_and_servicing_context.md`

Purpose:
Document the IndiaMART sales/service operating context relevant to calling sellers.

Include:
- Why IndiaMART sales or servicing teams may contact sellers.
- Publicly inferable call objectives: onboarding, subscription discussion, renewal, upsell, resolving lead issues, catalog improvement, service support, payment/package discussion.
- Seller pain points likely relevant to IndiaMART services.
- Terms from internal context that need domain explanation:
  - GLID
  - STS
  - DSR
  - PNS
  - Customer Voice
  - Buy lead
  - Enquiry
  - Callback
  - Lead Manager
  - MCAT/category
  - SPANCO
- If these are internal terms and public definitions are unavailable, mark them as internal-observed terms and explain only what can be inferred from provided attachments/context.
- Source links and attachment references.

7. `indiamart_competitive_and_market_context.md`

Purpose:
Give business context around the B2B marketplace space IndiaMART operates in.

Include:
- IndiaMART’s position in Indian B2B marketplaces.
- Publicly known competitor/context references if relevant.
- Why SMEs/MSMEs use online B2B marketplaces.
- Common challenges in Indian B2B seller digitization.
- Relevance of trust, lead quality, catalog completeness, and response speed.
- Source links.

8. `indiamart_terms_glossary.md`

Purpose:
Create a glossary of IndiaMART/domain terms useful for our project.

Include:
- Term.
- Meaning.
- Public source if available.
- Whether the term is public, internal-observed, or inferred.
- Why it matters for seller calls.

Include terms such as:
- Buyer
- Seller / Supplier
- Enquiry
- Buy Lead
- Direct Enquiry
- Callback
- Catalog
- Product Listing
- Category / MCAT
- TrustSEAL
- STAR
- PRIME
- IMA
- GLID
- STS
- DSR
- PNS
- Customer Voice
- Lead Manager
- Mini Dynamic Catalog / MDC
- Export Leads / Foreign Buy Leads
- Work Order
- Proforma / Invoice
- Client Ledger
- SPANCO

Formatting requirements:
- Output each document separately.
- Put the exact filename as the H1 heading at the top of each document.
- Make each document detailed and substantial.
- Use tables where useful.
- Include source links at the end of each document.
- Clearly distinguish public facts from attachment-derived facts and inferences.
- Keep the content IndiaMART-specific. Avoid generic AI, chatbot, LLM, or software architecture explanations.

Before writing final documents:
1. Browse the internet for IndiaMART-specific public sources.
2. Read all attachments I provide.
3. Extract only IndiaMART business/domain context relevant to salespeople calling sellers.
4. Then produce the Markdown documents.

Final response:
Give me all Markdown documents in full and provide the suggested filenames.
```

## Optional Follow-Up Prompt

Use this after ChatGPT generates the documents:

```text
Review the IndiaMART research documents and remove any generic content. Make them more IndiaMART-specific by adding source-backed terminology, seller-service context, marketplace concepts, catalog/listing details, paid-service references, and sales/servicing relevance. Clearly label anything that is inferred or only observed from my attachments.
```
