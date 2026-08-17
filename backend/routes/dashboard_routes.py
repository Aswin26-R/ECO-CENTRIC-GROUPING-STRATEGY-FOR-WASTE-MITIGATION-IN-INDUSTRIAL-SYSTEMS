from collections import Counter, defaultdict

from flask import Blueprint, jsonify

from models.database_models import Prediction
from models.ml_model import get_metrics

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")


@dashboard_bp.route("/stats", methods=["GET"])
def stats():
    predictions = Prediction.query.all()

    total = len(predictions)
    recyclable = sum(1 for p in predictions if p.waste_category in ("Recyclable", "Reusable"))
    hazardous = sum(1 for p in predictions if p.waste_category == "Hazardous")
    high_priority = sum(1 for p in predictions if p.priority == "High")

    return jsonify(
        {
            "success": True,
            "stats": {
                "total_predictions": total,
                "recyclable_waste": recyclable,
                "hazardous_waste": hazardous,
                "high_priority_waste": high_priority,
            },
        }
    )


@dashboard_bp.route("/charts", methods=["GET"])
def charts():
    predictions = Prediction.query.order_by(Prediction.created_at.asc()).all()

    waste_type_counts = Counter(p.predicted_waste_type for p in predictions)
    recommendation_counts = Counter(p.recommendation for p in predictions)

    by_day = defaultdict(int)
    for p in predictions:
        if p.created_at:
            day_key = p.created_at.strftime("%Y-%m-%d")
            by_day[day_key] += 1

    return jsonify(
        {
            "success": True,
            "charts": {
                "waste_type_distribution": [
                    {"name": k, "value": v} for k, v in waste_type_counts.most_common()
                ],
                "recommendation_distribution": [
                    {"name": k, "value": v} for k, v in recommendation_counts.most_common()
                ],
                "predictions_over_time": [
                    {"date": k, "count": v} for k, v in sorted(by_day.items())
                ],
            },
        }
    )


@dashboard_bp.route("/model-metrics", methods=["GET"])
def model_metrics():
    """Exposes LDA evaluation metrics (accuracy/precision/recall/F1/confusion matrix)."""
    try:
        return jsonify({"success": True, "metrics": get_metrics()})
    except Exception:
        return jsonify({"success": False, "message": "Model metrics not available. Train the model first."}), 503
