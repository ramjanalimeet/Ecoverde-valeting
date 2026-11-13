import Link from "next/link";
import LoginForm from "./LoginForm";


export default function LoginScreen() {
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
