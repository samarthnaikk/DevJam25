import os
import zipfile
from helper import *

def CreateZip(file_path, source_code, node_id, allcommands):
    zip_filename = f"{node_id}.zip"

    with zipfile.ZipFile(zip_filename, "w", zipfile.ZIP_DEFLATED) as zipf:
        # Ensure PreProcess folder exists in the zip
        zipf.writestr("PreProcess/", "")

        if os.path.exists(file_path):  # make sure the file exists
            arcname = os.path.join("PreProcess", os.path.basename(file_path))
            zipf.write(file_path, arcname)

        if os.path.exists(source_code):
            for folder, _, files in os.walk(source_code):
                for file in files:
                    src_file = os.path.join(folder, file)
                    arcname = os.path.join("ServerFiles", os.path.relpath(src_file, source_code))
                    zipf.write(src_file, arcname)

        makefile_content = ".PHONY: run\n\nrun:\n"
        for cmd in allcommands:
            makefile_content += f"\t@echo \"Executing {cmd['description']}\"\n"
            makefile_content += f"\t{cmd['command']} >> output.log 2>> error.log\n\n"

        # Add Makefile inside ServerFiles in the zip
        zipf.writestr("ServerFiles/Makefile", makefile_content)

