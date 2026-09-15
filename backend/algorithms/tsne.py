import numpy as np
import pandas as pd
from sklearn.manifold import TSNE
from utils.logger import setup_logger

logger = setup_logger(__name__)


def apply_tsne(df: pd.DataFrame, n_components: int = 2, perplexity: float = 30.0, n_iter: int = 1000) -> np.ndarray:
    """
    Apply t-SNE dimensionality reduction.
    
    Parameters:
        df: Preprocessed numeric DataFrame
        n_components: Target dimensions (default 2)
        perplexity: t-SNE perplexity (default 30)
        n_iter: Number of iterations (default 1000)
    
    Returns:
        2D numpy array of shape (n_samples, 2)
    """
    n_rows = df.shape[0]
    # Clamp perplexity to safe range
    safe_perplexity = min(perplexity, max(5.0, (n_rows - 1) / 3.0))
    
    logger.info(f"Running t-SNE: rows={n_rows}, perplexity={safe_perplexity}, n_iter={n_iter}")
    
    tsne = TSNE(
        n_components=n_components,
        perplexity=safe_perplexity,
        max_iter=n_iter,
        random_state=42,
        learning_rate="auto",
        init="pca",
        n_jobs=-1
    )
    result = tsne.fit_transform(df.values)
    logger.info(f"t-SNE complete. Output shape: {result.shape}")
    return result
