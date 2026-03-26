import { Types } from "mongoose";
import { startOfMonth, subMonths } from "date-fns";

import { Expense } from "@/lib/models/expense";

export async function getExpenseAnalytics(userId: string) {
  const now = new Date();
  const sixMonthsAgo = startOfMonth(subMonths(now, 5));
  const objectId = new Types.ObjectId(userId);

  const [totals, byCategory, monthlyTrend, recentExpenses] = await Promise.all([
    Expense.aggregate([
      { $match: { userId: objectId } },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$amount" },
          averageSpend: { $avg: "$amount" },
          transactions: { $sum: 1 }
        }
      }
    ]),
    Expense.aggregate([
      { $match: { userId: objectId } },
      {
        $group: {
          _id: "$category",
          value: { $sum: "$amount" }
        }
      },
      { $sort: { value: -1 } }
    ]),
    Expense.aggregate([
      {
        $match: {
          userId: objectId,
          spentAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$spentAt" },
            month: { $month: "$spentAt" }
          },
          amount: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]),
    Expense.find({ userId: objectId }).sort({ spentAt: -1 }).limit(8).lean()
  ]);

  const summary = totals[0] || { totalSpent: 0, averageSpend: 0, transactions: 0 };

  return {
    summary,
    byCategory,
    monthlyTrend: monthlyTrend.map((item) => ({
      label: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
      amount: item.amount
    })),
    recentExpenses: recentExpenses.map((expense) => ({
      ...expense,
      _id: expense._id.toString(),
      userId: expense.userId.toString(),
      spentAt: new Date(expense.spentAt).toISOString()
    }))
  };
}
