"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Mode = "login" | "register";

type Props = {
  mode: Mode;
  providers?: Array<"google" | "github">;
};

export function AuthForm({ mode, providers = [] }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      if (mode === "register") {
        const registerResponse = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const registerData = await registerResponse.json();

        if (!registerResponse.ok) {
          setError(registerData.error || "Unable to create account.");
          return;
        }
      }

      const loginResponse = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false
      });

      if (loginResponse?.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <p className="eyebrow">{mode === "login" ? "Welcome back" : "Start tracking"}</p>
        <h1>{mode === "login" ? "Sign in" : "Create your account"}</h1>
      </div>

      {mode === "register" ? (
        <label className="field">
          <span>Full name</span>
          <input name="name" type="text" placeholder="Jane Doe" required />
        </label>
      ) : null}

      <label className="field">
        <span>Email</span>
        <input name="email" type="email" placeholder="you@example.com" required />
      </label>

      {mode === "register" ? (
        <label className="field">
          <span>Preferred currency</span>
          <input name="currency" type="text" defaultValue="USD" maxLength={3} required />
        </label>
      ) : null}

      <label className="field">
        <span>Password</span>
        <input name="password" type="password" placeholder="At least 8 characters" required />
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <button className="button primary full-width" type="submit" disabled={loading}>
        {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
      </button>

      {providers.length ? (
        <div className="oauth-stack">
          {providers.includes("google") ? (
            <button
              className="button secondary full-width"
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              Continue with Google
            </button>
          ) : null}
          {providers.includes("github") ? (
            <button
              className="button secondary full-width"
              type="button"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            >
              Continue with GitHub
            </button>
          ) : null}
        </div>
      ) : null}

      <p className="form-footer">
        {mode === "login" ? "Need an account?" : "Already registered?"}{" "}
        <Link href={mode === "login" ? "/register" : "/login"}>
          {mode === "login" ? "Create one" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
