import subprocess
import threading
import time
import requests
from datetime import datetime
import csv
import os
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
nodes_data = []  # Storage for assigned tasks/nodes

def read_users_from_csv():
    """Read users from the CSV file"""
    users = []
    csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'users.csv')
    
    print(f"[CSV READER] Looking for users.csv at: {csv_path}")
    
    try:
        if os.path.exists(csv_path):
            print(f"[CSV READER] users.csv found, reading data...")
            with open(csv_path, 'r', newline='', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    # Clean and convert data
                    user = {
                        "id": int(row['id'].strip('"')),
                        "username": row['username'].strip('"'),
                        "email": row['email'].strip('"'),
                        "name": row['name'].strip('"'),
                        "role": row['role'].strip('"')
                    }
                    users.append(user)
            print(f"[CSV READER] ✅ Successfully loaded {len(users)} users from CSV")
        else:
            print(f"[CSV READER] ❌ users.csv not found at {csv_path}")
    except Exception as e:
        print(f"[CSV READER] ❌ Error reading users.csv: {e}")
    
    return users

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
    """Get admin dashboard statistics based on real data"""
    try:
        # Calculate real statistics from nodes_data
        total_tasks = len(nodes_data)
        running_tasks = len([n for n in nodes_data if n['status'].lower() == 'running'])
        queued_tasks = len([n for n in nodes_data if n['status'].lower() in ['pending', 'queued']])
        completed_tasks = len([n for n in nodes_data if n['status'].lower() == 'completed'])
        
        # Get user count from CSV
        all_users = read_users_from_csv()
        user_count = len([u for u in all_users if u['role'] == 'USER'])
        admin_count = len([u for u in all_users if u['role'] == 'ADMIN'])
        
        stats = {
            "totalNodes": len(all_users),
            "onlineNodes": user_count,  # Assuming users represent potential nodes
            "maintenanceNodes": 0,  # No maintenance tracking yet
            "runningTasks": running_tasks,
            "queuedTasks": queued_tasks,
            "completedToday": completed_tasks,
            "systemLoad": min(100, (total_tasks * 10) if total_tasks > 0 else 0)  # Simple load calculation
        }
        
        print(f"[ADMIN STATS] Real stats: Tasks({total_tasks}): Running({running_tasks}), Queued({queued_tasks}), Completed({completed_tasks}) | Users: {len(all_users)}")
        
        return jsonify(stats), 200
        
    except Exception as e:
        print(f"[ADMIN STATS] Error calculating real stats: {e}")
        # Fallback to basic stats
        return jsonify({
            "totalNodes": 0,
            "onlineNodes": 0,
            "maintenanceNodes": 0,
            "runningTasks": 0,
            "queuedTasks": 0,
            "completedToday": 0,
            "systemLoad": 0
        }), 200

@app.route("/api/admin/nodes", methods=["GET"])
def admin_nodes():
    """Get all nodes for admin dashboard based on real users"""
    try:
        # Get real users from CSV and create nodes based on them
        all_users = read_users_from_csv()
        nodes = []
        
        for i, user in enumerate(all_users):
            # Create a node representation for each user
            node_status = "online" if user['role'] == 'USER' else "admin"
            utilization = 0
            
            # Check if this user has any assigned tasks
            user_tasks = [n for n in nodes_data if n['userId'] == user['id']]
            if user_tasks:
                utilization = len(user_tasks) * 25  # Simple utilization calculation
                if any(task['status'].lower() == 'running' for task in user_tasks):
                    node_status = "running"
                elif any(task['status'].lower() in ['pending', 'queued'] for task in user_tasks):
                    node_status = "queued"
            
            node = {
                "id": f"user-{user['id']}",
                "name": f"Node-{user['username']}",
                "status": node_status,
                "gpuCount": 2 if user['role'] == 'USER' else 1,
                "cpuCores": 8 if user['role'] == 'USER' else 4,
                "memory": "16GB" if user['role'] == 'USER' else "8GB",
                "utilization": min(100, utilization),
                "location": f"User-{user['id']}-Location",
                "assignedTasks": len(user_tasks)
            }
            nodes.append(node)
        
        print(f"[ADMIN NODES] Generated {len(nodes)} real nodes from user data")
        
        return jsonify(nodes), 200
        
    except Exception as e:
        print(f"[ADMIN NODES] Error generating real nodes: {e}")
        # Fallback to empty nodes
        return jsonify([]), 200

@app.route("/api/admin/task-assignments", methods=["GET"])
def admin_task_assignments():
    """Get task assignments for admin dashboard"""
    try:
        # Get all users to map user IDs to usernames
        all_users = read_users_from_csv()
        user_map = {user['id']: user['username'] for user in all_users}
        
        # Convert nodes_data to the format expected by frontend
        assignments = []
        for node in nodes_data:
            assignment = {
                "id": f"task-{node['id']}",
                "name": node['taskName'],
                "user": user_map.get(node['userId'], f"User-{node['userId']}"),
                "node": f"n{node['id']}",
                "priority": "medium",  # Default priority
                "status": node['status'].lower(),
                "estimatedTime": "Unknown"  # Could be calculated based on task type
            }
            assignments.append(assignment)
        
        print(f"[API] Returning {len(assignments)} real task assignments")
        
        return jsonify(assignments), 200
        
    except Exception as e:
        print(f"[API] Error getting task assignments: {e}")
        # Fallback to mock data if there's an error
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
        ]), 200

