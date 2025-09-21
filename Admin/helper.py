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

def DataSplit(input_source="../PreProcess/", output_source="../PostProcess/", Objtype=1, chunks=1):
    """
    Splits the input file into multiple chunk files.
    """

    all_inp_files = os.listdir(input_source)
    text = ""
    for i in all_inp_files:
        with open(os.path.join(input_source, i), "r", encoding="utf-8") as f:
            text += f.read() + "\n"
        
    with open(input_source+"/sample1.txt", "w", encoding="utf-8") as f:
        f.write(text)
    
    input_source = input_source+"/sample1.txt"

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




