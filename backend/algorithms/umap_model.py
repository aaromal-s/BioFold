import numpy as np
import pandas as pd
import umap
from utils.logger import setup_logger

logger = setup_logger(__name__)


def apply_umap(df: pd.DataFrame, n_components: int = 2, n_neighbors: int = 15, min_dist: float = 0.1) -> np.ndarray:
    """
    Apply UMAP dimensionality reduction.
    
    Parameters:
        df: Preprocessed numeric DataFrame
        n_components: Target dimensions (default 2)
        n_neighbors: Number of neighbors (default 15)
        min_dist: Minimum distance (default 0.1)
    
    Returns:
        2D numpy array of shape (n_samples, 2)
    """
    n_rows = df.shape[0]
    # Clamp n_neighbors to valid range
    safe_neighbors = min(n_neighbors, n_rows - 1)
    safe_neighbors = max(2, safe_neighbors)
    
    logger.info(f"Running UMAP: rows={n_rows}, n_neighbors={safe_neighbors}, min_dist={min_dist}")
    
    reducer = umap.UMAP(
        n_components=n_components,
        n_neighbors=safe_neighbors,
        min_dist=min_dist,
        random_state=42,
        metric="euclidean",
        n_jobs=-1
    )
    result = reducer.fit_transform(df.values)
    logger.info(f"UMAP complete. Output shape: {result.shape}")
    return result
