"""File utility functions for OCR worker"""
import os
from pathlib import Path
from typing import Optional

def ensure_directory_exists(file_path: str) -> None:
    """Ensure the directory for a file path exists"""
    directory = os.path.dirname(file_path)
    if directory:
        os.makedirs(directory, exist_ok=True)

def get_file_extension(file_path: str) -> str:
    """Get file extension from file path"""
    return Path(file_path).suffix.lower()

def is_valid_file(file_path: str) -> bool:
    """Check if file exists and is readable"""
    return os.path.exists(file_path) and os.path.isfile(file_path)

def get_file_size(file_path: str) -> int:
    """Get file size in bytes"""
    if is_valid_file(file_path):
        return os.path.getsize(file_path)
    return 0

def sanitize_filename(filename: str) -> str:
    """Sanitize filename by removing invalid characters"""
    # Remove invalid characters
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '_')
    return filename
