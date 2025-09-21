import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Cpu, Thermometer, Zap, HardDrive } from "lucide-react"

interface GPUStatsProps {
  gpuName: string
  utilization: number
  temperature: number
  memory: { used: number; total: number }
  power: number
}

export function GPUStatsCard({ gpuName, utilization, temperature, memory, power }: GPUStatsProps) {
  const memoryPercent = (memory.used / memory.total) * 100

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Cpu className="h-5 w-5 text-primary" />
          {gpuName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">GPU Utilization</span>
            <span className="font-medium">{utilization}%</span>
          </div>
          <Progress value={utilization} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              Memory
            </span>
            <span className="font-medium">
              {memory.used}GB / {memory.total}GB
            </span>
          </div>
          <Progress value={memoryPercent} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Temperature</p>
              <p className="text-sm font-medium">{temperature}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">Power</p>
              <p className="text-sm font-medium">{power}W</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
