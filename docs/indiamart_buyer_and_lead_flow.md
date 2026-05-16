# indiamart_buyer_and_lead_flow.md

## Purpose

This document explains buyer demand and seller lead flow in the IndiaMART context. It is focused on how buyers discover suppliers, what enquiries and BuyLeads mean, how seller response matters, and where exact internal logic is not public.

## Source-quality note

- Public facts are taken from IndiaMART investor material and app listings.
- Attachment-derived facts are taken from the user-provided BuyLeads, Marketplace, MDC, IM Insta, and Star/Leader decks.
- Exact production matching, scoring, ranking, and distribution logic is not public. Where this document gives operational interpretation, it is marked as inference.

## Buyer discovery on IndiaMART

The user-provided marketplace deck describes multiple buyer entry paths:

| Entry path | Buyer action |
|---|---|
| Google search | Buyer searches product keywords on Google, clicks IndiaMART directory/search result, and reaches IndiaMART. |
| Direct DIR visit | Buyer visits DIR.IndiaMART.com and searches, browses, or posts buying requirements. |
| IndiaMART mobile app | Buyer searches suppliers and posts buying requirements. |
| Mobile site | Buyer uses m.indiamart.com to search or initiate contact. |

Source: User-provided attachment, `Marketplace Overview V1.0`, slides 5, 7, 10, 11, and 12.

The deck describes buyer action buttons such as:

| Buyer action | Meaning |
|---|---|
| Call / Call Now | Buyer directly talks to supplier. |
| Contact Supplier | Buyer sends an enquiry or email-like contact request to supplier. |
| Get Best Price | Buyer expresses buying interest and asks for supplier response or quote. |
| Post Buying Requirement | Buyer fills a requirement form and gets relevant suppliers within minutes. |

Source: User-provided attachment, `Marketplace Overview V1.0`, slides 9, 12, and 13.

## Public RFQ / BuyLead funnel

IndiaMART public investor material describes a lead-generation and matching funnel in the following style:

| Step | Publicly described idea |
|---|---|
| RFQ initiated | Buyer submits an industry-specific RFQ or buying requirement. |
| Requirement enrichment | The system can enrich the RFQ to improve matching and buyer/supplier information. |
| Seller matching | AI-driven matchmaking is described as connecting RFQs with relevant suppliers. |
| Supplier RFQ selection | Suppliers use paid quota or credits to select relevant RFQs/BuyLeads. |
| Lead management | Suppliers manage buyer interactions through Lead Manager and communication tools. |

Public source: IndiaMART Q3 FY26 investor presentation.

## Enquiry, BuyLead, Bizfeed, calls, and callbacks

### Key lead types and interaction signals

| Term | IndiaMART-specific meaning |
|---|---|
| Enquiry | A buyer contact or requirement sent to a supplier. It can be generated when a buyer clicks Contact Supplier, Get Best Price, or similar flows. |
| BuyLead / BL | A buyer requirement created when a buyer fills requirement details. Suppliers can consume BuyLeads using BuyLead balance or purchase options. |
| Bizfeed | Attachment-derived term. The BuyLeads deck says Bizfeed is generated when a buyer visits seller products or catalogue but does not post an enquiry. It is consumed only by the seller whose product was viewed. |
| Catalogue View | Buyer views seller product or catalogue page. It can signal interest even if the buyer does not submit an enquiry. |
| PNS call | Call routed through Preferred Number Service. MDC material says multiple supplier numbers can ring simultaneously. |
| Callback | Internal-observed seller/buyer interaction signal. Star/Leader deck lists callback to buyer in transaction/preferred district logic. |
| Tender | BuyLeads deck says tenders from Indian public sources are available for sellers on IndiaMART. |

Source: User-provided `BuyLeads Shubharambh`, slides 3, 4, 8, 9, 15, 18, 19, and 20; `MDC_3.0`, slide 4; `IM Star Pro - IM Leader Pro`, slide 19.

### BuyLead and Bizfeed differences

| Dimension | BuyLead | Bizfeed |
|---|---|---|
| Trigger | Buyer fills requirement details. | Buyer visits seller product/catalogue but does not post enquiry. |
| Who can consume | Up to 5 sellers, according to user-provided training. | Only the seller whose product was viewed. |
| Seller purpose | Gives access to buyer and detailed requirement. | Alerts seller about product/catalogue interest. |
| Sales-call relevance | Ask whether seller is consuming fresh leads and following up fast. | Ask whether seller is acting on catalogue-view signals and converting interest. |

