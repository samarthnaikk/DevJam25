"use client";

import { useAuthContext } from "@/components/auth-provider";
import { SessionManager } from "@/lib/client/session";
import { DashboardHeader } from "@/components/dashboard-header";
import { GPUStatsCard } from "@/components/gpu-stats-card";
import { TaskListCard } from "@/components/task-list-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, CheckCircle, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Mock data for demo
const mockGPUs = [
  {
    gpuName: "NVIDIA RTX 4090",
    utilization: 78,
    temperature: 72,
    memory: { used: 18, total: 24 },
    power: 320,
  },
  {
    gpuName: "NVIDIA RTX 4080",
    utilization: 45,
    temperature: 65,
    memory: { used: 8, total: 16 },
    power: 280,
  },
];

const mockTasks = [
  {
    id: "1",
    name: "Neural Network Training",
    status: "running" as const,
    progress: 67,
    duration: "2h 34m",
    gpuId: "0",
  },
  {
    id: "2",
    name: "Image Processing Batch",
    status: "completed" as const,
    progress: 100,
    duration: "45m",
    gpuId: "1",
  },
  {
    id: "3",
    name: "Data Analysis Pipeline",
    status: "pending" as const,
    progress: 0,
    duration: "Queued",
    gpuId: "0",
  },
  {
    id: "4",
    name: "Model Inference",
    status: "failed" as const,
    progress: 0,
    duration: "12m",
    gpuId: "1",
  },
];

export default function UserDashboard() {
  const { isAuthenticated, user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated using session manager
    const isLoggedIn = SessionManager.isAuthenticated();

    if (!isLoggedIn) {
      // Redirect to signin page if not authenticated
      router.push("/signin");
    }

    // Keep the existing role-based check
    if (user?.role === "admin") {
      router.push("/admin");
    }
  }, [user, router]);

  // Check authentication client-side
  const isLoggedIn =
    typeof window !== "undefined" ? SessionManager.isAuthenticated() : false;

  if (loading || !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">
              Welcome to your Dashboard!
            </h2>
            <p className="text-primary-foreground/90">
              Your GPU computing environment is ready. Monitor your tasks and
              system performance below.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Tasks
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  +2 from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Today
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +4 from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Runtime
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2h</div>
                <p className="text-xs text-muted-foreground">
                  -0.3h from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Power Usage
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">600W</div>
                <p className="text-xs text-muted-foreground">Across 2 GPUs</p>
              </CardContent>
            </Card>
          </div>

          {/* GPU Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockGPUs.map((gpu, index) => (
              <GPUStatsCard key={index} {...gpu} />
            ))}
          </div>

          {/* Tasks */}
          <TaskListCard tasks={mockTasks} />
        </div>
      </main>
    </div>
  );
}
