"""Configuration and MIME constants for OCR worker."""

# MIME types
MIME_PDF = "application/pdf"
MIME_DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
MIME_TYPES_IMAGE = ("image/jpeg", "image/png", "image/jpg")

# Tesseract
TESSERACT_CMD_DEFAULT = "/usr/bin/tesseract"
TESSERACT_LANG_DEFAULT = "eng"

# OCR settings
OCR_DPI = 300

# Queues
QUEUE_NAME = "ocr-queue"
PARSER_QUEUE_NAME = "parser-queue"

# Environment defaults
REDIS_HOST_DEFAULT = "redis"
REDIS_PORT_DEFAULT = 6379
OCR_WORKER_CONCURRENCY_DEFAULT = 3
