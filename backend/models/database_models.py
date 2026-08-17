from datetime import datetime

from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    predictions = db.relationship("Prediction", backref="user", lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "email": self.email}


class Prediction(db.Model):
    __tablename__ = "predictions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    production_process = db.Column(db.String(120), nullable=False)
    raw_material = db.Column(db.String(120), nullable=False)
    process_stage = db.Column(db.String(120), nullable=False)
    material_category = db.Column(db.String(120), nullable=False)
    production_quantity = db.Column(db.Float, nullable=False)
    material_quantity = db.Column(db.Float, nullable=False)

    predicted_waste_type = db.Column(db.String(120), nullable=False)
    waste_category = db.Column(db.String(80), nullable=False)
    action = db.Column(db.String(40), nullable=False, default="Review")
    confidence = db.Column(db.Float, nullable=False)
    priority = db.Column(db.String(40), nullable=False)
    recommendation = db.Column(db.String(255), nullable=False)
    environmental_note = db.Column(db.String(255), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "production_process": self.production_process,
            "raw_material": self.raw_material,
            "process_stage": self.process_stage,
            "material_category": self.material_category,
            "production_quantity": self.production_quantity,
            "material_quantity": self.material_quantity,
            "predicted_waste_type": self.predicted_waste_type,
            "waste_category": self.waste_category,
            "action": self.action,
            "confidence": self.confidence,
            "priority": self.priority,
            "recommendation": self.recommendation,
            "environmental_note": self.environmental_note,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
