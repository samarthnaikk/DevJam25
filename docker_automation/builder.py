"""
Docker image builder functions.
"""
import subprocess
from pathlib import Path
from typing import Optional

from config import (
    DATASET_PATH, LOGIC_PATH, DATASET_IMAGE_PREFIX, LOGIC_IMAGE_NAME,
    DATASET_DOCKERFILE_CONTENT, LOGIC_DOCKERFILE_CONTENT
)
from utils import (
    setup_logging, get_miniset_folders, format_miniset_name,
    create_dockerfile, cleanup_dockerfile
)

logger = setup_logging()


class DockerBuilder:
    """Docker image builder class."""
    
    def __init__(self):
        """Initialize the DockerBuilder."""
        self.logger = logger
    
    def build_miniset_image(self, miniset_name: str) -> bool:
        """
        Build a Docker image for a specific MiniSet.
        
        Args:
            miniset_name: Name of the MiniSet folder
            
        Returns:
            True if build was successful, False otherwise
        """
        miniset_path = DATASET_PATH / miniset_name
        if not miniset_path.exists():
            self.logger.error(f"MiniSet folder not found: {miniset_path}")
            return False
        
        # Create Dockerfile
        dockerfile_path = create_dockerfile(miniset_path, DATASET_DOCKERFILE_CONTENT)
        
        # Build image
        image_name = f"{DATASET_IMAGE_PREFIX}-{format_miniset_name(miniset_name)}"
        
        try:
            self.logger.info(f"Building Docker image for {miniset_name}...")
            
            result = subprocess.run([
                "docker", "build",
                "-t", image_name,
                "-f", str(dockerfile_path),
                str(miniset_path)
            ], capture_output=True, text=True, check=True)
            
            self.logger.info(f"Successfully built image: {image_name}")
            return True
            
        except subprocess.CalledProcessError as e:
            self.logger.error(f"Failed to build image for {miniset_name}: {e}")
            self.logger.error(f"Docker output: {e.stderr}")
            return False
            
        finally:
            # Cleanup Dockerfile
            cleanup_dockerfile(dockerfile_path)
    
    def build_logic_image(self) -> bool:
        """
        Build a Docker image for the Logic folder.
        
        Returns:
            True if build was successful, False otherwise
        """
        if not LOGIC_PATH.exists():
            self.logger.error(f"Logic folder not found: {LOGIC_PATH}")
            return False
        
        # Create Dockerfile
        dockerfile_path = create_dockerfile(LOGIC_PATH, LOGIC_DOCKERFILE_CONTENT)
        
        try:
            self.logger.info("Building Docker image for Logic...")
            
            result = subprocess.run([
                "docker", "build",
                "-t", LOGIC_IMAGE_NAME,
                "-f", str(dockerfile_path),
                str(LOGIC_PATH)
            ], capture_output=True, text=True, check=True)
            
            self.logger.info(f"Successfully built image: {LOGIC_IMAGE_NAME}")
            return True
            
        except subprocess.CalledProcessError as e:
            self.logger.error(f"Failed to build Logic image: {e}")
            self.logger.error(f"Docker output: {e.stderr}")
            return False
            
        finally:
            # Cleanup Dockerfile
            cleanup_dockerfile(dockerfile_path)
    
    def build_all_minisets(self) -> dict:
        """
        Build Docker images for all MiniSets.
        
        Returns:
            Dictionary with build results for each MiniSet
        """
        minisets = get_miniset_folders(DATASET_PATH)
        results = {}
        
        if not minisets:
            self.logger.warning("No MiniSet folders found in DataSet directory")
            return results
        
        self.logger.info(f"Found {len(minisets)} MiniSets to build: {minisets}")
        
        for miniset in minisets:
            self.logger.info(f"Building {miniset}...")
            results[miniset] = self.build_miniset_image(miniset)
            
            if results[miniset]:
                self.logger.info(f"✓ {miniset} build completed successfully")
            else:
                self.logger.error(f"✗ {miniset} build failed")
        
        return results
    
    def build_all(self) -> dict:
        """
        Build all Docker images (MiniSets + Logic).
        
        Returns:
            Dictionary with build results for all components
        """
        self.logger.info("Starting build process for all components...")
        
        results = {}
        
        # Build all MiniSets
        miniset_results = self.build_all_minisets()
        results.update(miniset_results)
        
        # Build Logic
        self.logger.info("Building Logic component...")
        results['Logic'] = self.build_logic_image()
        
        if results['Logic']:
            self.logger.info("✓ Logic build completed successfully")
        else:
            self.logger.error("✗ Logic build failed")
        
        # Summary
        successful = sum(1 for success in results.values() if success)
        total = len(results)
        
        self.logger.info(f"Build summary: {successful}/{total} components built successfully")
        
        return results
    
    def list_built_images(self) -> None:
        """List all built Docker images related to this project."""
        from utils import get_docker_images
        
        images = get_docker_images()
        project_images = [
            img for img in images 
            if any(name in img.lower() for name in [DATASET_IMAGE_PREFIX, LOGIC_IMAGE_NAME.lower()])
        ]
        
        if project_images:
            self.logger.info("Built project images:")
            for image in project_images:
                self.logger.info(f"  - {image}")
        else:
            self.logger.info("No project images found")