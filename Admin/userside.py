import os
import zipfile
from helper import *

def CreateZip(input_source, source_code, node_id, allcommands):
    zip_filename = f"{node_id}.zip"
    os.makedirs("temp_input", exist_ok=True)
    DataSplit(input_source=input_source+"/sample1.txt", output_source="temp_input", Objtype=1, chunks=5)
    input_source = "temp_input"

    with zipfile.ZipFile(zip_filename, "w", zipfile.ZIP_DEFLATED) as zipf:
        if os.path.exists(input_source):
            for folder, _, files in os.walk(input_source):
                for file in files:
                    file_path = os.path.join(folder, file)
                    arcname = os.path.join("PreProcess", os.path.relpath(file_path, input_source))
                    zipf.write(file_path, arcname)

        if os.path.exists(source_code):
            for folder, _, files in os.walk(source_code):
                for file in files:
                    file_path = os.path.join(folder, file)
                    arcname = os.path.join("ServerFiles", os.path.relpath(file_path, source_code))
                    zipf.write(file_path, arcname)

        makefile_content = ".PHONY: run\n\nrun:\n"
        for cmd in allcommands:
            makefile_content += f"\t@echo \"Executing {cmd['description']}\"\n"
            makefile_content += f"\t{cmd['command']} >> output.log 2>> error.log\n\n"

        # Add Makefile inside ServerFiles in the zip
        zipf.writestr("ServerFiles/Makefile", makefile_content)
