type Props = {
  totalSpent: number;
  averageSpend: number;
  transactions: number;
  currency: string;
};

export function SummaryCards({ totalSpent, averageSpend, transactions, currency }: Props) {
  const cards = [
    { label: "Total spent", value: formatCurrency(totalSpent, currency) },
    { label: "Average transaction", value: formatCurrency(averageSpend, currency) },
    { label: "Transactions", value: transactions.toString() }
  ];

  return (
    <section className="summary-grid">
      {cards.map((card) => (
        <article key={card.label} className="summary-card">
          <span>{card.label}</span>
          <strong>{card.value}</strong>
        </article>
      ))}
    </section>
  );
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD"
  }).format(value || 0);
}
