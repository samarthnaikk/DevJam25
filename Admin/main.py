import subprocess
import threading
import time
import requests
from flask import Flask, request
import os

from userside import *

allc = [
    {
        "description": "Train QA model on chunked text",
        "command": "source venv/bin/activate && python main.py"
    }
]

CreateZip("mydata", "mycmd", "n1", allcommands=allc)

app = Flask(__name__)

@app.route("/receivedd", methods=["POST"])
def receive_file():
    if "file" not in request.files:
        return "No file part", 400
    file = request.files["file"]
    if file.filename == "":
        return "No selected file", 400
    os.makedirs("receivedd", exist_ok=True)
    save_path = os.path.join("receivedd", file.filename)
    file.save(save_path)
    return f"File saved to {save_path}", 200

def start_ngrok_http(port=8000):
    ngrok_cmd = ["ngrok", "http", str(port)]
    print(f"[NGROK] Starting ngrok HTTP tunnel on port {port} ...")
    return subprocess.Popen(ngrok_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

def print_ngrok_url():
    url = None
    for _ in range(40):  # wait up to 40s
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

def main():
    port = 8000
    ngrok_proc = start_ngrok_http(port)
    threading.Thread(target=print_ngrok_url, daemon=True).start()
    try:
        app.run(host="0.0.0.0", port=port)
    finally:
        ngrok_proc.terminate()
        print("[NGROK] Tunnel closed.")

if __name__ == "__main__":
    main()
