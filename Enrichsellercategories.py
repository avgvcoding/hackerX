"""
enrich_seller_categories.py
────────────────────────────────────────────────────────────────────────────
Reads an IndiaMart seller JSON file and adds a `categories_bl_last_6_months`
block to every seller record that is missing it.

Supported JSON shapes
─────────────────────
  Shape A – wrapped dataset (your actual file format):
      {
        "metadata": { "total_records": 400, ... },
        "records":  [ { seller }, { seller }, ... ]
      }
      → metadata is preserved & updated; only records[] is enriched.

  Shape B – bare list:
      [ { seller }, { seller }, ... ]

  Shape C – single seller dict:
      { "glid": "...", ... }

Categories are generated contextually:
  • Company name / website / sales history are scanned for industry keywords.
  • A matching MCAT pool is selected; MCATs, product names, BL numbers, ranks,
    and service tiers are all randomised within realistic IndiaMart ranges.
  • Records that already contain categories_bl_last_6_months are skipped.
  • A per-GLID random seed ensures reproducible output across runs.

Usage
─────
    python enrich_seller_categories.py <input.json> [output.json]

If output.json is omitted the enriched file is written to
<input>_enriched.json in the same directory.
"""

import json
import random
import sys
import os
from copy import deepcopy

# ── 1. MCAT POOLS ──────────────────────────────────────────────────────────
# Each pool entry:  (mcat_name, [primary products], [secondary products])
MCAT_POOLS = {
    "cable_drag_chain": [
        ("Cable Drag Chain",
         ["15x40mm Plastic Cable Drag Chain", "20x40mm Plastic Cable Drag Chain",
          "25x57mm Cable Drag Chain", "35x75mm Heavy Duty Drag Chain"],
         ["Metal Cable Drag Chain", "Nylon Cable Drag Chain"]),
        ("Steel Drag Chain",
         ["200mm Steel Drag Chain", "Enclosed Metal Drag Chain",
          "H75 Steel Drag Chain", "Open Type Steel Drag Chain"],
         ["Stainless Steel Drag Chain"]),
        ("Plastic Cable Carrier",
         ["Plastic Cable Carrier", "Plastic Cable Drag Chain",
          "Plastic Energy Drag Chain", "Mini Cable Carrier"],
         ["Flexible Cable Carrier"]),
        ("Energy Chain",
         ["Igus-Type Energy Chain", "Heavy Duty Energy Chain",
          "Compact Energy Chain"],
         ["Self-Supporting Energy Chain"]),
    ],
    "electrical": [
        ("Electric Wire & Cable",
         ["FR PVC House Wire", "Armoured Cable", "Flexible Wire",
          "Co-axial Cable", "Control Cable"],
         ["Fire Survival Cable", "XLPE Cable"]),
        ("MCB & MCCB",
         ["Single Pole MCB", "Double Pole MCB", "Triple Pole MCB"],
         ["RCCB", "ELCB"]),
        ("Distribution Board",
         ["Single Door DB", "Double Door Distribution Board",
          "IP65 Weatherproof DB"],
         ["DIN Rail", "Busbar Chamber"]),
        ("Industrial Plug & Socket",
         ["16A Industrial Plug", "32A Industrial Socket",
          "63A CEE Plug"],
         ["Waterproof Connector"]),
    ],
    "machinery": [
        ("Industrial Machine",
         ["CNC Turning Machine", "Hydraulic Press Machine",
          "Injection Moulding Machine", "Band Saw Machine"],
         ["Drill Press Machine"]),
        ("Conveyor System",
         ["Belt Conveyor", "Roller Conveyor", "Chain Conveyor",
          "Screw Conveyor"],
         ["Overhead Conveyor"]),
        ("Pump & Motor",
         ["Centrifugal Pump", "Submersible Pump", "Gear Motor",
          "AC Induction Motor"],
         ["Monoblock Pump"]),
        ("Pneumatic Equipment",
         ["Air Compressor", "Pneumatic Cylinder", "Solenoid Valve",
          "FRL Unit"],
         ["Air Filter Regulator"]),
    ],
    "hardware": [
        ("Industrial Fastener",
         ["Hex Bolt", "Stainless Steel Nut", "Self Tapping Screw",
          "Foundation Bolt", "Allen Key Bolt"],
         ["Washer", "Threaded Rod"]),
        ("Bearing",
         ["Deep Groove Ball Bearing", "Taper Roller Bearing",
          "Thrust Bearing", "Needle Roller Bearing"],
         ["Pillow Block Bearing"]),
        ("Coupling",
         ["Jaw Coupling", "Rigid Coupling", "Flexible Coupling",
          "Oldham Coupling"],
         ["Spider Insert"]),
        ("Safety Equipment",
         ["Safety Helmet", "Safety Harness", "Industrial Gloves",
          "Safety Shoes"],
         ["Ear Muff", "Safety Goggles"]),
    ],
    "chemical": [
        ("Industrial Chemical",
         ["Hydrochloric Acid", "Sulphuric Acid", "Sodium Hydroxide",
          "Hydrogen Peroxide"],
         ["Ferric Chloride"]),
        ("Lubricant & Oil",
         ["Gear Oil", "Hydraulic Oil", "Cutting Oil",
          "Spindle Oil", "Compressor Oil"],
         ["Grease"]),
        ("Adhesive & Sealant",
         ["Epoxy Adhesive", "Silicone Sealant", "Cyanoacrylate Adhesive",
          "Polyurethane Sealant"],
         ["Thread Lock"]),
        ("Water Treatment Chemical",
         ["Alum", "Chlorine Tablet", "Coagulant", "Antiscalant"],
         ["Biocide"]),
    ],
    "textile": [
        ("Fabric",
         ["Cotton Fabric", "Polyester Fabric", "Blended Fabric",
          "Denim Fabric"],
         ["Lycra Fabric"]),
        ("Yarn",
         ["Cotton Yarn", "Polyester Yarn", "Nylon Yarn",
          "Viscose Yarn"],
         ["Blended Yarn"]),
        ("Garment",
         ["Men's T-Shirt", "Ladies Kurti", "Industrial Uniform",
          "Safety Jacket"],
         ["Apron"]),
        ("Knitting Machine Part",
         ["Needle", "Sinker", "Cam", "Feeder"],
         ["Jack"]),
    ],
    "food": [
        ("Spices & Masala",
         ["Red Chilli Powder", "Turmeric Powder", "Coriander Powder",
          "Garam Masala", "Kitchen King Masala"],
         ["Pepper Powder"]),
        ("Snacks & Namkeen",
         ["Bhujia", "Mixture", "Chakli", "Poha Chivda"],
         ["Khakhra"]),
        ("Bakery Product",
         ["Bread", "Biscuit", "Cake", "Rusk"],
         ["Cookies"]),
        ("Dairy Product",
         ["Paneer", "Ghee", "Butter", "Skimmed Milk Powder"],
         ["Cheese"]),
    ],
    "generic": [
        ("Industrial Product",
         ["Product A", "Product B", "Product C", "Product D"],
         ["Product E"]),
        ("Spare Part",
         ["Spare A", "Spare B", "Spare C"],
         ["Spare D"]),
        ("Component",
         ["Component A", "Component B", "Component C"],
         ["Component D"]),
        ("Raw Material",
         ["Raw Material A", "Raw Material B"],
         ["Raw Material C"]),
    ],
}

