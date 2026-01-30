"""Insights aggregator for analytics"""
import sys
from pathlib import Path
from typing import Dict, Any
from datetime import datetime

sys.path.insert(0, str(Path(__file__).parent.parent))

from services.db_service import DBService
from services.logger import get_logger
from constants import DEFAULT_TOP_SKILLS_LIMIT

logger = get_logger(__name__)


class InsightsAggregator:
    """Aggregates insights from resume data"""

    def __init__(self):
        self.db_service = DBService()

    def aggregate_all(self) -> Dict[str, Any]:
        """Aggregate all insights"""
        try:
            logger.info("Starting insights aggregation")

            insights = {
                "total_resumes": self.db_service.get_resume_count(),
                "processed_resumes": self.db_service.get_processed_count(),
                "top_skills": [
                    {"skill": row["skill"], "count": row["count"]}
                    for row in self.db_service.get_top_skills(DEFAULT_TOP_SKILLS_LIMIT)
                ],
                "timestamp": datetime.utcnow().isoformat()
            }
            
            logger.info("Insights aggregation completed", {
                "total_resumes": insights["total_resumes"],
                "processed_resumes": insights["processed_resumes"]
            })
            
            return insights
            
        except Exception as e:
            logger.error(f"Failed to aggregate insights: {e}")
            raise
        finally:
            # Connection pool is managed by DBService class
            pass
