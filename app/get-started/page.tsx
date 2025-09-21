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
import { Cpu, Zap, BarChart3, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GetStartedPage() {
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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm">Back to Home</span>
      </button>

      <div className="text-center space-y-8 max-w-md mx-auto animate-in fade-in duration-500">
        {/* Login Card with Enhanced Glassmorphism */}
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-white/10 backdrop-blur-md border-slate-600/30 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
              <CardDescription className="text-slate-300">
                Sign in to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <GoogleSignInButton />
              <RoleDemoInfo />
              
              <div className="flex justify-center gap-4 mt-6">
                <button
                  className="bg-white/20 backdrop-blur text-white px-6 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 border border-white/20"
                  onClick={() => router.push("/signup")}
                >
                  SIGN UP
                </button>
                <button
                  className="bg-white text-slate-900 px-6 py-2 rounded-lg hover:bg-slate-100 transition-all duration-200 font-medium"
                  onClick={() => router.push("/signin")}
                >
                  SIGN IN
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Preview with Dark Theme */}
        <div className="grid grid-cols-3 gap-4 mt-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/20">
              <Zap className="h-6 w-6 text-white mx-auto mb-2" />
              <p className="text-xs text-slate-300">Fast Processing</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/20">
              <BarChart3 className="h-6 w-6 text-white mx-auto mb-2" />
              <p className="text-xs text-slate-300">Real-time Stats</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/20">
              <Cpu className="h-6 w-6 text-white mx-auto mb-2" />
              <p className="text-xs text-slate-300">GPU Management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
