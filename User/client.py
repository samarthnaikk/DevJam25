import sys
import requests
import socket
import threading
import time
import os

BUFFER_SIZE = 1024


def download_file(ngrok_url, filename):
    """Generic function to download a file (like helper.py or n1.zip)"""
    if not ngrok_url.startswith("http"):
        ngrok_url = "https://" + ngrok_url
    if ngrok_url.endswith("/"):
        ngrok_url = ngrok_url[:-1]

    file_url = ngrok_url + "/" + filename
    print(f"[DOWNLOAD] Fetching {file_url}")
    try:
        resp = requests.get(file_url, stream=True)
        resp.raise_for_status()

        with open(filename, "wb") as f:
            for chunk in resp.iter_content(chunk_size=BUFFER_SIZE):
                if chunk:
                    f.write(chunk)

        print(f"[SUCCESS] {filename} downloaded and saved.")
    except Exception as e:
        print(f"[ERROR] Could not download {filename}: {e}")


def receive_messages(sock):
    """Thread to constantly receive messages or files from server"""
    while True:
        try:
            data = sock.recv(BUFFER_SIZE)
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
                print(f"[SERVER] Sending file: {filename} ({filesize} bytes)")

                with open("received_" + filename, "wb") as f:
                    remaining = filesize
                    while remaining > 0:
                        chunk = sock.recv(min(BUFFER_SIZE, remaining))
                        if not chunk:
                            break
                        f.write(chunk)
                        remaining -= len(chunk)

                print(f"[CLIENT] File {filename} received successfully ✅")
            else:
                print(f"[SERVER] {decoded if decoded else data[:50]}...")

        except Exception as e:
            print(f"[ERROR] {e}")
            break


def send_file(sock, filepath):
    """Send a file to the server"""
    if not os.path.exists(filepath):
        print("[ERROR] File does not exist")
        return

    filesize = os.path.getsize(filepath)
    filename = os.path.basename(filepath)

    header = f"FILE:{filename}:{filesize}".encode()
    sock.sendall(header)

    time.sleep(0.5)

    with open(filepath, "rb") as f:
        while chunk := f.read(BUFFER_SIZE):
            sock.sendall(chunk)

    print(f"[CLIENT] Sent file {filename} ({filesize} bytes)")


def run_client(server_ip, port=5002):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client:
        client.connect((server_ip, port))
        print(f"[CLIENT] Connected to server {server_ip}:{port}")

        threading.Thread(target=receive_messages, args=(client,), daemon=True).start()

        # Interactive input loop
        while True:
            user_input = input("Enter message or file:<path> > ").strip()
            if user_input.startswith("file:"):
                filepath = user_input[5:].strip()
                send_file(client, filepath)
            else:
                client.sendall(user_input.encode())
                print(f"[SENT] {user_input}")


if __name__ == "__main__":
    DEFAULT_NGROK_LINK = "https://4cc4a89bea34.ngrok-free.app"

    if len(sys.argv) >= 2:
        if sys.argv[1] == "--download-helper":
            ngrok_link = sys.argv[2] if len(sys.argv) == 3 else DEFAULT_NGROK_LINK
            download_file(ngrok_link, "helper.py")

        elif sys.argv[1] == "--download-zip":
            ngrok_link = sys.argv[2] if len(sys.argv) == 3 else DEFAULT_NGROK_LINK
            download_file(ngrok_link, "n1.zip")

        else:
            run_client("172.18.237.8")

    else:
        run_client("172.18.237.8")
