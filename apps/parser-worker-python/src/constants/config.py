"""Configuration and status constants for Parser worker."""

# Resume status values
STATUS_PARSED = "parsed"
STATUS_FAILED = "failed"

# Queue
QUEUE_NAME = "parser-queue"

# Upload service (for queueing matcher job)
UPLOAD_SERVICE_URL_DEFAULT = "http://upload-service:3001"
MATCHER_ENDPOINT_PATH = "/api/internal/queue/matcher"

# Environment defaults
REDIS_HOST_DEFAULT = "redis"
REDIS_PORT_DEFAULT = 6379
PARSER_WORKER_CONCURRENCY_DEFAULT = 3
