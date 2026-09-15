import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from utils.logger import setup_logger

logger = setup_logger(__name__)


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
