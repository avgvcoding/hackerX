#!/usr/bin/env python3
"""Generate a seller dataset for the IndiaMART sales chatbot MVP.

The first record is the authentic seller inspected in WebERP. The remaining
records are deterministic synthetic IndiaMART-style seller records that follow
the same schema for development, demos, and prompt testing.
"""

from __future__ import annotations

import argparse
import json
import random
from datetime import date, timedelta
from pathlib import Path


SEED = 42473394
DEFAULT_COUNT = 400


def original_seller() -> dict:
    return {
        "record_type": "original",
        "source": "WebERP Chrome inspection on 15 May 2026",
        "glid": "42473394",
        "company_id": "11129297",
        "sts_company_id": "25453843",
        "seller_identity": {
            "company_name": "Star Enterprises",
            "contact_person": "Radha Rani",
            "contact_person_source": {
                "top_bar": "Radha Rani",
                "contact_page": {"first_name": "Radha", "last_name": "Rani"},
            },
            "ceo_name": "Radha Rani",
            "designation": {
                "top_bar": "Proprietor",
                "contact_page": "CEO",
            },
            "city": "Ghaziabad",
            "state": "Uttar Pradesh",
            "pin": "201003",
            "country": "India",
            "customer_type": "STAR",
            "package_indicators": ["4Y", "STAR", "IMA 4/4", "PRIME"],
            "turnover_range": {
                "top_bar": "₹ 40 L - 1.5 Cr",
                "contact_page": "40 lakhs to 1.5 Cr.",
            },
            "employee_count": "Upto 10 People",
            "business_type": "Manufacturer",
            "module": "Indiamart Mobile",
            "parent_company": "Star Enterprises [Ghaziabad] - 42473394 - STAR",
            "related_companies": "0 Siblings Found",
        },
        "account_status": {
            "status": "Enable",
            "created_date": "24-May-2017",
            "updated_date": "17-Feb-2026",
            "gluser": "42473394 - LST",
            "website": "http://www.starcable.co.in",
            "paid_url": "https://www.indiamart.com/starenterprises-ghaziabad-up/",
            "fcp_url": None,
            "mobile_url": None,
            "old_paid_url": None,
            "sales_servicing_exec": None,
            "tele_cc_exec": None,
        },
        "contact_context": {
            "primary_email": "s***c***e***i*@gmail.com",
            "alternate_email": None,
            "primary_mobile": "+91 83*****676",
            "alternate_mobile": "+91 92*****176",
            "phone": "+91 120 29*****",
            "alternate_phone": None,
            "fax": None,
            "alternate_fax": None,
            "supplier_pns_number": "7942542743",
            "pns_incoming_number": "7942554266",
            "privacy_note": "Masked values are preserved exactly as WebERP displayed them.",
        },
        "performance_snapshot": {
            "seven_day": {
                "bl_active": "7 D",
                "all_enquiries": "7 D",
                "calls": 40,
                "lead_manager": "100% (1)",
                "callbacks": "7 D",
                "replies": 36,
                "connection_attempt": "121",
                "product_add": "0/0",
                "product_deactivation": 0,
            },
            "thirty_day": {
                "bl_active": "30 D",
                "all_enquiries": "29 D",
                "calls": 143,
                "lead_manager": "100% (4)",
                "callbacks": "29 D",
                "replies": 81,
                "connection_attempt": "349",
                "product_add": "2/2",
                "product_deactivation": 0,
            },
            "ninety_day": {
                "bl_active": "90 D",
                "all_enquiries": "85 D",
                "calls": 446,
                "lead_manager": "83% (24)",
                "callbacks": "81 D",
                "replies": 270,
                "connection_attempt": "1263",
                "product_add": "11/18",
                "product_deactivation": 1,
            },
            "connect_recency": "24 D",
            "meeting_recency": "23 D",
            "number_count": 3,
            "category_score": "96.8%",
            "product_count": 87,
        },
        "sales_service_history": [
            {
                "date": "22-Apr-2026",
                "activity_type": "Upsell",
                "employee": "Shivang Tyagi (109911) - KCD",
                "contact_channel": "92*****176 (Secondary)",
                "summary": (
                    "Meeting with Sappan sir regarding services and overall response. "
                    "Client faced buy lead sold-out/consumption issues and said export "
                    "buy leads were not reflected in panel. Issue had occurred in past "
                    "without resolution; needs resolution."
                ),
                "metrics": {"BuyLead": 3, "Replies": 4, "Callback": 1},
                "follow_up_required": True,
            },
            {
                "date": "21-Apr-2026",
                "activity_type": "Servicing - Talked",
                "employee": "Pratyusha (100455) - KCD",
                "contact_channel": "92*****176 (Secondary)",
                "summary": (
                    "Discussed buy lead consumption, feedback, LMS activity, and complete "
                    "specifications needed for some products. Client said responses were good."
                ),
                "metrics": {"BuyLead": 5, "Replies": 10},
                "follow_up_required": False,
            },
            {
                "date": "29-Mar-2026",
                "activity_type": "Upsell",
                "employee": "Shivang Tyagi (109911) - KCD",
                "contact_channel": "83*****676 (Primary)",
                "summary": (
                    "Meeting with owner Rinku sir about services, feedback, export package, "
                    "and cashback. Client reported no buy leads in export panel and needed "
                    "CC team follow-up."
                ),
                "metrics": {"BuyLead": 1},
                "follow_up_required": True,
            },
            {
                "date": "19-Feb-2026",
                "activity_type": "Others - Interested",
                "employee": "Riya Prajapati (112640) - KCD",
                "contact_channel": "s***c***e***i*@gmail.com (Primary)",
                "summary": (
                    "Discussed buy lead preference, category preference, performance report, "
                    "and preferred cities. Client said no issue as of now."
                ),
                "metrics": {"Products": "+1", "BuyLead": 4, "MCAT": "+1", "Replies": 12, "Callback": 3},
                "follow_up_required": False,
            },
            {
                "date": "17-Feb-2026",
                "activity_type": "Servicing - Talked",
                "employee": "Riya Prajapati (112640) - KCD",
                "contact_channel": "92*****176 (Secondary)",
                "summary": "Client was helped to verify email through a video call.",
                "metrics": {},
                "follow_up_required": False,
            },
            {
                "date": "15-Jan-2026",
                "activity_type": "Others - Interested",
                "employee": "Neha Yadav (95719) - KCD",
                "contact_channel": "i***@starcable.co.in (Primary)",
                "summary": (
                    "Discussed buy leads, enquiries, direct enquiry, direct calls, and product "
                    "rejection. Client was told not to add manufacturer/trader terms in product names."
                ),
                "metrics": {"Products": "+9 -10", "BuyLead": 4, "MCAT": "+2", "Replies": 25, "Callback": 8},
                "follow_up_required": True,
            },
            {
                "date": "09-Jan-2026",
                "activity_type": "Upsell - Not Interested",
                "employee": "Prince Rastogi (87098) - KCD",
                "contact_channel": "92*****176 (Secondary)",
                "summary": (
                    "Visit done twice; owner unavailable. Client reported less response, product "
                    "rejection with 'Product Name Is Not Clear', and wanted cashback for export leads."
                ),
                "metrics": {"Products": "+9", "-ve MCat": "+1", "BuyLead": 2, "MCAT": "+1", "Replies": 9, "BL NI": 1},
                "follow_up_required": True,
            },
        ],
        "pain_points": [
            {
                "category": "Buy lead consumption issues",
                "evidence": [
                    "22-Apr-2026 upsell meeting mentioned many buy leads could not be consumed.",
                    "21-Apr-2026 servicing call discussed buy lead consumption.",
                ],
                "suggested_action": "Start with issue resolution and explain a concrete buy lead consumption plan.",
            },
            {
                "category": "Export buy lead / export package issue",
                "evidence": [
                    "22-Apr-2026 comment says no export buy lead reflected in panel.",
                    "29-Mar-2026 owner discussion covered export package and cashback.",
                ],
                "suggested_action": "Verify export lead visibility before pitching export upgrade or retention.",
            },
            {
                "category": "Product rejection",
                "evidence": [
                    "15-Jan-2026 product rejection discussed.",
                    "09-Jan-2026 error shown: Product Name Is Not Clear.",
                ],
                "suggested_action": "Offer catalog cleanup and product naming guidance.",
            },
            {
                "category": "Email verification / bounce",
                "evidence": [
                    "17-Feb-2026 email verification handled through video call.",
                    "13-Feb-2026 bounce email notification sent for i***@starcable.co.in.",
                ],
                "suggested_action": "Confirm active email before discussing enquiry delivery.",
            },
            {
                "category": "Category preference / irrelevant leads",
                "evidence": [
                    "19-Feb-2026 client said leads came from a category they do not deal in.",
                    "Preferred cities and category preference were discussed.",
                ],
                "suggested_action": "Review category and city preferences during the call.",
            },
        ],
        "model_usage_notes": {
            "recommended_call_objective": "Service-first optimization call, then soft upsell if issues are resolved.",
            "do_not_claim": [
                "Unmasked phone numbers or emails",
                "Client ledger details",
                "Query details",
                "Receipt details",
            ],
        },
    }


