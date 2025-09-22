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
  running: "bg-blue-400/20 text-blue-400 border-blue-400/30",
  completed: "bg-green-400/20 text-green-400 border-green-400/30",
  pending: "bg-yellow-400/20 text-yellow-400 border-yellow-400/30",
  failed: "bg-red-400/20 text-red-400 border-red-400/30",
}

export function TaskListCard({ tasks }: TaskListCardProps) {
  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3">
        <CardTitle 
          className="text-base sm:text-lg text-white"
          style={{ fontFamily: 'Lato, sans-serif' }}
        >
          Recent Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="space-y-3 sm:space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-white/5 border border-white/5 hover:border-purple-400/30 transition-all duration-300 rounded-lg">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center gap-2 flex-shrink-0">
                  {statusIcons[task.status]}
                  <div className="min-w-0 flex-1">
                    <p 
                      className="font-medium text-xs sm:text-sm text-white truncate"
                      style={{ fontFamily: 'Lato, sans-serif' }}
                    >
                      {task.name}
                    </p>
                    <p 
                      className="text-xs text-white/60"
                      style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
                    >
                      GPU {task.gpuId} • {task.duration}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2">
                {task.status === "running" && (
                  <span 
                    className="text-xs text-white/60"
                    style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
                  >
                    {task.progress}%
                  </span>
                )}
                <Badge variant="secondary" className={`${statusColors[task.status]} text-xs flex-shrink-0`}>
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
