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
    memory: { used: 18, total: 24 },
  },
  {
    gpuName: "NVIDIA RTX 4080",
    utilization: 45,
    memory: { used: 8, total: 16 },
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
    if (!loading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to signin");
      router.push("/signin");
      return;
    }

    // If user is admin, redirect to admin dashboard
    if (user?.role === "ADMIN" || user?.role === "admin") {
      console.log("Admin user detected, redirecting to admin dashboard");
      router.push("/admin");
      return;
    }
  }, [isAuthenticated, user, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-white/60 mb-4">Redirecting to sign in...</p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400 mx-auto"></div>
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
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-white">
            <h2 
              className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
              style={{ fontFamily: 'Lato, sans-serif', fontWeight: '400' }}
            >
              Welcome to your Dashboard!
            </h2>
            <p 
              className="text-white/70"
              style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
            >
              Your GPU computing environment is ready. Monitor your tasks and
              system performance below.
            </p>
          </div>

          {/* Stats Overview - Removed Power Usage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 rounded-lg p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 
                  className="text-sm font-medium text-white/80"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  Active Tasks
                </h3>
                <Activity className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <div 
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  3
                </div>
                <p 
                  className="text-xs text-white/60"
                  style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
                >
                  +2 from yesterday
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 rounded-lg p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 
                  className="text-sm font-medium text-white/80"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  Completed Today
                </h3>
                <CheckCircle className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <div 
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  12
                </div>
                <p 
                  className="text-xs text-white/60"
                  style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
                >
                  +4 from yesterday
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 rounded-lg p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 
                  className="text-sm font-medium text-white/80"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  Avg. Runtime
                </h3>
                <Clock className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <div 
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  1.2h
                </div>
                <p 
                  className="text-xs text-white/60"
                  style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
                >
                  -0.3h from yesterday
                </p>
              </div>
            </div>
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
