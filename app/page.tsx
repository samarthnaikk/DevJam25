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
import { useEffect, useState } from "react";
import OptimizedSpline from "@/components/optimized-spline";

export default function HomePage() {
  const { isAuthenticated, user, loading } = useAuthContext();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

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
    <div className="relative min-h-screen overflow-hidden" onClick={() => setShowDropdown(false)}>
      {/* Spline 3D Background */}
      <div className="absolute inset-0 z-0">
        <OptimizedSpline 
          scene="https://prod.spline.design/KNeoX42LGSI6oW-F/scene.splinecode"
          className="w-full h-full"
        />
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

      {/* Get Started Button - Top Right Corner */}
<div className="absolute top-4 right-1 z-50">
  <div className="relative">
    <div
      className="relative w-auto max-w-[11rem] bg-black/90 border border-slate-700 shadow-lg rounded-xl overflow-hidden transition-all duration-500 ease-in-out"
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 hover:opacity-30 transition-opacity duration-300 rounded-xl"></div>

      <div className="relative z-10">
        {/* Get Started Header */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(!showDropdown);
          }}
          className={`flex items-center gap-1 px-9 py-2 text-sm font-semibold text-white transition-all duration-300 ${!showDropdown && 'hover:scale-105'}`}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-all duration-300">
            Get Started
          </span>
          <svg 
            className={`w-3 h-3 transform transition-transform duration-300 ${
              showDropdown ? 'rotate-180' : ''
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expanded Options */}
        <div className={`transition-all duration-500 ease-in-out ${
          showDropdown ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="border-t border-slate-600 px-2 pb-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/signup");
              }}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors duration-200 mt-2"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 font-medium text-sm">
                Sign Up
              </span>
              <p className="text-xs text-slate-400 mt-1">Create new account</p>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/signin");
              }}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 font-medium text-sm">
                Sign In
              </span>
              <p className="text-xs text-slate-400 mt-1">Access your account</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
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
