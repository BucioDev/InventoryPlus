// app/api/session/route.ts
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/app/lib"; // your file path
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore  = await cookies();
  
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)

  return NextResponse.json({
    location: session.location ?? null,
    role: session.role ?? null,
  });
}
