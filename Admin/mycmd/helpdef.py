import os
import zipfile
import shutil

def rename_file(old_path, new_path):
    os.rename(old_path, new_path)

postprocess_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../PostProcess"))

for f in os.listdir(postprocess_dir):
    full_path = os.path.join(postprocess_dir, f)
    if os.path.isfile(full_path):
        new_filename = "n1_" + f
        new_path = os.path.join(postprocess_dir, new_filename)
        rename_file(full_path, new_path)

parent_dir = os.path.dirname(postprocess_dir)
new_dir = os.path.join(parent_dir, "n1_PostProcess")

if os.path.exists(new_dir):
    shutil.rmtree(new_dir)
os.rename(postprocess_dir, new_dir)

zip_filename = os.path.join(parent_dir, "n1_PostP.zip")
with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(new_dir):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, parent_dir)
            zipf.write(file_path, arcname)


