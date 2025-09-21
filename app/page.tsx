"use client";

import { useAuthContext } from "@/components/auth-provider";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { RoleDemoInfo } from "@/components/role-demo-info";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Cpu, Zap, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { isAuthenticated, user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Cpu className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 text-balance">
            GPU Task Manager
          </h1>
          <p className="mt-2 text-gray-600 text-pretty">
            High-performance computing made simple
          </p>
        </div>

        {/* Demo Info */}
        <RoleDemoInfo />

        {/* Login Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your GPU computing dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <GoogleSignInButton />

            <div className="text-center text-sm text-muted-foreground">
              Demo credentials will automatically assign roles
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
                onClick={() => router.push("/signup")}
              >
                SIGN UP
              </button>
              <button
                className="bg-secondary text-primary px-4 py-2 rounded border border-primary hover:bg-secondary/80 transition"
                onClick={() => router.push("/signin")}
              >
                SIGN IN
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <Zap className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-gray-600">Fast Processing</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-gray-600">Real-time Stats</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <Cpu className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-gray-600">GPU Management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
