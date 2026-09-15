from utils.logger import setup_logger

logger = setup_logger(__name__)


def select_algorithm(n_rows: int) -> str:
    """
    Adaptively select a dimensionality reduction algorithm based on dataset size.
    
    Rules:
      < 1000 rows     → t-SNE
      1000–10000 rows → UMAP
      > 10000 rows    → PCA → UMAP  (pca_umap)
    """
    if n_rows < 1000:
        algorithm = "tsne"
        reason = f"Small dataset ({n_rows} rows < 1000) → t-SNE selected for high-quality embedding"
    elif n_rows <= 10000:
        algorithm = "umap"
        reason = f"Medium dataset ({n_rows} rows in [1000, 10000]) → UMAP selected for speed + quality"
    else:
        algorithm = "pca_umap"
        reason = f"Large dataset ({n_rows} rows > 10000) → PCA + UMAP selected for scalability"

    logger.info(f"Algorithm selected: {algorithm}. Reason: {reason}")
    return algorithm
