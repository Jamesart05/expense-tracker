"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const COLORS = ["#ff6b6b", "#f7b801", "#6c9eff", "#31c48d", "#9b5de5", "#06b6d4"];

type TrendItem = {
  label: string;
  amount: number;
};

type CategoryItem = {
  _id: string;
  value: number;
};

type Props = {
  trend: TrendItem[];
  categories: CategoryItem[];
};

export function AnalyticsCharts({ trend, categories }: Props) {
  return (
    <section className="chart-grid">
      <article className="chart-card">
        <div className="section-heading">
          <h2>Monthly spend trend</h2>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff6b6b" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#ff6b6b" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#ff6b6b"
                strokeWidth={3}
                fill="url(#spendGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="chart-card">
        <div className="section-heading">
          <h2>Category breakdown</h2>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categories} dataKey="value" nameKey="_id" outerRadius={100}>
                {categories.map((entry, index) => (
                  <Cell key={entry._id} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
