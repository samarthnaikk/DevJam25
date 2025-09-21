import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  try {
    console.log("=== Testing Google OAuth Configuration ===");

    // Check environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    console.log(
      "Client ID:",
      clientId ? `${clientId.substring(0, 20)}...` : "MISSING"
    );
    console.log(
      "Client Secret:",
      clientSecret ? `${clientSecret.substring(0, 10)}...` : "MISSING"
    );
    console.log("Redirect URI:", redirectUri);

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        {
          error: "Missing OAuth configuration",
          details: {
            hasClientId: !!clientId,
            hasClientSecret: !!clientSecret,
            hasRedirectUri: !!redirectUri,
          },
        },
        { status: 500 }
      );
    }

    // Test OAuth client creation
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    // Test generating auth URL
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
    });

    console.log("Generated test auth URL successfully");

    return NextResponse.json({
      success: true,
      message: "OAuth configuration appears valid",
      config: {
        clientIdLength: clientId.length,
        clientSecretLength: clientSecret.length,
        redirectUri: redirectUri,
        authUrlGenerated: true,
        testAuthUrl: authUrl.substring(0, 100) + "...",
      },
    });
  } catch (error) {
    console.error("OAuth configuration test failed:", error);
    return NextResponse.json(
      {
        error: "OAuth configuration test failed",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
