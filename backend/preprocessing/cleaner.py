import numpy as np
import pandas as pd
from utils.logger import setup_logger

logger = setup_logger(__name__)


def drop_non_numeric_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Remove all non-numeric columns from the DataFrame."""
    numeric_df = df.select_dtypes(include=[np.number])
    dropped = set(df.columns) - set(numeric_df.columns)
    if dropped:
        logger.info(f"Dropped non-numeric columns: {dropped}")
        df.drop(columns=list(dropped), inplace=True)
    return df


def fill_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """Fill missing values with the column mean."""
    missing_before = df.isnull().sum().sum()
    if missing_before > 0:
        df.fillna(df.mean(), inplace=True)
        logger.info(f"Filled {missing_before} missing values with column means")
    return df


def remove_constant_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Remove columns that have zero variance (constant columns)."""
    non_constant = df.loc[:, df.nunique(dropna=False) > 1]
    removed = set(df.columns) - set(non_constant.columns)
    if removed:
        logger.info(f"Removed constant columns: {removed}")
        df.drop(columns=list(removed), inplace=True)
    return df
