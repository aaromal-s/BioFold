import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from utils.logger import setup_logger

logger = setup_logger(__name__)

def compute_feature_importance(df: pd.DataFrame, labels: list, top_k: int = 10) -> list:
    """
    Compute Random Forest feature importances given cluster labels.
    Returns list of dicts: [{'feature': name, 'importance': float}]
    """
    if len(set(labels)) < 2:
        logger.info("Only 1 cluster found, cannot compute feature importance.")
        return []
        
    logger.info("Computing feature importance for clusters using RandomForest")
    clf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    clf.fit(df.values, labels)
    
    importances = clf.feature_importances_
    features = df.columns
    
    # Sort descending
    indices = np.argsort(importances)[::-1]
    
    top_features = []
    for i in range(min(top_k, len(features))):
        top_features.append({
            "feature": str(features[indices[i]]),
            "importance": round(float(importances[indices[i]]), 4)
        })
        
    return top_features
