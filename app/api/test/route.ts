// app/api/test/route.ts

import { connectDB } from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  return Response.json({ message: "Database Connected Successfully" });
}