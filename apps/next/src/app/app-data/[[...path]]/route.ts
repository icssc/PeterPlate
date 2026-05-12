import { type NextRequest, NextResponse } from "next/server";

async function handleProxy(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join("/");

  // Choose the host based on the path
  let targetHost = "https://us.i.posthog.com";
  if (path.startsWith("static/") || path.startsWith("array/")) {
    targetHost = "https://us-assets.i.posthog.com";
  }

  const url = new URL(req.url);
  const targetUrl = `${targetHost}/${path}${url.search}`;

  const requestHeaders = new Headers();
  if (req.headers.has("content-type")) {
    requestHeaders.set("content-type", req.headers.get("content-type")!);
  }

  // Forward the IP address if possible
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    req.ip ||
    "";
  if (ip) {
    requestHeaders.set("x-forwarded-for", ip);
  }

  // Forward User-Agent for correct device tracking
  if (req.headers.has("user-agent")) {
    requestHeaders.set("user-agent", req.headers.get("user-agent")!);
  }

  const options: RequestInit = {
    method: req.method,
    headers: requestHeaders,
    redirect: "manual",
  };

  // Only POST/PUT methods can have a body
  if (
    req.method !== "GET" &&
    req.method !== "HEAD" &&
    req.method !== "OPTIONS"
  ) {
    options.body = await req.arrayBuffer();
  }

  try {
    const response = await fetch(targetUrl, options);

    const responseHeaders = new Headers(response.headers);
    responseHeaders.set("Access-Control-Allow-Origin", "*");

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("PostHog Proxy Error:", error);
    return new NextResponse("Error proxying request", { status: 500 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const OPTIONS = handleProxy;
