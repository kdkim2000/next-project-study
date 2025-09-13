// /app/api/me/route.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const GET = auth((req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  return NextResponse.json({ user: req.auth.user });
});
