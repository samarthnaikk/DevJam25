"use client";

import { useAuthContext } from "@/components/auth-provider";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { RoleDemoInfo } from "@/components/role-demo-info";
import { SessionManager } from "@/lib/client/session";
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

  // Removed automatic redirect - users can manually navigate to dashboard/admin
  // useEffect(() => {
  //   if (isAuthenticated && user) {
  //     if (user.role === "ADMIN" || user.role === "admin") {
  //       router.push("/admin");
  //     } else {
  //       router.push("/dashboard");
  //     }
  //   }
  // }, [isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  // Removed the automatic redirect for authenticated users - now they can see the homepage

  return (
    <div className="relative overflow-x-hidden">
      {/* Fixed Header - Only show when not authenticated */}
      {!isAuthenticated && (
        <header className="fixed top-0 left-0 right-0 z-[100] bg-black border-b border-white/10">
          <div className="w-full px-6 py-4 flex items-start justify-between">
            {/* Logo and Brand - Top Left Corner */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                  src="/Screenshot 2025-09-21 at 12.36.07 PM.svg"
                  alt="Rvidia Logo"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <span
                className="text-white font-semibold text-4xl tracking-wide"
                style={{ fontFamily: "Lato, sans-serif", fontWeight: "375" }}
              >
                Rvidia
              </span>
            </div>

            {/* Navigation Buttons - Top Right Corner */}
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/signin")}
                className="px-3 py-1.5 text-xl text-white hover:text-white/80 transition-colors duration-200 hover:bg-white/5 rounded-md"
                style={{ fontFamily: "Lato, sans-serif", fontWeight: "300" }}
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="px-3 py-1.5 text-xl bg-[#0B42F4] text-white rounded-md transition-colors duration-200"
                style={{ fontFamily: "Lato, sans-serif", fontWeight: "300" }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Home Section */}
      <div className="relative min-h-screen">
        {/* Spline 3D Background - Only for Hero Section */}
        <div className="absolute inset-0 z-0 pointer-events-none">
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
              style={{ fontFamily: "Lato, sans-serif", fontWeight: "300" }}
            >
              Divide. Distribute. Done.
            </h1>
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
            {[
              "C",
              "o",
              "m",
              "p",
              "u",
              "t",
              "e",
              ".",
              " ",
              "S",
              "h",
              "a",
              "r",
              "e",
              ".",
              " ",
              "C",
              "o",
              "n",
              "q",
              "u",
              "e",
              "r",
              ".",
            ].map((char, i) => (
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
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex flex-col items-center space-y-2 animate-bounce">
            <span className="text-white/60 text-sm font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>
              Scroll to learn more
            </span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to give the 3D model more room */}
      <div className="bg-black h-32"></div>

      {/* Section Divider 1 - Hero to Vision */}
      <div className="relative z-10 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-32 h-px bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Vision Section */}
      <div className="relative min-h-screen z-10 bg-black">
        {/* SVG Background Elements - Only 07.svg */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* 07.svg - Left side covering left part */}
          <img 
            src="/07.svg" 
            alt="" 
            className="absolute opacity-60"
            style={{
              left: '-200px',
              top: '0px',
              width: '800px',
              height: '800px',
              filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))'
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Our Vision Header */}
            <div className="text-center mb-16">
              <h2
                className="text-5xl md:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6"
                style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
              >
                Our Vision
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto"></div>
            </div>

            {/* Vision Content */}
            <div className="text-center">
             
              
              <p
                className="text-4xl text-white/80 leading-relaxed max-w-3xl mx-auto"
                style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
              >
               To democratize high-performance computing by dividing one task across many computers, making computation faster, smarter, and accessible to everyone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Divider 2 - Vision to About Us */}
      <div className="relative z-10 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-32 h-px bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="relative min-h-screen z-10 bg-black">
        {/* SVG Background Elements - Only 4.svg */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* 4.svg - Right side */}
          <img 
            src="/4.svg" 
            alt="" 
            className="absolute opacity-50"
            style={{
              left: '743px',
              top: '433px',
              width: '893px',
              height: '858px',
              filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))'
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* About Us Header */}
            <div className="text-center mb-16">
              <h2
                className="text-5xl md:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6"
                style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
              >
                About Us
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto"></div>
            </div>

            {/* Team Information */}
            <div className="text-center mb-20">
              <p
                className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto mb-12"
                style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
              >
                We are a dedicated team of 4 passionate individuals, each bringing unique expertise 
                to revolutionize the distributed computing landscape.
              </p>
            </div>

            {/* Team Members */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {/* Team Member 1 - Suyash Singh */}
              <div 
                className="group relative"
                style={{
                  animation: "slideInUp 0.6s ease-out 0.1s both"
                }}
              >
                <div 
                  className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden rounded-lg"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))"
                  }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-400/20 to-transparent z-10"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-400/20 to-transparent z-10"></div>
                  
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src="/team/suyash-singh.jpg" 
                      alt="Suyash Singh" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-4xl" style={{display: 'none'}}>
                      SS
                    </div>
                    
                    {/* Hover Overlay with Details */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                      <div className="text-center">
                        <p className="text-purple-300 text-sm font-medium mb-4" style={{ fontFamily: 'Lato, sans-serif' }}>
                          Frontend UI
                        </p>
                        <p className="text-white/80 text-xs leading-relaxed" style={{ fontFamily: 'Lato, sans-serif' }}>
                          Crafting beautiful and intuitive user interfaces that make complex distributed computing accessible to everyone.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Name and Role Section */}
                  <div className="p-4 relative z-10">
                    <h3 className="text-white text-lg font-semibold text-center group-hover:text-purple-300 transition-colors duration-300" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Suyash Singh
                    </h3>
                  </div>
                </div>
              </div>

              {/* Team Member 2 - Ishhan Kheria */}
              <div 
                className="group relative"
                style={{
                  animation: "slideInUp 0.6s ease-out 0.2s both"
                }}
              >
                <div 
                  className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden rounded-lg"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))"
                  }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-400/20 to-transparent z-10"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-400/20 to-transparent z-10"></div>
                  
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src="/team/ishhan-kheria.jpg" 
                      alt="Ishhan Kheria" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-4xl" style={{display: 'none'}}>
                      IK
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                      <div className="text-center">
                        <p className="text-purple-300 text-sm font-medium mb-4" style={{ fontFamily: 'Lato, sans-serif' }}>
                          Frontend API
                        </p>
                        <p className="text-white/80 text-xs leading-relaxed" style={{ fontFamily: 'Lato, sans-serif' }}>
                          Building seamless connections between user interfaces and backend services for optimal performance.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Name and Role Section */}
                  <div className="p-4 relative z-10">
                    <h3 className="text-white text-lg font-semibold text-center group-hover:text-purple-300 transition-colors duration-300" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Ishhan Kheria
                    </h3>
                  </div>
                </div>
              </div>

              {/* Team Member 3 - Samarth Naik */}
              <div 
                className="group relative"
                style={{
                  animation: "slideInUp 0.6s ease-out 0.3s both"
                }}
              >
                <div 
                  className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden rounded-lg"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))"
                  }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-400/20 to-transparent z-10"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-400/20 to-transparent z-10"></div>
                  
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src="/team/samarth-naik.jpg" 
                      alt="Samarth Naik" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-4xl" style={{display: 'none'}}>
                      SN
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                      <div className="text-center">
                        <p className="text-purple-300 text-sm font-medium mb-4" style={{ fontFamily: 'Lato, sans-serif' }}>
                          Backend
                        </p>
                        <p className="text-white/80 text-xs leading-relaxed" style={{ fontFamily: 'Lato, sans-serif' }}>
                          Developing robust server infrastructure and distributed computing algorithms that power our platform.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Name and Role Section */}
                  <div className="p-4 relative z-10">
                    <h3 className="text-white text-lg font-semibold text-center group-hover:text-purple-300 transition-colors duration-300" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Samarth Naik
                    </h3>
                  </div>
                </div>
              </div>

              {/* Team Member 4 - Inesh Ingid */}
              <div 
                className="group relative"
                style={{
                  animation: "slideInUp 0.6s ease-out 0.4s both"
                }}
              >
                <div 
                  className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden rounded-lg"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))"
                  }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-400/20 to-transparent z-10"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-400/20 to-transparent z-10"></div>
                  
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src="/team/inesh-ingid.jpg" 
                      alt="Inesh Ingid" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-4xl" style={{display: 'none'}}>
                      II
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                      <div className="text-center">
                        <p className="text-purple-300 text-sm font-medium mb-4" style={{ fontFamily: 'Lato, sans-serif' }}>
                          Design & Research
                        </p>
                        <p className="text-white/80 text-xs leading-relaxed" style={{ fontFamily: 'Lato, sans-serif' }}>
                          Leading user experience design and conducting research to drive innovation in distributed computing.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Name and Role Section */}
                  <div className="p-4 relative z-10">
                    <h3 className="text-white text-lg font-semibold text-center group-hover:text-purple-300 transition-colors duration-300" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Inesh Ingid
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="relative z-10 bg-black border-t border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Footer Main Content */}
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Company Info */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img
                      src="/Screenshot 2025-09-21 at 12.36.07 PM.svg"
                      alt="Rvidia Logo"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <span
                    className="text-white font-semibold text-2xl tracking-wide"
                    style={{ fontFamily: "Lato, sans-serif", fontWeight: "375" }}
                  >
                    Rvidia
                  </span>
                </div>
                <p
                  className="text-white/70 text-sm leading-relaxed mb-4 max-w-md"
                  style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
                >
                  Democratizing high-performance computing through distributed processing. 
                  Making computation faster, smarter, and accessible to everyone.
                </p>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3
                  className="text-white font-semibold text-lg mb-4"
                  style={{ fontFamily: 'Lato, sans-serif', fontWeight: '400' }}
                >
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#vision"
                      className="text-white/60 hover:text-white transition-colors text-sm"
                      style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
                    >
                      Our Vision
                    </a>
                  </li>
                  <li>
                    <a
                      href="#about"
                      className="text-white/60 hover:text-white transition-colors text-sm"
                      style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={() => router.push("/signin")}
                      className="text-white/60 hover:text-white transition-colors text-sm text-left"
                      style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
                    >
                      Sign In
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => router.push("/signup")}
                      className="text-white/60 hover:text-white transition-colors text-sm text-left"
                      style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
                    >
                      Get Started
                    </button>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3
                  className="text-white font-semibold text-lg mb-4"
                  style={{ fontFamily: 'Lato, sans-serif', fontWeight: '400' }}
                >
                  Connect
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    </div>
                    <span
                      className="text-white/60 text-sm"
                      style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
                    >
                      hello@rvidia.com
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    </div>
                    <span
                      className="text-white/60 text-sm"
                      style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
                    >
                      support@rvidia.com
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <p
                    className="text-white/50 text-sm"
                    style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
                  >
                    © 2025 Rvidia. All rights reserved.
                  </p>
                </div>
                <div className="flex items-center space-x-6">
                  <a
                    href="#"
                    className="text-white/50 hover:text-white transition-colors text-sm"
                    style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    className="text-white/50 hover:text-white transition-colors text-sm"
                    style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
                  >
                    Terms of Service
                  </a>
                  <div className="flex items-center space-x-2">
                    <span
                      className="text-white/30 text-xs"
                      style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
                    >
                      Built with
                    </span>
                    <div className="w-1 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                    <span
                      className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 text-xs font-medium"
                      style={{ fontFamily: 'Lato, sans-serif' }}
                    >
                      distributed computing
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
