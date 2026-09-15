import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from engine.data_handler import parse_file, extract_metadata
from utils.validator import validate_upload
from utils.logger import setup_logger

logger = setup_logger(__name__)
upload_bp = Blueprint("upload", __name__)

UPLOAD_FOLDER = "temp_uploads"


@upload_bp.route("/api/upload", methods=["POST"])
def upload_file():
    try:
        if "file" not in request.files:
            return jsonify({"success": False, "error": "No file provided"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"success": False, "error": "No file selected"}), 400

        is_valid, error_msg = validate_upload(file)
        if not is_valid:
            return jsonify({"success": False, "error": error_msg}), 400

        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        logger.info(f"File saved to {filepath}")

        df = parse_file(filepath)
        metadata = extract_metadata(df)

        preview = df.head(5).fillna("").to_dict(orient="records")

        return jsonify({
            "success": True,
            "data": {
                "filename": filename,
                "rows": metadata["rows"],
                "columns": metadata["columns"],
                "missing_values": metadata["missing_values"],
                "numeric_features": metadata["numeric_features"],
                "dtypes": metadata["dtypes"],
                "preview": preview
            }
        })

    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@upload_bp.route("/api/remove", methods=["POST"])
def remove_file():
    try:
        data = request.get_json()
        filename = data.get("filename")
        if not filename:
            return jsonify({"success": False, "error": "No filename provided"}), 400
            
        filepath = os.path.join(UPLOAD_FOLDER, secure_filename(filename))
        if os.path.exists(filepath):
            os.remove(filepath)
            logger.info(f"File removed: {filepath}")
            return jsonify({"success": True, "message": "File removed successfully"})
        else:
            return jsonify({"success": False, "error": "File not found"}), 404
    except Exception as e:
        logger.error(f"Remove error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500
