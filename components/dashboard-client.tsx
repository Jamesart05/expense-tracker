"use client";

import { useEffect, useState } from "react";

import { AnalyticsCharts } from "@/components/charts";
import { ExpenseForm } from "@/components/expense-form";
import { ExpenseTable } from "@/components/expense-table";
import { SummaryCards } from "@/components/summary-cards";

type AnalyticsState = {
  summary: {
    totalSpent: number;
    averageSpend: number;
    transactions: number;
  };
  byCategory: Array<{ _id: string; value: number }>;
  monthlyTrend: Array<{ label: string; amount: number }>;
  recentExpenses: Array<{
    _id: string;
    amount: number;
    category: string;
    note?: string;
    paymentMethod: string;
    spentAt: string;
  }>;
};

type Props = {
  initialData: AnalyticsState;
  currency: string;
};

export function DashboardClient({ initialData, currency }: Props) {
  const [data, setData] = useState(initialData);

  async function refreshAnalytics() {
    const response = await fetch("/api/analytics");
    if (response.ok) {
      setData(await response.json());
    }
  }

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  return (
    <div className="dashboard-content">
      <SummaryCards {...data.summary} currency={currency} />
      <div className="dashboard-grid">
        <ExpenseForm onSaved={refreshAnalytics} />
        <div className="stack">
          <AnalyticsCharts trend={data.monthlyTrend} categories={data.byCategory} />
          <ExpenseTable
            expenses={data.recentExpenses}
            currency={currency}
            onDeleted={refreshAnalytics}
          />
        </div>
      </div>
    </div>
  );
}
