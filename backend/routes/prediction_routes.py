from flask import Blueprint, jsonify, request

from models.database_models import Prediction, db
from models.ml_model import ModelNotTrainedError
from services.prediction_service import ValidationError, run_prediction

prediction_bp = Blueprint("predictions", __name__, url_prefix="/api/predictions")

DEFAULT_USER_ID = 1  # Prototype implementation assumption: single demo user


@prediction_bp.route("/predict", methods=["POST"])
def predict_only():
    """Runs the LDA prediction WITHOUT saving to the database (preview step)."""
    data = request.get_json(silent=True) or {}
    try:
        result = run_prediction(data)
        return jsonify({"success": True, "prediction": result})
    except ValidationError as e:
        return jsonify({"success": False, "message": str(e)}), 400
    except ModelNotTrainedError as e:
        return jsonify({"success": False, "message": str(e)}), 503
    except Exception:
        return jsonify(
            {"success": False, "message": "Unable to analyze the data. Please check your inputs and try again."}
        ), 500


@prediction_bp.route("", methods=["POST"])
def save_prediction():
    """Runs the prediction AND persists it to the database."""
    data = request.get_json(silent=True) or {}
    try:
        result = run_prediction(data)
    except ValidationError as e:
        return jsonify({"success": False, "message": str(e)}), 400
    except ModelNotTrainedError as e:
        return jsonify({"success": False, "message": str(e)}), 503
    except Exception:
        return jsonify(
            {"success": False, "message": "Unable to analyze the data. Please check your inputs and try again."}
        ), 500

    try:
        record = Prediction(
            user_id=DEFAULT_USER_ID,
            production_process=result["input"]["production_process"],
            raw_material=result["input"]["raw_material"],
            process_stage=result["input"]["process_stage"],
            material_category=result["input"]["material_category"],
            production_quantity=result["input"]["production_quantity"],
            material_quantity=result["input"]["material_quantity"],
            predicted_waste_type=result["waste_type"],
            waste_category=result["category"],
            action=result["action"],
            confidence=result["confidence"],
            priority=result["priority"],
            recommendation=result["recommendation"],
            environmental_note=result["environmental_note"],
        )
        db.session.add(record)
        db.session.commit()
        return jsonify({"success": True, "prediction": record.to_dict()}), 201
    except Exception:
        db.session.rollback()
        return jsonify({"success": False, "message": "Unable to save the prediction. Please try again."}), 500


@prediction_bp.route("", methods=["GET"])
def list_predictions():
    query = Prediction.query.order_by(Prediction.created_at.desc())

    search = request.args.get("search", "").strip()
    if search:
        like = f"%{search}%"
        query = query.filter(
            db.or_(
                Prediction.predicted_waste_type.ilike(like),
                Prediction.production_process.ilike(like),
                Prediction.waste_category.ilike(like),
            )
        )

    category = request.args.get("category", "").strip()
    if category:
        query = query.filter(Prediction.waste_category == category)

    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=10, type=int)

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify(
        {
            "success": True,
            "predictions": [p.to_dict() for p in pagination.items],
            "total": pagination.total,
            "page": page,
            "per_page": per_page,
            "pages": pagination.pages,
        }
    )


@prediction_bp.route("/<int:prediction_id>", methods=["GET"])
def get_prediction(prediction_id):
    record = Prediction.query.get(prediction_id)
    if not record:
        return jsonify({"success": False, "message": "Prediction not found."}), 404
    return jsonify({"success": True, "prediction": record.to_dict()})


@prediction_bp.route("/<int:prediction_id>", methods=["DELETE"])
def delete_prediction(prediction_id):
    record = Prediction.query.get(prediction_id)
    if not record:
        return jsonify({"success": False, "message": "Prediction not found."}), 404
    db.session.delete(record)
    db.session.commit()
    return jsonify({"success": True, "message": "Prediction deleted."})
