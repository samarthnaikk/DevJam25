import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Temporarily disable ProtectedRoute for debugging
  return <>{children}</>;
}
