import socket
import threading
import time
from core import GetIP 

def receive_messages(conn):
    """Thread to constantly receive messages from client"""
    while True:
        try:
            data = conn.recv(1024)
            if not data:
                break
            print(f"[CLIENT] {data.decode()}")
        except:
            break

def run_server(port=5002):
    host = GetIP()
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
        server.bind((host, port))
        server.listen(1)
        print(f"[SERVER] Listening on {host}:{port} ...")

        conn, addr = server.accept()
        print(f"[SERVER] Connected by {addr}")

        threading.Thread(target=receive_messages, args=(conn,), daemon=True).start()

        count = 1
        while True:
            message = f"Server message {count}"
            conn.sendall(message.encode())
            print(f"[SENT] {message}")
            count += 1
            time.sleep(2)  # interval between messages

if __name__ == "__main__":
    run_server()