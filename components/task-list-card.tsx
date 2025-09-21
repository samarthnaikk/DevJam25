import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle, Play } from "lucide-react"

interface Task {
  id: string
  name: string
  status: "running" | "completed" | "pending" | "failed"
  progress: number
  duration: string
  gpuId: string
}

interface TaskListCardProps {
  tasks: Task[]
}

const statusIcons = {
  running: <Play className="h-4 w-4" />,
  completed: <CheckCircle className="h-4 w-4" />,
  pending: <Clock className="h-4 w-4" />,
  failed: <AlertCircle className="h-4 w-4" />,
}

const statusColors = {
  running: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
}

export function TaskListCard({ tasks }: TaskListCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {statusIcons[task.status]}
                  <div>
                    <p className="font-medium text-sm">{task.name}</p>
                    <p className="text-xs text-muted-foreground">
                      GPU {task.gpuId} • {task.duration}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {task.status === "running" && <span className="text-xs text-muted-foreground">{task.progress}%</span>}
                <Badge variant="secondary" className={statusColors[task.status]}>
                  {task.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
