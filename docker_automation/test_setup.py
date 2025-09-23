#!/usr/bin/env python3
"""
Test script to verify the Docker automation system setup.
"""
import sys
from pathlib import Path

# Add the docker_automation directory to the path
sys.path.insert(0, str(Path(__file__).parent))

from utils import validate_docker_installation, get_miniset_folders
from config import DATASET_PATH, LOGIC_PATH, EXPORT_DIR

def main():
    print("🐳 Docker Automation System - Setup Verification")
    print("=" * 50)
    
    # Check Docker
    print("1. Checking Docker installation...")
    if validate_docker_installation():
        print("   ✅ Docker is installed and running")
    else:
        print("   ❌ Docker is not available")
        print("   Please install Docker and make sure it's running")
        return False
    
    # Check project structure
    print("\n2. Checking project structure...")
    
    if DATASET_PATH.exists():
        print(f"   ✅ DataSet folder found: {DATASET_PATH}")
        
        minisets = get_miniset_folders(DATASET_PATH)
        if minisets:
            print(f"   ✅ Found {len(minisets)} MiniSets: {', '.join(minisets)}")
        else:
            print("   ⚠️  No MiniSet folders found in DataSet")
    else:
        print(f"   ❌ DataSet folder not found: {DATASET_PATH}")
    
    if LOGIC_PATH.exists():
        print(f"   ✅ Logic folder found: {LOGIC_PATH}")
    else:
        print(f"   ❌ Logic folder not found: {LOGIC_PATH}")
    
    if EXPORT_DIR.exists():
        print(f"   ✅ Export directory ready: {EXPORT_DIR}")
    else:
        print(f"   ❌ Export directory not found: {EXPORT_DIR}")
    
    # Check automation system
    print("\n3. Checking automation system...")
    automation_files = [
        "main.py", "builder.py", "exporter.py", "utils.py", "config.py"
    ]
    
    all_files_exist = True
    for file in automation_files:
        file_path = Path(__file__).parent / file
        if file_path.exists():
            print(f"   ✅ {file}")
        else:
            print(f"   ❌ {file} missing")
            all_files_exist = False
    
    print("\n4. Summary:")
    if all_files_exist:
        print("   🎉 All automation system files are in place!")
        print("   📖 See README.md for usage instructions")
        print("   🚀 You can now run: python main.py --help")
        return True
    else:
        print("   ❌ Some files are missing. Please check the setup.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)