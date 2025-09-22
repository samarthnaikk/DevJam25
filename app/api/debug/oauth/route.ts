import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set",
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI,
    clientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
    clientSecretLength: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
    nodeEnv: process.env.NODE_ENV,
  });
}
