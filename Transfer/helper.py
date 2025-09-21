"""
This file has all the required functions to slices/distribute data irrespective of same or
cross network
"""

import os
import time

def Partition(input_source=None,output_source=None):
    pass

def ModelSplit(input_source=None,output_source=None):
    pass

def DataSplit(input_source="../PreProcess/sample1.txt", output_source="../PostProcess/", Objtype=1, chunks=1):
    """
    Splits the input file into multiple chunk files.
    """

    if Objtype == 1:
        if not input_source or not output_source:
            raise ValueError("Both input_source and output_source must be provided.")
        if chunks < 1:
            raise ValueError("Chunks must be at least 1.")

        try:
            os.makedirs(output_source, exist_ok=True)

            with open(input_source, "r", encoding="utf-8") as f:
                lines = f.readlines()

            total_lines = len(lines)
            chunk_size = (total_lines + chunks - 1) // chunks

            for i in range(chunks):
                start = i * chunk_size
                end = min(start + chunk_size, total_lines)
                if start >= total_lines:
                    break
                chunk_lines = lines[start:end]

                chunk_file = os.path.join(output_source, f"chunk_{i+1}.txt")
                with open(chunk_file, "w", encoding="utf-8") as cf:
                    cf.writelines(chunk_lines)
        except Exception as e:
            print("Error while Splitting data - type 1")
            with open("../.log", "a", encoding="utf-8") as log:
                log.write(f"{time.ctime()} - Error while Splitting data - type 1 - {e}\n")

    elif Objtype == 2:
        if not input_source or not output_source:
            raise ValueError("Both input_source and output_source must be provided.")
        if chunks < 1:
            raise ValueError("Chunks must be at least 1.")

        try:
            os.makedirs(output_source, exist_ok=True)

            with open(input_source, "r", encoding="utf-8") as f:
                text = f.read()

            tokens = text.split()
            total_tokens = len(tokens)
            chunk_size = (total_tokens + chunks - 1) // chunks

            for i in range(chunks):
                start = i * chunk_size
                end = min(start + chunk_size, total_tokens)
                if start >= total_tokens:
                    break
                chunk_tokens = tokens[start:end]

                chunk_file = os.path.join(output_source, f"chunk_{i+1}.txt")
                with open(chunk_file, "w", encoding="utf-8") as cf:
                    cf.write(" ".join(chunk_tokens))
        except Exception as e:
            print("Error while Splitting data - type 2")
            with open("../.log", "a", encoding="utf-8") as log:
                log.write(f"{time.ctime()} - Error while Splitting data - type 2 - {e}\n")
    elif Objtype == 3:
        #Can use sentence-transformers or nltk for better sentence splitting
        if not input_source or not output_source:
            raise ValueError("Both input_source and output_source must be provided.")
        if chunks < 1:
            raise ValueError("Chunks must be at least 1.")

        try:
            os.makedirs(output_source, exist_ok=True)

            with open(input_source, "r", encoding="utf-8") as f:
                text = f.read()

            # Split by paragraphs (two or more newlines)
            paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
            total_paragraphs = len(paragraphs)
            chunk_size = (total_paragraphs + chunks - 1) // chunks

            for i in range(chunks):
                start = i * chunk_size
                end = min(start + chunk_size, total_paragraphs)
                if start >= total_paragraphs:
                    break
                chunk_paragraphs = paragraphs[start:end]

                chunk_file = os.path.join(output_source, f"chunk_{i+1}.txt")
                with open(chunk_file, "w", encoding="utf-8") as cf:
                    cf.write("\n\n".join(chunk_paragraphs))
        except Exception as e:
            print("Error while Splitting data - type 3")
            with open("../.log", "a", encoding="utf-8") as log:
                log.write(f"{time.ctime()} - Error while Splitting data - type 3 - {e}\n")
    elif Objtype == 4:
        if not input_source or not output_source:
            raise ValueError("Both input_source and output_source must be provided.")
        if chunks < 1:
            raise ValueError("Chunks must be at least 1.")

        try:
            os.makedirs(output_source, exist_ok=True)

            with open(input_source, "r", encoding="utf-8") as f:
                text = f.read()

            tokens = text.split()
            total_tokens = len(tokens)
            chunk_size = (total_tokens + chunks - 1) // chunks
            overlap = max(1, chunk_size // 5)  # 20% overlap, adjust as needed

            start = 0
            i = 0
            while start < total_tokens:
                end = min(start + chunk_size, total_tokens)
                chunk_tokens = tokens[start:end]

                chunk_file = os.path.join(output_source, f"chunk_{i+1}.txt")
                with open(chunk_file, "w", encoding="utf-8") as cf:
                    cf.write(" ".join(chunk_tokens))

                i += 1
                start += chunk_size - overlap  # move forward with overlap
        except Exception as e:
            print("Error while Splitting data - type 4")
            with open("../.log", "a", encoding="utf-8") as log:
                log.write(f"{time.ctime()} - Error while Splitting data - type 4 - {e}\n")

    elif Objtype == 5:
        if not input_source or not output_source:
            raise ValueError("Both input_source and output_source must be provided.")
        if chunks < 1:
            raise ValueError("Chunks must be at least 1.")

        try:
            os.makedirs(output_source, exist_ok=True)

            with open(input_source, "r", encoding="utf-8") as f:
                text = f.read()

            tokens = text.split()
            total_tokens = len(tokens)

            # Define fixed chunk size and stride
            chunk_size = max(1, len(tokens) // chunks)   # adjust chunk size based on requested chunks
            stride = max(1, chunk_size // 2)             # default: 50% overlap

            i = 0
            start = 0
            while start < total_tokens:
                end = min(start + chunk_size, total_tokens)
                chunk_tokens = tokens[start:end]

                chunk_file = os.path.join(output_source, f"chunk_{i+1}.txt")
                with open(chunk_file, "w", encoding="utf-8") as cf:
                    cf.write(" ".join(chunk_tokens))

                i += 1
                start += stride   # slide forward by stride
        except Exception as e:
            print("Error while Splitting data - type 5")
            with open("../.log", "a", encoding="utf-8") as log:
                log.write(f"{time.ctime()} - Error while Splitting data - type 5 - {e}\n")

    elif Objtype == 6:
        if not input_source or not output_source:
            raise ValueError("Both input_source and output_source must be provided.")
        if chunks < 2:
            raise ValueError("Chunks must be at least 2 for hierarchical splitting.")

        try:
            os.makedirs(output_source, exist_ok=True)

            with open(input_source, "r", encoding="utf-8") as f:
                text = f.read()

            tokens = text.split()
            total_tokens = len(tokens)

            # First split: large chunks
            num_large_chunks = chunks // 2 if chunks > 2 else 2
            large_chunk_size = (total_tokens + num_large_chunks - 1) // num_large_chunks

            file_index = 1
            for i in range(num_large_chunks):
                start = i * large_chunk_size
                end = min(start + large_chunk_size, total_tokens)
                if start >= total_tokens:
                    break
                large_chunk_tokens = tokens[start:end]

                # Second split: sub-chunks within each large chunk
                sub_chunk_size = max(1, len(large_chunk_tokens) // 2)  # 2 sub-chunks per large chunk
                for j in range(0, len(large_chunk_tokens), sub_chunk_size):
                    sub_chunk_tokens = large_chunk_tokens[j:j + sub_chunk_size]

                    chunk_file = os.path.join(output_source, f"chunk_{file_index}.txt")
                    with open(chunk_file, "w", encoding="utf-8") as cf:
                        cf.write(" ".join(sub_chunk_tokens))

                    file_index += 1

        except Exception as e:
            print("Error while Splitting data - type 6")
            with open("../.log", "a", encoding="utf-8") as log:
                log.write(f"{time.ctime()} - Error while Splitting data - type 6 - {e}\n")

    elif Objtype == 7:
        if not input_source or not output_source or not task_type:
            raise ValueError("input_source, output_source, and task_type must be provided.")
        
        try:
            os.makedirs(output_source, exist_ok=True)

            with open(input_source, "r", encoding="utf-8") as f:
                text = f.read()

            chunks_list = []

            if task_type == "qa":  
                # Split into paragraphs, since QA usually depends on localized context
                chunks_list = [p.strip() for p in text.split("\n\n") if p.strip()]

            elif task_type == "summarization":
                # Split into larger sections (by headings or long paragraphs)
                sections = [s.strip() for s in text.split("\n\n") if s.strip()]
                # Group multiple paragraphs into one section
                group_size = 3
                chunks_list = [
                    "\n\n".join(sections[i:i+group_size]) 
                    for i in range(0, len(sections), group_size)
                ]

            elif task_type == "classification":
                # Split into individual sentences for fine-grained analysis
                import re
                sentences = re.split(r'(?<=[.!?])\s+', text)
                chunks_list = [s.strip() for s in sentences if s.strip()]

            else:
                # Default fallback: paragraph-based splitting
                chunks_list = [p.strip() for p in text.split("\n\n") if p.strip()]

            # Write out the chunks
            for i, chunk in enumerate(chunks_list, start=1):
                chunk_file = os.path.join(output_source, f"chunk_{i}.txt")
                with open(chunk_file, "w", encoding="utf-8") as cf:
                    cf.write(chunk)

        except Exception as e:
            print("Error while Splitting data - type 7")
            with open("../.log", "a", encoding="utf-8") as log:
                log.write(f"{time.ctime()} - Error while Splitting data - type 7 - {e}\n")
