import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Settings, Play, Pause } from "lucide-react"

interface TaskAssignment {
  id: string
  name: string
  user: string
  node: string
  priority: "high" | "medium" | "low"
  status: "queued" | "running" | "paused"
  estimatedTime: string
}

interface TaskAssignmentCardProps {
  tasks: TaskAssignment[]
}

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
}

const statusColors = {
  queued: "bg-gray-100 text-gray-800",
  running: "bg-blue-100 text-blue-800",
  paused: "bg-orange-100 text-orange-800",
}

export function TaskAssignmentCard({ tasks }: TaskAssignmentCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Task Assignment
          </CardTitle>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Assignment Form */}
        <div className="border rounded-lg p-4 bg-muted/50">
          <h4 className="font-medium mb-3">Quick Task Assignment</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-name">Task Name</Label>
              <Input id="task-name" placeholder="Enter task name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assign-user">Assign to User</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">John Doe</SelectItem>
                  <SelectItem value="user2">Jane Smith</SelectItem>
                  <SelectItem value="user3">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assign-node">Target Node</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select node" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="node1">GPU-Node-01</SelectItem>
                  <SelectItem value="node2">GPU-Node-02</SelectItem>
                  <SelectItem value="node3">GPU-Node-03</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="mt-4">Assign Task</Button>
        </div>

        {/* Current Assignments */}
        <div className="space-y-3">
          <h4 className="font-medium">Current Assignments</h4>
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div>
                  <h5 className="font-medium">{task.name}</h5>
                  <p className="text-sm text-muted-foreground">
                    {task.user} • {task.node} • Est. {task.estimatedTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={priorityColors[task.priority]}>
                  {task.priority}
                </Badge>
                <Badge variant="secondary" className={statusColors[task.status]}>
                  {task.status}
                </Badge>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm">
                    {task.status === "running" ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