FIRST_NAMES = [
    "Amit",
    "Priya",
    "Rahul",
    "Neha",
    "Vikas",
    "Pooja",
    "Sanjay",
    "Kavita",
    "Rohit",
    "Anjali",
    "Manish",
    "Deepak",
    "Nitin",
    "Meena",
    "Saurabh",
    "Ritu",
    "Arun",
    "Seema",
    "Harsh",
    "Nisha",
]

LAST_NAMES = [
    "Sharma",
    "Gupta",
    "Verma",
    "Agarwal",
    "Jain",
    "Yadav",
    "Kumar",
    "Singh",
    "Patel",
    "Mehta",
    "Bansal",
    "Mishra",
    "Chaudhary",
    "Khan",
    "Reddy",
    "Iyer",
]

COMPANY_CORES = [
    "Star",
    "Shree",
    "Om",
    "Apex",
    "Royal",
    "National",
    "Bharat",
    "Metro",
    "Prime",
    "Galaxy",
    "Sunrise",
    "Global",
    "Modern",
    "United",
    "Krishna",
    "Balaji",
    "Rudra",
    "Siddhi",
]

COMPANY_SUFFIXES = [
    "Enterprises",
    "Industries",
    "Traders",
    "Corporation",
    "Sales",
    "Manufacturing",
    "Agency",
    "Exports",
    "Solutions",
    "Products",
    "Works",
]

