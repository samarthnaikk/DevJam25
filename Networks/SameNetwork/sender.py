import socket
from core import GetIP

def run_client(server_ip, port=5002, message="Hello from client!"):
    my_ip = GetIP()
    print(f"[CLIENT] My IP is {my_ip}")

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client:
        client.connect((server_ip, port))
        client.sendall(message.encode())

        reply = client.recv(1024).decode()
        print(f"[CLIENT] Server replied: {reply}")

if __name__ == "__main__":
    # change the IP below to the server machine’s IP
    run_client("10.164.119.168")
