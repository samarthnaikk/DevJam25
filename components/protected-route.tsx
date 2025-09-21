"use client"

import { useAuthContext } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: "admin" | "user"
  redirectTo?: string
}

export function ProtectedRoute({ children, requiredRole, redirectTo = "/" }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!isAuthenticated) {
      router.push(redirectTo)
      return
    }

    if (requiredRole && user?.role !== requiredRole) {
      // Redirect based on actual role
      if (user?.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
      return
    }
  }, [isAuthenticated, user, loading, requiredRole, router, redirectTo])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}
