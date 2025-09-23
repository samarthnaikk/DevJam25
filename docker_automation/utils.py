"""
Utility functions for Docker automation system.
"""
import logging
import os
import tempfile
from pathlib import Path
from typing import List, Optional

from config import LOG_FORMAT, DATE_FORMAT


def setup_logging(level: str = "INFO") -> logging.Logger:
    """
    Set up logging configuration.
    
    Args:
        level: Logging level (DEBUG, INFO, WARNING, ERROR)
        
    Returns:
        Configured logger instance
    """
    logging.basicConfig(
        level=getattr(logging, level.upper()),
        format=LOG_FORMAT,
        datefmt=DATE_FORMAT
    )
    return logging.getLogger(__name__)


def ensure_directory_exists(path: Path) -> None:
    """
    Ensure a directory exists, create it if it doesn't.
    
    Args:
        path: Path to the directory
    """
    path.mkdir(parents=True, exist_ok=True)


def get_miniset_folders(dataset_path: Path) -> List[str]:
    """
    Get all MiniSet folders from the DataSet directory.
    
    Args:
        dataset_path: Path to the DataSet directory
        
    Returns:
        List of MiniSet folder names
    """
    if not dataset_path.exists():
        return []
    
    minisets = []
    for item in dataset_path.iterdir():
        if item.is_dir() and item.name.startswith("MiniSet"):
            minisets.append(item.name)
    
    return sorted(minisets)


def create_dockerfile(directory: Path, content: str) -> Path:
    """
    Create a Dockerfile in the specified directory.
    
    Args:
        directory: Directory where to create the Dockerfile
        content: Content of the Dockerfile
        
    Returns:
        Path to the created Dockerfile
    """
    dockerfile_path = directory / "Dockerfile"
    with open(dockerfile_path, 'w') as f:
        f.write(content)
    return dockerfile_path


def cleanup_dockerfile(dockerfile_path: Path) -> None:
    """
    Remove a Dockerfile if it exists.
    
    Args:
        dockerfile_path: Path to the Dockerfile to remove
    """
    if dockerfile_path.exists():
        dockerfile_path.unlink()


def format_miniset_name(miniset_name: str) -> str:
    """
    Format MiniSet name for Docker image naming.
    
    Args:
        miniset_name: Original MiniSet name (e.g., "MiniSet1")
        
    Returns:
        Formatted name (e.g., "miniset1")
    """
    return miniset_name.lower()


def validate_docker_installation() -> bool:
    """
    Check if Docker is installed and running.
    
    Returns:
        True if Docker is available, False otherwise
    """
    import subprocess
    
    try:
        result = subprocess.run(
            ["docker", "--version"],
            capture_output=True,
            text=True,
            check=True
        )
        return "Docker version" in result.stdout
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def get_docker_images() -> List[str]:
    """
    Get list of current Docker images.
    
    Returns:
        List of Docker image names
    """
    import subprocess
    
    try:
        result = subprocess.run(
            ["docker", "images", "--format", "{{.Repository}}:{{.Tag}}"],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip().split('\n') if result.stdout.strip() else []
    except subprocess.CalledProcessError:
        return []