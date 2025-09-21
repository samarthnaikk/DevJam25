import { AuthTroubleshooter } from "@/components/auth-troubleshooter";

export default function AuthTroubleshooterPage() {
  return (
    <div className="container max-w-screen-sm py-8">
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
