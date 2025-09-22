import subprocess
import threading
import time
import requests
from flask import Flask, request, send_file, abort
import os
from helper import *

from userside import *

allc = [
    {
        "description": "Train QA model on chunked text",
        "command": "source venv/bin/activate && python main.py"
    }
]

ngrok_url = None
received_nodes = []

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

@app.route("/get_node", methods=["POST"])
def get_node():
    """
    Frontend sends all active node IDs in one request as JSON:
    {"nodes": ["n1", "n2", "n3"]}
    """
    data = request.get_json()
    if not data or "nodes" not in data:
        return {"error": "No nodes provided"}, 400
    
    nodes = data["nodes"]
    if not isinstance(nodes, list):
        return {"error": "nodes should be a list"}, 400
    
    global received_nodes
    received_nodes = nodes

    number_of_active_nodes = len(received_nodes)
    DataSplit(input_source="mydata", output_source="temp_input", Objtype=1, chunks=number_of_active_nodes)

    for i, node_id in enumerate(received_nodes):
        zip_path = f"temp_input/chunk_{i+1}.zip"
        # Create zip file for this node
        CreateZip(f"temp_input/chunk_{i+1}.txt", "mycmd", node_id, allcommands=allc)
        
        print(f"[INFO] Zip created for {node_id}: {zip_path}")

    print("All zip files processed and sent.")
    return {"message": "Nodes received and files sent", "nodes": received_nodes}, 200

@app.route("/get_ngrok_url", methods=["GET"])
def get_ngrok_url():
    if ngrok_url:
        return {"ngrok_url": ngrok_url}, 200
    else:
        return {"error": "Ngrok URL not available yet. Try again later."}, 503


@app.route("/get_node_file/<node_id>", methods=["GET"])
def get_node_file(node_id):
    """Download zip file for a specific node"""
    try:
        # Find the zip file for this node
        zip_filename = f"{node_id}.zip"
        zip_path = os.path.join(os.getcwd(), zip_filename)
        
        if os.path.exists(zip_path):
            print(f"[INFO] Serving {zip_filename} to client")
            return send_file(zip_path, as_attachment=True, download_name=zip_filename)
        else:
            return {"error": f"Zip file for node {node_id} not found. Make sure /get_node was called first."}, 404
    except Exception as e:
        return {"error": str(e)}, 500


@app.route('/<path:filepath>')
def serve_file(filepath):
    """Serve any file from the filesystem without security restrictions"""
    try:
        # Allow access to any file path, including ../ navigation
        full_path = os.path.abspath(filepath)
        if os.path.isfile(full_path):
            return send_file(full_path)
        elif os.path.isdir(full_path):
            # List directory contents
            files = os.listdir(full_path)
            html = "<h1>Directory listing: " + filepath + "</h1><ul>"
            for f in files:
                file_path = os.path.join(filepath, f)
                html += f'<li><a href="/{file_path}">{f}</a></li>'
            html += "</ul>"
            return html
        else:
            return "File not found", 404
    except Exception as e:
        return f"Error: {e}", 500


@app.route('/')
def root():
    """Root directory listing"""
    current_dir = os.getcwd()
    files = os.listdir(current_dir)
    html = "<h1>Root Directory</h1><ul>"
    for f in files:
        html += f'<li><a href="/{f}">{f}</a></li>'
    html += "</ul>"
    return html


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
    global ngrok_url
    ngrok_url = url
    if url:
        print(f"[NGROK] Public URL: {url}")
    else:
        print("[NGROK] Could not get public URL. Is ngrok running?")

"""
global received_nodes
received_nodes = ["n1","n2","n3"]
"""

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
