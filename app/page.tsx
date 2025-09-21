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
import OptimizedSpline from "@/components/optimized-spline";

export default function HomePage() {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Spline 3D Background */}
      <div className="absolute inset-0 z-0">
        <OptimizedSpline 
          scene="https://prod.spline.design/KNeoX42LGSI6oW-F/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* Logo and Brand - Top Left Corner */}
      <div className="absolute top-4 left-4 z-50 flex items-center space-x-3">
        <div className="w-10 h-10 flex items-center justify-center">
          <img 
            src="/Screenshot 2025-09-21 at 12.36.07 PM.svg" 
            alt="Rvidia Logo" 
            className="w-10 h-10 object-contain"
          />
        </div>
        <span className="text-white font-semibold text-xl tracking-wide">Rvidia</span>
      </div>

   {/* Text Overlay to Cover Spline Model Text */}
<div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
  <div className="bg-black px-12 py-6 rounded-none shadow-none">
    <h1
      className="text-6xl tracking-wider text-center whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
      style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
    >
      Divide. Distribute. Done.
    </h1>
  </div>  
</div>

      {/* Sign In / Sign Up Buttons - Top Right Corner */}
      <div className="absolute top-4 right-4 z-50 flex gap-3">
        <button
          onClick={() => router.push("/signin")}
          className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 hover:bg-white/5 rounded-md"
        >
          Sign In
        </button>
        <button
          onClick={() => router.push("/signup")}
          className="px-4 py-2 text-sm font-medium bg-transparent text-white rounded-md hover:bg-white hover:text-black transition-colors duration-200 border border-white"
        >
          Sign Up
        </button>
      </div>


     <div className="absolute bottom-4 right-4 z-50 bg-black px-4 py-2 rounded-lg shadow-lg">
  <span
    className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
    style={{
      fontFamily: "'Lato', sans-serif",
      fontWeight: 300,
      display: "inline-block",
      letterSpacing: "0.05em",
      animation: "wave 2s ease-in-out infinite",
    }}
  >
    {["C","o","m","p","u","t","e","."," ","S","h","a","r","e","."," ","C","o","n","q","u","e","r","."].map((char, i) => (
      <span
        key={i}
        style={{
          display: "inline-block",
          animationDelay: `${i * 0.05}s`,
        }}
      >
        {char}
      </span>
    ))}
  </span>

  <style jsx>{`
    @keyframes wave {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-3px); }
    }
  `}</style>
</div>



      {/* Content Overlay with Glassmorphism */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* This page now only shows the 3D model and Get Started button */}
      </div>
    </div>
  );
}
