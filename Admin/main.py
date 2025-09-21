from userside import *
from server import *
from core import *
import os

allcommands = [
    {"description": "Run main script", "command": "python3 main.py"},
    {"description": "Run main1 script", "command": "python3 main1.py"}
]


#Create a zip file of the project
CreateZip("mydata","mycmd","node_1",allcommands)

host = GetIP()
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
    server.bind(("0.0.0.0", 5002))
    server.listen(1)
    print(f"Listening on 0.0.0.0:5002 ...")
    conn, addr = server.accept()
    print(f"Connected by {addr}")

    # Now send the file over the connection
    send_file(conn, "node_1.zip")
