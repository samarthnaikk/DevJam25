# Dynamic Dashboard Integration - Frontend & Backend

This document describes the implementation of dynamic dashboards that connect the Next.js frontend (`frontendux` branch) with the Flask backend (`backend` branch) through API proxy routes.

## 🎯 Implementation Overview

### ✅ Completed Features

1. **API Proxy Infrastructure** - Next.js routes that forward requests to Flask backend
2. **Dynamic Admin Dashboard** - Real-time data from backend APIs
3. **Dynamic User Dashboard** - Live updates from backend services
4. **Scrollable Data Views** - Auto-scrolling for large datasets
5. **Error Handling & Loading States** - Robust UX with proper feedback

## 🔧 Technical Architecture

### API Proxy System

**Location**: `/app/api/flask/[...path]/route.ts`

This dynamic route handles all HTTP methods (GET, POST, PUT, DELETE) and forwards them to the Flask backend:

```
Frontend Request: /api/flask/admin/stats
↓
Proxy Route: /app/api/flask/[...path]/route.ts
↓
Backend Request: ${BACKEND_URL}/api/admin/stats
↓
Response forwarded back to frontend
```

**Environment Variable**: `BACKEND_URL=http://localhost:5000` (in `.env.local`)

### API Utilities

**Location**: `/lib/api/backend.ts`

Provides typed API functions for:

- **Admin APIs**: stats, nodes, task assignments, new nodes, current assignments
- **User APIs**: stats, GPUs, tasks, processors
- **General APIs**: health check, system status

**Location**: `/lib/api/hooks.ts`

Custom React hooks for data fetching:

- `useApi<T>()` - Single API call with loading/error states
- `useMultipleApi<T>()` - Multiple parallel API calls
- Auto-refresh functionality
- Error boundary handling

## 📊 Dashboard Implementations

### Admin Dashboard (`/admin`)

**Dynamic Data Sources**:

- **Stats Overview**: Total nodes, running tasks, system load
- **Task Assignments**: Real-time task allocation with user/node mapping
- **New Nodes**: Recently joined nodes with status tracking
- **Current Assignments**: Active task→user→node relationships

**API Endpoints Used**:

```typescript
adminApi.getStats(); // /api/flask/admin/stats
adminApi.getNodes(); // /api/flask/admin/nodes
adminApi.getTaskAssignments(); // /api/flask/admin/task-assignments
adminApi.getNewNodes(); // /api/flask/admin/new-nodes
adminApi.getCurrentAssignments(); // /api/flask/admin/current-assignments
```

**Features**:

- ✅ Real-time refresh every 30 seconds
- ✅ Manual refresh button
- ✅ Loading states for each section
- ✅ Error handling with retry capability
- ✅ Scrollable task lists (max 96 viewport height)
- ✅ Responsive grid layout

### User Dashboard (`/dashboard`)

**Dynamic Data Sources**:

- **Stats Cards**: Active tasks, completed today, average runtime
- **GPU Information**: Real-time GPU utilization and memory usage
- **Task List**: Recent tasks with status and progress

**API Endpoints Used**:

```typescript
userApi.getStats(); // /api/flask/user/stats
userApi.getGPUs(); // /api/flask/user/gpus
userApi.getTasks(); // /api/flask/user/tasks
userApi.getProcessors(); // /api/flask/user/processors
```

**Features**:

- ✅ Real-time refresh every 15 seconds (faster for user activity)
- ✅ Manual refresh button
- ✅ Loading states and error boundaries
- ✅ Scrollable task list (max 96 viewport height)
- ✅ Dynamic GPU cards based on available hardware

## 🎨 UX Enhancements

### Loading States

```tsx
{
  apiLoading && (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
    </div>
  );
}
```

### Error States

```tsx
{
  errors.stats && !apiLoading && (
    <div className="p-4 bg-red-400/20 border border-red-400/30 rounded-lg text-red-400 text-sm">
      Failed to load stats: {errors.stats}
    </div>
  );
}
```

### Scrollable Content

```tsx
<div className="max-h-96 overflow-y-auto pr-2">{/* Scrollable content */}</div>
```

