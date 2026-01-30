"""Health check service for Python workers"""
import os
import sys
from pathlib import Path
from typing import Dict, Any

sys.path.insert(0, str(Path(__file__).parent.parent))

def check_health() -> Dict[str, Any]:
    """Perform health checks"""
    health_status = {
        "status": "healthy",
        "checks": {}
    }
    
    # Check Redis connection
    try:
        import redis
        redis_host = os.getenv('REDIS_HOST', 'redis')
        redis_port = int(os.getenv('REDIS_PORT', '6379'))
        redis_password = os.getenv('REDIS_PASSWORD')
        
        r = redis.Redis(
            host=redis_host,
            port=redis_port,
            password=redis_password,
            socket_connect_timeout=2
        )
        r.ping()
        health_status["checks"]["redis"] = "healthy"
    except Exception as e:
        health_status["checks"]["redis"] = f"unhealthy: {str(e)}"
        health_status["status"] = "unhealthy"
    
    # Check Tesseract
    try:
        import pytesseract
        from PIL import Image
        import io
        
        # Create a minimal test image
        test_image = Image.new('RGB', (100, 100), color='white')
        pytesseract.image_to_string(test_image)
        health_status["checks"]["tesseract"] = "healthy"
    except Exception as e:
        health_status["checks"]["tesseract"] = f"unhealthy: {str(e)}"
        health_status["status"] = "unhealthy"
    
    return health_status
