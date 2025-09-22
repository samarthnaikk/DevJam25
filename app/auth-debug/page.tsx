"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SessionManager } from "@/lib/client/session";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthDebugPage() {
  const [session, setSession] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const testSession = async () => {
    setLoading(true);
    addLog("Starting session test...");

    try {
      // Debug cookies first
      addLog("Checking document cookies...");
      SessionManager.debugCookies();

      // Try to get session
      addLog("Attempting to get session...");
      const sessionData = await SessionManager.getSession();

      if (sessionData) {
        addLog("Session retrieved successfully!");
        setSession(sessionData);
      } else {
        addLog("No session found or session invalid");
        setSession(null);
      }
    } catch (error) {
      addLog(`Error during session test: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const signOut = async () => {
    setLoading(true);
    addLog("Attempting to sign out...");

    try {
      await SessionManager.signOut();
      addLog("Sign out completed");
      setSession(null);
    } catch (error) {
      addLog(`Error during sign out: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group mb-6 fixed top-2 left-4 z-20"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>Back to Home</span>
      </Link>

      <h1 className="text-2xl font-bold mb-6">Authentication Debug Tool</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>Test authentication functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testSession} disabled={loading} className="w-full">
              Test Session
            </Button>
            <Button
              onClick={signOut}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Sign Out
            </Button>
            <Button onClick={clearLogs} variant="secondary" className="w-full">
              Clear Logs
            </Button>
          </CardContent>
        </Card>

        {/* Session Data */}
        <Card>
          <CardHeader>
            <CardTitle>Current Session</CardTitle>
          </CardHeader>
          <CardContent>
            {session ? (
              <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            ) : (
              <p className="text-muted-foreground">No active session</p>
            )}
          </CardContent>
        </Card>

        {/* Logs */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Debug Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-64 overflow-auto">
              {logs.length === 0 ? (
                <p>No logs yet. Click "Test Session" to start debugging.</p>
              ) : (
                logs.map((log, index) => <div key={index}>{log}</div>)
              )}
            </div>
          </CardContent>
        </Card>

        {/* Browser Cookies */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Browser Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded text-sm">
              <pre>{document.cookie || "No cookies found"}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
