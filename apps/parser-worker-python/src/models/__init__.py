"""Type definitions for Parser worker"""
from typing import TypedDict, Dict, List, Any, Optional

class ParserJobData(TypedDict):
    """Data structure for Parser job"""
    resumeId: str
    extractedText: str

class ParsedResumeData(TypedDict):
    """Structure for parsed resume data"""
    name: str
    email: str
    phone: str
    skills: List[str]
    experience: List[Dict[str, Any]]
    education: List[Dict[str, Any]]
    rawText: str

class ParserResult(TypedDict):
    """Result structure for parser processing"""
    resumeId: str
    parsedData: ParsedResumeData
    status: str
    error: Optional[str]

class HealthStatus(TypedDict):
    """Health check status structure"""
    status: str
    checks: Dict[str, str]
