"""
Docker image exporter functions for tagging, saving, and cleanup.
"""
import subprocess
from pathlib import Path
from typing import Optional, List

from config import (
    DATASET_IMAGE_PREFIX, LOGIC_IMAGE_NAME, EXPORT_TAG_NAME,
    EXPORT_DIR, DATASET_TAR_TEMPLATE, LOGIC_TAR_NAME,
    DATASET_PATH
)
from utils import (
    setup_logging, get_miniset_folders, format_miniset_name,
    ensure_directory_exists
)

logger = setup_logging()


class DockerExporter:
    """Docker image exporter class."""
    
    def __init__(self):
        """Initialize the DockerExporter."""
        self.logger = logger
        ensure_directory_exists(EXPORT_DIR)
    
    def _run_docker_command(self, command: List[str]) -> bool:
        """
        Run a Docker command and handle errors.
        
        Args:
            command: Docker command as list of strings
            
        Returns:
            True if command was successful, False otherwise
        """
        try:
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                check=True
            )
            return True
        except subprocess.CalledProcessError as e:
            self.logger.error(f"Docker command failed: {' '.join(command)}")
            self.logger.error(f"Error output: {e.stderr}")
            return False
    
    def _tag_image(self, source_image: str, target_tag: str) -> bool:
        """
        Tag a Docker image.
        
        Args:
            source_image: Source image name
            target_tag: Target tag name
            
        Returns:
            True if tagging was successful, False otherwise
        """
        self.logger.info(f"Tagging {source_image} as {target_tag}")
        return self._run_docker_command(["docker", "tag", source_image, target_tag])
    
    def _save_image(self, image_name: str, output_file: Path) -> bool:
        """
        Save a Docker image to a tar file.
        
        Args:
            image_name: Name of the image to save
            output_file: Path to the output tar file
            
        Returns:
            True if saving was successful, False otherwise
        """
        self.logger.info(f"Saving {image_name} to {output_file}")
        return self._run_docker_command([
            "docker", "save", "-o", str(output_file), image_name
        ])
    
    def _remove_image(self, image_name: str) -> bool:
        """
        Remove a Docker image.
        
        Args:
            image_name: Name of the image to remove
            
        Returns:
            True if removal was successful, False otherwise
        """
        self.logger.info(f"Removing temporary tag: {image_name}")
        return self._run_docker_command(["docker", "rmi", image_name])
    
    def export_miniset(self, miniset_name: str) -> bool:
        """
        Export a MiniSet Docker image.
        
        Process:
        1. Tag the original image as 'DataSet'
        2. Save the 'DataSet' tagged image to tar file
        3. Remove the temporary 'DataSet' tag
        
        Args:
            miniset_name: Name of the MiniSet to export
            
        Returns:
            True if export was successful, False otherwise
        """
        original_image = f"{DATASET_IMAGE_PREFIX}-{format_miniset_name(miniset_name)}"
        temp_tag = EXPORT_TAG_NAME
        output_file = EXPORT_DIR / DATASET_TAR_TEMPLATE.format(miniset_name)
        
        self.logger.info(f"Exporting {miniset_name}...")
        
        # Step 1: Tag the image
        if not self._tag_image(original_image, temp_tag):
            return False
        
        # Step 2: Save the image
        if not self._save_image(temp_tag, output_file):
            # Cleanup the temporary tag if save failed
            self._remove_image(temp_tag)
            return False
        
        # Step 3: Remove temporary tag
        if not self._remove_image(temp_tag):
            self.logger.warning(f"Failed to cleanup temporary tag: {temp_tag}")
            # Don't return False here as the export was successful
        
        self.logger.info(f"✓ Successfully exported {miniset_name} to {output_file}")
        return True
    
    def export_logic(self) -> bool:
        """
        Export the Logic Docker image.
        
        Process:
        1. Tag the logic-app image as 'DataSet'
        2. Save the 'DataSet' tagged image to tar file
        3. Remove the temporary 'DataSet' tag
        
        Returns:
            True if export was successful, False otherwise
        """
        original_image = LOGIC_IMAGE_NAME
        temp_tag = EXPORT_TAG_NAME
        output_file = EXPORT_DIR / LOGIC_TAR_NAME
        
        self.logger.info("Exporting Logic component...")
        
        # Step 1: Tag the image
        if not self._tag_image(original_image, temp_tag):
            return False
        
        # Step 2: Save the image
        if not self._save_image(temp_tag, output_file):
            # Cleanup the temporary tag if save failed
            self._remove_image(temp_tag)
            return False
        
        # Step 3: Remove temporary tag
        if not self._remove_image(temp_tag):
            self.logger.warning(f"Failed to cleanup temporary tag: {temp_tag}")
            # Don't return False here as the export was successful
        
        self.logger.info(f"✓ Successfully exported Logic to {output_file}")
        return True
    
    def export_all_minisets(self) -> dict:
        """
        Export all MiniSet Docker images.
        
        Returns:
            Dictionary with export results for each MiniSet
        """
        minisets = get_miniset_folders(DATASET_PATH)
        results = {}
        
        if not minisets:
            self.logger.warning("No MiniSet folders found in DataSet directory")
            return results
        
        self.logger.info(f"Exporting {len(minisets)} MiniSets: {minisets}")
        
        for miniset in minisets:
            results[miniset] = self.export_miniset(miniset)
            
            if results[miniset]:
                self.logger.info(f"✓ {miniset} export completed successfully")
            else:
                self.logger.error(f"✗ {miniset} export failed")
        
        return results
    
    def export_all(self) -> dict:
        """
        Export all Docker images (MiniSets + Logic).
        
        Returns:
            Dictionary with export results for all components
        """
        self.logger.info("Starting export process for all components...")
        
        results = {}
        
        # Export all MiniSets
        miniset_results = self.export_all_minisets()
        results.update(miniset_results)
        
        # Export Logic
        results['Logic'] = self.export_logic()
        
        if results['Logic']:
            self.logger.info("✓ Logic export completed successfully")
        else:
            self.logger.error("✗ Logic export failed")
        
        # Summary
        successful = sum(1 for success in results.values() if success)
        total = len(results)
        
        self.logger.info(f"Export summary: {successful}/{total} components exported successfully")
        
        # List exported files
        self._list_exported_files()
        
        return results
    
    def _list_exported_files(self) -> None:
        """List all exported tar files."""
        tar_files = list(EXPORT_DIR.glob("*.tar"))
        
        if tar_files:
            self.logger.info("Exported files:")
            for tar_file in sorted(tar_files):
                file_size = tar_file.stat().st_size / (1024 * 1024)  # MB
                self.logger.info(f"  - {tar_file.name} ({file_size:.1f} MB)")
        else:
            self.logger.info("No exported files found")
    
    def clean_export_directory(self) -> bool:
        """
        Clean the export directory by removing all tar files.
        
        Returns:
            True if cleanup was successful, False otherwise
        """
        tar_files = list(EXPORT_DIR.glob("*.tar"))
        
        if not tar_files:
            self.logger.info("Export directory is already clean")
            return True
        
        try:
            for tar_file in tar_files:
                tar_file.unlink()
                self.logger.info(f"Removed: {tar_file.name}")
            
            self.logger.info(f"Cleaned {len(tar_files)} files from export directory")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to clean export directory: {e}")
            return False
    
    def export_specific(self, component: str) -> bool:
        """
        Export a specific component.
        
        Args:
            component: Component name ('Logic' or MiniSet name)
            
        Returns:
            True if export was successful, False otherwise
        """
        if component.lower() == 'logic':
            return self.export_logic()
        else:
            # Assume it's a MiniSet name
            minisets = get_miniset_folders(DATASET_PATH)
            if component in minisets:
                return self.export_miniset(component)
            else:
                self.logger.error(f"Component not found: {component}")
                self.logger.info(f"Available components: Logic, {', '.join(minisets)}")
                return False