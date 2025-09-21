"use client";

import { useAuthContext } from "@/components/auth-provider";
import { SessionManager } from "@/lib/client/session";
import { DashboardHeader } from "@/components/dashboard-header";
import { NodeManagementCard } from "@/components/node-management-card";
import { UserManagementCard } from "@/components/user-management-card";
import { TaskAssignmentCard } from "@/components/task-assignment-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Users, Settings, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SignOutButton } from "@/components/sign-out-button";

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
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = SessionManager.getSession();
        console.log("Admin page - Session check:", session);

        // For debugging only - always allow access for now
        return;

        /*
        if (!session) {
          console.log("No session found, redirecting to login page");
          router.push("/");
          return;
        }
  
        // Check role from session if available, otherwise fall back to AuthContext
        const userRole = session.role || user?.role;
        console.log("User role:", userRole);
        
        if (userRole !== "admin") {
          console.log("User is not an admin, redirecting to dashboard");
          router.push("/dashboard");
        }
        */
      } catch (error) {
        console.error("Session check error:", error);
      }
    };

    if (!loading) {
      checkAuth();
    }
  }, [loading, router, user]); // During transition, we'll use both methods
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Temporarily disable auth check for debugging
  const isAuthenticated = true; // SessionManager.isAuthenticated();
  const isAdmin = true; // session?.role === "admin" || user?.role === "admin";

  // For debugging, simply return content
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Admin Control Center</h2>
              <p className="text-primary-foreground/90">
                Manage compute nodes, users, and task assignments across your
                GPU cluster.
              </p>
            </div>
            <SignOutButton variant="outline" />
          </div>

          {/* Admin Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Nodes
                </CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  2 online, 1 maintenance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +2 new this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Running Tasks
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">5 queued</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Load
                </CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">67%</div>
                <p className="text-xs text-muted-foreground">
                  Across all nodes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Management Sections */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <NodeManagementCard nodes={mockNodes} />
            <UserManagementCard users={mockUsers} />
          </div>

          {/* Task Assignment */}
          <TaskAssignmentCard tasks={mockTaskAssignments} />
        </div>
      </main>
    </div>
  );
}
