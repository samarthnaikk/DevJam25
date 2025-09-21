import socket
from core import GetIP

def run_server(port=5002):
    host = GetIP()  # get this machine's LAN IP
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
        server.bind((host, port))
        server.listen(1)
        print(f"[SERVER] Listening on {host}:{port} ...")

        conn, addr = server.accept()
        with conn:
            print(f"[SERVER] Connected by {addr}")
            data = conn.recv(1024).decode()
            print(f"[SERVER] Received: {data}")

            reply = "Message received!"
            conn.sendall(reply.encode())

if __name__ == "__main__":
    run_server()
