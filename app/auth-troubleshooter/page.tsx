import { AuthTroubleshooter } from "@/components/auth-troubleshooter";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthTroubleshooterPage() {
  return (
    <div className="container max-w-screen-sm py-8">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group mb-6 fixed top-2 left-4 z-20"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>Back to Home</span>
      </Link>

      <h1 className="text-2xl font-bold mb-6 text-center">
        Authentication Troubleshooter
      </h1>
      <p className="text-center mb-8 text-muted-foreground">
        Use this tool if you're experiencing authentication problems
      </p>

      <AuthTroubleshooter />

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          This page helps you resolve issues with invalid authentication tokens
          by clearing all authentication cookies and allowing you to sign in
          again.
        </p>
      </div>
    </div>
  );
}
