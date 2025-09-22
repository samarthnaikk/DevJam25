import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Cpu, HardDrive } from "lucide-react"

interface GPUStatsProps {
  gpuName: string
  utilization: number
  memory: { used: number; total: number }
}

export function GPUStatsCard({ gpuName, utilization, memory }: GPUStatsProps) {
  const memoryPercent = (memory.used / memory.total) * 100

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-purple-400/50 transition-all duration-300">
      <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle 
          className="text-base sm:text-lg flex items-center gap-2 text-white"
          style={{ fontFamily: 'Lato, sans-serif' }}
        >
          <Cpu className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 flex-shrink-0" />
          <span className="truncate">{gpuName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span 
              className="text-white/60"
              style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
            >
              GPU Utilization
            </span>
            <span 
              className="font-medium text-white"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              {utilization}%
            </span>
          </div>
          <Progress value={utilization} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span 
              className="text-white/60 flex items-center gap-1"
              style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
            >
              <HardDrive className="h-3 w-3 flex-shrink-0" />
              Memory
            </span>
            <span 
              className="font-medium text-white text-right"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              {memory.used}GB / {memory.total}GB
            </span>
          </div>
          <Progress value={memoryPercent} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
