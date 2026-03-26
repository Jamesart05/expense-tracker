import { redirect } from "next/navigation";

import { DashboardClient } from "@/components/dashboard-client";
import { SignOutButton } from "@/components/sign-out-button";
import { getExpenseAnalytics } from "@/lib/analytics";
import { getAuthSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";

export default async function DashboardPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectToDatabase();
  const analytics = await getExpenseAnalytics(session.user.id);

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Expense intelligence</p>
          <h1>{session.user.name?.split(" ")[0] || "User"}, here is your overview.</h1>
        </div>
        <SignOutButton />
      </header>
      <DashboardClient initialData={analytics} currency={session.user.currency || "USD"} />
    </main>
  );
}
