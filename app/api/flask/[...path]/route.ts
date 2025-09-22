import { NextRequest, NextResponse } from "next/server";

// Backend now runs on port 5000 (changed from 8000)
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const { path } = params;
    const pathString = path.join("/");
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    const fullPath = searchParams
      ? `${pathString}?${searchParams}`
      : pathString;

    console.log(`[PROXY] GET ${BACKEND_URL}/api/${fullPath}`);

    const response = await fetch(`${BACKEND_URL}/api/${fullPath}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Forward any authorization headers if needed
        ...(request.headers.get("authorization") && {
          Authorization: request.headers.get("authorization")!,
        }),
      },
    });

    if (!response.ok) {
      console.error(
        `[PROXY] Backend error: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: "Backend service unavailable", status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[PROXY] Error connecting to backend:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend service" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const { path } = params;
    const pathString = path.join("/");
    const body = await request.json();

    console.log(`[PROXY] POST ${BACKEND_URL}/api/${pathString}`);

    const response = await fetch(`${BACKEND_URL}/api/${pathString}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("authorization") && {
          Authorization: request.headers.get("authorization")!,
        }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(
        `[PROXY] Backend error: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: "Backend service unavailable", status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[PROXY] Error connecting to backend:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend service" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const { path } = params;
    const pathString = path.join("/");
    const body = await request.json();

    console.log(`[PROXY] PUT ${BACKEND_URL}/api/${pathString}`);

    const response = await fetch(`${BACKEND_URL}/api/${pathString}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("authorization") && {
          Authorization: request.headers.get("authorization")!,
        }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(
        `[PROXY] Backend error: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: "Backend service unavailable", status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[PROXY] Error connecting to backend:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend service" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const { path } = params;
    const pathString = path.join("/");

    console.log(`[PROXY] DELETE ${BACKEND_URL}/api/${pathString}`);

    const response = await fetch(`${BACKEND_URL}/api/${pathString}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("authorization") && {
          Authorization: request.headers.get("authorization")!,
        }),
      },
    });

    if (!response.ok) {
      console.error(
        `[PROXY] Backend error: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: "Backend service unavailable", status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[PROXY] Error connecting to backend:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend service" },
      { status: 500 }
    );
  }
}
