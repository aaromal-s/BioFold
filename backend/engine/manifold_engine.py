import numpy as np
import pandas as pd
from engine.adaptive_selector import select_algorithm
from preprocessing.cleaner import drop_non_numeric_columns, fill_missing_values, remove_constant_columns
from preprocessing.scaler import scale_data
from preprocessing.feature_selector import reduce_features
from algorithms.tsne import apply_tsne
from algorithms.umap_model import apply_umap
from algorithms.pca import apply_pca, apply_pca_2d
from algorithms.isomap import apply_isomap
from utils.logger import setup_logger
from utils.validator import validate_dataframe

logger = setup_logger(__name__)


def run_reduction(df: pd.DataFrame, params: dict = None):
    """
    Full pipeline: preprocess → select algorithm → reduce to 2D.
    Returns (result_2d: np.ndarray, algorithm_used: str)
    """
    if params is None:
        params = {}
        
    logger.info(f"Starting reduction pipeline. Shape before preprocessing: {df.shape}")

    # Preprocessing
    df_clean = drop_non_numeric_columns(df)
    
    imputation = params.get("imputation", "mean")
    df_clean = fill_missing_values(df_clean, strategy=imputation)
    df_clean = remove_constant_columns(df_clean)

    valid, msg = validate_dataframe(df_clean)
    if not valid:
        raise ValueError(f"Validation failed after preprocessing: {msg}")

    scaler_type = params.get("scaler", "standard")
    df_scaled = scale_data(df_clean, method=scaler_type)
    
    df_final = reduce_features(df_scaled)

    logger.info(f"Shape after preprocessing: {df_final.shape}")

    # Algorithm selection
    n_rows = df_final.shape[0]
    algorithm_override = params.get("algorithm")
    if algorithm_override and algorithm_override in ["tsne", "umap", "pca_umap", "pca", "isomap"]:
        algorithm = algorithm_override
        logger.info(f"Using manual algorithm override: {algorithm}")
    else:
        algorithm = select_algorithm(n_rows)

    # Run the selected algorithm
    if algorithm == "tsne":
        perplexity = float(params.get("perplexity", 30.0))
        result_2d = apply_tsne(df_final, perplexity=perplexity)
    elif algorithm == "umap":
        n_neighbors = int(params.get("n_neighbors", 15))
        min_dist = float(params.get("min_dist", 0.1))
        result_2d = apply_umap(df_final, n_neighbors=n_neighbors, min_dist=min_dist)
    elif algorithm == "isomap":
        n_neighbors = int(params.get("n_neighbors", 5))
        result_2d = apply_isomap(df_final, n_neighbors=n_neighbors)
    elif algorithm == "pca_umap":
        # First reduce with PCA to at most 50 dims, then UMAP
        n_pca = min(50, df_final.shape[1], df_final.shape[0] - 1)
        df_pca = apply_pca(df_final, n_components=n_pca)
        n_neighbors = int(params.get("n_neighbors", 15))
        min_dist = float(params.get("min_dist", 0.1))
        result_2d = apply_umap(df_pca, n_neighbors=n_neighbors, min_dist=min_dist)
    elif algorithm == "pca":
        result_2d = apply_pca_2d(df_final)
    else:
        raise ValueError(f"Unknown algorithm: {algorithm}")

    logger.info(f"Reduction complete. Output shape: {result_2d.shape}, algorithm: {algorithm}")
    return result_2d, algorithm
