import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import https from "https";

const backendBaseUrl =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

const proxyClient = axios.create({
  baseURL: backendBaseUrl,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  ...(process.env.API_ALLOW_SELF_SIGNED === "true" && {
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  }),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const endpoint = `/${path.join("/")}`;

  const authHeader = request.headers.get("Authorization");
  const cookieToken = request.cookies.get("auth-token")?.value;
  const token =
    authHeader || (cookieToken ? `Bearer ${cookieToken}` : undefined);

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = token;
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // empty body is fine
  }

  try {
    const response = await proxyClient.post(endpoint, body, { headers });
    return NextResponse.json(response.data);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return NextResponse.json(err.response.data, {
        status: err.response.status,
      });
    }
    return NextResponse.json(
      {
        statusCode: -1,
        statusDesc: "Error de conexión con el servidor",
        payload: null,
      },
      { status: 502 },
    );
  }
}
