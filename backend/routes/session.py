from flask import Blueprint, request, jsonify
import json
from models import db, AnalysisSession
from utils.logger import setup_logger

logger = setup_logger(__name__)
session_bp = Blueprint("session", __name__)

@session_bp.route("/api/sessions", methods=["GET"])
def get_sessions():
    try:
        sessions = AnalysisSession.query.order_by(AnalysisSession.created_at.desc()).all()
        return jsonify({
            "success": True,
            "data": [s.to_dict() for s in sessions]
        })
    except Exception as e:
        logger.error(f"Error fetching sessions: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@session_bp.route("/api/sessions", methods=["POST"])
def save_session():
    try:
        body = request.get_json()
        if not body or "name" not in body or "params" not in body or "dataset_name" not in body:
            return jsonify({"success": False, "error": "Missing required fields"}), 400

        new_session = AnalysisSession(
            name=body["name"],
            dataset_name=body["dataset_name"],
            params_json=json.dumps(body["params"]),
            processed_file=body.get("processed_file", "")
        )
        db.session.add(new_session)
        db.session.commit()
        
        logger.info(f"Saved new session: {new_session.name}")
        return jsonify({
            "success": True,
            "data": new_session.to_dict()
        })
    except Exception as e:
        logger.error(f"Error saving session: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@session_bp.route("/api/sessions/<int:session_id>", methods=["DELETE"])
def delete_session(session_id):
    try:
        session = AnalysisSession.query.get(session_id)
        if not session:
            return jsonify({"success": False, "error": "Session not found"}), 404
            
        db.session.delete(session)
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        logger.error(f"Error deleting session: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
