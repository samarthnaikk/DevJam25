"use client";

import { useAuthContext } from "@/components/auth-provider";
import { SessionManager } from "@/lib/client/session";
import { DashboardHeader } from "@/components/dashboard-header";
import { GPUStatsCard } from "@/components/gpu-stats-card";
import { TaskListCard } from "@/components/task-list-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, CheckCircle, Zap, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { userApi } from "@/lib/api/backend";
import { useMultipleApi } from "@/lib/api/hooks";

export default function UserDashboard() {
  const { isAuthenticated, user, loading } = useAuthContext();
  const router = useRouter();

  // Fetch all user data
  const {
    data,
    loading: apiLoading,
    errors,
    refetch,
  } = useMultipleApi(
    {
      stats: userApi.getStats,
      gpus: userApi.getGPUs,
      tasks: userApi.getTasks,
      processors: userApi.getProcessors,
    },
    {
      autoFetch: true,
      refreshInterval: 15000, // Refresh every 15 seconds for real-time updates
    }
  );

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

  // Get data with fallbacks
  const stats = data.stats || {
    activeTasks: 0,
    completedToday: 0,
    avgRuntime: "0h",
    changeFromYesterday: {
      activeTasks: 0,
      completedToday: 0,
      avgRuntime: "0h",
    },
  };
  const gpus = data.gpus || [];
  const tasks = data.tasks || [];
  const processors = data.processors || {
    activeProcessors: 0,
    totalProcessors: 0,
    efficiency: 0,
  };
  return (
    <div className="min-h-screen bg-black">
      <DashboardHeader />

      <main className="pt-24 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
                  style={{ fontFamily: "Lato, sans-serif", fontWeight: "400" }}
                >
                  Welcome to your Dashboard!
                </h2>
                <p
                  className="text-white/70"
                  style={{ fontFamily: "Lato, sans-serif", fontWeight: "300" }}
                >
                  Your GPU computing environment is ready. Monitor your tasks
                  and system performance below.
                </p>
              </div>
              <button
                onClick={() => refetch()}
                disabled={apiLoading}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                style={{ fontFamily: "Lato, sans-serif" }}
              >
                <RefreshCw
                  className={`h-4 w-4 ${apiLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 rounded-lg p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3
                  className="text-sm font-medium text-white/80"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
                  Active Tasks
                </h3>
                <Activity className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <div
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
                  {apiLoading ? "..." : stats.activeTasks || 0}
                </div>
                <p
                  className="text-xs text-white/60"
                  style={{ fontFamily: "Lato, sans-serif", fontWeight: "300" }}
                >
                  {apiLoading
                    ? "Loading..."
                    : `${
                        stats.changeFromYesterday.activeTasks >= 0 ? "+" : ""
                      }${stats.changeFromYesterday.activeTasks} from yesterday`}
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 rounded-lg p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3
                  className="text-sm font-medium text-white/80"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
                  Completed Today
                </h3>
                <CheckCircle className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <div
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
                  {apiLoading ? "..." : stats.completedToday || 0}
                </div>
                <p
                  className="text-xs text-white/60"
                  style={{ fontFamily: "Lato, sans-serif", fontWeight: "300" }}
                >
                  {apiLoading
                    ? "Loading..."
                    : `${
                        stats.changeFromYesterday.completedToday >= 0 ? "+" : ""
                      }${
                        stats.changeFromYesterday.completedToday
                      } from yesterday`}
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 rounded-lg p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3
                  className="text-sm font-medium text-white/80"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
                  Avg. Runtime
                </h3>
                <Clock className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <div
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
                  {apiLoading ? "..." : stats.avgRuntime || "0h"}
                </div>
                <p
                  className="text-xs text-white/60"
                  style={{ fontFamily: "Lato, sans-serif", fontWeight: "300" }}
                >
                  {apiLoading
                    ? "Loading..."
                    : `${stats.changeFromYesterday.avgRuntime} from yesterday`}
                </p>
              </div>
            </div>
          </div>

          {/* GPU Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Show loading state for GPUs */}
            {apiLoading && (
              <>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                  </div>
                </div>
              </>
            )}

            {/* Show error state for GPUs */}
            {errors.gpus && !apiLoading && (
              <div className="col-span-2 p-4 bg-red-400/20 border border-red-400/30 rounded-lg text-red-400 text-sm">
                Failed to load GPU information: {errors.gpus}
              </div>
            )}

            {/* Show GPU data or empty state */}
            {!apiLoading && !errors.gpus && (
              <>
                {gpus.length > 0 ? (
                  gpus.map((gpu, index) => (
                    <GPUStatsCard
                      key={gpu.id || index}
                      gpuName={gpu.gpuName}
                      utilization={gpu.utilization}
                      memory={gpu.memory}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <p
                      className="text-white/60"
                      style={{ fontFamily: "Lato, sans-serif" }}
                    >
                      No GPU information available
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Tasks Section */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            {/* Show loading state for tasks */}
            {apiLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
              </div>
            )}

            {/* Show error state for tasks */}
            {errors.tasks && !apiLoading && (
              <div className="p-4 bg-red-400/20 border border-red-400/30 rounded-lg text-red-400 text-sm">
                Failed to load tasks: {errors.tasks}
              </div>
            )}

            {/* Show task data */}
            {!apiLoading && !errors.tasks && <TaskListCard tasks={tasks} />}
          </div>
        </div>
      </main>
    </div>
  );
}
