import numpy as np
import pandas as pd
from sklearn.manifold import Isomap
from utils.logger import setup_logger

logger = setup_logger(__name__)

def apply_isomap(df: pd.DataFrame, n_components: int = 2, n_neighbors: int = 5) -> np.ndarray:
    """
    Apply Isomap dimensionality reduction.
    """
    n_rows = df.shape[0]
    safe_neighbors = min(n_neighbors, n_rows - 1)
    safe_neighbors = max(2, safe_neighbors)
    
    logger.info(f"Running Isomap: rows={n_rows}, n_neighbors={safe_neighbors}")
    
    isomap = Isomap(
        n_neighbors=safe_neighbors,
        n_components=n_components,
        n_jobs=-1
    )
    result = isomap.fit_transform(df.values)
    logger.info(f"Isomap complete. Output shape: {result.shape}")
    return result