LOCATIONS = [
    ("Delhi", "Delhi", "1100"),
    ("Noida", "Uttar Pradesh", "2013"),
    ("Ghaziabad", "Uttar Pradesh", "2010"),
    ("Gurugram", "Haryana", "1220"),
    ("Faridabad", "Haryana", "1210"),
    ("Mumbai", "Maharashtra", "4000"),
    ("Pune", "Maharashtra", "4110"),
    ("Ahmedabad", "Gujarat", "3800"),
    ("Surat", "Gujarat", "3950"),
    ("Jaipur", "Rajasthan", "3020"),
    ("Ludhiana", "Punjab", "1410"),
    ("Bengaluru", "Karnataka", "5600"),
    ("Chennai", "Tamil Nadu", "6000"),
    ("Hyderabad", "Telangana", "5000"),
    ("Kolkata", "West Bengal", "7000"),
    ("Indore", "Madhya Pradesh", "4520"),
]

BUSINESS_TYPES = ["Manufacturer", "Trader", "Wholesaler", "Exporter", "Service Provider", "Distributor"]
CUSTOMER_TYPES = ["FREE", "STAR", "PRIME", "IMA", "TRUSTSEAL", "MDC"]
TURNOVERS = ["Below 40 Lakhs", "40 lakhs to 1.5 Cr.", "1.5 Cr. to 5 Cr.", "5 Cr. to 25 Cr.", "Above 25 Cr."]
EMPLOYEE_COUNTS = ["Upto 10 People", "11 to 25 People", "26 to 50 People", "51 to 100 People", "Above 100 People"]
SERVICES = ["IM STAR 10", "Trust Seal", "Mini Dynamic Catalog", "Foreign-BL", "Buy Lead Credits", "MDC", "Prime Seller"]
PAIN_TEMPLATES = [
    (
        "Buy lead consumption issues",
        "Client reported difficulty consuming buy leads and asked for panel guidance.",
        "Review buy lead panel, consumption flow, and lead filters during the call.",
    ),
    (
        "Category mismatch",
        "Client said some leads are coming from categories they do not handle.",
        "Validate category preference, MCAT mapping, and preferred cities.",
    ),
    (
        "Product rejection",
        "Recent history mentions product rejection or incomplete product specifications.",
        "Offer catalog cleanup and product-quality improvement steps.",
    ),
    (
        "Low enquiry response",
        "Client mentioned fewer enquiries or lower response in recent interactions.",
        "Use performance data to discuss enquiry trend and response improvement.",
    ),
    (
        "Email verification / bounce",
        "Client had email verification or bounce-related service impact.",
        "Confirm active email before discussing missed enquiries.",
    ),
    (
        "Pending renewal / package discussion",
        "Recent discussion touched package value, cashback, renewal, or service fit.",
        "Position the call as value review before renewal or upsell.",
    ),
    (
        "Panel usage help",
        "Client needed help with login, refresh, Leads Manager, or dashboard usage.",
        "Start with guided support and then pitch optimization.",
    ),
]


