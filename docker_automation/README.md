# Docker Automation System

A comprehensive Python-based automation system for building and exporting Docker images for the DevJam25 project.

## Overview

This system automates the process of:
- Building Docker images for each MiniSet in the DataSet folder
- Building Docker images for the Logic folder
- Exporting images with proper tagging for distribution
- Managing image lifecycle and cleanup

## Project Structure

```
docker_automation/
├── main.py                 # Main entry point with CLI interface
├── builder.py              # Docker image building functions
├── exporter.py             # Image tagging, exporting, and cleanup
├── utils.py                # Utility functions and helpers
├── config.py               # Configuration settings and constants
└── README.md               # This file
```

## Features

### Image Building
- **MiniSet Images**: Each subfolder in `DataSet/` is built into a Docker image named `dataset-miniset1`, `dataset-miniset2`, etc.
- **Logic Image**: The `Logic/` folder is built into a Docker image called `logic-app`
- **Automatic Detection**: Automatically discovers all MiniSet folders
- **Dockerfile Generation**: Creates appropriate Dockerfiles automatically

### Image Exporting
- **Clean Naming**: On your main laptop, images keep original names
- **Distribution Ready**: For export, images are temporarily tagged as `DataSet`
- **Tar Files**: Exported as `DataSet_MiniSet1.tar`, `DataSet_Logic.tar`, etc.
- **Clean Cleanup**: Removes temporary tags after export
- **Receiver Ready**: When loaded with `docker load`, only shows image named `DataSet`

### Modular Design
- **Separation of Concerns**: Builder, exporter, and utilities are separate
- **Extensible**: Easy to add new MiniSets or modify behavior
- **Configurable**: Centralized configuration in `config.py`
- **Logging**: Comprehensive logging with different levels

## Prerequisites

1. **Docker**: Make sure Docker is installed and running
   ```bash
   docker --version
   ```

2. **Python 3.7+**: Required for the automation scripts
   ```bash
   python --version
   ```

## Installation

1. Navigate to your project directory:
   ```bash
   cd /path/to/DevJam25
   ```

2. The automation system is ready to use (no additional dependencies required)

## Usage

### Command Line Interface

The main script provides a comprehensive CLI interface:

```bash
cd docker_automation
python main.py [OPTIONS]
```

### Available Commands

#### Building Images

```bash
# Build all images (MiniSets + Logic)
python main.py --build-all

# Build a specific MiniSet
python main.py --build MiniSet1

# Build the Logic component
python main.py --build Logic
```

#### Exporting Images

```bash
# Export all built images to tar files
python main.py --export-all

# Export a specific component
python main.py --export Logic
python main.py --export MiniSet1
```

#### Combined Operations

```bash
# Build everything and then export everything
python main.py --build-and-export-all
```

#### Utility Commands

```bash
# List all built project images
python main.py --list-images

# List available components
python main.py --list-components

# Clean the export directory
python main.py --clean-exports
```

#### Logging Options

```bash
# Set logging level
python main.py --build-all --log-level DEBUG
python main.py --export-all --log-level WARNING
```

### Example Workflows

#### Full Development Workflow
```bash
# 1. Build all components
python main.py --build-all

# 2. Test your images (optional)
docker run dataset-miniset1
docker run logic-app

# 3. Export for distribution
python main.py --export-all
```

#### Quick Single Component
```bash
# Build and export just the Logic component
python main.py --build Logic
python main.py --export Logic
```

#### Clean and Rebuild
```bash
# Clean exports and rebuild everything
python main.py --clean-exports
python main.py --build-and-export-all
```

## Output Structure

### Built Images (on main laptop)
- `dataset-miniset1`
- `dataset-miniset2`
- `logic-app`

### Exported Files
All exported files are saved in the `exports/` directory:
- `DataSet_MiniSet1.tar`
- `DataSet_MiniSet2.tar`
- `DataSet_Logic.tar`

### On Receiver Laptop
When someone loads the tar files:
```bash
docker load -i DataSet_MiniSet1.tar
```

They will only see an image named `DataSet` (clean and simple).

## Configuration

Key settings can be modified in `config.py`:

```python
# Image naming
DATASET_IMAGE_PREFIX = "dataset"
LOGIC_IMAGE_NAME = "logic-app"
EXPORT_TAG_NAME = "DataSet"

# Paths
DATASET_PATH = PROJECT_ROOT / "DataSet"
LOGIC_PATH = PROJECT_ROOT / "Logic"
EXPORT_DIR = PROJECT_ROOT / "exports"
```

## Dockerfile Templates

The system automatically generates appropriate Dockerfiles:

### For MiniSets (Dataset)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY . /app/data/
CMD ["echo", "Dataset container ready"]
```

### For Logic
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY . /app/
RUN pip install --no-cache-dir -r requirements.txt || echo "No requirements.txt found"
CMD ["python", "main.py"]
```

## Extending the System

### Adding New MiniSets
Simply create a new folder in `DataSet/` (e.g., `MiniSet3/`). The system will automatically detect and include it.

### Custom Dockerfiles
If you need custom Dockerfiles, modify the templates in `config.py`:
```python
DATASET_DOCKERFILE_CONTENT = """
FROM python:3.9-slim
# Your custom content here
"""
```

### New Export Formats
Extend the `DockerExporter` class in `exporter.py` to support additional export formats.

## Troubleshooting

### Common Issues

1. **Docker not running**
   ```
   Error: Docker is not installed or not running
   ```
   Solution: Start Docker Desktop or Docker daemon

2. **Permission denied**
   ```
   Error: permission denied while trying to connect to Docker
   ```
   Solution: Add your user to the docker group or use sudo

3. **Build failures**
   - Check Dockerfile syntax
   - Ensure all required files are in the source directories
   - Check Docker build logs with `--log-level DEBUG`

4. **Export failures**
   - Ensure images are built before exporting
   - Check disk space in exports directory
   - Verify Docker images exist with `--list-images`

### Debug Mode

Run with debug logging to see detailed information:
```bash
python main.py --build-all --log-level DEBUG
```

### Manual Docker Commands

If you need to run Docker commands manually:
```bash
# List all images
docker images

# Remove specific image
docker rmi dataset-miniset1

# Load exported image
docker load -i exports/DataSet_MiniSet1.tar
```

## License

This automation system is part of the DevJam25 project.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Run with `--log-level DEBUG` for detailed logs
3. Verify your Docker installation and project structure