import os
import sys
import signal
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from services.queue_service import QueueService
from services.logger import get_logger
from services.db_service import DBService
from aggregations.insights_aggregator import InsightsAggregator
from constants import (
    QUEUE_NAME,
    REDIS_HOST_DEFAULT,
    REDIS_PORT_DEFAULT,
    INSIGHTS_WORKER_CONCURRENCY_DEFAULT,
)

logger = get_logger(__name__)

def process_insights_job(job_data: dict) -> dict:
    """Process insights aggregation job"""
    try:
        logger.info("Processing insights aggregation", {
            "job_data": job_data
        })
        
        aggregator = InsightsAggregator()
        insights = aggregator.aggregate_all()
        
        logger.info("Insights aggregation completed", {
            "total_resumes": insights.get("total_resumes", 0),
            "processed_resumes": insights.get("processed_resumes", 0)
        })
        
        return {
            "insights": insights,
            "status": "completed"
        }
    except Exception as e:
        logger.error(f"Insights aggregation failed: {e}", {
            "error": str(e)
        })
        raise

def graceful_shutdown(signum, frame):
    """Handle graceful shutdown"""
    logger.info("Received shutdown signal, cleaning up...")
    DBService.close_pool()
    sys.exit(0)

def main():
    """Main worker loop"""
    logger.info("Starting Insights Worker")
    
    # Register signal handlers
    signal.signal(signal.SIGTERM, graceful_shutdown)
    signal.signal(signal.SIGINT, graceful_shutdown)
    
    redis_host = os.getenv("REDIS_HOST", REDIS_HOST_DEFAULT)
    redis_port = int(os.getenv("REDIS_PORT", str(REDIS_PORT_DEFAULT)))
    redis_password = os.getenv("REDIS_PASSWORD")
    concurrency = int(os.getenv("INSIGHTS_WORKER_CONCURRENCY", str(INSIGHTS_WORKER_CONCURRENCY_DEFAULT)))

    queue_service = QueueService(
        queue_name=QUEUE_NAME,
        redis_host=redis_host,
        redis_port=redis_port,
        redis_password=redis_password,
        processor=process_insights_job,
        concurrency=concurrency,
    )
    
    try:
        queue_service.start()
    except KeyboardInterrupt:
        logger.info("Shutting down Insights Worker")
        queue_service.stop()
    except Exception as e:
        logger.error(f"Fatal error in Insights Worker: {e}")
        queue_service.stop()
        sys.exit(1)
    finally:
        DBService.close_pool()
        logger.info("Insights Worker stopped")

if __name__ == '__main__':
    main()
