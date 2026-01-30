"""Configuration and business constants for Insights worker."""

# Analytics defaults
DEFAULT_TOP_SKILLS_LIMIT = 10
STATUS_MATCHED = "matched"

# Queue
QUEUE_NAME = "insights-queue"

# Environment defaults (used when env vars are not set)
REDIS_HOST_DEFAULT = "redis"
REDIS_PORT_DEFAULT = 6379
INSIGHTS_WORKER_CONCURRENCY_DEFAULT = 2
