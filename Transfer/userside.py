"""
This will help to prepare files and folders that will be forwarded to the user side
"""

def CreateMake(allcommands):
    with open("Makefile", "w", encoding="utf-8") as f:
        f.write(".PHONY: run\n\n")
        f.write("run:\n")
        for i in allcommands:
            f.write(f"\t@echo \"Executing {i['description']}\"\n")
            f.write(f"\t{i['command']} >> output.log 2>> error.log\n\n")

