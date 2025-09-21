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
	import argparse
	parser = argparse.ArgumentParser(description="Train and query a simple text QA model.")
	parser.add_argument('--train_files', nargs='*', type=str, help='Paths to plain text files to train on (multiple allowed)')
	parser.add_argument('--ask', type=str, help='Question to ask')
	args = parser.parse_args()

	qa = SimpleTextQA()
	if args.train_files:
		for file in args.train_files:
			with open(file, 'r', encoding='utf-8') as f:
				text = f.read()
			qa.add_text_chunk(text)
			print(f"Added {file} for training.")
		qa.finalize_index()
		print("Merged all chunks and built index.")
	if args.ask:
		if qa.index is None:
			raise RuntimeError("You must train the model first with --train_files.")
		answers = qa.answer(args.ask, top_k=1)
		print("Answer:", answers[0])
