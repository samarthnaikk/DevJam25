# Frontend-Backend Integration Guide

## Overview

This project integrates a **Next.js frontend** (running on port 3000) with a **Flask backend** (running on port 5000). The integration is designed to be minimal and non-intrusive to existing functionality.

## Architecture

```
Frontend (Next.js) ←→ API Proxy ←→ Backend (Flask)
     :3000              /api/flask/*        :5000
```

- **Frontend**: Complete Next.js project with authentication handled entirely by Next.js
- **Backend**: Python Flask project located at `Admin/main.py`
- **Proxy**: Next.js API route at `/api/flask/[...path]` forwards requests to Flask backend

## Setup Instructions

### 1. Backend Setup (Flask)

1. **Install Python dependencies** (including the new Flask-CORS requirement):

   ```bash
   cd Admin
   pip install -r ../requirements.txt
   ```

2. **Start the Flask backend**:

   ```bash
   cd Admin
   python main.py
   ```

   The backend will:

   - Start on port 5000 (changed from 8000)
   - Enable CORS for localhost:3000
   - Start ngrok tunnel (optional)
   - Display startup messages

### 2. Frontend Setup (Next.js)

1. **Install Node.js dependencies**:

   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Start the development server**:

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

   The frontend will start on port 3000.

### 3. Running Both Together

1. **Start Backend first**:

   ```bash
   cd Admin
   python main.py
   ```

2. **In a new terminal, start Frontend**:

   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api/\*
   - Frontend API calls: http://localhost:3000/api/flask/\*

## New Backend API Routes

The following API routes have been added to support the frontend dashboards:

### Health & Status

- `GET /api/health` - Health check
- `GET /api/status` - System status

### Admin Dashboard APIs

- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/nodes` - All compute nodes
- `GET /api/admin/task-assignments` - Task assignments
- `GET /api/admin/new-nodes` - New nodes pending approval
- `GET /api/admin/current-assignments` - Current active assignments
- `POST /api/admin/submit-nodes` - Submit active nodes for task distribution

### User Dashboard APIs

- `GET /api/user/stats` - User dashboard statistics
- `GET /api/user/gpus` - GPU information
- `GET /api/user/tasks` - User tasks
- `GET /api/user/processors` - Processor information

### Legacy Routes (maintained for backward compatibility)

- `POST /get_node` - Original node submission endpoint
- `POST /api/receivedd` - File upload (now with /api prefix)
- `GET /api/get_ngrok_url` - Get ngrok public URL

## Frontend Integration Points

### Admin Dashboard (`/admin`)

- Displays real-time statistics from backend
- Shows node management interface
- Includes node submission functionality
- Task assignment monitoring

### User Dashboard (`/dashboard`)

- GPU statistics and monitoring
- Task progress tracking
- System performance metrics

### Node Submission Component

- Interactive form to submit active node IDs
- Integrates with existing backend `DataSplit` and `CreateZip` functionality
- Real-time feedback and status updates

## Key Features

1. **CORS Configuration**: Flask backend configured to accept requests from Next.js frontend
2. **API Proxy**: All backend calls routed through `/api/flask/*` for seamless integration
3. **Error Handling**: Comprehensive error handling for API failures
4. **Real-time Updates**: Dashboard components refresh automatically
5. **Non-intrusive**: Existing backend logic unchanged, only added API endpoints

## Environment Variables

You can customize the backend URL by setting:

```bash
# .env.local (for Next.js)
BACKEND_URL=http://localhost:5000
```

## Troubleshooting

### Backend not responding

1. Check if Flask server is running on port 5000
2. Verify CORS is enabled for localhost:3000
3. Check console for network errors

### Frontend API errors

1. Ensure backend is running first
2. Check if proxy route is correctly forwarding requests
3. Verify API endpoints are returning expected data format

### Node submission not working

1. Check if `mydata` directory exists in backend
2. Verify `mycmd` directory contains required files
3. Check backend logs for DataSplit and CreateZip errors

## Development Notes

- **Authentication**: Handled entirely by Next.js, no backend changes required
- **Design**: Frontend design and styles remain unchanged
- **Backend Logic**: No modification to existing data processing logic
- **Minimal Changes**: Only added API routes and CORS configuration

## Production Deployment

For production deployment:

1. Set `BACKEND_URL` environment variable to production Flask server URL
2. Configure CORS origins in Flask to include production frontend domain
3. Run Flask with production WSGI server (e.g., Gunicorn)
4. Build and deploy Next.js application with correct backend URL

```bash
# Production Flask
gunicorn -w 4 -b 0.0.0.0:5000 Admin.main:app

# Production Next.js
npm run build
npm start
```
