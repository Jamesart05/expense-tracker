"use client";

import { FormEvent, useState } from "react";

import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from "@/lib/constants";

type ExpenseItem = {
  _id: string;
  amount: number;
  category: string;
  note?: string;
  paymentMethod: string;
  spentAt: string;
};

type Props = {
  expenses: ExpenseItem[];
  currency: string;
  onDeleted: () => Promise<void> | void;
};

export function ExpenseTable({ expenses, currency, onDeleted }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);

  async function removeExpense(id: string) {
    const response = await fetch(`/api/expenses/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      await onDeleted();
    }
  }

  async function updateExpense(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch(`/api/expenses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      setEditingId(null);
      await onDeleted();
    }
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Recent expenses</h2>
      </div>
      <div className="table-wrap">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Method</th>
              <th>Note</th>
              <th>Amount</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              editingId === expense._id ? (
                <tr key={expense._id}>
                  <td colSpan={6}>
                    <form
                      className="inline-edit-form"
                      onSubmit={(event) => updateExpense(event, expense._id)}
                    >
                      <input
                        name="spentAt"
                        type="date"
                        defaultValue={expense.spentAt.slice(0, 10)}
                        required
                      />
                      <select name="category" defaultValue={expense.category} required>
                        {EXPENSE_CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <select
                        name="paymentMethod"
                        defaultValue={expense.paymentMethod}
                        required
                      >
                        {PAYMENT_METHODS.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                      <input name="note" type="text" defaultValue={expense.note || ""} />
                      <input
                        name="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        defaultValue={expense.amount}
                        required
                      />
                      <div className="inline-actions">
                        <button className="text-button" type="submit">
                          Save
                        </button>
                        <button
                          className="text-button muted-button"
                          type="button"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              ) : (
                <tr key={expense._id}>
                  <td>{new Date(expense.spentAt).toLocaleDateString()}</td>
                  <td>{expense.category}</td>
                  <td>{expense.paymentMethod}</td>
                  <td>{expense.note || "-"}</td>
                  <td>{formatCurrency(expense.amount, currency)}</td>
                  <td>
                    <div className="row-actions">
                      <button className="text-button" onClick={() => setEditingId(expense._id)}>
                        Edit
                      </button>
                      <button className="text-button" onClick={() => removeExpense(expense._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            ))}
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  No expenses yet. Add your first transaction to unlock analytics.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD"
  }).format(value || 0);
}
