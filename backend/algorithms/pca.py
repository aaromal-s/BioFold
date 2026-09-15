import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from utils.logger import setup_logger

logger = setup_logger(__name__)


def apply_pca(df: pd.DataFrame, n_components: int = 50) -> pd.DataFrame:
    """
    Apply PCA to reduce features to n_components dimensions.
    Used as a preprocessing step before UMAP for large datasets.
    
    Parameters:
        df: Preprocessed numeric DataFrame
        n_components: Number of PCA components to keep (default 50)
    
    Returns:
        DataFrame with reduced features
    """
    n_rows, n_cols = df.shape
    safe_components = min(n_components, n_cols, n_rows - 1)
    logger.info(f"Running PCA: rows={n_rows}, cols={n_cols} → n_components={safe_components}")
    
    pca = PCA(n_components=safe_components, random_state=42, svd_solver="randomized")
    result = pca.fit_transform(df.values)
    
    explained = pca.explained_variance_ratio_.sum()
    logger.info(f"PCA complete. Explained variance: {explained:.3f}. Output shape: {result.shape}")
    
    col_names = [f"pc{i+1}" for i in range(safe_components)]
    return pd.DataFrame(result, columns=col_names)


def apply_pca_2d(df: pd.DataFrame) -> np.ndarray:
    """
    Apply PCA directly to 2D for visualization.
    
    Parameters:
        df: Preprocessed numeric DataFrame
    
    Returns:
        2D numpy array of shape (n_samples, 2)
    """
    n_rows, n_cols = df.shape
    safe_components = min(2, n_cols, n_rows - 1)
    logger.info(f"Running PCA-2D: rows={n_rows}, cols={n_cols}")
    
    pca = PCA(n_components=safe_components, random_state=42, svd_solver="randomized")
    result = pca.fit_transform(df.values)
    
    # Pad to 2D if needed
    if result.shape[1] < 2:
        zeros = np.zeros((result.shape[0], 2 - result.shape[1]))
        result = np.hstack([result, zeros])
    
    logger.info(f"PCA-2D complete. Output shape: {result.shape}")
    return result
