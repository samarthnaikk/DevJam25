import subprocess
import threading
import time
import http.server
import socketserver
from userside import *

allc = [
    {
        "description": "Train QA model on chunked text",
        "command": "source venv/bin/activate && python main.py"
    }
]

CreateZip("mydata","mycmd","n1",allcommands=allc)

def start_ngrok_http(port=8000):
    ngrok_cmd = ["ngrok", "http", str(port)]
    print(f"[NGROK] Starting ngrok HTTP tunnel on port {port} ...")
    ngrok_proc = subprocess.Popen(ngrok_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return ngrok_proc

def print_ngrok_url():
    import requests
    url = None
    for _ in range(40):  # Wait up to 40 seconds
        try:
            resp = requests.get("http://localhost:4040/api/tunnels")
            tunnels = resp.json()["tunnels"]
            for t in tunnels:
                if t["proto"] == "https":
                    url = t["public_url"]
                    break
            if url:
                break
        except Exception:
            pass
        time.sleep(1)
    if url:
        print(f"[NGROK] Public URL: {url}")
    else:
        print("[NGROK] Could not get public URL. Is ngrok running?")

def start_http_server(port=8000):
    Handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", port), Handler) as httpd:
        print(f"[HTTP] Serving at port {port}")
        httpd.serve_forever()

def main():
    port = 8000
    ngrok_proc = start_ngrok_http(port)
    threading.Thread(target=print_ngrok_url, daemon=True).start()
    try:
        start_http_server(port)
    finally:
        ngrok_proc.terminate()
        print("[NGROK] Tunnel closed.")

if __name__ == "__main__":
    main()