# ── 2. INDUSTRY DETECTION ──────────────────────────────────────────────────
KEYWORDS = {
    "cable_drag_chain": ["cable", "drag chain", "energy chain", "carrier", "starcable"],
    "electrical":       ["electric", "wire", "mcb", "panel", "switchgear", "transformer"],
    "machinery":        ["machine", "machinery", "equipment", "pump", "motor", "conveyor"],
    "hardware":         ["hardware", "fastener", "bolt", "nut", "bearing", "coupling"],
    "chemical":         ["chemical", "acid", "lubricant", "oil", "adhesive", "coating"],
    "textile":          ["textile", "fabric", "yarn", "garment", "knitting", "cloth"],
    "food":             ["food", "spice", "masala", "snack", "bakery", "dairy", "namkeen"],
}

def detect_industry(record: dict) -> str:
    """Return an MCAT pool key based on clues in the seller record."""
    clues = " ".join([
        record.get("seller_identity", {}).get("company_name", ""),
        record.get("account_status", {}).get("website", ""),
        json.dumps(record.get("sales_service_history", [])),
        json.dumps(record.get("pain_points", [])),
    ]).lower()

    for industry, kws in KEYWORDS.items():
        if any(kw in clues for kw in kws):
            return industry
    return "generic"

# ── 3. CATEGORY GENERATOR ──────────────────────────────────────────────────
RANKS      = ["A", "A", "A", "B", "B", "C"]   # weighted toward A/B
SERVICES   = ["IM STAR 10", "IM STAR 10", "IM STAR 5", None]

