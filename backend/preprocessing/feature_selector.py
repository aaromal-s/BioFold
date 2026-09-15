import pandas as pd
from sklearn.feature_selection import VarianceThreshold, SelectKBest, f_classif
from utils.logger import setup_logger

logger = setup_logger(__name__)

MAX_FEATURES = 100


def reduce_features(df: pd.DataFrame, max_features: int = MAX_FEATURES) -> pd.DataFrame:
    """
    Reduce number of features if columns > max_features.
    Strategy:
      1. Apply VarianceThreshold to remove near-zero variance features
      2. If still > max_features, apply SelectKBest (f_classif with row index as proxy target)
    """
    original_cols = df.shape[1]
    
    if original_cols <= max_features:
        logger.info(f"Feature selection not needed ({original_cols} features ≤ {max_features})")
        return df

    logger.info(f"Reducing features from {original_cols} to max {max_features}")

    # Step 1: VarianceThreshold
    selector = VarianceThreshold(threshold=0.01)
    try:
        reduced = selector.fit_transform(df.values)
        selected_mask = selector.get_support()
        df_var = pd.DataFrame(reduced, columns=df.columns[selected_mask])
        logger.info(f"After VarianceThreshold: {df_var.shape[1]} features")
    except Exception as e:
        logger.warning(f"VarianceThreshold failed: {e}, skipping")
        df_var = df

    if df_var.shape[1] <= max_features:
        return df_var

    # Step 2: SelectKBest — use row index as proxy label
    import numpy as np
    pseudo_labels = np.arange(df_var.shape[0]) % min(10, df_var.shape[0])
    try:
        k = min(max_features, df_var.shape[1])
        kbest = SelectKBest(score_func=f_classif, k=k)
        reduced2 = kbest.fit_transform(df_var.values, pseudo_labels)
        selected_mask2 = kbest.get_support()
        df_final = pd.DataFrame(reduced2, columns=df_var.columns[selected_mask2])
        logger.info(f"After SelectKBest: {df_final.shape[1]} features")
        return df_final
    except Exception as e:
        logger.warning(f"SelectKBest failed: {e}, returning VarianceThreshold result")
        return df_var.iloc[:, :max_features]
