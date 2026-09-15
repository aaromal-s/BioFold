import os
from flask import Flask, jsonify
from flask_cors import CORS
from routes.upload import upload_bp
from routes.analyze import analyze_bp
from routes.visualize import visualize_bp
from utils.logger import setup_logger

logger = setup_logger(__name__)

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Ensure temp upload directory exists
    os.makedirs("temp_uploads", exist_ok=True)

    # Register blueprints
    app.register_blueprint(upload_bp)
    app.register_blueprint(analyze_bp)
    app.register_blueprint(visualize_bp)

    @app.route("/api/health", methods=["GET"])
    def health():
        logger.info("Health check requested")
        return jsonify({
            "success": True,
            "data": {
                "status": "online",
                "version": "1.0.0",
                "service": "BioManifold Backend"
            }
        })

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "error": "Route not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"success": False, "error": "Internal server error"}), 500

    return app


if __name__ == "__main__":
    app = create_app()
    logger.info("BioManifold backend starting on port 5000")
    app.run(debug=True, port=5000, threaded=True)
