"""
This file has all the required functions to slices/distribute data irrespective of same or
cross network
"""

import os

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
        except:
            print("Error while Splitting data - type 1")

    