def masked_mobile(rng: random.Random) -> str:
    return f"+91 {rng.randint(70, 99)}*****{rng.randint(100, 999)}"


def masked_email(company_slug: str, rng: random.Random) -> str:
    domains = ["gmail.com", "yahoo.com", "rediffmail.com", f"{company_slug}.co.in", f"{company_slug}.com"]
    prefix = rng.choice(["sales", "info", "contact", "admin", "enquiry"])
    return f"{prefix[0]}***{prefix[-1]}***@{rng.choice(domains)}"


def fmt_date(d: date) -> str:
    return d.strftime("%d-%b-%Y")


def fake_history(rng: random.Random, base_date: date, pain_choices: list[tuple[str, str, str]]) -> list[dict]:
    employees = [
        "Riya Prajapati (112640) - KCD",
        "Shivang Tyagi (109911) - KCD",
        "Prince Rastogi (87098) - KCD",
        "Pratyusha (100455) - KCD",
        "Neha Yadav (95719) - KCD",
        "Customer Care-IM",
    ]
    activities = ["Servicing - Talked", "Upsell", "Others - Interested", "Answered", "Missed Call", "Upsell - Talked and Appt"]
    history = []
    for idx in range(rng.randint(4, 8)):
        day = base_date - timedelta(days=rng.randint(idx * 6, idx * 18 + 10))
        pain = rng.choice(pain_choices)
        activity = rng.choice(activities)
        history.append(
            {
                "date": fmt_date(day),
                "activity_type": activity,
                "employee": rng.choice(employees),
                "contact_channel": rng.choice(["Primary mobile", "Secondary mobile", "Primary email", "DID call"]),
                "summary": pain[1],
                "metrics": {
                    "BuyLead": rng.randint(0, 9),
                    "Replies": rng.randint(0, 60),
                    "Callback": rng.randint(0, 10),
                    "MCAT": rng.choice(["+0", "+1", "+2", "-1"]),
                },
                "follow_up_required": rng.random() < 0.45,
            }
        )
    history.sort(key=lambda item: item["date"], reverse=True)
    return history


