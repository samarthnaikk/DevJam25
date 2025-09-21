import socket
import threading
import time
from core import GetIP

def receive_messages(sock):
    """Thread to constantly receive messages from server"""
    while True:
        try:
            data = sock.recv(1024)
            if not data:
                break
            print(f"[SERVER] {data.decode()}")
        except:
            break

def run_client(server_ip, port=5002):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client:
        client.connect((server_ip, port))
        print(f"[CLIENT] Connected to server {server_ip}:{port}")
        threading.Thread(target=receive_messages, args=(client,), daemon=True).start()
        count = 1
        while True:
            message = f"Client message {count}"
            client.sendall(message.encode())
            print(f"[SENT] {message}")
            count += 1
            time.sleep(2)

if __name__ == "__main__":
    # Example server IP, replace with actual server IP in the same network
    run_client("172.18.237.8")

