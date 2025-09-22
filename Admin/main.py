import subprocess
import threading
import time
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
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

# Configure CORS to allow requests from Next.js frontend (port 3000)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

# ====== FRONTEND API ROUTES ======
# These routes provide data for the Next.js dashboard components

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint for frontend monitoring"""
    return jsonify({
        "status": "healthy",
        "timestamp": time.ctime(),
        "service": "Flask Backend"
    })

@app.route("/api/status", methods=["GET"])
def system_status():
    """System status endpoint for frontend monitoring"""
    return jsonify({
        "backend": "online",
        "database": "online",
        "services": [
            {"name": "Node Manager", "status": "online"},
            {"name": "Task Processor", "status": "online"},
            {"name": "File Handler", "status": "online"}
        ]
    })

# Admin API Routes
@app.route("/api/admin/stats", methods=["GET"])
def admin_stats():
    """Get admin dashboard statistics"""
    # Mock data - replace with actual logic if needed
    return jsonify({
        "totalNodes": len(received_nodes) if received_nodes else 3,
        "onlineNodes": len([n for n in received_nodes if n]) if received_nodes else 2,
        "maintenanceNodes": 1,
        "runningTasks": 5,
        "queuedTasks": 3,
        "completedToday": 12,
        "systemLoad": 67
    })

@app.route("/api/admin/nodes", methods=["GET"])
def admin_nodes():
    """Get all nodes for admin dashboard"""
    # Mock data based on received_nodes - replace with actual logic if needed
    nodes = []
    if received_nodes:
        for i, node_id in enumerate(received_nodes):
            nodes.append({
                "id": node_id,
                "name": f"Node-{node_id}",
                "status": "online" if i < 2 else "maintenance",
                "gpuCount": 4,
                "cpuCores": 16,
                "memory": "32GB",
                "utilization": 45 + (i * 15),
                "location": f"Datacenter-{i+1}"
            })
    else:
        # Default mock nodes when no received_nodes
        nodes = [
            {
                "id": "n1",
                "name": "Node-GPU-01",
                "status": "online",
                "gpuCount": 4,
                "cpuCores": 16,
                "memory": "64GB",
                "utilization": 75,
                "location": "Datacenter-A"
            },
            {
                "id": "n2", 
                "name": "Node-GPU-02",
                "status": "online",
                "gpuCores": 8,
                "cpuCores": 32,
                "memory": "128GB",
                "utilization": 60,
                "location": "Datacenter-B"
            }
        ]
    return jsonify(nodes)

@app.route("/api/admin/task-assignments", methods=["GET"])
def admin_task_assignments():
    """Get task assignments for admin dashboard"""
    # Mock data - replace with actual logic if needed
    return jsonify([
        {
            "id": "task-1",
            "name": "ML Model Training",
            "user": "user1",
            "node": "n1",
            "priority": "high",
            "status": "running",
            "estimatedTime": "2h 30m"
        },
        {
            "id": "task-2",
            "name": "Data Processing",
            "user": "user2", 
            "node": "n2",
            "priority": "medium",
            "status": "queued",
            "estimatedTime": "1h 15m"
        }
    ])

@app.route("/api/admin/new-nodes", methods=["GET"])
def admin_new_nodes():
    """Get new nodes pending approval"""
    # Mock data - replace with actual logic if needed
    return jsonify([
        {
            "id": "n3",
            "name": "Node-GPU-03",
            "joinedAt": "2 hours ago",
            "status": "pending"
        }
    ])

@app.route("/api/admin/current-assignments", methods=["GET"])
def admin_current_assignments():
    """Get current active task assignments"""
    # Mock data - replace with actual logic if needed
    return jsonify([
        {
            "id": "assign-1",
            "taskName": "Neural Network Training",
            "userName": "alice",
            "nodeName": "Node-GPU-01",
            "status": "running"
        },
        {
            "id": "assign-2",
            "taskName": "Image Processing",
            "userName": "bob",
            "nodeName": "Node-GPU-02", 
            "status": "queued"
        }
    ])

# User API Routes  
@app.route("/api/user/stats", methods=["GET"])
def user_stats():
    """Get user dashboard statistics"""
    # Mock data - replace with actual logic if needed
    return jsonify({
        "activeTasks": 3,
        "completedToday": 7,
        "avgRuntime": "1h 45m",
        "changeFromYesterday": {
            "activeTasks": 1,
            "completedToday": 2,
            "avgRuntime": "15m"
        }
    })

@app.route("/api/user/gpus", methods=["GET"])
def user_gpus():
    """Get GPU information for user dashboard"""
    # Mock data - replace with actual logic if needed
    return jsonify([
        {
            "id": "gpu-1",
            "gpuName": "NVIDIA RTX 4090",
            "utilization": 78,
            "memory": {
                "used": 12,
                "total": 24
            }
        },
        {
            "id": "gpu-2",
            "gpuName": "NVIDIA RTX 4080",
            "utilization": 45,
            "memory": {
                "used": 6,
                "total": 16
            }
        }
    ])

@app.route("/api/user/tasks", methods=["GET"])
def user_tasks():
    """Get user tasks for dashboard"""
    # Mock data - replace with actual logic if needed
    return jsonify([
        {
            "id": "task-user-1",
            "name": "Image Classification",
            "status": "running",
            "progress": 75,
            "duration": "1h 22m",
            "gpuId": "gpu-1"
        },
        {
            "id": "task-user-2",
            "name": "Data Analysis",
            "status": "completed",
            "progress": 100,
            "duration": "45m",
            "gpuId": "gpu-2"
        },
        {
            "id": "task-user-3",
            "name": "Model Optimization",
            "status": "pending",
            "progress": 0,
            "duration": "0m",
            "gpuId": ""
        }
    ])

@app.route("/api/user/processors", methods=["GET"])
def user_processors():
    """Get processor information for user dashboard"""
    # Mock data - replace with actual logic if needed
    return jsonify({
        "activeProcessors": 6,
        "totalProcessors": 8,
        "efficiency": 87
    })

# Node Management API Routes (integrating existing functionality)
@app.route("/api/admin/submit-nodes", methods=["POST"])
def submit_nodes():
    """Submit active node IDs for task distribution - integrates existing get_node functionality"""
    data = request.get_json()
    if not data or "nodes" not in data:
        return jsonify({"error": "No nodes provided"}), 400
    
    nodes = data["nodes"]
    if not isinstance(nodes, list):
        return jsonify({"error": "nodes should be a list"}), 400
    
    global received_nodes
    received_nodes = nodes

    number_of_active_nodes = len(received_nodes)
    
    try:
        # Use existing backend logic
        DataSplit(input_source="mydata", output_source="temp_input", Objtype=1, chunks=number_of_active_nodes)

        for i in range(len(received_nodes)):
            CreateZip(f"temp_input/chunk_{i+1}.txt","mycmd", received_nodes[i], allcommands=allc)

        print("Zip completed")
        print(f"Received nodes from frontend: {received_nodes}")
        
        return jsonify({
            "message": "Nodes processed successfully", 
            "nodes": received_nodes,
            "chunks_created": number_of_active_nodes
        }), 200
        
    except Exception as e:
        print(f"Error processing nodes: {e}")
        return jsonify({"error": f"Failed to process nodes: {str(e)}"}), 500

# ====== EXISTING ROUTES ======

@app.route("/api/receivedd", methods=["POST"])
def receive_file():
    """File upload endpoint - existing functionality"""
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    os.makedirs("receivedd", exist_ok=True)
    save_path = os.path.join("receivedd", file.filename)
    file.save(save_path)
    return jsonify({"message": f"File saved to {save_path}"}), 200

@app.route("/get_node", methods=["POST"])
def get_node_legacy():
    """Legacy endpoint - kept for backward compatibility"""
    return get_node_internal()

def get_node_internal():
    """Internal function for node processing logic"""
    data = request.get_json()
    if not data or "nodes" not in data:
        return jsonify({"error": "No nodes provided"}), 400
    
    nodes = data["nodes"]
    if not isinstance(nodes, list):
        return jsonify({"error": "nodes should be a list"}), 400
    
    global received_nodes
    received_nodes = nodes

    number_of_active_nodes = len(received_nodes)
    DataSplit(input_source="mydata", output_source="temp_input", Objtype=1, chunks=number_of_active_nodes)

    for i in range(len(received_nodes)):
        CreateZip(f"temp_input/chunk_{i+1}.txt","mycmd", received_nodes[i], allcommands=allc)

    print("Zip completed")
    print(f"Received nodes from frontend:")
    return jsonify({"message": "Nodes received", "nodes": received_nodes}), 200

@app.route("/api/get_ngrok_url", methods=["GET"])
def get_ngrok_url():
    """Get the ngrok public URL"""
    if ngrok_url:
        return jsonify({"ngrok_url": ngrok_url}), 200
    else:
        return jsonify({"error": "Ngrok URL not available yet. Try again later."}), 503


def start_ngrok_http(port=5000):
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
    port = 5000  # Changed from 8000 to 5000 for frontend integration
    ngrok_proc = start_ngrok_http(port)
    threading.Thread(target=print_ngrok_url, daemon=True).start()
    try:
        print(f"[FLASK] Starting Flask server on http://localhost:{port}")
        print(f"[FLASK] Frontend can access via: http://localhost:3000/api/flask/...")
        app.run(host="0.0.0.0", port=port, debug=True)
    finally:
        ngrok_proc.terminate()
        print("[NGROK] Tunnel closed.")

if __name__ == "__main__":
    main()
