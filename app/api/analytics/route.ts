import { NextResponse } from "next/server";

import { getExpenseAnalytics } from "@/lib/analytics";
import { getAuthSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const analytics = await getExpenseAnalytics(session.user.id);
  return NextResponse.json(analytics);
}
