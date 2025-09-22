"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

/**
 * AuthTroubleshooter Component
 *
 * This component provides a user-friendly way to troubleshoot authentication issues,
 * particularly when dealing with invalid JWT tokens.
 */
export function AuthTroubleshooter() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");

  const clearAuthTokens = async () => {
    try {
      setStatus("loading");
      setMessage("Clearing authentication tokens...");

      // Call our API route that clears all auth cookies and redirects to signin
      window.location.href = "/api/clear-auth";

      // The redirect will happen automatically, but we set success state
      // in case there's any delay
      setStatus("success");
      setMessage(
        "Authentication tokens cleared. Redirecting to sign-in page..."
      );
    } catch (error) {
      console.error("Failed to clear auth tokens:", error);
      setStatus("error");
      setMessage("An error occurred while clearing tokens. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Authentication Troubleshooter</CardTitle>
        <CardDescription>
          If you're experiencing authentication issues or seeing "invalid token"
          errors, use this tool to reset your authentication state.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "error" && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {status === "success" && (
          <Alert className="mb-4">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <p className="text-sm text-muted-foreground mb-4">
          This will clear all authentication tokens and redirect you to the
          sign-in page. You'll need to sign in again after this process.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={clearAuthTokens}
          disabled={status === "loading"}
          className="w-full"
        >
          {status === "loading"
            ? "Clearing Tokens..."
            : "Clear Authentication Tokens"}
        </Button>
      </CardFooter>
    </Card>
  );
}
