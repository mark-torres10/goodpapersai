import logging
import os
from typing import Optional

# ANSI color codes
YELLOW = "\033[33m"
RED = "\033[31m"
RESET = "\033[0m"

class ColoredFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        # Get the relative path from project root
        filepath = record.pathname
        rel_path = os.path.relpath(filepath)
        # Convert path separators to dots and remove .py extension
        module_path = rel_path.replace(os.sep, '.').replace('.py', '')
        
        # Color the module path based on level
        color = ''
        if record.levelno == logging.WARNING:
            color = YELLOW
        elif record.levelno >= logging.ERROR:
            color = RED
            
        record.module_path = f"{color}[{module_path}]{RESET}"
        return super().format(record)

def get_logger(name: Optional[str] = None) -> logging.Logger:
    """Get a logger instance with colored formatting."""
    logger = logging.getLogger(name)
    
    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = ColoredFormatter('%(module_path)s: %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    
    return logger

# Create default logger instance
logger = get_logger(__name__)
