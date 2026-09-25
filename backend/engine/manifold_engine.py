import numpy as np
import pandas as pd
from engine.adaptive_selector import select_algorithm
from preprocessing.cleaner import drop_non_numeric_columns, fill_missing_values, remove_constant_columns
from preprocessing.scaler import scale_data
from preprocessing.feature_selector import reduce_features
from algorithms.tsne import apply_tsne
from algorithms.umap_model import apply_umap
from algorithms.pca import apply_pca, apply_pca_2d
from algorithms.autoencoder import apply_autoencoder
from algorithms.isomap import apply_isomap
from utils.logger import setup_logger
from utils.validator import validate_dataframe

logger = setup_logger(__name__)


def run_reduction(df: pd.DataFrame, params: dict = None):
    """
    Full pipeline: preprocess → select algorithm → reduce to 2D/3D.
    Returns (result_nd: np.ndarray, algorithm_used: str, processed_df: pd.DataFrame)
    """
    if params is None:
        params = {}
        
    logger.info(f"Starting reduction pipeline. Shape before preprocessing: {df.shape}")

    # Lasso Re-analysis support
    selected_indices = params.get("selected_indices")
    if selected_indices and isinstance(selected_indices, list) and len(selected_indices) > 0:
        logger.info(f"Applying lasso selection. Subsetting to {len(selected_indices)} rows.")
        df = df.iloc[selected_indices].copy()

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
    n_dims = int(params.get("n_components", 2))
    
    algorithm_override = params.get("algorithm")
    if algorithm_override and algorithm_override in ["tsne", "umap", "pca_umap", "pca", "isomap", "autoencoder"]:
        algorithm = algorithm_override
        logger.info(f"Using manual algorithm override: {algorithm}")
    else:
        algorithm = select_algorithm(n_rows)

    # Run the selected algorithm
    if algorithm == "tsne":
        perplexity = float(params.get("perplexity", 30.0))
        result_nd = apply_tsne(df_final, n_components=n_dims, perplexity=perplexity)
    elif algorithm == "umap":
        n_neighbors = int(params.get("n_neighbors", 15))
        min_dist = float(params.get("min_dist", 0.1))
        result_nd = apply_umap(df_final, n_components=n_dims, n_neighbors=n_neighbors, min_dist=min_dist)
    elif algorithm == "isomap":
        n_neighbors = int(params.get("n_neighbors", 5))
        result_nd = apply_isomap(df_final, n_components=n_dims, n_neighbors=n_neighbors)
    elif algorithm == "autoencoder":
        epochs = int(params.get("epochs", 50))
        result_nd = apply_autoencoder(df_final, n_components=n_dims, epochs=epochs)
    elif algorithm == "pca_umap":
        # First reduce with PCA to at most 50 dims, then UMAP
        n_pca = min(50, df_final.shape[1], df_final.shape[0] - 1)
        df_pca = apply_pca(df_final, n_components=n_pca)
        n_neighbors = int(params.get("n_neighbors", 15))
        min_dist = float(params.get("min_dist", 0.1))
        result_nd = apply_umap(df_pca, n_components=n_dims, n_neighbors=n_neighbors, min_dist=min_dist)
    elif algorithm == "pca":
        # We need to adapt apply_pca_2d for 3d if needed, or use apply_pca
        result_df = apply_pca(df_final, n_components=n_dims)
        # Pad if needed
        result_nd = result_df.values
        if result_nd.shape[1] < n_dims:
            zeros = np.zeros((result_nd.shape[0], n_dims - result_nd.shape[1]))
            result_nd = np.hstack([result_nd, zeros])
    else:
        raise ValueError(f"Unknown algorithm: {algorithm}")

    logger.info(f"Reduction complete. Output shape: {result_nd.shape}, algorithm: {algorithm}")
    return result_nd, algorithm, df_final
