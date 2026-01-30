import logging
import os
import json
from datetime import datetime

def get_logger(name: str) -> logging.Logger:
    """Get configured logger"""
    logger = logging.getLogger(name)
    
    if not logger.handlers:
        handler = logging.StreamHandler()
        
        log_format = os.getenv('LOG_FORMAT', 'json')
        log_level = os.getenv('LOG_LEVEL', 'INFO')
        
        if log_format == 'json':
            handler.setFormatter(JsonFormatter())
        else:
            handler.setFormatter(logging.Formatter(
                '%(asctime)s [%(name)s] %(levelname)s: %(message)s'
            ))
        
        logger.addHandler(handler)
        logger.setLevel(getattr(logging, log_level.upper()))
    
    return logger

class JsonFormatter(logging.Formatter):
    """JSON formatter for logs"""
    
    def format(self, record):
        log_data = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
        }
        
        if record.exc_info:
            log_data['exception'] = self.formatException(record.exc_info)
        
        if hasattr(record, 'service'):
            log_data['service'] = record.service
        
        return json.dumps(log_data)
