import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import { getAuthSession } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await getAuthSession();
  const providers = [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? (["google"] as const) : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? (["github"] as const) : [])
  ];

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="auth-shell">
      <AuthForm mode="register" providers={providers} />
    </main>
  );
}
