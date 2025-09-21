import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Server, Cpu, HardDrive, Wifi, WifiOff } from "lucide-react"

interface Node {
  id: string
  name: string
  status: "online" | "offline" | "maintenance"
  gpuCount: number
  cpuCores: number
  memory: string
  utilization: number
  location: string
}

interface NodeManagementCardProps {
  nodes: Node[]
}

const statusColors = {
  online: "bg-green-100 text-green-800",
  offline: "bg-red-100 text-red-800",
  maintenance: "bg-yellow-100 text-yellow-800",
}

const statusIcons = {
  online: <Wifi className="h-4 w-4" />,
  offline: <WifiOff className="h-4 w-4" />,
  maintenance: <Server className="h-4 w-4" />,
}

export function NodeManagementCard({ nodes }: NodeManagementCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          Compute Nodes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {nodes.map((node) => (
            <div key={node.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {statusIcons[node.status]}
                    <div>
                      <h4 className="font-medium">{node.name}</h4>
                      <p className="text-sm text-muted-foreground">{node.location}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={statusColors[node.status]}>
                    {node.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Cpu className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">GPUs:</span>
                  <span className="font-medium">{node.gpuCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Server className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">CPUs:</span>
                  <span className="font-medium">{node.cpuCores}</span>
                </div>
                <div className="flex items-center gap-1">
                  <HardDrive className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">RAM:</span>
                  <span className="font-medium">{node.memory}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Usage:</span>
                  <span className="font-medium ml-1">{node.utilization}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
