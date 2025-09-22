"""
This file will be used to get all the system level data
like CPU, disk usage and others
"""

import psutil
import os

def GetCPU():
    """
    Returns CPU usage of the system in percentage.
    """
    return psutil.cpu_percent(interval=1)

def GetRAM():
    """
    Returns RAM usage of the system in percentage.
    """
    return psutil.virtual_memory().percent

def GetFolderSize(path=None):
    """
    Returns the size of a folder in kb
    """
    if path is None:
        path = os.getcwd()+"/.."

    total_size = 0
    for dirpath, dirnames, filenames in os.walk(path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            if os.path.exists(fp):
                total_size += os.path.getsize(fp)
    size = total_size/1024
    return size

def GetFileCount(path=None):
    """
    Returns the number of files in a folder
    """
    if path is None:
        path = os.getcwd()+"/.."
        print(path)

    file_count = 0
    for dirpath, dirnames, filenames in os.walk(path):
        file_count += len(filenames)
    return file_count
