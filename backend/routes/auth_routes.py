from flask import Blueprint, jsonify, request

from models.database_models import User, db

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

DEMO_EMAIL = "demo@steelwaste.io"
DEMO_PASSWORD = "demo1234"


def ensure_demo_user():
    """Creates a demo login account on first run, for the academic prototype."""
    if not User.query.filter_by(email=DEMO_EMAIL).first():
        user = User(name="Demo User", email=DEMO_EMAIL)
        user.set_password(DEMO_PASSWORD)
        db.session.add(user)
        db.session.commit()


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required."}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"success": False, "message": "Invalid email or password."}), 401

    # Prototype implementation assumption: simple session-less token stand-in
    # for the academic demo (real auth/session/JWT handling is out of scope).
    return jsonify(
        {
            "success": True,
            "user": user.to_dict(),
            "token": f"demo-token-{user.id}",
        }
    )
