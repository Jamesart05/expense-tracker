import { NextResponse } from "next/server";

import { getAuthSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Expense } from "@/lib/models/expense";
import { expenseSchema } from "@/lib/validators";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const expenses = await Expense.find({ userId: session.user.id }).sort({ spentAt: -1 }).lean();

  return NextResponse.json(
    expenses.map((expense) => ({
      ...expense,
      _id: expense._id.toString(),
      userId: expense.userId.toString(),
      spentAt: new Date(expense.spentAt).toISOString()
    }))
  );
}

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = expenseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await connectToDatabase();

  const expense = await Expense.create({
    ...parsed.data,
    spentAt: new Date(parsed.data.spentAt),
    userId: session.user.id
  });

  return NextResponse.json(
    {
      ...expense.toObject(),
      _id: expense._id.toString(),
      userId: expense.userId.toString()
    },
    { status: 201 }
  );
}
