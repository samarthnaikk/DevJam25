import socket
import threading
import time
import os
from core import GetIP 

BUFFER_SIZE = 1024

def receive_messages(conn):
    """Thread to constantly receive messages or files from client"""
    while True:
        try:
            data = conn.recv(BUFFER_SIZE)
            if not data:
                break

            decoded = None
            try:
                decoded = data.decode()
            except UnicodeDecodeError:
                pass

            if decoded and decoded.startswith("FILE:"):
                _, filename, filesize = decoded.split(":")
                filesize = int(filesize)
                print(f"[CLIENT] Sending file: {filename} ({filesize} bytes)")

                with open("received_" + filename, "wb") as f:
                    remaining = filesize
                    while remaining > 0:
                        chunk = conn.recv(min(BUFFER_SIZE, remaining))
                        if not chunk:
                            break
                        f.write(chunk)
                        remaining -= len(chunk)

                print(f"[SERVER] File {filename} received successfully ✅")
            else:
                print(f"[CLIENT] {decoded if decoded else data[:50]}...")

        except Exception as e:
            print(f"[ERROR] {e}")
            break


def send_file(conn, filepath):
    """Send a file to the connected client"""
    if not os.path.exists(filepath):
        print("[ERROR] File does not exist")
        return

    filesize = os.path.getsize(filepath)
    filename = os.path.basename(filepath)

    header = f"FILE:{filename}:{filesize}".encode()
    conn.sendall(header)

    time.sleep(0.5)  # small delay

    with open(filepath, "rb") as f:
        while chunk := f.read(BUFFER_SIZE):
            conn.sendall(chunk)

    print(f"[SERVER] Sent file {filename} ({filesize} bytes)")


def run_server(port=5002):
    host = GetIP()
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
        server.bind((host, port))
        server.listen(1)
        print(f"[SERVER] Listening on {host}:{port} ...")

        conn, addr = server.accept()
        print(f"[SERVER] Connected by {addr}")

        threading.Thread(target=receive_messages, args=(conn,), daemon=True).start()

        # Interactive input loop
        while True:
            user_input = input("Enter message or file:<path> > ").strip()
            if user_input.startswith("file:"):
                filepath = user_input[5:].strip()
                send_file(conn, filepath)
            else:
                conn.sendall(user_input.encode())
                print(f"[SENT] {user_input}")


if __name__ == "__main__":
    run_server()