### Auto-Refresh

- **Admin Dashboard**: 30-second intervals
- **User Dashboard**: 15-second intervals
- **Manual Refresh**: Button with loading spinner

## 🔄 Data Flow

```
1. Component Mount
   ↓
2. useMultipleApi Hook
   ↓
3. Parallel API Calls
   ↓
4. Proxy Routes (/api/flask/...)
   ↓
5. Flask Backend (backend branch)
   ↓
6. Response Processing
   ↓
7. State Updates
   ↓
8. UI Re-render
   ↓
9. Auto-refresh Timer
```

## 🚀 Usage Instructions

### 1. Environment Setup

Add to `.env.local`:

```bash
BACKEND_URL=http://localhost:5000
```

### 2. Start Services

**Backend (Flask)**:

```bash
# Switch to backend branch
git checkout backend
# Start Flask server (typically on port 5000)
python app.py
```

**Frontend (Next.js)**:

```bash
# Switch to frontend branch
git checkout frontendux
# Start Next.js dev server
npm run dev
# Or
pnpm dev
```

### 3. Access Dashboards

- **Admin Dashboard**: http://localhost:3000/admin
- **User Dashboard**: http://localhost:3000/dashboard

## 🧪 Testing

### API Integration Test

```bash
npx ts-node test-api-integration.ts
```

### Browser Testing

1. Open browser developer tools
2. Navigate to dashboard
3. Check Network tab for API calls
4. Verify Console logs for proxy requests

### Expected API Endpoints (Flask Backend)

The backend should implement these endpoints:

**Admin Endpoints**:

- `GET /api/admin/stats` - Dashboard overview statistics
- `GET /api/admin/nodes` - List of compute nodes
- `GET /api/admin/task-assignments` - Task assignment data
- `GET /api/admin/new-nodes` - Recently joined nodes
- `GET /api/admin/current-assignments` - Active assignments

**User Endpoints**:

- `GET /api/user/stats` - User dashboard statistics
- `GET /api/user/gpus` - GPU information
- `GET /api/user/tasks` - User's tasks
- `GET /api/user/processors` - Processor information

**General Endpoints**:

- `GET /api/health` - Health check
- `GET /api/status` - System status

## 📋 Expected Data Formats

### Admin Stats Response

```json
{
  "totalNodes": 5,
  "onlineNodes": 4,
  "maintenanceNodes": 1,
  "runningTasks": 12,
  "queuedTasks": 3,
  "completedToday": 45,
  "systemLoad": 67
}
```

### User Stats Response

```json
{
  "activeTasks": 3,
  "completedToday": 12,
  "avgRuntime": "2.4h",
  "changeFromYesterday": {
    "activeTasks": 2,
    "completedToday": 4,
    "avgRuntime": "-0.3h"
  }
}
```

### GPU Data Response

```json
[
  {
    "id": "gpu-0",
    "gpuName": "NVIDIA RTX 4090",
    "utilization": 78,
    "memory": {
      "used": 18,
      "total": 24
    }
  }
]
```

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Errors**: The proxy routes handle CORS automatically
2. **Backend Not Running**: Check `BACKEND_URL` and Flask server status
3. **API Timeout**: Increase fetch timeout in proxy routes if needed
4. **Data Not Loading**: Check browser Network tab for failed requests

### Debug Logs

The proxy routes log all requests:

```
[PROXY] GET http://localhost:5000/api/admin/stats
[PROXY] Backend error: 500 Internal Server Error
```

### Error Recovery

- **Automatic**: Components show error messages with retry options
- **Manual**: Use refresh buttons to retry failed requests
- **Fallback**: Empty states when no data is available

## 🔄 Future Enhancements

- **Real-time WebSocket Integration**: Live updates without polling
- **Caching Layer**: Redis/memory cache for frequently accessed data
- **Pagination**: For large datasets in tables
- **Filtering/Search**: Advanced data filtering capabilities
- **Export Functions**: CSV/JSON export for dashboard data

---

**Status**: ✅ Implementation Complete
**Branch**: `frontendux` (Frontend) + `backend` (Flask API)
**Last Updated**: September 22, 2025