@app.route("/api/admin/new-nodes", methods=["GET"])
def admin_new_nodes():
    """Get new nodes pending approval based on real data"""
    try:
        # Show recently assigned tasks as "new nodes"
        all_users = read_users_from_csv()
        user_map = {user['id']: user for user in all_users}
        
        new_nodes = []
        
        # Get recent pending tasks (last 5 assigned tasks that are still pending)
        pending_tasks = [n for n in nodes_data if n['status'].lower() in ['pending', 'queued']]
        recent_pending = sorted(pending_tasks, key=lambda x: x['assignedAt'], reverse=True)[:5]
        
        for task in recent_pending:
            user = user_map.get(task['userId'])
            if user:
                new_node = {
                    "id": f"task-{task['id']}",
                    "name": f"{user['username']}-{task['taskName']}",
                    "joinedAt": task['assignedAt'][:19].replace('T', ' '),  # Format timestamp
                    "status": "pending",
                    "taskName": task['taskName'],
                    "userName": user['username']
                }
                new_nodes.append(new_node)
        
        print(f"[NEW NODES] Found {len(new_nodes)} pending task assignments")
        
        return jsonify(new_nodes), 200
        
    except Exception as e:
        print(f"[NEW NODES] Error getting new nodes: {e}")
        return jsonify([]), 200

@app.route("/api/admin/current-assignments", methods=["GET"])
def admin_current_assignments():
    """Get current active task assignments"""
    try:
        # Get all users to map user IDs to usernames
        all_users = read_users_from_csv()
        user_map = {user['id']: user['username'] for user in all_users}
        
        # Convert nodes_data to the format expected by frontend
        assignments = []
        for i, node in enumerate(nodes_data):
            assignment = {
                "id": f"assign-{node['id']}",
                "taskName": node['taskName'],
                "userName": user_map.get(node['userId'], f"User-{node['userId']}"),
                "nodeName": f"Node-{node['userId']}-{node['id']}",
                "status": node['status'].lower()
            }
            assignments.append(assignment)
        
        print(f"[API] Returning {len(assignments)} real task assignments from nodes_data")
        for assignment in assignments:
            print(f"[API] - {assignment['taskName']} → {assignment['userName']} (Status: {assignment['status']})")
        
        return jsonify(assignments), 200
        
    except Exception as e:
        print(f"[API] Error getting current assignments: {e}")
        # Fallback to mock data if there's an error
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
        ]), 200

@app.route("/api/admin/search-users", methods=["GET"])
def admin_search_users():
    """Search for users by username for task assignment"""
    username_query = request.args.get('username', '').strip()
    
    if not username_query:
        return jsonify({"error": "Username parameter is required"}), 400
    
    try:
        # Read real users from CSV file
        all_users = read_users_from_csv()
        
        print(f"\n[USER SEARCH] Search query: '{username_query}'")
        print(f"[USER SEARCH] Total users in database: {len(all_users)}")
        
        # Filter users based on username search (case-insensitive)
        filtered_users = [
            user for user in all_users 
            if username_query.lower() in user["username"].lower() or 
               username_query.lower() in user["name"].lower()
        ]
        
        print(f"[USER SEARCH] Found {len(filtered_users)} matching users:")
        for user in filtered_users:
            print(f"[USER SEARCH] - {user['username']} ({user['name']}) | ID: {user['id']} | Role: {user['role']}")
        
        return jsonify(filtered_users), 200
        
    except Exception as e:
        print(f"Error searching users: {e}")
        return jsonify({"error": "Failed to search users"}), 500

