// API utility functions for making requests to the Flask backend

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `/api/flask${endpoint}`;
    console.log(`[API] Making request to: ${url}`);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`[API] Error ${response.status}:`, data);
      return {
        error: data.error || `Request failed with status ${response.status}`,
        status: response.status,
      };
    }

    console.log(`[API] Success:`, data);
    return {
      data,
      status: response.status,
    };
  } catch (error) {
    console.error("[API] Network error:", error);
    return {
      error: "Network error - unable to connect to backend",
      status: 500,
    };
  }
}

// Admin Dashboard API calls
export const adminApi = {
  // Get dashboard overview stats
  getStats: () =>
    apiRequest<{
      totalNodes: number;
      onlineNodes: number;
      maintenanceNodes: number;
      runningTasks: number;
      queuedTasks: number;
      completedToday: number;
      systemLoad: number;
    }>("/admin/stats"),

  // Get all nodes
  getNodes: () =>
    apiRequest<
      Array<{
        id: string;
        name: string;
        status: "online" | "offline" | "maintenance";
        gpuCount: number;
        cpuCores: number;
        memory: string;
        utilization: number;
        location: string;
      }>
    >("/admin/nodes"),

  // Get task assignments
  getTaskAssignments: () =>
    apiRequest<
      Array<{
        id: string;
        name: string;
        user: string;
        node: string;
        priority: "high" | "medium" | "low";
        status: "running" | "queued" | "paused" | "completed";
        estimatedTime: string;
      }>
    >("/admin/task-assignments"),

  // Get new nodes
  getNewNodes: () =>
    apiRequest<
      Array<{
        id: string;
        name: string;
        joinedAt: string;
        status: "online" | "pending" | "offline";
      }>
    >("/admin/new-nodes"),

  // Get current assignments
  getCurrentAssignments: () =>
    apiRequest<
      Array<{
        id: string;
        taskName: string;
        userName: string;
        nodeName: string;
        status: "running" | "queued" | "paused";
      }>
    >("/admin/current-assignments"),

  // Submit active nodes for task distribution
  submitNodes: (nodes: string[]) =>
    apiRequest<{
      message: string;
      nodes: string[];
      chunks_created: number;
    }>("/admin/submit-nodes", {
      method: "POST",
      body: JSON.stringify({ nodes }),
    }),
};

// User Dashboard API calls
export const userApi = {
  // Get user dashboard stats
  getStats: () =>
    apiRequest<{
      activeTasks: number;
      completedToday: number;
      avgRuntime: string;
      changeFromYesterday: {
        activeTasks: number;
        completedToday: number;
        avgRuntime: string;
      };
    }>("/user/stats"),

  // Get GPU information
  getGPUs: () =>
    apiRequest<
      Array<{
        id: string;
        gpuName: string;
        utilization: number;
        memory: {
          used: number;
          total: number;
        };
      }>
    >("/user/gpus"),

  // Get user tasks
  getTasks: () =>
    apiRequest<
      Array<{
        id: string;
        name: string;
        status: "running" | "completed" | "pending" | "failed";
        progress: number;
        duration: string;
        gpuId: string;
      }>
    >("/user/tasks"),

  // Get processors info (for the removed Power Usage card)
  getProcessors: () =>
    apiRequest<{
      activeProcessors: number;
      totalProcessors: number;
      efficiency: number;
    }>("/user/processors"),
};

// General utility functions
export const api = {
  // Health check
  healthCheck: () =>
    apiRequest<{ status: string; timestamp: string }>("/health"),

  // Get system status
  getSystemStatus: () =>
    apiRequest<{
      backend: "online" | "offline";
      database: "online" | "offline";
      services: Array<{
        name: string;
        status: "online" | "offline";
      }>;
    }>("/status"),
};
