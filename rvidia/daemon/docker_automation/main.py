"""
Docker Automation System - Main Entry Point

This script automates Docker image building and exporting for the DevJam25 project.
"""
import argparse
import sys
from pathlib import Path

from builder import DockerBuilder
from exporter import DockerExporter
from utils import setup_logging, validate_docker_installation, get_miniset_folders
from config import DATASET_PATH


def create_parser() -> argparse.ArgumentParser:
    """
    Create command line argument parser.
    
    Returns:
        Configured ArgumentParser instance
    """
    parser = argparse.ArgumentParser(
        description="Docker Automation System for DevJam25 project",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py --build-all              # Build all Docker images
  python main.py --build MiniSet1         # Build specific MiniSet
  python main.py --build Logic            # Build Logic component
  python main.py --export-all             # Export all images to tar files
  python main.py --export Logic           # Export specific component
  python main.py --build-and-export-all   # Build and export everything
  python main.py --list-images            # List built project images
  python main.py --clean-exports          # Clean export directory
        """
    )
    
    # Action groups
    action_group = parser.add_mutually_exclusive_group(required=True)
    
    # Build actions
    action_group.add_argument(
        "--build-all",
        action="store_true",
        help="Build Docker images for all MiniSets and Logic"
    )
    
    action_group.add_argument(
        "--build",
        type=str,
        metavar="COMPONENT",
        help="Build Docker image for specific component (MiniSet name or 'Logic')"
    )
    
    # Export actions
    action_group.add_argument(
        "--export-all",
        action="store_true",
        help="Export all built Docker images to tar files"
    )
    
    action_group.add_argument(
        "--export",
        type=str,
        metavar="COMPONENT",
        help="Export specific component (MiniSet name or 'Logic')"
    )
    
    # Combined actions
    action_group.add_argument(
        "--build-and-export-all",
        action="store_true",
        help="Build all images and export them to tar files"
    )
    
    # Utility actions
    action_group.add_argument(
        "--list-images",
        action="store_true",
        help="List all built project Docker images"
    )
    
    action_group.add_argument(
        "--clean-exports",
        action="store_true",
        help="Clean the export directory"
    )
    
    action_group.add_argument(
        "--list-components",
        action="store_true",
        help="List all available components"
    )
    
    # Optional arguments
    parser.add_argument(
        "--log-level",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        default="INFO",
        help="Set logging level (default: INFO)"
    )
    
    return parser


def list_available_components():
    """List all available components."""
    logger = setup_logging()
    
    minisets = get_miniset_folders(DATASET_PATH)
    
    logger.info("Available components:")
    logger.info("  - Logic (main application)")
    
    if minisets:
        for miniset in minisets:
            logger.info(f"  - {miniset}")
    else:
        logger.warning("No MiniSet folders found in DataSet directory")


def main():
    """Main entry point."""
    parser = create_parser()
    args = parser.parse_args()
    
    # Setup logging
    logger = setup_logging(args.log_level)
    
    # Validate Docker installation
    if not validate_docker_installation():
        logger.error("Docker is not installed or not running")
        logger.error("Please install Docker and make sure it's running")
        sys.exit(1)
    
    # Initialize components
    builder = DockerBuilder()
    exporter = DockerExporter()
    
    success = True
    
    try:
        if args.build_all:
            logger.info("Building all Docker images...")
            results = builder.build_all()
            success = all(results.values())
            
        elif args.build:
            logger.info(f"Building Docker image for {args.build}...")
            if args.build.lower() == 'logic':
                success = builder.build_logic_image()
            else:
                success = builder.build_miniset_image(args.build)
                
        elif args.export_all:
            logger.info("Exporting all Docker images...")
            results = exporter.export_all()
            success = all(results.values())
            
        elif args.export:
            logger.info(f"Exporting Docker image for {args.export}...")
            success = exporter.export_specific(args.export)
            
        elif args.build_and_export_all:
            logger.info("Building and exporting all Docker images...")
            
            # Build all
            build_results = builder.build_all()
            build_success = all(build_results.values())
            
            if build_success:
                # Export all
                export_results = exporter.export_all()
                export_success = all(export_results.values())
                success = build_success and export_success
            else:
                logger.error("Build process failed, skipping export")
                success = False
                
        elif args.list_images:
            builder.list_built_images()
            
        elif args.clean_exports:
            logger.info("Cleaning export directory...")
            success = exporter.clean_export_directory()
            
        elif args.list_components:
            list_available_components()
            
    except KeyboardInterrupt:
        logger.info("Process interrupted by user")
        success = False
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        success = False
    
    # Exit with appropriate code
    if success:
        logger.info("Operation completed successfully")
        sys.exit(0)
    else:
        logger.error("Operation failed")
        sys.exit(1)


if __name__ == "__main__":
    main()