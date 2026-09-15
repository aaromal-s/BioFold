import pandas as pd
import numpy as np
from utils.logger import setup_logger

logger = setup_logger(__name__)


def parse_file(filepath: str) -> pd.DataFrame:
    """Parse CSV or Excel file into a pandas DataFrame."""
    fmt = detect_format(filepath)
    logger.info(f"Parsing {filepath} as {fmt}")
    if fmt == "csv":
        df = pd.read_csv(filepath)
    elif fmt == "excel":
        df = pd.read_excel(filepath, engine="openpyxl")
    else:
        raise ValueError(f"Unsupported file format: {filepath}")
    logger.info(f"Parsed DataFrame: {df.shape[0]} rows, {df.shape[1]} columns")
    
    # Aggressively downcast float64 -> float32 to halve memory footprint
    float_cols = df.select_dtypes(include=['float64']).columns
    df[float_cols] = df[float_cols].astype(np.float32)
    
    return df


def detect_format(filepath: str) -> str:
    """Detect file format from extension."""
    lower = filepath.lower()
    if lower.endswith(".csv"):
        return "csv"
    elif lower.endswith(".xlsx") or lower.endswith(".xls"):
        return "excel"
    return "unknown"


def extract_metadata(df: pd.DataFrame) -> dict:
    """Extract key metadata from a DataFrame."""
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    dtypes = {col: str(dtype) for col, dtype in df.dtypes.items()}
    metadata = {
        "rows": df.shape[0],
        "columns": df.shape[1],
        "missing_values": int(df.isnull().sum().sum()),
        "numeric_features": len(numeric_cols),
        "dtypes": dtypes,
    }
    logger.info(f"Metadata extracted: {metadata}")
    return metadata
