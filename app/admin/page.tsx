"use client";

import { useAuthContext } from "@/components/auth-provider";
import { SessionManager } from "@/lib/client/session";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Settings, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Mock data for demo
const mockNodes = [
  {
    id: "1",
    name: "GPU-Node-01",
    status: "online" as const,
    gpuCount: 4,
    cpuCores: 32,
    memory: "128GB",
    utilization: 78,
    location: "Datacenter A",
  },
  {
    id: "2",
    name: "GPU-Node-02",
    status: "online" as const,
    gpuCount: 2,
    cpuCores: 16,
    memory: "64GB",
    utilization: 45,
    location: "Datacenter A",
  },
  {
    id: "3",
    name: "GPU-Node-03",
    status: "maintenance" as const,
    gpuCount: 8,
    cpuCores: 64,
    memory: "256GB",
    utilization: 0,
    location: "Datacenter B",
  },
];

const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "user" as const,
    status: "active" as const,
    lastActive: "2 hours ago",
    tasksCompleted: 15,
    tasksRunning: 2,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "user" as const,
    status: "active" as const,
    lastActive: "30 minutes ago",
    tasksCompleted: 23,
    tasksRunning: 1,
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin" as const,
    status: "inactive" as const,
    lastActive: "1 day ago",
    tasksCompleted: 8,
    tasksRunning: 0,
  },
];

const mockTaskAssignments = [
  {
    id: "1",
    name: "Deep Learning Model Training",
    user: "John Doe",
    node: "GPU-Node-01",
    priority: "high" as const,
    status: "running" as const,
    estimatedTime: "4h 30m",
  },
  {
    id: "2",
    name: "Data Processing Pipeline",
    user: "Jane Smith",
    node: "GPU-Node-02",
    priority: "medium" as const,
    status: "queued" as const,
    estimatedTime: "2h 15m",
  },
  {
    id: "3",
    name: "Image Classification Batch",
    user: "John Doe",
    node: "GPU-Node-01",
    priority: "low" as const,
    status: "paused" as const,
    estimatedTime: "1h 45m",
  },
];

