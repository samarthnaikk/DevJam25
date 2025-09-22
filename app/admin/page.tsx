"use client";

import { useAuthContext } from "@/components/auth-provider";
import { SessionManager } from "@/lib/client/session";
import { DashboardHeader } from "@/components/dashboard-header";
import { NodeManagementCard } from "@/components/node-management-card";
import { NodeSubmissionCard } from "@/components/node-submission-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Settings, Activity, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { adminApi } from "@/lib/api/backend";
import { useMultipleApi } from "@/lib/api/hooks";

export default function AdminDashboard() {
  const { user, loading, isAdmin } = useAuthContext();
  const router = useRouter();

  // Fetch all admin data
  const {
    data,
    loading: apiLoading,
    errors,
    refetch,
  } = useMultipleApi(
    {
      stats: adminApi.getStats,
      nodes: adminApi.getNodes,
      taskAssignments: adminApi.getTaskAssignments,
      newNodes: adminApi.getNewNodes,
      currentAssignments: adminApi.getCurrentAssignments,
    },
    {
      autoFetch: true,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

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
          <p className="text-gray-600 mb-4">
            You don't have admin permissions to access this page.
          </p>
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

  // Get data with fallbacks
  const stats = data.stats || {
    totalNodes: 0,
    onlineNodes: 0,
    maintenanceNodes: 0,
    runningTasks: 0,
    queuedTasks: 0,
    completedToday: 0,
    systemLoad: 0,
  };
  const nodes = data.nodes || [];
  const taskAssignments = data.taskAssignments || [];
  const newNodes = data.newNodes || [];
  const currentAssignments = data.currentAssignments || [];
  return (
    <div className="min-h-screen bg-black">
      <DashboardHeader />

      <main className="pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-purple-400/20 to-blue-400/20 backdrop-blur-sm border border-white/10 rounded-lg p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-bl from-purple-400/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-blue-400/20 to-transparent"></div>
            <div className="relative z-10">
              <h2
                className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
                style={{ fontFamily: "Lato, sans-serif", fontWeight: "375" }}
              >
                Admin Control Center
              </h2>
              <p
                className="text-white/80 text-lg"
                style={{ fontFamily: "Lato, sans-serif", fontWeight: "300" }}
              >
                Manage compute nodes, users, and task assignments across your
                distributed GPU cluster.
              </p>
            </div>
          </div>

          {/* Admin Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 rounded-lg p-6 group">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-white/80 text-sm font-medium group-hover:text-purple-300 transition-colors"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
                  Total Nodes
                </h3>
                <div className="w-10 h-10 bg-purple-400/20 rounded-full flex items-center justify-center">
                  <Server className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <div
                className="text-3xl font-bold text-white mb-2"
                style={{ fontFamily: "Lato, sans-serif" }}
              >
                {apiLoading ? "..." : stats.totalNodes || 0}
              </div>
              <p
                className="text-white/60 text-sm"
                style={{ fontFamily: "Lato, sans-serif", fontWeight: "300" }}
              >
                {apiLoading
                  ? "Loading..."
                  : `${stats.onlineNodes || 0} online, ${
                      stats.maintenanceNodes || 0
                    } maintenance`}
              </p>
              <div className="mt-4 flex space-x-1">
                {Array.from({ length: stats.onlineNodes || 0 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.5}s` }}
                  ></div>
                ))}
                {Array.from({ length: stats.maintenanceNodes || 0 }).map(
                  (_, i) => (
                    <div
                      key={`m-${i}`}
                      className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
                      style={{
                        animationDelay: `${(stats.onlineNodes + i) * 0.5}s`,
                      }}
                    ></div>
                  )
                )}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 rounded-lg p-6 group">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-white/80 text-sm font-medium group-hover:text-purple-300 transition-colors"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
                  Running Tasks
                </h3>
                <div className="w-10 h-10 bg-purple-400/20 rounded-full flex items-center justify-center">
                  <Activity className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <div
                className="text-3xl font-bold text-white mb-2"
                style={{ fontFamily: "Lato, sans-serif" }}
              >
                {apiLoading ? "..." : stats.runningTasks || 0}
              </div>
              <p
                className="text-white/60 text-sm"
                style={{ fontFamily: "Lato, sans-serif", fontWeight: "300" }}
              >
                {apiLoading
                  ? "Loading..."
                  : `${stats.queuedTasks || 0} queued, ${
                      stats.completedToday || 0
                    } completed today`}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all duration-300 rounded-lg p-6 group">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-white/80 text-sm font-medium group-hover:text-blue-300 transition-colors"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
                  System Load
                </h3>
                <div className="w-10 h-10 bg-blue-400/20 rounded-full flex items-center justify-center">
                  <Settings className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              <div
                className="text-3xl font-bold text-white mb-2"
                style={{ fontFamily: "Lato, sans-serif" }}
              >
                {apiLoading ? "..." : `${stats.systemLoad || 0}%`}
              </div>
              <p
                className="text-white/60 text-sm"
                style={{ fontFamily: "Lato, sans-serif", fontWeight: "300" }}
              >
                Across all nodes
              </p>
              <div className="mt-4">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.systemLoad || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Task Assignment Section with New Nodes on the right */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Task Assignment - Left side (2/3 width) */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-white text-xl font-semibold flex items-center"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
                  <div className="w-8 h-8 bg-purple-400/20 rounded-full flex items-center justify-center mr-3">
                    <Settings className="h-4 w-4 text-purple-400" />
                  </div>
                  Task Assignment
                </h3>
                <div className="flex gap-3">
                  <button
                    className="px-4 py-2 bg-purple-400/20 hover:bg-purple-400/30 text-purple-400 rounded-lg border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 text-sm font-medium"
                    style={{ fontFamily: "Lato, sans-serif" }}
                  >
                    Assign Task
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-400/20 hover:bg-blue-400/30 text-blue-400 rounded-lg border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 text-sm font-medium"
                    style={{ fontFamily: "Lato, sans-serif" }}
                  >
                    New Task
                  </button>
                </div>
              </div>

              {/* Show loading state */}
              {apiLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                </div>
              )}

              {/* Show error state */}
              {errors.taskAssignments && !apiLoading && (
                <div className="p-4 bg-red-400/20 border border-red-400/30 rounded-lg text-red-400 text-sm">
                  Failed to load task assignments: {errors.taskAssignments}
                </div>
              )}

              {/* Show data or empty state */}
              {!apiLoading && !errors.taskAssignments && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {taskAssignments.length > 0 ? (
                    taskAssignments.map((task) => (
                      <div
                        key={task.id}
                        className="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-purple-400/30 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4
                            className="text-white font-medium text-sm"
                            style={{ fontFamily: "Lato, sans-serif" }}
                          >
                            {task.name}
                          </h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              task.status === "running"
                                ? "bg-green-400/20 text-green-400"
                                : task.status === "queued"
                                ? "bg-yellow-400/20 text-yellow-400"
                                : task.status === "paused"
                                ? "bg-red-400/20 text-red-400"
                                : "bg-blue-400/20 text-blue-400"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <div
                          className="text-white/60 text-sm mb-2"
                          style={{
                            fontFamily: "Lato, sans-serif",
                            fontWeight: "300",
                          }}
                        >
                          <div>User: {task.user}</div>
                          <div>Node: {task.node}</div>
                          <div>Priority: {task.priority}</div>
                          <div>Est. Time: {task.estimatedTime}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <p
                        className="text-white/60"
                        style={{ fontFamily: "Lato, sans-serif" }}
                      >
                        No task assignments found
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* New Nodes - Right side (1/3 width) */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-white text-xl font-semibold flex items-center"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
                  <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center mr-3">
                    <Server className="h-4 w-4 text-green-400" />
                  </div>
                  New Nodes
                </h3>
                <button
                  className="px-3 py-1 bg-red-400/20 hover:bg-red-400/30 text-red-400 rounded-lg border border-red-400/30 hover:border-red-400/50 transition-all duration-300 text-xs font-medium"
                  style={{ fontFamily: "Lato, sans-serif" }}
                >
                  Terminate All
                </button>
              </div>

              {/* Show loading state */}
              {apiLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
                </div>
              )}

              {/* Show error state */}
              {errors.newNodes && !apiLoading && (
                <div className="p-3 bg-red-400/20 border border-red-400/30 rounded-lg text-red-400 text-xs">
                  Failed to load new nodes: {errors.newNodes}
                </div>
              )}

              {/* Show data or empty state */}
              {!apiLoading && !errors.newNodes && (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {newNodes.length > 0 ? (
                    newNodes.map((node) => (
                      <div
                        key={node.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5"
                      >
                        <div>
                          <p
                            className="text-white font-medium text-sm"
                            style={{ fontFamily: "Lato, sans-serif" }}
                          >
                            {node.name}
                          </p>
                          <p
                            className="text-white/60 text-xs"
                            style={{
                              fontFamily: "Lato, sans-serif",
                              fontWeight: "300",
                            }}
                          >
                            Joined {node.joinedAt}
                          </p>
                        </div>
                        <div
                          className={`text-xs font-medium ${
                            node.status === "online"
                              ? "text-green-400"
                              : node.status === "pending"
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          {node.status}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p
                        className="text-white/60 text-sm"
                        style={{ fontFamily: "Lato, sans-serif" }}
                      >
                        No new nodes
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Node Submission Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NodeSubmissionCard
              onNodesSubmitted={(submittedNodes) => {
                console.log("Nodes submitted:", submittedNodes);
                // Optionally refresh data after successful submission
                refetch();
              }}
            />

            {/* Placeholder for future components */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h3
                className="text-white text-lg font-semibold mb-4 flex items-center"
                style={{ fontFamily: "Lato, sans-serif" }}
              >
                <div className="w-6 h-6 bg-gray-400/20 rounded-full flex items-center justify-center mr-3">
                  <Settings className="h-3 w-3 text-gray-400" />
                </div>
                System Logs
              </h3>
              <div className="text-white/60 text-sm">
                <p>System logs and monitoring information will appear here.</p>
                <p className="mt-2 text-xs">Features coming soon...</p>
              </div>
            </div>
          </div>

          {/* Current Assignments Section - Below Task Assignment */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3
              className="text-white text-xl font-semibold mb-6 flex items-center"
              style={{ fontFamily: "Lato, sans-serif" }}
            >
              <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center mr-3">
                <Activity className="h-4 w-4 text-blue-400" />
              </div>
              Current Assignments
            </h3>

            {/* Show loading state */}
            {apiLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              </div>
            )}

            {/* Show error state */}
            {errors.currentAssignments && !apiLoading && (
              <div className="p-4 bg-red-400/20 border border-red-400/30 rounded-lg text-red-400 text-sm">
                Failed to load current assignments: {errors.currentAssignments}
              </div>
            )}

            {/* Show data or empty state */}
            {!apiLoading && !errors.currentAssignments && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
                {currentAssignments.length > 0 ? (
                  currentAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-blue-400/30 transition-all duration-300"
                    >
                      <div>
                        <p
                          className="text-white font-medium"
                          style={{ fontFamily: "Lato, sans-serif" }}
                        >
                          {assignment.taskName}
                        </p>
                        <p
                          className="text-white/60 text-sm"
                          style={{
                            fontFamily: "Lato, sans-serif",
                            fontWeight: "300",
                          }}
                        >
                          {assignment.userName} → {assignment.nodeName}
                        </p>
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          assignment.status === "running"
                            ? "text-green-400"
                            : assignment.status === "queued"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {assignment.status}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <p
                      className="text-white/60"
                      style={{ fontFamily: "Lato, sans-serif" }}
                    >
                      No current assignments
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Node Management Section */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3
              className="text-white text-xl font-semibold mb-6 flex items-center"
              style={{ fontFamily: "Lato, sans-serif" }}
            >
              <div className="w-8 h-8 bg-purple-400/20 rounded-full flex items-center justify-center mr-3">
                <Server className="h-4 w-4 text-purple-400" />
              </div>
              Node Management
            </h3>

            {/* Show loading state */}
            {apiLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
              </div>
            )}

            {/* Show error state */}
            {errors.nodes && !apiLoading && (
              <div className="p-4 bg-red-400/20 border border-red-400/30 rounded-lg text-red-400 text-sm">
                Failed to load nodes: {errors.nodes}
              </div>
            )}

            {/* Show node management component */}
            {!apiLoading && !errors.nodes && (
              <div className="text-white">
                <NodeManagementCard nodes={nodes} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
