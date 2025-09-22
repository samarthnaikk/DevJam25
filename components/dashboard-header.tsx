"use client";

import { useAuthContext } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function DashboardHeader() {
  const { user, signOut } = useAuthContext();
  const router = useRouter();

  if (!user) return null;

  // Check if user is admin (handle both cases)
  const isAdmin = user.role?.toLowerCase() === "admin";

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-black border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between relative">
        {/* Left side with Dashboard text */}
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
          <div className="min-w-0">
            <h1 
              className="text-lg sm:text-xl font-semibold text-white truncate"
              style={{ fontFamily: 'Lato, sans-serif', fontWeight: '400' }}
            >
              {isAdmin ? "Admin Dashboard" : "My Dashboard"}
            </h1>
            <p 
              className="text-xs sm:text-sm text-white/60 truncate"
              style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}
            >
              Welcome back, {user.name}
            </p>
          </div>
        </div>

        {/* Centered Logo and Rvidia - Hidden on small screens */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center">
            <img
              src="/Screenshot 2025-09-21 at 12.36.07 PM.svg"
              alt="Rvidia Logo"
              className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
            />
          </div>
          <span
            className="text-white font-semibold text-lg lg:text-xl tracking-wide"
            style={{ fontFamily: "Lato, sans-serif", fontWeight: "400" }}
          >
            Rvidia
          </span>
        </div>

        {/* Right side with sign out button */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="flex items-center space-x-1 sm:space-x-2 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-red-400/50 transition-all duration-300 px-2 sm:px-3"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline text-xs sm:text-sm" style={{ fontFamily: 'Lato, sans-serif', fontWeight: '300' }}>Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
