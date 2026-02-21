import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROXY_TIMEOUT_MS = 15_000;

// Hop-by-hop headers must not be forwarded to/from upstream.
const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "proxy-connection",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "content-encoding",
]);

function getApiBaseUrl(): string {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    throw new Error("Missing API_BASE_URL environment variable.");
  }
  return baseUrl.replace(/\/$/, "");
}

function getJwtFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");

  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.slice(7).trim();
    return token || null;
  }

  return (
    request.cookies.get("jwt")?.value ??
    request.cookies.get("token")?.value ??
    request.cookies.get("auth_token")?.value ??
    null
  );
}

function buildRequestHeaders(request: NextRequest, jwt: string | null): Headers {
  const headers = new Headers();

  for (const [key, value] of request.headers.entries()) {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase()) && key.toLowerCase() !== "host") {
      headers.set(key, value);
    }
  }

  headers.set("x-forwarded-host", request.headers.get("host") ?? "");
  headers.set("x-forwarded-proto", request.nextUrl.protocol.replace(":", ""));

  // TODO: Validate/verify JWT before forwarding once auth is implemented.
  // For now, all requests are public — token is forwarded as-is if present.
  if (jwt && !headers.has("authorization")) {
    headers.set("authorization", `Bearer ${jwt}`);
  }

  return headers;
}

function buildResponseHeaders(upstream: Response): Headers {
  const headers = new Headers();

  for (const [key, value] of upstream.headers.entries()) {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  }

  return headers;
}

function buildUpstreamUrl(baseUrl: string, search: string): URL {
  // API_BASE_URL is the full upstream endpoint (e.g. https://example.com/graphql).
  // Path segments from the catch-all are intentionally ignored — all requests
  // hit the same endpoint regardless of what sub-path the client used.
  const url = new URL(baseUrl);
  url.search = search;
  return url;
}

type Ctx = { params: Promise<{ path?: string[] }> };

async function forwardRequest(
  request: NextRequest,
  context: Ctx,
): Promise<Response> {
  let upstreamBaseUrl: string;

  try {
    upstreamBaseUrl = getApiBaseUrl();
  } catch (err) {
    console.error("[proxy] config error:", err);
    return Response.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }

  const upstreamUrl = buildUpstreamUrl(upstreamBaseUrl, request.nextUrl.search);

  const jwt = getJwtFromRequest(request);
  const method = request.method.toUpperCase();

  const init: RequestInit = {
    method,
    headers: buildRequestHeaders(request, jwt),
    redirect: "manual",
    signal: AbortSignal.timeout(PROXY_TIMEOUT_MS),
  };

  if (method !== "GET" && method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  let upstreamResponse: Response;

  try {
    upstreamResponse = await fetch(upstreamUrl, init);
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      console.error(`[proxy] upstream timeout after ${PROXY_TIMEOUT_MS}ms:`, upstreamUrl.href);
      return Response.json(
        { error: "Upstream request timed out.", upstream: upstreamUrl.href },
        { status: 504 },
      );
    }
    console.error("[proxy] upstream fetch failed:", err);
    return Response.json(
      { error: "Failed to reach upstream.", upstream: upstreamUrl.href },
      { status: 502 },
    );
  }

  const responseHeaders = buildResponseHeaders(upstreamResponse);

  // Surface upstream errors with a structured body when upstream returns non-2xx
  // and the response is not already JSON.
  if (!upstreamResponse.ok) {
    const contentType = upstreamResponse.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      const text = await upstreamResponse.text();
      console.warn(
        `[proxy] upstream ${upstreamResponse.status} from ${upstreamUrl.href}:`,
        text.slice(0, 300),
      );
      return Response.json(
        {
          error: "Upstream returned an error.",
          status: upstreamResponse.status,
          upstream: upstreamUrl.href,
          detail: text.slice(0, 500),
        },
        { status: upstreamResponse.status, headers: responseHeaders },
      );
    }
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

export async function GET(request: NextRequest, context: Ctx) {
  return forwardRequest(request, context);
}

export async function POST(request: NextRequest, context: Ctx) {
  return forwardRequest(request, context);
}

export async function PUT(request: NextRequest, context: Ctx) {
  return forwardRequest(request, context);
}

export async function PATCH(request: NextRequest, context: Ctx) {
  return forwardRequest(request, context);
}

export async function DELETE(request: NextRequest, context: Ctx) {
  return forwardRequest(request, context);
}

export async function HEAD(request: NextRequest, context: Ctx) {
  return forwardRequest(request, context);
}

export async function OPTIONS(request: NextRequest, context: Ctx) {
  return forwardRequest(request, context);
}
