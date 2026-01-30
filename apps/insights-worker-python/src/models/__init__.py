"""Type definitions for Insights worker"""
from typing import TypedDict, Dict, List, Any, Optional

class InsightsJobData(TypedDict):
    """Data structure for Insights job"""
    resumeId: Optional[str]
    action: str  # 'aggregate', 'update', etc.

class InsightResult(TypedDict):
    """Result structure for insights processing"""
    status: str
    data: Optional[Dict[str, Any]]
    error: Optional[str]

class HealthStatus(TypedDict):
    """Health check status structure"""
    status: str
    checks: Dict[str, str]
