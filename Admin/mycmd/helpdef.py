import os

def rename_file(old_path, new_path):
    os.rename(old_path, new_path)

def renameall():
    postprocess_dir = os.path.join(os.path.dirname(__file__), "../PostProcess")

    all_files = []
    for f in os.listdir(postprocess_dir):
        full_path = os.path.join(postprocess_dir, f)
        if os.path.isfile(full_path):  # skip directories
            all_files.append(f)

    # Rename files
    for f in all_files:
        old_path = os.path.join(postprocess_dir, f)
        new_filename = "n1_" + f
        new_path = os.path.join(postprocess_dir, new_filename)
        rename_file(old_path, new_path)
