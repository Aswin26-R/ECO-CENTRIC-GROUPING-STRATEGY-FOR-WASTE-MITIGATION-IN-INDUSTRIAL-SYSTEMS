from models.ml_model import predict_waste
from services.recommendation_service import get_recommendation

REQUIRED_FIELDS = [
    "production_process",
    "raw_material",
    "process_stage",
    "material_category",
    "production_quantity",
    "material_quantity",
]


class ValidationError(Exception):
    pass


def validate_input(data: dict):
    missing = [f for f in REQUIRED_FIELDS if data.get(f) in (None, "")]
    if missing:
        raise ValidationError(f"Missing required field(s): {', '.join(missing)}")

    for qty_field in ("production_quantity", "material_quantity"):
        try:
            value = float(data[qty_field])
        except (TypeError, ValueError):
            raise ValidationError(f"'{qty_field}' must be a number.")
        if value <= 0:
            raise ValidationError(f"'{qty_field}' must be greater than zero.")


def run_prediction(data: dict) -> dict:
    validate_input(data)

    clean_input = {
        "production_process": data["production_process"],
        "raw_material": data["raw_material"],
        "process_stage": data["process_stage"],
        "material_category": data["material_category"],
        "production_quantity": float(data["production_quantity"]),
        "material_quantity": float(data["material_quantity"]),
    }

    waste_type, confidence, probabilities = predict_waste(clean_input)
    rule = get_recommendation(waste_type)

    return {
        "input": clean_input,
        "waste_type": waste_type,
        "category": rule["category"],
        "action": rule["action"],
        "priority": rule["priority"],
        "confidence": confidence,
        "recommendation": rule["recommendation"],
        "environmental_note": rule["environmental_note"],
        "probabilities": probabilities,
    }
