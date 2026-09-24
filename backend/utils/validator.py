import os
import pandas as pd
import numpy as np
from utils.logger import setup_logger

logger = setup_logger(__name__)

ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls", ".tsv", ".txt", ".h5", ".h5ad"}
MAX_FILE_SIZE_MB = 500
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024


def validate_upload(file) -> tuple:
    """
    Validate uploaded file.
    
    Returns:
        (is_valid: bool, error_message: str)
    """
    filename = file.filename
    if not filename:
        return False, "Filename is empty"

    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return False, f"File extension '{ext}' is not allowed. Accepted: {', '.join(ALLOWED_EXTENSIONS)}"

    # Check file size by reading content length header or seeking
    file.seek(0, 2)  # seek to end
    size = file.tell()
    file.seek(0)  # reset

    if size > MAX_FILE_SIZE_BYTES:
        return False, f"File size {size / 1024 / 1024:.1f}MB exceeds limit of {MAX_FILE_SIZE_MB}MB"

    if size == 0:
        return False, "File is empty"

    logger.info(f"File validated: {filename}, size: {size} bytes")
    return True, ""


def validate_dataframe(df: pd.DataFrame) -> tuple:
    """
    Validate that the DataFrame has sufficient rows and numeric columns.
    
    Returns:
        (is_valid: bool, error_message: str)
    """
    if df is None or df.empty:
        return False, "DataFrame is empty"

    if df.shape[0] < 10:
        return False, f"Dataset has only {df.shape[0]} rows; minimum is 10"

    numeric_cols = df.select_dtypes(include=[np.number]).columns
    if len(numeric_cols) < 2:
        return False, f"Dataset must have at least 2 numeric columns; found {len(numeric_cols)}"

    return True, ""
