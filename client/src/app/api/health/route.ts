import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Disable edge caching

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}