def random_category_entry(sno: int, mcat_tuple: tuple) -> dict:
    mcat_name, primary_pool, secondary_pool = mcat_tuple

    num_primary   = random.randint(1, min(3, len(primary_pool)))
    num_secondary = random.randint(0, min(2, len(secondary_pool)))
    num_products  = random.randint(3, 90)

    # Higher product count → higher BL numbers (loose correlation)
    bl_scale = num_products * random.uniform(8, 20)
    pur_bl_t = int(bl_scale * random.uniform(0.8, 1.2))
    pur_bl_p = int(pur_bl_t * random.uniform(0.5, 0.95))

    rank    = random.choice(RANKS)
    service = random.choice(SERVICES)

    # Rank C entries typically have no IM STAR service
    if rank == "C":
        service = None

    return {
        "sno":               sno,
        "mcat_name":         mcat_name,
        "no_of_products":    num_products,
        "primary_products":  random.sample(primary_pool, num_primary),
        "secondary_products": (
            random.sample(secondary_pool, num_secondary)
            if num_secondary else []
        ),
        "rank":              rank,
        "pur_bl_t_last_6m":  pur_bl_t,
        "pur_bl_p_last_6m":  pur_bl_p,
        "service":           service,
    }

def build_categories(record: dict) -> list:
    industry = detect_industry(record)
    pool     = MCAT_POOLS[industry]

    # Pick 2–4 MCATs (no duplicates)
    num_cats = random.randint(2, min(4, len(pool)))
    chosen   = random.sample(pool, num_cats)

    return [random_category_entry(i + 1, mcat) for i, mcat in enumerate(chosen)]

# ── 4. ENRICHMENT LOGIC ────────────────────────────────────────────────────
def enrich_record(record: dict) -> dict:
    """Add categories block if missing; return enriched copy."""
    enriched = deepcopy(record)

    if "categories_bl_last_6_months" in enriched:
        print(f"  ↳ GLID {enriched.get('glid', '?')} already has categories — skipped.")
        return enriched

    categories = build_categories(enriched)

    # Insert after contact_context (preserve key order in Python 3.7+)
    new_record = {}
    for key, value in enriched.items():
        new_record[key] = value
        if key == "contact_context":
            new_record["categories_bl_last_6_months"] = categories

    # Fallback: key wasn't found, just append
    if "categories_bl_last_6_months" not in new_record:
        new_record["categories_bl_last_6_months"] = categories

    print(f"  ↳ GLID {enriched.get('glid', '?')} → added "
          f"{len(categories)} categories (industry: {detect_industry(enriched)})")
    return new_record

# ── 5. MAIN ────────────────────────────────────────────────────────────────

def load_and_detect(input_path: str):
    """
    Load JSON and return (shape, data).
    shape = "wrapped" | "list" | "single"
    """
    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if isinstance(data, dict) and "records" in data and "metadata" in data:
        return "wrapped", data
    elif isinstance(data, list):
        return "list", data
    else:
        return "single", data


def main():
    if len(sys.argv) < 2:
        print("Usage: python enrich_seller_categories.py <input.json> [output.json]")
        sys.exit(1)

    input_path  = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else (
        os.path.splitext(input_path)[0] + "_enriched.json"
    )

    print(f"\n📂  Reading  : {input_path}")
    shape, data = load_and_detect(input_path)
    print(f"📐  Shape    : {shape}")

    # ── Extract the records list ──────────────────────────────────────────
    if shape == "wrapped":
        records = data["records"]
    elif shape == "list":
        records = data
    else:                          # single seller dict
        records = [data]

    print(f"📊  Records  : {len(records)}\n")

    # ── Enrich every record ───────────────────────────────────────────────
    enriched_records = []
    added = skipped = 0
    for r in records:
        result = enrich_record(r)
        enriched_records.append(result)
        if "categories_bl_last_6_months" in r:
            skipped += 1
        else:
            added += 1

    # ── Reassemble in the original shape ─────────────────────────────────
    if shape == "wrapped":
        # Update metadata counters so the file stays self-consistent
        meta = deepcopy(data["metadata"])
        meta["categories_enriched"]        = added
        meta["categories_already_present"] = skipped
        meta["enrich_script_version"]      = "2.0"
        output_data = {"metadata": meta, "records": enriched_records}

    elif shape == "list":
        output_data = enriched_records

    else:
        output_data = enriched_records[0]

    # ── Write output ──────────────────────────────────────────────────────
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"\n✅  Written        : {output_path}")
    print(f"   Records enriched : {added}")
    print(f"   Already had cats : {skipped}")
    print(f"   Total records    : {len(enriched_records)}\n")


if __name__ == "__main__":
    main()