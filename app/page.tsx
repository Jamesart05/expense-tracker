import Link from "next/link";
import { BarChart3, ShieldCheck, WalletCards } from "lucide-react";

export default function HomePage() {
  return (
    <main className="landing-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">MERN + Next.js Expense Platform</p>
          <h1>Track every expense and understand where your money goes.</h1>
          <p className="hero-text">
            Expensely combines secure authentication, real-time expense management,
            category insights, and multi-month analytics in one dashboard.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="button primary">
              Create account
            </Link>
            <Link href="/login" className="button secondary">
              Sign in
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="stat-tile">
            <WalletCards size={24} />
            <strong>Expense Logging</strong>
            <span>Add, edit, and delete transactions instantly.</span>
          </div>
          <div className="stat-tile">
            <BarChart3 size={24} />
            <strong>Analytics</strong>
            <span>Monitor totals, trends, and category splits.</span>
          </div>
          <div className="stat-tile">
            <ShieldCheck size={24} />
            <strong>Complete Auth</strong>
            <span>Secure credentials auth with optional OAuth providers.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
