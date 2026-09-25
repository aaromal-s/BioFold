import os
import time
from flask import Blueprint, request, jsonify, send_file
from werkzeug.utils import secure_filename
from engine.data_handler import parse_file
from engine.manifold_engine import run_reduction
from algorithms.cluster_engine import apply_clustering
from algorithms.biomarker import compute_feature_importance
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

        # Instead of single parameter, pass entire body to run_reduction
        result_nd, algorithm_used, processed_df = run_reduction(df_original, params=body)
        
        # Apply clustering if requested
        clustering_method = body.get("clustering", "none")
        top_features = []
        if clustering_method != "none":
            # Run clustering on the reduced results
            cluster_labels = apply_clustering(result_nd, method=clustering_method, 
                                              n_clusters=int(body.get("n_clusters", 5)),
                                              eps=float(body.get("eps", 0.5)))
            labels = cluster_labels
            logger.info(f"Applied clustering: {clustering_method}")
            
            # Compute feature importances
            top_features = compute_feature_importance(processed_df, labels)

        elapsed = round(time.time() - start_time, 2)
        n_dims = int(body.get("n_components", 2))

        points = []
        for i in range(len(result_nd)):
            pt = {
                "x": float(result_nd[i, 0]),
                "y": float(result_nd[i, 1]),
                "label": labels[i]
            }
            if n_dims == 3 and result_nd.shape[1] >= 3:
                pt["z"] = float(result_nd[i, 2])
            points.push(pt) if hasattr(points, 'push') else points.append(pt)

        # Save processed CSV
        processed_filename = f"processed_{filename}"
        processed_path = os.path.join(UPLOAD_FOLDER, processed_filename)
        col_names = [f"dim{i+1}" for i in range(result_nd.shape[1])]
        proc_df = pd.DataFrame(result_nd, columns=col_names)
        proc_df["label"] = labels
        proc_df.to_csv(processed_path, index=False)

        return jsonify({
            "success": True,
            "data": {
                "points": points,
                "algorithm_used": algorithm_used,
                "n_points": len(points),
                "elapsed_seconds": elapsed,
                "processed_filename": processed_filename,
                "top_features": top_features,
                "n_components": n_dims
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