export default function AdminDashboard() {
  const { user, loading, isAdmin } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = SessionManager.getSession();
        console.log("Admin page - Session check:", session);
        console.log("User from context:", user);
        console.log("Is admin:", isAdmin);

        // Wait a moment for auth to stabilize
        if (!user) {
          console.log("No user found, redirecting to signin");
          router.push("/signin");
          return;
        }

        // Check if user is admin
        const userRole = user.role?.toLowerCase();
        if (!isAdmin && userRole !== "admin") {
          console.log("User is not an admin, redirecting to dashboard");
          router.push("/dashboard");
          return;
        }

        console.log("Admin access granted for user:", user.name);
      } catch (error) {
        console.error("Session check error:", error);
      }
    };

    if (!loading) {
      checkAuth();
    }
  }, [loading, router, user, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show loading if no user yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check admin access
  const hasAdminAccess = isAdmin || user.role?.toLowerCase() === "admin";
  
  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have admin permissions to access this page.</p>
          <button 
            onClick={() => router.push("/dashboard")}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black">
      <DashboardHeader />

      <main className="pt-24 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-purple-400/20 to-blue-400/20 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-400/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-400/20 to-transparent"></div>
            <div className="relative z-10">
              <h2 
                className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
                style={{ fontFamily: 'Lato, sans-serif', fontWeight: '375' }}
              >
                Admin Control Center
              </h2>
              <p 
                className="text-white/80 text-lg"
                style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
              >
                Manage compute nodes, users, and task assignments across your distributed GPU cluster.
              </p>
            </div>
          </div>

          {/* Admin Stats Overview - Remove Active Users */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 rounded-lg p-6 group">
              <div className="flex items-center justify-between mb-4">
                <h3 
                  className="text-white/80 text-sm font-medium group-hover:text-purple-300 transition-colors"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  Total Nodes
                </h3>
                <div className="w-10 h-10 bg-purple-400/20 rounded-full flex items-center justify-center">
                  <Server className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <div 
                className="text-3xl font-bold text-white mb-2"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                3
              </div>
              <p 
                className="text-white/60 text-sm"
                style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
              >
                2 online, 1 maintenance
              </p>
              <div className="mt-4 flex space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 rounded-lg p-6 group">
              <div className="flex items-center justify-between mb-4">
                <h3 
                  className="text-white/80 text-sm font-medium group-hover:text-purple-300 transition-colors"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  Running Tasks
                </h3>
                <div className="w-10 h-10 bg-purple-400/20 rounded-full flex items-center justify-center">
                  <Activity className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <div 
                className="text-3xl font-bold text-white mb-2"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                8
              </div>
              <p 
                className="text-white/60 text-sm"
                style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
              >
                5 queued, 3 completed today
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all duration-300 rounded-lg p-6 group">
              <div className="flex items-center justify-between mb-4">
                <h3 
                  className="text-white/80 text-sm font-medium group-hover:text-blue-300 transition-colors"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  System Load
                </h3>
                <div className="w-10 h-10 bg-blue-400/20 rounded-full flex items-center justify-center">
                  <Settings className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              <div 
                className="text-3xl font-bold text-white mb-2"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                67%
              </div>
              <p 
                className="text-white/60 text-sm"
                style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
              >
                Across all nodes
              </p>
              <div className="mt-4">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Task Assignment Section with New Nodes on the right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task Assignment - Left side (2/3 width) */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 
                  className="text-white text-xl font-semibold flex items-center"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  <div className="w-8 h-8 bg-purple-400/20 rounded-full flex items-center justify-center mr-3">
                    <Settings className="h-4 w-4 text-purple-400" />
                  </div>
                  Task Assignment
                </h3>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-purple-400/20 hover:bg-purple-400/30 text-purple-400 rounded-lg border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 text-sm font-medium"
                    style={{ fontFamily: 'Lato, sans-serif' }}>
                    Assign Task
                  </button>
                  <button className="px-4 py-2 bg-blue-400/20 hover:bg-blue-400/30 text-blue-400 rounded-lg border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 text-sm font-medium"
                    style={{ fontFamily: 'Lato, sans-serif' }}>
                    New Task
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockTaskAssignments.map((task) => (
                  <div key={task.id} className="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-purple-400/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>
                        {task.name}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.status === 'running' ? 'bg-green-400/20 text-green-400' :
                        task.status === 'queued' ? 'bg-yellow-400/20 text-yellow-400' :
                        'bg-red-400/20 text-red-400'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="text-white/60 text-sm mb-2" style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}>
                      <div>User: {task.user}</div>
                      <div>Node: {task.node}</div>
                      <div>Priority: {task.priority}</div>
                      <div>Est. Time: {task.estimatedTime}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* New Nodes - Right side (1/3 width) */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 
                  className="text-white text-xl font-semibold flex items-center"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center mr-3">
                    <Server className="h-4 w-4 text-green-400" />
                  </div>
                  New Nodes
                </h3>
                <button className="px-3 py-1 bg-red-400/20 hover:bg-red-400/30 text-red-400 rounded-lg border border-red-400/30 hover:border-red-400/50 transition-all duration-300 text-xs font-medium"
                  style={{ fontFamily: 'Lato, sans-serif' }}>
                  Terminate All
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                  <div>
                    <p className="text-white font-medium text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>GPU-Node-04</p>
                    <p className="text-white/60 text-xs" style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}>Joined 2 hours ago</p>
                  </div>
                  <div className="text-green-400 text-xs font-medium">Online</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                  <div>
                    <p className="text-white font-medium text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>GPU-Node-05</p>
                    <p className="text-white/60 text-xs" style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}>Joined 1 day ago</p>
                  </div>
                  <div className="text-green-400 text-xs font-medium">Online</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                  <div>
                    <p className="text-white font-medium text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>GPU-Node-06</p>
                    <p className="text-white/60 text-xs" style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}>Pending approval</p>
                  </div>
                  <div className="text-yellow-400 text-xs font-medium">Pending</div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Assignments Section - Below Task Assignment */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 
              className="text-white text-xl font-semibold mb-6 flex items-center"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center mr-3">
                <Activity className="h-4 w-4 text-blue-400" />
              </div>
              Current Assignments
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-blue-400/30 transition-all duration-300">
                <div>
                  <p className="text-white font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>ML Training Job</p>
                  <p className="text-white/60 text-sm" style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}>John Doe → GPU-Node-01</p>
                </div>
                <div className="text-green-400 text-sm font-medium">Running</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-blue-400/30 transition-all duration-300">
                <div>
                  <p className="text-white font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>Data Processing</p>
                  <p className="text-white/60 text-sm" style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}>Jane Smith → GPU-Node-02</p>
                </div>
                <div className="text-yellow-400 text-sm font-medium">Queued</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-blue-400/30 transition-all duration-300">
                <div>
                  <p className="text-white font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>Image Classification</p>
                  <p className="text-white/60 text-sm" style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}>Mike Johnson → GPU-Node-01</p>
                </div>
                <div className="text-red-400 text-sm font-medium">Paused</div>
              </div>
            </div>
          </div>
        </div>
      </main>


    </div>
  );
}
