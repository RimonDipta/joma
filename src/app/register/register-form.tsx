"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, Wallet } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (new TextEncoder().encode(password).length > 72) {
      setError("Password must not exceed 72 UTF-8 bytes.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create your account.");
        return;
      }

      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!loginResult || loginResult.error) {
        router.push("/login?registered=true");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 py-12 text-white">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-10 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-black">
            <Wallet size={21} />
          </div>

          <span className="text-2xl font-semibold tracking-tight">Joma</span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-[#111113] p-7 shadow-2xl sm:p-9">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Start taking control of your finances.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="h-12 w-full rounded-lg border border-white/10 bg-[#09090b] px-4 text-sm outline-none transition placeholder:text-zinc-600 focus:border-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-12 w-full rounded-lg border border-white/10 bg-[#09090b] px-4 text-sm outline-none transition placeholder:text-zinc-600 focus:border-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className="h-12 w-full rounded-lg border border-white/10 bg-[#09090b] px-4 text-sm outline-none transition placeholder:text-zinc-600 focus:border-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                className="h-12 w-full rounded-lg border border-white/10 bg-[#09090b] px-4 text-sm outline-none transition placeholder:text-zinc-600 focus:border-emerald-500"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 font-medium text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Creating account..." : "Create account"}

              {!isLoading && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="mt-7 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-zinc-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-emerald-400 hover:text-emerald-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Your finances, organized.
        </p>
      </div>
    </main>
  );
}
