import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/dashboard");
  return (
    <main className="login">
      <div className="login__card">
        <div className="login__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="" />
          <span>
            eco<b>verde</b>
          </span>
        </div>
        <h1>Welcome back</h1>
        <p className="login__sub">Sign in to your bookings dashboard</p>
        <LoginForm />
        <Link href="/" className="login__back">
          ← Back to website
        </Link>
      </div>
    </main>
  );
}
