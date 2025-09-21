"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuthContext } from "@/components/auth-provider";
import { SessionManager } from "@/lib/client/session";
import { useRouter } from "next/navigation";

export function SignOutButton({
  variant = "default",
}: {
  variant?: "default" | "outline" | "destructive" | "ghost";
}) {
  const { signOut } = useAuthContext();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Clear session from SessionManager first
      SessionManager.clearSession();

      // Sign out from Auth context
      await signOut();

      // Redirect to home/login page after a small delay to ensure all state is cleared
      setTimeout(() => {
        router.push("/");
      }, 100);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleSignOut}
      className={`flex items-center space-x-2 ${
        variant === "outline"
          ? "bg-white text-primary hover:bg-gray-100 hover:text-primary border-white"
          : ""
      }`}
    >
      <LogOut className="h-4 w-4" />
      <span>Sign Out</span>
    </Button>
  );
}
