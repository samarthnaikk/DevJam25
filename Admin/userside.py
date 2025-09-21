"""
This will help to prepare files and folders that will be forwarded to the user side
"""

import os
import zipfile

def CreateMake(allcommands):
    """
    Creates a Makefile with the given commands.
    """
    with open("Makefile", "w", encoding="utf-8") as f:
        f.write(".PHONY: run\n\n")
        f.write("run:\n")
        for i in allcommands:
            f.write(f"\t@echo \"Executing {i['description']}\"\n")
            f.write(f"\t{i['command']} >> output.log 2>> error.log\n\n")

def CreateZip(input_source, source_code, node_id):
    """
    Zips input_source as 'PreProcess/' and source_code as 'ServerFiles/' 
    inside node_id.zip.
    """
    zip_filename = f"{node_id}.zip"

    with zipfile.ZipFile(zip_filename, "w", zipfile.ZIP_DEFLATED) as zipf:
        # Add PreProcess folder
        for folder, _, files in os.walk(input_source):
            for file in files:
                file_path = os.path.join(folder, file)
                arcname = os.path.join("PreProcess", os.path.relpath(file_path, input_source))
                zipf.write(file_path, arcname)

        # Add ServerFiles folder
        for folder, _, files in os.walk(source_code):
            for file in files:
                file_path = os.path.join(folder, file)
                arcname = os.path.join("ServerFiles", os.path.relpath(file_path, source_code))
                zipf.write(file_path, arcname)

