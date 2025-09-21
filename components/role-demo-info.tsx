"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"

export function RoleDemoInfo() {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">Demo Mode</p>
            <p className="text-blue-700">
              This is a hackathon demo. Click "Continue with Google" to randomly be assigned either an Admin or User
              role. Admin users see the admin dashboard with node management, while regular users see the standard
              dashboard with GPU stats.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
