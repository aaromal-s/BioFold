import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from engine.data_handler import parse_file
from engine.adaptive_selector import select_algorithm
from engine.manifold_engine import run_reduction
from preprocessing.cleaner import drop_non_numeric_columns, fill_missing_values, remove_constant_columns
from preprocessing.scaler import standard_scale
from preprocessing.feature_selector import reduce_features
from utils.logger import setup_logger

logger = setup_logger(__name__)
analyze_bp = Blueprint("analyze", __name__)

UPLOAD_FOLDER = "temp_uploads"


@analyze_bp.route("/api/analyze", methods=["POST"])
def analyze_dataset():
    try:
        body = request.get_json()
        if not body or "filename" not in body:
            return jsonify({"success": False, "error": "filename is required"}), 400

        filename = secure_filename(body["filename"])
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        if not os.path.exists(filepath):
            return jsonify({"success": False, "error": "File not found"}), 404

        logger.info(f"Analyzing {filename}")
        df = parse_file(filepath)

        # Preprocessing pipeline
        df = drop_non_numeric_columns(df)
        df = fill_missing_values(df)
        df = remove_constant_columns(df)
        df = standard_scale(df)
        df = reduce_features(df)

        n_rows = df.shape[0]
        n_features = df.shape[1]
        algorithm = select_algorithm(n_rows)

        logger.info(f"Dataset: {n_rows} rows, {n_features} features → algorithm: {algorithm}")

        return jsonify({
            "success": True,
            "data": {
                "algorithm_used": algorithm,
                "n_rows": n_rows,
                "n_components_after_preprocessing": n_features,
                "status": "ready"
            }
        })

    except Exception as e:
        logger.error(f"Analyze error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500