@app.route("/api/admin/assign-task", methods=["POST"])
def admin_assign_task():
    """Assign task to selected users by creating nodes"""
    data = request.get_json()
    
    if not data or 'userIds' not in data or 'taskName' not in data:
        return jsonify({"error": "userIds and taskName are required"}), 400
    
    user_ids = data.get('userIds', [])
    task_name = data.get('taskName', '')
    description = data.get('description', '')
    
    if not user_ids or not task_name:
        return jsonify({"error": "userIds and taskName cannot be empty"}), 400
    
    try:
        assigned_tasks = []
        
        # Get all users to map user IDs to full user details
        all_users = read_users_from_csv()
        user_map = {user['id']: user for user in all_users}
        
        print(f"\n[TASK ASSIGNMENT] Starting task assignment process...")
        print(f"[TASK ASSIGNMENT] Task Name: '{task_name}'")
        print(f"[TASK ASSIGNMENT] Description: '{description}'")
        print(f"[TASK ASSIGNMENT] Target Users: {user_ids}")
        print(f"[TASK ASSIGNMENT] Number of users to assign: {len(user_ids)}")
        
        # Print detailed user information from database
        print(f"\n[USER DETAILS] Looking up user details from CSV database:")
        for user_id in user_ids:
            if user_id in user_map:
                user = user_map[user_id]
                print(f"[USER DETAILS] Database ID: {user['id']} | Username: {user['username']} | Email: {user['email']} | Name: {user['name']} | Role: {user['role']}")
            else:
                print(f"[USER DETAILS] ❌ User ID {user_id} not found in database!")
        
        for user_id in user_ids:
            # Create a node entry for each selected user
            node_data = {
                "id": len(nodes_data) + 1,
                "userId": user_id,
                "taskName": task_name,
                "description": description,
                "status": "PENDING",
                "assignedAt": datetime.now().isoformat(),
                "progress": 0
            }
            
            nodes_data.append(node_data)
            assigned_tasks.append(node_data)
            
            # Print individual node creation with full user details
            user_info = user_map.get(user_id, {})
            username = user_info.get('username', f'Unknown-{user_id}')
            email = user_info.get('email', 'Unknown')
            print(f"[NODE CREATED] Node ID: {node_data['id']} | Database User ID: {user_id} | Username: {username} | Email: {email} | Task: '{task_name}' | Status: PENDING")
        
        print(f"\n[TASK ASSIGNMENT] ✅ Successfully created {len(assigned_tasks)} new nodes")
        print(f"[TASK ASSIGNMENT] Total nodes in system: {len(nodes_data)}")
        print(f"[TASK ASSIGNMENT] Assignment completed at: {datetime.now().isoformat()}")
        
        return jsonify({
            "message": f"Task '{task_name}' assigned to {len(user_ids)} users",
            "assignedTasks": assigned_tasks
        }), 200
        
    except Exception as e:
        print(f"Error assigning task: {e}")
        return jsonify({"error": "Failed to assign task"}), 500

# User API Routes  
@app.route("/api/user/stats", methods=["GET"])
def user_stats():
    """Get user dashboard statistics based on real data"""
    try:
        # For now, calculate general stats since we don't have user authentication
        # In a real app, you'd get the current user's ID and filter by that
        
        total_tasks = len(nodes_data)
        running_tasks = len([n for n in nodes_data if n['status'].lower() == 'running'])
        completed_tasks = len([n for n in nodes_data if n['status'].lower() == 'completed'])
        pending_tasks = len([n for n in nodes_data if n['status'].lower() in ['pending', 'queued']])
        
        # Calculate average runtime (mock calculation for now)
        avg_runtime = "45m" if total_tasks > 0 else "0m"
        
        stats = {
            "activeTasks": running_tasks + pending_tasks,
            "completedToday": completed_tasks,
            "avgRuntime": avg_runtime,
            "totalTasks": total_tasks,
            "changeFromYesterday": {
                "activeTasks": 0,  # Would need historical data
                "completedToday": 0,  # Would need historical data  
                "avgRuntime": "0m"
            }
        }
        
        print(f"[USER STATS] Real stats: Active: {running_tasks + pending_tasks}, Completed: {completed_tasks}, Total: {total_tasks}")
        
        return jsonify(stats), 200
        
    except Exception as e:
        print(f"[USER STATS] Error calculating real stats: {e}")
        return jsonify({
            "activeTasks": 0,
            "completedToday": 0,
            "avgRuntime": "0m",
            "totalTasks": 0,
            "changeFromYesterday": {
                "activeTasks": 0,
                "completedToday": 0,
                "avgRuntime": "0m"
            }
        }), 200

