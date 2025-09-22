# AI Q&A based on user-provided plain text
# Requirements: pip install sentence-transformers faiss-cpu
import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer


class SimpleTextQA:
	def __init__(self, model_name='all-MiniLM-L6-v2'):
		self.model = SentenceTransformer(model_name)
		self.text_chunks = []
		self.embeddings_list = []  # Store embeddings for each chunk batch
		self.index = None

	def add_text_chunk(self, text, chunk_size=500):
		"""Add a new chunk of text for training (can be called multiple times)."""
		chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
		self.text_chunks.extend(chunks)
		emb = self.model.encode(chunks, convert_to_numpy=True)
		self.embeddings_list.append(emb)

	def finalize_index(self):
		"""Merge all embeddings and build the FAISS index. Call after all chunks are added."""
		if not self.embeddings_list:
			raise ValueError("No data to build index. Add text chunks first.")
		all_embeddings = np.vstack(self.embeddings_list)
		self.embeddings = all_embeddings
		self.index = faiss.IndexFlatL2(all_embeddings.shape[1])
		self.index.add(all_embeddings)

	def answer(self, question, top_k=1):
		"""Finds the most relevant chunk(s) for the question."""
		if self.index is None:
			raise ValueError("Model not trained. Call finalize_index() after adding text chunks.")
		q_emb = self.model.encode([question], convert_to_numpy=True)
		D, I = self.index.search(q_emb, top_k)
		return [self.text_chunks[i] for i in I[0]]

if __name__ == "__main__":
	import time
	chunk_files = [
		os.path.join(os.path.dirname(__file__), f'../Admin/temp_input/chunk_{i}.txt') for i in range(1, 6)
	]
	sample_file = os.path.join(os.path.dirname(__file__), 'sample1.txt')

	# Train on chunk_1.txt and chunk_2.txt
	qa1 = SimpleTextQA()
	t1 = time.time()
	for file in chunk_files:
		with open(file, 'r', encoding='utf-8') as f:
			text = f.read()
		qa1.add_text_chunk(text)
		print(f"Added {file} for training.")

	qa1.finalize_index()
	np.save("embeddings.npy", qa1.embeddings)
	t2 = time.time()
	print(f"[Chunks 1+2] Training and merging took {t2-t1:.2f} seconds.")

	# Train on sample1.txt only
	qa2 = SimpleTextQA()
	t3 = time.time()
	with open(sample_file, 'r', encoding='utf-8') as f:
		text = f.read()
	qa2.add_text_chunk(text)

	qa2.finalize_index()
	np.save("embeddings_sample1.npy", qa2.embeddings)
	t4 = time.time()
	print(f"[Sample1] Training took {t4-t3:.2f} seconds.")
