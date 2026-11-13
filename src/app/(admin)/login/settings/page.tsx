import { requireAuth } from "@/lib/auth";
import { changePassword } from "../actions";

export const metadata = { title: "Settings" };

const ERRORS: Record<string, string> = {
  current: "Your current password is incorrect.",
  short: "The new password must be at least 10 characters.",
  match: "The new passwords don't match.",
};

export default async function Settings({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAuth();
  const sp = await searchParams;
  return (
    <>
      <div className="main__head">
        <h1>Settings</h1>
      </div>
      {sp.error && <p className="flash flash--err">{ERRORS[sp.error] ?? "Something went wrong."}</p>}
      <section className="panel settings-card">
        <form action={changePassword} className="panel__body form-a">
          <h2 className="settings-card__title">Change your password</h2>
          <label>
            Current password
            <input name="current" type="password" autoComplete="current-password" required />
          </label>
          <label>
            New password
            <input name="next" type="password" autoComplete="new-password" minLength={10} required />
          </label>
          <label>
            Confirm new password
            <input name="confirm" type="password" autoComplete="new-password" minLength={10} required />
          </label>
          <div className="form-a__row">
            <button className="abtn abtn--lg" type="submit">
              Update password
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