def synthetic_seller(index: int, rng: random.Random, used_glids: set[str]) -> dict:
    while True:
        glid = str(rng.randint(30000000, 89999999))
        if glid not in used_glids:
            used_glids.add(glid)
            break

    company_id = str(rng.randint(10000000, 19999999))
    sts_company_id = str(rng.randint(20000000, 29999999))
    first = rng.choice(FIRST_NAMES)
    last = rng.choice(LAST_NAMES)
    contact = f"{first} {last}"
    core = rng.choice(COMPANY_CORES)
    suffix = rng.choice(COMPANY_SUFFIXES)
    company_name = f"{core} {suffix}"
    city, state, pin_prefix = rng.choice(LOCATIONS)
    pin = f"{pin_prefix}{rng.randint(10, 99)}"
    slug = company_name.lower().replace(" ", "").replace("&", "and")
    customer_type = rng.choice(CUSTOMER_TYPES)
    created_year = rng.randint(2015, 2025)
    created = date(created_year, rng.randint(1, 12), rng.randint(1, 28))
    updated = date(2026, rng.randint(1, 5), rng.randint(1, 14))
    products = rng.randint(8, 240)
    score = round(rng.uniform(62.0, 99.5), 1)
    package_indicators = [f"{2026 - created_year}Y", customer_type]
    if customer_type != "FREE":
        package_indicators.extend(rng.sample(["PRIME", "IMA 2/4", "IMA 3/4", "IMA 4/4", "TRUSTSEAL"], k=2))

    seven_calls = rng.randint(0, 55)
    thirty_calls = seven_calls + rng.randint(20, 170)
    ninety_calls = thirty_calls + rng.randint(90, 520)
    replies_7 = rng.randint(0, 60)
    replies_30 = replies_7 + rng.randint(20, 260)
    replies_90 = replies_30 + rng.randint(60, 900)
    pain_choices = rng.sample(PAIN_TEMPLATES, k=rng.randint(2, 4))
    history = fake_history(rng, date(2026, 5, 15), pain_choices)

    return {
        "record_type": "synthetic",
        "source": "Deterministic fake data generated for IndiaMART hackathon prototype",
        "glid": glid,
        "company_id": company_id,
        "sts_company_id": sts_company_id,
        "seller_identity": {
            "company_name": company_name,
            "contact_person": contact,
            "contact_person_source": {
                "top_bar": contact,
                "contact_page": {"first_name": first, "last_name": last},
            },
            "ceo_name": contact,
            "designation": {
                "top_bar": rng.choice(["Owner", "Proprietor", "Director", "Partner", "Manager"]),
                "contact_page": rng.choice(["CEO", "Owner", "Proprietor", "Director", "Manager"]),
            },
            "city": city,
            "state": state,
            "pin": pin,
            "country": "India",
            "customer_type": customer_type,
            "package_indicators": package_indicators,
            "turnover_range": {
                "top_bar": rng.choice(TURNOVERS),
                "contact_page": rng.choice(TURNOVERS),
            },
            "employee_count": rng.choice(EMPLOYEE_COUNTS),
            "business_type": rng.choice(BUSINESS_TYPES),
            "module": rng.choice(["Indiamart Mobile", "WebERP", "Desktop", "Mobile + Web"]),
            "parent_company": f"{company_name} [{city}] - {glid} - {customer_type}",
            "related_companies": f"{rng.randint(0, 3)} Siblings Found",
        },
        "account_status": {
            "status": rng.choice(["Enable", "Enable", "Enable", "Temporarily Inactive"]),
            "created_date": fmt_date(created),
            "updated_date": fmt_date(updated),
            "gluser": f"{glid} - {rng.choice(['LST', 'GLUSR', 'STS'])}",
            "website": f"http://www.{slug}.com",
            "paid_url": f"https://www.indiamart.com/{slug}-{city.lower()}/",
            "fcp_url": None,
            "mobile_url": None,
            "old_paid_url": None,
            "sales_servicing_exec": rng.choice(["Riya Prajapati", "Shivang Tyagi", "Prince Rastogi", None]),
            "tele_cc_exec": rng.choice(["Customer Care-IM", "KCD Team", None]),
        },
        "contact_context": {
            "primary_email": masked_email(slug, rng),
            "alternate_email": rng.choice([None, masked_email(slug, rng)]),
            "primary_mobile": masked_mobile(rng),
            "alternate_mobile": rng.choice([None, masked_mobile(rng)]),
            "phone": rng.choice([None, f"+91 {rng.randint(11, 999)} {rng.randint(20, 99)}*****"]),
            "alternate_phone": None,
            "fax": None,
            "alternate_fax": None,
            "supplier_pns_number": str(rng.randint(7900000000, 7999999999)),
            "pns_incoming_number": str(rng.randint(7900000000, 7999999999)),
            "privacy_note": "Synthetic masked contact values for demo use.",
        },
        "performance_snapshot": {
            "seven_day": {
                "bl_active": f"{rng.randint(0, 7)} D",
                "all_enquiries": f"{rng.randint(0, 7)} D",
                "calls": seven_calls,
                "lead_manager": f"{rng.randint(45, 100)}% ({rng.randint(0, 8)})",
                "callbacks": f"{rng.randint(0, 7)} D",
                "replies": replies_7,
                "connection_attempt": str(rng.randint(0, 160)),
                "product_add": f"{rng.randint(0, 5)}/{rng.randint(0, 8)}",
                "product_deactivation": rng.randint(0, 2),
            },
            "thirty_day": {
                "bl_active": f"{rng.randint(5, 30)} D",
                "all_enquiries": f"{rng.randint(5, 30)} D",
                "calls": thirty_calls,
                "lead_manager": f"{rng.randint(45, 100)}% ({rng.randint(1, 25)})",
                "callbacks": f"{rng.randint(5, 30)} D",
                "replies": replies_30,
                "connection_attempt": str(rng.randint(40, 520)),
                "product_add": f"{rng.randint(0, 12)}/{rng.randint(0, 18)}",
                "product_deactivation": rng.randint(0, 8),
            },
            "ninety_day": {
                "bl_active": f"{rng.randint(20, 90)} D",
                "all_enquiries": f"{rng.randint(20, 90)} D",
                "calls": ninety_calls,
                "lead_manager": f"{rng.randint(40, 100)}% ({rng.randint(5, 80)})",
                "callbacks": f"{rng.randint(20, 90)} D",
                "replies": replies_90,
                "connection_attempt": str(rng.randint(120, 1800)),
                "product_add": f"{rng.randint(0, 40)}/{rng.randint(0, 50)}",
                "product_deactivation": rng.randint(0, 20),
            },
            "connect_recency": f"{rng.randint(0, 60)} D",
            "meeting_recency": f"{rng.randint(0, 120)} D",
            "number_count": rng.randint(1, 5),
            "category_score": f"{score}%",
            "product_count": products,
        },
        "sales_service_history": history,
        "pain_points": [
            {
                "category": category,
                "evidence": [
                    f"{history[0]['date']} {history[0]['activity_type']} history note: {evidence}",
                    f"Performance snapshot available for GLID {glid}.",
                ],
                "suggested_action": action,
            }
            for category, evidence, action in pain_choices
        ],
        "model_usage_notes": {
            "recommended_call_objective": rng.choice(
                [
                    "Service-first issue resolution call",
                    "Lead optimization and category tuning call",
                    "Renewal value review with soft upsell",
                    "Catalog quality improvement call",
                    "Panel adoption and Leads Manager guidance call",
                ]
            ),
            "do_not_claim": [
                "Unmasked phone numbers or emails",
                "Data from inaccessible internal pages",
                "Payment confirmation unless present in account records",
            ],
        },
    }


