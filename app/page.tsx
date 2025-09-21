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
      {/* Home Section */}
      <div className="relative min-h-screen">
        {/* Spline 3D Background - Only for Hero Section */}
        <div className="absolute inset-0 z-0 pointer-events-none">
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
        
          <span
            className="text-white font-semibold text-3xl tracking-wide"
            style={{ fontFamily: "Open Sans", fontWeight: "300" }}
          >
            Rvidia
          </span>
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

          <style jsx>{`
            @keyframes wave {
              0%,
              100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-3px);
              }
            }
          `}</style>
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
                className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto mb-12"
                style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
              >
                We envision a future where computational power knows no boundaries. 
                By democratizing access to high-performance computing resources, 
                we're empowering innovators, researchers, and businesses to push 
                the limits of what's possible in our digital age.
              </p>
              
              <p
                className="text-lg text-white/80 leading-relaxed max-w-3xl mx-auto"
                style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
              >
                At Rvidia, we're revolutionizing distributed computing by making it accessible, 
                efficient, and profitable for everyone. Our platform connects computational resources 
                worldwide, creating a seamless ecosystem where power is shared and innovation thrives.
              </p>
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
                <Card 
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/15 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))"
                  }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-400/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-400/20 to-transparent"></div>
                  
                  <CardHeader className="relative z-10">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 mx-auto border-2 border-purple-400 group-hover:border-purple-300 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-400/50">
                      <img 
                        src="/team/suyash-singh.jpg" 
                        alt="Suyash Singh" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center" style={{display: 'none'}}>
                        <span className="text-white font-bold text-2xl">SS</span>
                      </div>
                    </div>
                    <CardTitle className="text-white text-xl text-center group-hover:text-purple-300 transition-colors duration-300" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Suyash Singh
                    </CardTitle>
                    <p className="text-purple-300 text-sm text-center font-medium group-hover:text-purple-200 transition-colors duration-300" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Frontend UI
                    </p>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-white/70 text-center group-hover:text-white/90 transition-colors duration-300" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Crafting beautiful and intuitive user interfaces that make complex distributed computing accessible to everyone.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              {/* Team Member 2 - Ishhan Kheria */}
              <div 
                className="group relative"
                style={{
                  animation: "slideInUp 0.6s ease-out 0.2s both"
                }}
              >
                <Card 
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/15 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))"
                  }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-400/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-400/20 to-transparent"></div>
                  
                  <CardHeader className="relative z-10">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 mx-auto border-2 border-purple-400 group-hover:border-purple-300 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-400/50">
                      <img 
                        src="/team/ishhan-kheria.jpg" 
                        alt="Ishhan Kheria" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center" style={{display: 'none'}}>
                        <span className="text-white font-bold text-2xl">IK</span>
                      </div>
                    </div>
                    <CardTitle className="text-white text-xl text-center group-hover:text-purple-300 transition-colors duration-300" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Ishhan Kheria
                    </CardTitle>
                    <p className="text-purple-300 text-sm text-center font-medium group-hover:text-purple-200 transition-colors duration-300" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Frontend API
                    </p>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-white/70 text-center group-hover:text-white/90 transition-colors duration-300" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Building seamless connections between user interfaces and backend services for optimal performance.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              {/* Team Member 3 - Samarth Naik */}
              <div 
                className="group relative"
                style={{
                  animation: "slideInUp 0.6s ease-out 0.3s both"
                }}
              >
                <Card 
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/15 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))"
                  }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-400/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-400/20 to-transparent"></div>
                  
                  <CardHeader className="relative z-10">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 mx-auto border-2 border-purple-400 group-hover:border-purple-300 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-400/50">
                      <img 
                        src="/team/samarth-naik.jpg" 
                        alt="Samarth Naik" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center" style={{display: 'none'}}>
                        <span className="text-white font-bold text-2xl">SN</span>
                      </div>
                    </div>
                    <CardTitle className="text-white text-xl text-center group-hover:text-purple-300 transition-colors duration-300" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Samarth Naik
                    </CardTitle>
                    <p className="text-purple-300 text-sm text-center font-medium group-hover:text-purple-200 transition-colors duration-300" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Backend
                    </p>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-white/70 text-center group-hover:text-white/90 transition-colors duration-300" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Developing robust server infrastructure and distributed computing algorithms that power our platform.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              {/* Team Member 4 - Inesh Ingid */}
              <div 
                className="group relative"
                style={{
                  animation: "slideInUp 0.6s ease-out 0.4s both"
                }}
              >
                <Card 
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/15 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))"
                  }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-400/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-400/20 to-transparent"></div>
                  
                  <CardHeader className="relative z-10">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 mx-auto border-2 border-purple-400 group-hover:border-purple-300 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-400/50">
                      <img 
                        src="/team/inesh-ingid.jpg" 
                        alt="Inesh Ingid" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center" style={{display: 'none'}}>
                        <span className="text-white font-bold text-2xl">II</span>
                      </div>
                    </div>
                    <CardTitle className="text-white text-xl text-center group-hover:text-purple-300 transition-colors duration-300" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Inesh Ingid
                    </CardTitle>
                    <p className="text-purple-300 text-sm text-center font-medium group-hover:text-purple-200 transition-colors duration-300" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Design & Research
                    </p>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-white/70 text-center group-hover:text-white/90 transition-colors duration-300" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Leading user experience design and conducting research to drive innovation in distributed computing.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Add CSS animations */}
            <style jsx>{`
              @keyframes slideInUp {
                0% {
                  opacity: 0;
                  transform: translateY(50px);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        </div>
      </div>

      {/* Content Overlay with Glassmorphism */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* This page now only shows the 3D model and Get Started button */}
      </div>
    </div>
  );
}
