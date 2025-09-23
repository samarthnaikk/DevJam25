"""
Configuration settings for Docker automation system.
"""
import os
from pathlib import Path

# Project paths
PROJECT_ROOT = Path(__file__).parent.parent
DATASET_PATH = PROJECT_ROOT / "DataSet"
LOGIC_PATH = PROJECT_ROOT / "Logic"

# Docker image naming
DATASET_IMAGE_PREFIX = "dataset"
LOGIC_IMAGE_NAME = "logic-app"
EXPORT_TAG_NAME = "DataSet"

# Export settings
EXPORT_DIR = PROJECT_ROOT / "exports"
DATASET_TAR_TEMPLATE = "DataSet_{}.tar"
LOGIC_TAR_NAME = "DataSet_Logic.tar"

# Dockerfile templates
DATASET_DOCKERFILE_CONTENT = """FROM python:3.9-slim

WORKDIR /app

# Copy dataset content
COPY . /app/data/

# Install any dependencies if needed
# RUN pip install -r requirements.txt

CMD ["echo", "Dataset container ready"]
"""

LOGIC_DOCKERFILE_CONTENT = """FROM python:3.9-slim

WORKDIR /app

# Copy logic files
COPY . /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt || echo "No requirements.txt found"

# Default command
CMD ["python", "main.py"]
"""

# Logging settings
LOG_FORMAT = "%(asctime)s - %(levelname)s - %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"