def build_dataset(count: int) -> dict:
    if count < 1:
        raise ValueError("count must be at least 1")

    rng = random.Random(SEED)
    records = [original_seller()]
    used_glids = {records[0]["glid"]}

    for index in range(1, count):
        records.append(synthetic_seller(index, rng, used_glids))

    return {
        "metadata": {
            "dataset_name": "IndiaMART seller sales-chatbot prototype dataset",
            "total_records": len(records),
            "original_records": 1,
            "synthetic_records": len(records) - 1,
            "random_seed": SEED,
            "schema_version": "1.0",
            "notes": [
                "Record 0 is the authentic WebERP-inspected seller.",
                "Records 1..399 are deterministic fake IndiaMART-style sellers.",
                "Masked contact values must remain masked in AI responses.",
            ],
        },
        "records": records,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--count", type=int, default=DEFAULT_COUNT)
    parser.add_argument("--output", default="seller_dataset.json")
    args = parser.parse_args()

    dataset = build_dataset(args.count)
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(dataset, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"Wrote {len(dataset['records'])} sellers to {output}")
    print(f"Original records: {dataset['metadata']['original_records']}")
    print(f"Synthetic records: {dataset['metadata']['synthetic_records']}")
    print(f"First GLID: {dataset['records'][0]['glid']}")
    print(f"Last GLID: {dataset['records'][-1]['glid']}")


if __name__ == "__main__":
    main()
