from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from models.database_models import db
from routes.auth_routes import auth_bp, ensure_demo_user
from routes.dashboard_routes import dashboard_bp
from routes.prediction_routes import prediction_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": Config.FRONTEND_URL}})

    db.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(prediction_bp)
    app.register_blueprint(dashboard_bp)

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"success": True, "message": "Steel Waste Management API is running."})

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "message": "Resource not found."}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"success": False, "message": "Internal server error. Please try again later."}), 500

    with app.app_context():
        db.create_all()
        ensure_demo_user()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
