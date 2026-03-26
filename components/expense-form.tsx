"use client";

import { FormEvent, useState } from "react";

import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from "@/lib/constants";

type Props = {
  onSaved: () => Promise<void> | void;
};

export function ExpenseForm({ onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        setError("Unable to save expense.");
        return;
      }

      event.currentTarget.reset();
      await onSaved();
    } catch {
      setError("Network error while saving expense.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="section-heading">
        <h2>Add expense</h2>
      </div>
      <div className="grid-two">
        <label className="field">
          <span>Amount</span>
          <input name="amount" type="number" min="0.01" step="0.01" required />
        </label>
        <label className="field">
          <span>Date</span>
          <input name="spentAt" type="date" required />
        </label>
        <label className="field">
          <span>Category</span>
          <select name="category" required defaultValue="">
            <option value="" disabled>
              Select category
            </option>
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Payment method</span>
          <select name="paymentMethod" required defaultValue="">
            <option value="" disabled>
              Select method
            </option>
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        <span>Note</span>
        <textarea name="note" rows={3} placeholder="Optional details" />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button className="button primary" type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save expense"}
      </button>
    </form>
  );
}