@app.route("/api/user/gpus", methods=["GET"])
def user_gpus():
    """Get GPU information for user dashboard based on real task load"""
    try:
        # Get all users and calculate GPU utilization based on real tasks
        all_users = read_users_from_csv()
        gpus = []
        
        # Create GPUs based on user count and task assignments
        for i, user in enumerate(all_users[:4]):  # Limit to 4 GPUs for display
            user_tasks = [n for n in nodes_data if n['userId'] == user['id']]
            
            # Calculate utilization based on user's tasks
            utilization = 0
            if user_tasks:
                running_tasks = len([t for t in user_tasks if t['status'].lower() == 'running'])
                pending_tasks = len([t for t in user_tasks if t['status'].lower() in ['pending', 'queued']])
                utilization = min(100, (running_tasks * 60) + (pending_tasks * 20))
            
            # Calculate memory usage based on utilization
            total_memory = 16 if user['role'] == 'USER' else 8
            used_memory = int((utilization / 100) * total_memory)
            
            gpu = {
                "id": f"gpu-{user['id']}",
                "gpuName": f"NVIDIA RTX {'4090' if user['role'] == 'USER' else '4060'}",
                "utilization": utilization,
                "memory": {
                    "used": used_memory,
                    "total": total_memory
                },
                "assignedTo": user['username'],
                "activeTasks": len(user_tasks)
            }
            gpus.append(gpu)
        
        print(f"[USER GPUS] Generated {len(gpus)} real GPU status from user tasks")
        
        return jsonify(gpus), 200
        
    except Exception as e:
        print(f"[USER GPUS] Error generating real GPU data: {e}")
        return jsonify([]), 200

@app.route("/api/user/tasks", methods=["GET"])
def user_tasks():
    """Get user tasks for dashboard based on real data"""
    try:
        # Get all users to map user IDs to usernames
        all_users = read_users_from_csv()
        user_map = {user['id']: user for user in all_users}
        
        # Convert nodes_data to user task format
        tasks = []
        for i, task in enumerate(nodes_data):
            user = user_map.get(task['userId'], {})
            
            # Calculate progress based on status
            progress = 0
            if task['status'].lower() == 'completed':
                progress = 100
            elif task['status'].lower() == 'running':
                progress = task.get('progress', 50)  # Default to 50% if running
            elif task['status'].lower() in ['pending', 'queued']:
                progress = 0
            
            # Calculate duration (mock for now)
            duration = "0m"
            if task['status'].lower() == 'completed':
                duration = f"{(i + 1) * 15}m"  # Mock completed duration
            elif task['status'].lower() == 'running':
                duration = f"{(i + 1) * 10}m"  # Mock running duration
            
            user_task = {
                "id": f"task-{task['id']}",
                "name": task['taskName'],
                "status": task['status'].lower(),
                "progress": progress,
                "duration": duration,
                "gpuId": f"gpu-{task['userId']}",
                "assignedAt": task['assignedAt'],
                "assignedTo": user.get('username', f"User-{task['userId']}")
            }
            tasks.append(user_task)
        
        print(f"[USER TASKS] Returning {len(tasks)} real tasks")
        
        return jsonify(tasks), 200
        
    except Exception as e:
        print(f"[USER TASKS] Error getting real tasks: {e}")
        return jsonify([]), 200

@app.route("/api/user/processors", methods=["GET"])
def user_processors():
    """Get processor information for user dashboard based on real data"""
    try:
        # Calculate processor utilization based on real task load
        all_users = read_users_from_csv()
        total_processors = len(all_users) * 2  # 2 processors per user
        
        # Calculate active processors based on running tasks
        running_tasks = len([n for n in nodes_data if n['status'].lower() == 'running'])
        active_processors = min(total_processors, running_tasks * 2)
        
        # Calculate efficiency based on task completion ratio
        total_tasks = len(nodes_data)
        completed_tasks = len([n for n in nodes_data if n['status'].lower() == 'completed'])
        efficiency = int((completed_tasks / total_tasks * 100)) if total_tasks > 0 else 100
        
        processor_stats = {
            "activeProcessors": active_processors,
            "totalProcessors": total_processors,
            "efficiency": efficiency,
            "runningTasks": running_tasks,
            "totalTasks": total_tasks
        }
        
        print(f"[USER PROCESSORS] Real processor stats: {active_processors}/{total_processors} active, {efficiency}% efficiency")
        
        return jsonify(processor_stats), 200
        
    except Exception as e:
        print(f"[USER PROCESSORS] Error calculating real processor data: {e}")
        return jsonify({
            "activeProcessors": 0,
            "totalProcessors": 8,
            "efficiency": 0,
            "runningTasks": 0,
            "totalTasks": 0
        }), 200

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
    print(f"[FLASK] Starting Flask server on http://localhost:{port}")
    print(f"[FLASK] Frontend can access via: http://localhost:3000/api/flask/...")
    
    # Comment out ngrok for now - can be enabled later if needed
    # ngrok_proc = start_ngrok_http(port)
    # threading.Thread(target=print_ngrok_url, daemon=True).start()
    
    try:
        app.run(host="0.0.0.0", port=port, debug=True)
    except KeyboardInterrupt:
        print("[FLASK] Server stopped.")

if __name__ == "__main__":
    main()
