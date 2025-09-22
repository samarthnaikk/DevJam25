import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Server, Cpu, HardDrive, Wifi, WifiOff } from "lucide-react";

interface Node {
  id: string;
  name: string;
  status: "online" | "offline" | "maintenance";
  gpuCount: number;
  cpuCores: number;
  memory: string;
  utilization: number;
  location: string;
}

interface NodeManagementCardProps {
  nodes: Node[];
}

const statusColors = {
  online: "bg-green-400/20 text-green-400 border border-green-400/30",
  offline: "bg-red-400/20 text-red-400 border border-red-400/30",
  maintenance: "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30",
};

const statusIcons = {
  online: <Wifi className="h-4 w-4 text-green-400" />,
  offline: <WifiOff className="h-4 w-4 text-red-400" />,
  maintenance: <Server className="h-4 w-4 text-yellow-400" />,
};

export function NodeManagementCard({ nodes }: NodeManagementCardProps) {
  return (
    <div className="bg-black border border-white/10 rounded-lg">
      <div className="p-6 border-b border-white/10">
        <h3
          className="text-white text-xl font-semibold flex items-center"
          style={{ fontFamily: "Lato, sans-serif" }}
        >
          <div className="w-8 h-8 bg-purple-400/20 rounded-full flex items-center justify-center mr-3">
            <Server className="h-4 w-4 text-purple-400" />
          </div>
          Node Management
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="bg-white/5 border border-white/10 hover:border-purple-400/30 transition-all duration-300 rounded-lg p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg border border-white/20">
                      {statusIcons[node.status]}
                    </div>
                    <div>
                      <h4
                        className="font-semibold text-white text-lg"
                        style={{ fontFamily: "Lato, sans-serif" }}
                      >
                        {node.name}
                      </h4>
                      <p
                        className="text-sm text-white/60 font-medium"
                        style={{
                          fontFamily: "Lato, sans-serif",
                          fontWeight: "300",
                        }}
                      >
                        {node.location}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className={`${
                      statusColors[node.status]
                    } font-semibold text-sm px-3 py-1 rounded-full`}
                  >
                    {node.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-purple-400/20 hover:bg-purple-400/30 text-purple-400 border-purple-400/30 hover:border-purple-400/50 transition-all duration-300"
                  >
                    Manage
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-sm bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 text-white/80">
                  <div className="p-1 bg-purple-400/20 rounded">
                    <Cpu className="h-3 w-3 text-purple-400" />
                  </div>
                  <span
                    className="text-white/60"
                    style={{ fontFamily: "Lato, sans-serif" }}
                  >
                    GPUs:
                  </span>
                  <span
                    className="font-semibold text-purple-300"
                    style={{ fontFamily: "Lato, sans-serif" }}
                  >
                    {node.gpuCount}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <div className="p-1 bg-blue-400/20 rounded">
                    <Server className="h-3 w-3 text-blue-400" />
                  </div>
                  <span
                    className="text-white/60"
                    style={{ fontFamily: "Lato, sans-serif" }}
                  >
                    CPUs:
                  </span>
                  <span
                    className="font-semibold text-blue-300"
                    style={{ fontFamily: "Lato, sans-serif" }}
                  >
                    {node.cpuCores}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <div className="p-1 bg-purple-400/20 rounded">
                    <HardDrive className="h-3 w-3 text-purple-400" />
                  </div>
                  <span
                    className="text-white/60"
                    style={{ fontFamily: "Lato, sans-serif" }}
                  >
                    RAM:
                  </span>
                  <span
                    className="font-semibold text-purple-300"
                    style={{ fontFamily: "Lato, sans-serif" }}
                  >
                    {node.memory}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <span
                    className="text-white/60"
                    style={{ fontFamily: "Lato, sans-serif" }}
                  >
                    Usage:
                  </span>
                  <span
                    className="font-semibold text-green-300"
                    style={{ fontFamily: "Lato, sans-serif" }}
                  >
                    {node.utilization}%
                  </span>
                  <div className="ml-2 w-12 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-500"
                      style={{ width: `${node.utilization}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
