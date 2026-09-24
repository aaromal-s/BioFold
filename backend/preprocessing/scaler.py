import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from utils.logger import setup_logger

logger = setup_logger(__name__)


import numpy as np

def standard_scale(df: pd.DataFrame) -> pd.DataFrame:
    """Apply StandardScaler (zero mean, unit variance) to all columns."""
    logger.info("Applying StandardScaler")
    scaler = StandardScaler()
    scaled = scaler.fit_transform(df.values)
    return pd.DataFrame(scaled, columns=df.columns)

def minmax_scale(df: pd.DataFrame) -> pd.DataFrame:
    """Apply MinMaxScaler (scale to [0, 1]) to all columns."""
    logger.info("Applying MinMaxScaler")
    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(df.values)
    return pd.DataFrame(scaled, columns=df.columns)

def log2_transform(df: pd.DataFrame) -> pd.DataFrame:
    """Apply log2(x + 1) transform."""
    logger.info("Applying Log2 Transform")
    # Shift values if minimum is negative to avoid log of negative
    min_val = df.min().min()
    if min_val < 0:
        df = df - min_val
    return np.log2(df + 1)

def scale_data(df: pd.DataFrame, method: str = "standard") -> pd.DataFrame:
    if method == "standard":
        return standard_scale(df)
    elif method == "minmax":
        return minmax_scale(df)
    elif method == "log2":
        return log2_transform(df)
    elif method == "none":
        return df
    else:
        return standard_scale(df)
