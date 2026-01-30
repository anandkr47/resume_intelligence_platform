# Reuse logger
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / 'ocr-worker-python' / 'src'))
from services.logger import get_logger
