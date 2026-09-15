import os
import time
from flask import Blueprint, request, jsonify, send_file
from werkzeug.utils import secure_filename
from engine.data_handler import parse_file
from engine.manifold_engine import run_reduction
from utils.logger import setup_logger
import pandas as pd
import numpy as np

logger = setup_logger(__name__)
visualize_bp = Blueprint("visualize", __name__)

UPLOAD_FOLDER = "temp_uploads"


@visualize_bp.route("/api/visualize", methods=["POST"])
def visualize_dataset():
    try:
        body = request.get_json()
        if not body or "filename" not in body:
            return jsonify({"success": False, "error": "filename is required"}), 400

        filename = secure_filename(body["filename"])
        algorithm_override = body.get("algorithm", None)
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        if not os.path.exists(filepath):
            return jsonify({"success": False, "error": "File not found"}), 404

        logger.info(f"Visualizing {filename} with algorithm override={algorithm_override}")

        start_time = time.time()
        df_original = parse_file(filepath)
        
        # Build label column — extract BEFORE running reduction
        labels = []
        best_col = None
        
        # 1. Look for obvious column names in ALL columns (including numeric ones)
        for col in df_original.columns:
            col_lower = str(col).lower()
            if any(x in col_lower for x in ["type", "label", "cluster", "group", "class", "category"]):
                best_col = col
                break
        
        # 2. Find a non-numeric column with few unique values (categorical), avoiding IDs
        if not best_col:
            non_numeric_cols = df_original.select_dtypes(exclude=[np.number]).columns.tolist()
            for col in non_numeric_cols:
                n_unique = df_original[col].nunique()
                if 1 < n_unique < len(df_original) * 0.5:
                    best_col = col
                    break
        
        # 3. Fallback to first non-numeric
        if not best_col:
            non_numeric_cols = df_original.select_dtypes(exclude=[np.number]).columns.tolist()
            if non_numeric_cols:
                best_col = non_numeric_cols[0]
                
        if best_col:
            labels = df_original[best_col].astype(str).tolist()
            logger.info(f"Selected '{best_col}' as label column")
            # Drop the label column so it doesn't get used as a mathematical feature
            df_original.drop(columns=[best_col], inplace=True)
        else:
            labels = ["Unlabeled"] * len(df_original)
            logger.info("No label column found, using 'Unlabeled'")

        result_2d, algorithm_used = run_reduction(df_original, algorithm_override)
        elapsed = round(time.time() - start_time, 2)

        points = [
            {"x": float(result_2d[i, 0]), "y": float(result_2d[i, 1]), "label": labels[i]}
            for i in range(len(result_2d))
        ]

        # Save processed CSV
        processed_filename = f"processed_{filename}"
        processed_path = os.path.join(UPLOAD_FOLDER, processed_filename)
        proc_df = pd.DataFrame(result_2d, columns=["dim1", "dim2"])
        proc_df["label"] = labels
        proc_df.to_csv(processed_path, index=False)

        return jsonify({
            "success": True,
            "data": {
                "points": points,
                "algorithm_used": algorithm_used,
                "n_points": len(points),
                "elapsed_seconds": elapsed,
                "processed_filename": processed_filename
            }
        })

    except Exception as e:
        logger.error(f"Visualize error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


@visualize_bp.route("/api/download/<filename>", methods=["GET"])
def download_processed(filename):
    try:
        safe_filename = secure_filename(filename)
        filepath = os.path.join(UPLOAD_FOLDER, safe_filename)
        if not os.path.exists(filepath):
            return jsonify({"success": False, "error": "File not found"}), 404
        return send_file(filepath, as_attachment=True, download_name=filename)
    except Exception as e:
        logger.error(f"Download error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500
