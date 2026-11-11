import { SITE } from "@/data/site";
import { getEnv, getSetting } from "@/lib/db";
import { changePassword, saveSettings } from "../actions";

export const metadata = { title: "Settings" };

const ERRORS: Record<string, string> = {
  email: "That notification email address doesn't look right.",
  current: "Your current password is incorrect.",
  short: "The new password must be at least 10 characters.",
  match: "The new passwords don't match.",
};

export default async function Settings({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const notify = (await getSetting("notify_email")) || "";
  const owner = (await getSetting("owner_name")) || "John";
  const fallback = (await getEnv("QUOTE_TO_EMAIL")) || SITE.email;
  const hasKey = Boolean(await getEnv("RESEND_API_KEY"));

  return (
    <>
      <div className="main__head">
        <h1>Settings</h1>
      </div>
      {sp.saved && <p className="flash">Settings saved.</p>}
      {sp.error && <p className="flash flash--err">{ERRORS[sp.error] ?? "Something went wrong."}</p>}
      <div className="grid2">
        <section className="panel">
          <div className="panel__head">
            <h2>Notifications</h2>
          </div>
          <form action={saveSettings} className="panel__body form-a">
            <label>
              Your name <span className="hint">(shown on the overview)</span>
              <input name="owner_name" defaultValue={owner} maxLength={60} />
            </label>
            <label>
              Send new quote requests to
              <input name="notify_email" type="email" defaultValue={notify} placeholder={fallback} />
              <span className="hint">Leave blank to use {fallback}.</span>
            </label>
            <p className="main__hello">
              Email delivery: <strong>{hasKey ? "connected (Resend)" : "not set up — add RESEND_API_KEY on the Worker"}</strong>
            </p>
            <div className="form-a__row">
              <button className="abtn" type="submit">
                Save settings
              </button>
            </div>
          </form>
        </section>
        <section className="panel">
          <div className="panel__head">
            <h2>Change password</h2>
          </div>
          <form action={changePassword} className="panel__body form-a">
            <label>
              Current password
              <input name="current" type="password" autoComplete="current-password" required />
            </label>
            <label>
              New password <span className="hint">(at least 10 characters)</span>
              <input name="next" type="password" autoComplete="new-password" minLength={10} required />
            </label>
            <label>
              Confirm new password
              <input name="confirm" type="password" autoComplete="new-password" minLength={10} required />
            </label>
            <p className="main__hello">Changing the password signs you out everywhere.</p>
            <div className="form-a__row">
              <button className="abtn" type="submit">
                Update password
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
