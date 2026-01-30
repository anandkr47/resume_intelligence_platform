"""Type definitions for OCR worker"""
from typing import TypedDict, Dict, Any, Optional

class OCRJobData(TypedDict):
    """Data structure for OCR job"""
    resumeId: str
    filePath: str
    fileName: str
    mimeType: str

class OCRResult(TypedDict):
    """Result structure for OCR processing"""
    resumeId: str
    extractedText: str
    status: str
    error: Optional[str]

class HealthStatus(TypedDict):
    """Health check status structure"""
    status: str
    checks: Dict[str, str]
