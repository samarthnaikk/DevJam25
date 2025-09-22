"""
This file has all the required functions to run the server files
"""

import zipfile
import os

def ExtractZip(zip_path, extract_to="."):
    """
    Extracts all files from a zip archive into the specified directory.
    """
    if not os.path.exists(zip_path):
        raise FileNotFoundError(f"{zip_path} does not exist")

    with zipfile.ZipFile(zip_path, "r") as zipf:
        zipf.extractall(extract_to)
