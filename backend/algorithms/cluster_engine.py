import numpy as np
import pandas as pd
from sklearn.cluster import KMeans, DBSCAN
from utils.logger import setup_logger

logger = setup_logger(__name__)

def apply_clustering(result_2d: np.ndarray, method: str, n_clusters: int = 5, eps: float = 0.5, min_samples: int = 5):
    """
    Apply clustering to the reduced 2D results.
    """
    if method == "kmeans":
        logger.info(f"Running KMeans with n_clusters={n_clusters}")
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        labels = kmeans.fit_predict(result_2d)
        return [f"Cluster {l}" for l in labels]
    
    elif method == "dbscan":
        logger.info(f"Running DBSCAN with eps={eps}, min_samples={min_samples}")
        dbscan = DBSCAN(eps=eps, min_samples=min_samples)
        labels = dbscan.fit_predict(result_2d)
        return [f"Cluster {l}" if l != -1 else "Noise" for l in labels]
        
    else:
        logger.warning(f"Unknown clustering method {method}")
        return ["Unknown"] * len(result_2d)
