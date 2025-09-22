import os
import zipfile
import numpy as np
import faiss

RECEIVED_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "receivedd"))
MERGED_DIR = os.path.join(RECEIVED_DIR, "merged")
os.makedirs(MERGED_DIR, exist_ok=True)

# Step 1: Unzip all ZIP files into merged folder
for f in os.listdir(RECEIVED_DIR):
    if f.endswith(".zip"):
        zip_path = os.path.join(RECEIVED_DIR, f)
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(MERGED_DIR)

# Step 2: Collect all embeddings
embedding_list = []
text_chunks = []

for folder in os.listdir(MERGED_DIR):
    folder_path = os.path.join(MERGED_DIR, folder)
    if os.path.isdir(folder_path):
        for file in os.listdir(folder_path):
            if file.endswith(".npy"):
                emb_path = os.path.join(folder_path, file)
                emb = np.load(emb_path)
                embedding_list.append(emb)

                # Optionally, store the text chunk corresponding to this embedding
                txt_file = file.replace(".npy", ".txt")
                txt_path = os.path.join(folder_path, txt_file)
                if os.path.exists(txt_path):
                    with open(txt_path, 'r', encoding='utf-8') as f:
                        text_chunks.append(f.read())
                else:
                    text_chunks.extend([f"Chunk {i}" for i in range(emb.shape[0])])

# Step 3: Merge all embeddings
all_embeddings = np.vstack(embedding_list)
np.save(os.path.join(RECEIVED_DIR, "merged_embeddings.npy"), all_embeddings)
print(f"Merged {len(embedding_list)} embedding files into shape {all_embeddings.shape}")

# Step 4: Build FAISS index
index = faiss.IndexFlatL2(all_embeddings.shape[1])
index.add(all_embeddings)
print(f"FAISS index built with {index.ntotal} vectors")

# Step 5: Optional: save index for later use
faiss.write_index(index, os.path.join(RECEIVED_DIR, "final_index.faiss"))

print("Final merged model is ready for Q&A.")