Source: User-provided attachment, `BuyLeads Shubharambh`, slide 4.

## Sources of buyer demand and BuyLeads

The BuyLeads deck says buyer demand can come from:

| Source | Source type |
|---|---|
| buyer.indiamart.com | Buyer requirement form/source |
| DIR page forms | Buyer requirement form on directory pages |
| Mobile site | m-site buyer flow |
| IndiaMART WhatsApp | Messaging or requirement flow |
| Android and iOS apps | Mobile app flow |
| Helpline number | Offline/assisted source |
| Traffic on IndiaMART network | Marketplace browsing and requirement behaviour |

Source: User-provided attachment, `BuyLeads Shubharambh`, slides 6 and 7.

## BuyLead lifecycle

The user-provided BuyLeads deck describes the lifecycle at a high level:

| Stage | Meaning |
|---|---|
| Buyer posts requirement | Buyer fills requirement details through IndiaMART surfaces. |
| Screening | Deck says auto screening followed by manual screening. |
| Lead becomes available | The BuyLead appears for relevant suppliers through seller view options and alerts. |
| Supplier consumes lead | Supplier uses BuyLead balance or paid lead access. |
| Supplier contacts buyer | Supplier contacts buyer to sell products or respond to the requirement. |
| Post-consumption actions | Seller can use Lead Manager actions, follow-up, call, email, and related tools. |

Source: User-provided attachment, `BuyLeads Shubharambh`, slide 8.

## Seller lead view options

The BuyLeads deck lists seller view/access options:

| View option | Use |
|---|---|
| Android app | Seller can view and act on leads from mobile. |
| iOS app | Seller can view and act on leads from mobile. |
| Mobile website | m.indiamart.com access. |
| Desktop websites | seller.indiamart.com and trade.indiamart.com are listed. |
| tenders.indiamart.com | Tender access. |
| Email alerts | Lead notification. |
| App notifications | Lead notification. |

Source: User-provided attachment, `BuyLeads Shubharambh`, slide 9.

## Buyer profile details visible on BuyLead cards

The BuyLeads deck says a BuyLead card may include additional buyer details such as:

| Buyer profile field | Interpretation |
|---|---|
| Buys | Products the buyer has searched. |
| Sells | Products the buyer sells, if the buyer is also a seller. |
| Requirements till date | Number of requirements the buyer has posted. |
| Member since | Since when the buyer has been a member on IndiaMART. |
| Mobile, email, business name | Availability of contact and business identifiers. |
| Buyer viewed | Other products checked before posting the BuyLead. |

Source: User-provided attachment, `BuyLeads Shubharambh`, slide 16.

Sales-call relevance: when sellers complain about lead quality, salespeople may need to explain how to read buyer profile context and prioritize leads based on requirement, buyer behaviour, location, contactability, and fit.

## What signals may matter for buyer-seller matching

### Public facts

Public IndiaMART investor material describes AI-driven enrichment and matchmaking for RFQ/BuyLead flow. It also describes product specifications, prices, photos/videos, reviews/ratings, negotiations, customer history/reminders, quotations, and conversations as part of the commerce enablement journey.

### Attachment-derived operational signals

The user-provided decks mention the following signals in different contexts:

| Signal | Where it appears |
|---|---|
| Product category / MCAT | Marketplace and Star/Leader Pro decks. |
| Buyer requirement details | BuyLeads deck. |
| Location / preferred district | Marketplace and Star/Leader Pro decks. |
| Supplier paid status | Listing-order material. |
| Product enrichment: price, image, without image | Marketplace deck, DIR MCAT listing order. |
| BuyLead consumption | BuyLeads deck and Star/Leader Pro logic. |
| Bizfeed consumption / catalogue views | BuyLeads deck and Star/Leader Pro logic. |
| Callback to buyer | Star/Leader Pro logic. |
| PNS call over 60 seconds | Star/Leader Pro logic. |
| Unique replies and positive QRF | Star/Leader Pro logic. |
| Seller preferences | BuyLead preferences and preferred locations. |

Source: User-provided `Marketplace Overview V1.0`, slide 26; `IM Star Pro - IM Leader Pro`, slides 7, 8, and 19.

### Inferences

The following are reasonable inferences for sales-call preparation, not published internal rules:

| Inferred signal | Practical use |
|---|---|
| Product and category relevance | A correctly mapped product is more likely to match the buyer's requirement. |
| Location fit | Buyer expectations may vary by city, delivery range, and preferred supplier geography. |
| Catalogue completeness | Product names, photos, specifications, and price can help buyer trust and lead conversion. |
| Seller responsiveness | Faster responses should improve chance of converting a lead, especially if multiple sellers receive similar requirements. |
| Trust and verification | TrustSEAL and verified business information may reduce buyer hesitation in B2B interactions. |
| Historical seller behaviour | BuyLead consumption and callback patterns may influence preferred district and product/service fit in certain internal products. |

## How seller response quality affects outcomes

The BuyLeads deck gives clear seller tips:

| Tip from training deck | Sales-call implication |
|---|---|
| Consume fresh leads, meaning leads that arrived just now. | Seller should act quickly, not batch leads too late. |
| Contact buyers immediately by phone, email, or Lead Manager. | Multichannel response improves contact chances. |
| Ensure regular follow-up. | B2B purchase cycles may need repeated follow-up. |
| Keep product rates competitive. | Pricing remains part of buyer evaluation. |

Source: User-provided attachment, `BuyLeads Shubharambh`, slide 10.

Lead Manager training in the MDC deck says sellers can set reminders, add notes, add labels, send quotations, and filter by date. These features support disciplined follow-up and pipeline management. Source: User-provided attachment, `MDC_3.0`, slide 9.

## WhatsApp and IM Insta flow

The user-provided IM Insta deck describes WhatsApp integration with IndiaMART:

| Flow | Meaning |
|---|---|
| Buyer-initiated WhatsApp conversation | Buyer visits IndiaMART on m-site or mobile app, clicks WhatsApp icon, conversation appears in supplier LMS, supplier replies via LMS, buyer receives seller message on WhatsApp. |
| Seller-initiated WhatsApp conversation | Supplier consumes a BuyLead or receives buyer enquiry on LMS, then initiates WhatsApp with pre-crafted templates. |
| 24-hour rule | Seller can send unlimited customized messages within 24 hours from buyer's last message. |
| 7-day template rule | If buyer does not reply, seller can send one pre-crafted message per day for 7 days. |
| STOP keyword | If buyer responds with STOP, seller gets muted or blocked for 90 days in that context. |
| Benefits | Buyer response, direct WhatsApp enquiry, time saving, one WhatsApp inbox, and buyer convenience. |

Source: User-provided attachment, `IM Insta PPT + FAQ`, slides 5 to 7 and 10.

Sales-call relevance: if a seller is receiving enquiries but struggles with response, IM Insta or Lead Manager discipline may be relevant. However, IM Insta pricing/eligibility is product-dependent and should be checked before recommending.

## Caveat: exact internal lead logic is not public

Do not claim that any exact IndiaMART lead ranking, distribution, BuyLead approval, supplier shortlist, or search ranking formula is publicly known unless it appears in an official public IndiaMART source.

Safe language for a salesperson or AI assistant:

| Unsafe wording | Safer wording |
|---|---|
| "IndiaMART always sends leads to paid sellers first." | "Paid services can affect visibility and lead access in specific product contexts, but exact internal distribution logic is not public." |
| "This category will guarantee more enquiries." | "This may improve visibility or lead access, but IndiaMART services do not guarantee confirmed orders or a specific number of enquiries unless a product contract says so." |
| "Search is purely listing order." | "The training deck says listing order and search relevance are different. Search is based on relevance." |
| "A package guarantees conversion." | "Packages may help visibility, trust, catalogue quality, and lead access. Conversion still depends on demand, price, response, product fit, and buyer decision." |

## Sources

### Public sources

1. IndiaMART Q3 FY26 Investor Presentation: https://nsearchives.nseindia.com/corporate/INDIAMART_20012026161806_EarningPresentation20012026.pdf
2. IndiaMART app on Google Play: https://play.google.com/store/apps/details?hl=en_IN&id=com.indiamart.m
3. IndiaMART B2B Marketplace App on Apple App Store: https://apps.apple.com/in/app/indiamart-b2b-marketplace-app/id668561641

### User-provided attachments

1. `Marketplace Overview V1.0 (6) (1) (1).pptx`, slides 5, 7, 9 to 13, 15 to 18, 21 to 27.
2. `BuyLeads Shubharambh - updated August 2025.pptx`, slides 3 to 10, 13 to 16, 18 to 23.
3. `MDC_3.0.pptx`, slides 4, 7, 9, 18 to 22, 24.
4. `IM Insta PPT + FAQ.pptx`, slides 5 to 7, 10, 16, 18 to 23, 28 to 31.
5. `IM Star Pro - IM Leader Pro.pptx`, slides 4 to 8, 11, 19, 23 to 24.
