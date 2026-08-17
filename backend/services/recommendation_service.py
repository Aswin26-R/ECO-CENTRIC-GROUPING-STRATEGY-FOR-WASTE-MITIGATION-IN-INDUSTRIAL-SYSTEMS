"""
Application-level recommendation layer applied after the LDA prediction.

These waste-category mappings and recommendation texts are a PROTOTYPE
IMPLEMENTATION ASSUMPTION for this academic demo -- they are not claims
taken from the source project document, which does not specify exact waste
categories or recommendation rules. The structure is kept modular so it can
later be replaced with a more sophisticated rule engine or a second ML
model, as noted in the project document's future-enhancement discussion.
"""

WASTE_RULES = {
    "Steel Scrap": {
        "category": "Recyclable",
        "action": "Recycle",
        "priority": "Medium",
        "recommendation": "Segregate and route to steel recycling / re-melting.",
        "environmental_note": "Recycling scrap reduces demand for virgin raw material and lowers energy use.",
    },
    "Blast Furnace Slag": {
        "category": "Recyclable",
        "action": "Reuse",
        "priority": "Low",
        "recommendation": "Process for reuse in cement production or road-base aggregate.",
        "environmental_note": "Slag reuse in construction materials avoids landfill and reduces cement clinker demand.",
    },
    "Mill Scale": {
        "category": "Recyclable",
        "action": "Recycle",
        "priority": "Medium",
        "recommendation": "Collect and recycle as feedstock for sintering or iron recovery.",
        "environmental_note": "Recovering iron units from mill scale reduces the need for new iron ore.",
    },
    "EAF Dust": {
        "category": "Hazardous",
        "action": "Treatment",
        "priority": "High",
        "recommendation": "Store in sealed containers and route to a licensed hazardous-waste processor for zinc/metal recovery.",
        "environmental_note": "EAF dust can contain heavy metals; improper handling poses a serious environmental and health risk.",
    },
    "Pickling Sludge": {
        "category": "Hazardous",
        "action": "Treatment",
        "priority": "High",
        "recommendation": "Neutralize and treat acidic sludge before recovering usable metal salts.",
        "environmental_note": "Untreated pickling sludge is acidic and can contaminate soil and groundwater.",
    },
    "Zinc Ash": {
        "category": "Hazardous",
        "action": "Treatment",
        "priority": "High",
        "recommendation": "Segregate for zinc recovery through a certified reclamation process.",
        "environmental_note": "Zinc ash recovery reduces the need for primary zinc mining and prevents soil contamination.",
    },
    "Refractory Waste": {
        "category": "Reusable",
        "action": "Reuse",
        "priority": "Low",
        "recommendation": "Crush and reuse as raw material in refractory relining or as construction aggregate.",
        "environmental_note": "Reusing refractory material reduces raw mineral extraction for new refractory bricks.",
    },
    "Waste Gas Sludge": {
        "category": "Treatable",
        "action": "Treatment",
        "priority": "Medium",
        "recommendation": "Treat through gas-cleaning/dewatering systems before safe disposal or partial reuse.",
        "environmental_note": "Proper gas-sludge treatment reduces particulate emissions and downstream water contamination.",
    },
}

DEFAULT_RULE = {
    "category": "Unclassified",
    "action": "Review",
    "priority": "Medium",
    "recommendation": "Manually review this waste stream; no automated recommendation rule is defined yet.",
    "environmental_note": None,
}


def get_recommendation(waste_type: str) -> dict:
    return WASTE_RULES.get(waste_type, DEFAULT_RULE)
