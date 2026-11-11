"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { PET_OPTIONS, PRIMARY_PHONE, SERVICE_MENU, whatsappLink } from "@/data/site";
import {
  ACCEPT_ATTR,
  MAX_FILES,
  NOT_SURE,
  serviceLabel,
  validatePhotos,
  validateQuote,
  type FieldErrors,
  type QuoteFields,
} from "@/lib/quote";
import { CheckIcon, CloseIcon, PhoneIcon, UploadIcon, WhatsAppIcon } from "./Icons";

const EMPTY: QuoteFields = {
  name: "",
  phone: "",
  address: "",
  email: "",
  car: "",
  pets: "",
  service: "",
  message: "",
  consent: false,
};

type Status = "idle" | "sending" | "success" | "error";

export default function QuoteModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [fields, setFields] = useState<QuoteFields>(EMPTY);
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [sentName, setSentName] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uid = useId();

  const open = useCallback((service?: string | null) => {
    const d = dialogRef.current;
    if (!d) return;
    if (service && serviceLabel(service)) setFields((f) => ({ ...f, service }));
    setStatus((st) => (st === "success" ? "idle" : st));
    lastFocus.current = document.activeElement as HTMLElement | null;
    if (!d.open) d.showModal();
    document.documentElement.classList.add("modal-open");
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  // Any link to "#quote" (Book Now, Get a Free Quote, service cards, menus, footer) opens the modal,
  // preselecting ?service=<slug> when present.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.hash !== "#quote") return;
      // Capture phase on window runs before Next <Link>'s handler, so we can take over the click.
      e.preventDefault();
      e.stopPropagation();
      open(url.searchParams.get("service"));
    };
    window.addEventListener("click", onClick, true);
    // Deep link: /?service=slug#quote
    if (location.hash === "#quote") {
      open(new URLSearchParams(location.search).get("service"));
      history.replaceState(null, "", location.pathname);
    }
    return () => window.removeEventListener("click", onClick, true);
  }, [open]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const set = <K extends keyof QuoteFields>(k: K, v: QuoteFields[K]) => {
    setFields((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onFiles = (list: FileList | null) => {
    const next = [...photos, ...Array.from(list ?? [])].slice(0, MAX_FILES + 1);
    const err = validatePhotos(next);
    setErrors((e) => ({ ...e, photos: err }));
    if (!err) setPhotos(next);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (status === "sending") return;
    const errs = { ...validateQuote(fields), photos: validatePhotos(photos) };
    const firstKey = (Object.keys(errs) as (keyof FieldErrors)[]).find((k) => errs[k]);
    setErrors(errs);
    if (firstKey) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }

    setStatus("sending");
    setServerError("");
    const body = new FormData(ev.currentTarget);
    body.delete("photos");
    photos.forEach((p) => body.append("photos", p));

    try {
      const res = await fetch("/api/quote", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: FieldErrors; message?: string };
      if (res.ok && data.ok) {
        setSentName(fields.name.trim().split(/\s+/)[0] || "there");
        setStatus("success");
        setFields(EMPTY);
        setPhotos([]);
        return;
      }
      if (data.errors) setErrors(data.errors);
      setServerError(
        data.message ||
          "Sorry — we couldn't send your request just now. Please call or WhatsApp us and we'll quote you straight away."
      );
      setStatus("error");
    } catch {
      setServerError("Sorry — we couldn't reach our server. Please call or WhatsApp us and we'll quote you straight away.");
      setStatus("error");
    }
  };

  const err = (k: keyof FieldErrors) =>
    errors[k] ? (
      <p className="field__error" id={`${uid}-${k}-err`}>
        {errors[k]}
      </p>
    ) : null;
  const a11y = (k: keyof FieldErrors, hint?: string) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": [errors[k] ? `${uid}-${k}-err` : "", hint ?? ""].filter(Boolean).join(" ") || undefined,
  });

  return (
    <dialog
      ref={dialogRef}
      id="quote"
      className="quote-modal"
      aria-label="Request your free quote"
      onClose={() => {
        document.documentElement.classList.remove("modal-open");
        lastFocus.current?.focus?.();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
    >
      <button type="button" className="quote-modal__close icon-btn" onClick={close} aria-label="Close quote form">
        <CloseIcon />
      </button>
      <div className="quote__grid">
        <div className="quote__aside">
          <p className="eyebrow">Free Quote · No Obligation</p>
          <h2 className="quote__heading">Prefer to talk it through?</h2>
          <p className="lead">
            Every car is different, so every quote is tailored. Send us photos, or call John — we&apos;re available 7
            days a week, 7am–8pm.
          </p>
          <ul className="ticks">
            <li>
              <CheckIcon width={20} height={20} /> <span>No-obligation, tailored price</span>
            </li>
            <li>
              <CheckIcon width={20} height={20} /> <span>We come to your home or workplace</span>
            </li>
            <li>
              <CheckIcon width={20} height={20} /> <span>Eco-friendly products, electric van</span>
            </li>
          </ul>
          <div className="quote__contact">
            <a className="btn btn--outline btn--block" href={`tel:${PRIMARY_PHONE.tel}`}>
              <PhoneIcon width={18} height={18} /> Call {PRIMARY_PHONE.display}
            </a>
            <a className="btn btn--whatsapp btn--block" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon width={18} height={18} /> Message on WhatsApp
            </a>
          </div>
        </div>

        <div className="quote__card">
          {status === "success" ? (
            <div className="quote__success" ref={successRef} tabIndex={-1} role="status">
              <span className="quote__success-icon">
                <CheckIcon width={30} height={30} />
              </span>
              <h3>Thanks, {sentName}! Your request is in.</h3>
              <p>John will call you shortly on your number to confirm a tailored quote and a time that suits you.</p>
              <p>Want to speak now, or send your photos straight away? Message us on WhatsApp.</p>
              <div className="quote__success-actions">
                <a
                  className="btn btn--whatsapp"
                  href={whatsappLink(`Hi John, I've just sent a quote request on your website — my name is ${sentName}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon width={18} height={18} /> Continue on WhatsApp
                </a>
                <button type="button" className="btn btn--outline" onClick={() => { setStatus("idle"); close(); }}>
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} noValidate aria-labelledby="quote-title">
              <h3 id="quote-title" className="quote__title">
                Request your free quote
              </h3>
              <p className="quote__intro">Tell us about your car and John will call you to confirm your price.</p>

              {/* Honeypot — hidden from people, tempting to bots */}
              <div className="hp" aria-hidden="true">
                <label>
                  Company <input type="text" name="company" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div className="form-grid">
                <div className="field">
                  <label htmlFor={`${uid}-name`}>
                    Your name <span className="req">*</span>
                  </label>
                  <input id={`${uid}-name`} name="name" autoComplete="name" placeholder="e.g. John Smith" required value={fields.name} onChange={(e) => set("name", e.target.value)} {...a11y("name")} />
                  {err("name")}
                </div>
                <div className="field">
                  <label htmlFor={`${uid}-phone`}>
                    Phone number <span className="req">*</span>
                  </label>
                  <input id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="07…" required value={fields.phone} onChange={(e) => set("phone", e.target.value)} {...a11y("phone")} />
                  {err("phone")}
                </div>
                <div className="field field--full">
                  <label htmlFor={`${uid}-address`}>
                    Address / postcode <span className="req">*</span>
                  </label>
                  <input id={`${uid}-address`} name="address" autoComplete="street-address" placeholder="Where should we come to you?" required value={fields.address} onChange={(e) => set("address", e.target.value)} {...a11y("address")} />
                  {err("address")}
                </div>
                <div className="field">
                  <label htmlFor={`${uid}-email`}>
                    Email <span className="opt">(optional)</span>
                  </label>
                  <input id={`${uid}-email`} name="email" type="email" autoComplete="email" placeholder="you@example.com" value={fields.email} onChange={(e) => set("email", e.target.value)} {...a11y("email")} />
                  {err("email")}
                </div>
                <div className="field">
                  <label htmlFor={`${uid}-car`}>
                    Type of car <span className="req">*</span>
                  </label>
                  <input id={`${uid}-car`} name="car" placeholder="e.g. Range Rover Evoque" required value={fields.car} onChange={(e) => set("car", e.target.value)} {...a11y("car")} />
                  {err("car")}
                </div>
                <div className="field">
                  <label htmlFor={`${uid}-pets`}>Any pets in the car?</label>
                  <select id={`${uid}-pets`} name="pets" value={fields.pets} onChange={(e) => set("pets", e.target.value)} {...a11y("pets")}>
                    <option value="">Select…</option>
                    {PET_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  {err("pets")}
                </div>
                <div className="field">
                  <label htmlFor={`${uid}-service`}>
                    Service you&apos;re interested in <span className="req">*</span>
                  </label>
                  <select id={`${uid}-service`} name="service" required value={fields.service} onChange={(e) => set("service", e.target.value)} {...a11y("service")}>
                    <option value="">Select a service…</option>
                    {SERVICE_MENU.map((g) => (
                      <optgroup key={g.slug} label={g.title}>
                        {g.items.map((s) => (
                          <option key={s.slug} value={s.slug}>
                            {s.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                    <option value={NOT_SURE}>Not sure — please advise</option>
                  </select>
                  {err("service")}
                </div>
                <div className="field field--full">
                  <label htmlFor={`${uid}-message`}>
                    Anything else? <span className="opt">(optional)</span>
                  </label>
                  <textarea id={`${uid}-message`} name="message" rows={4} placeholder="Condition, stains, preferred days/times…" value={fields.message} onChange={(e) => set("message", e.target.value)} {...a11y("message")} />
                  {err("message")}
                </div>
                <div className="field field--full">
                  <span className="field__label" id={`${uid}-photos-label`}>
                    Upload photos of your car <span className="opt">(optional)</span>
                  </span>
                  <label className={`upload${errors.photos ? " upload--error" : ""}`} htmlFor={`${uid}-photos`}>
                    <UploadIcon width={22} height={22} />
                    <span>
                      <strong>Add interior &amp; exterior photos</strong>
                      <small id={`${uid}-photos-hint`}>JPG, PNG, WebP or HEIC · up to {MAX_FILES} photos, 8 MB each</small>
                    </span>
                  </label>
                  <input
                    ref={fileRef}
                    id={`${uid}-photos`}
                    className="sr-only"
                    name="photos"
                    type="file"
                    accept={ACCEPT_ATTR}
                    multiple
                    onChange={(e) => onFiles(e.target.files)}
                    aria-labelledby={`${uid}-photos-label`}
                    {...a11y("photos", `${uid}-photos-hint`)}
                  />
                  {photos.length > 0 && (
                    <ul className="upload__list">
                      {photos.map((p, i) => (
                        <li key={`${p.name}-${i}`}>
                          <span>{p.name}</span>
                          <button
                            type="button"
                            className="icon-btn icon-btn--sm"
                            aria-label={`Remove ${p.name}`}
                            onClick={() => setPhotos((ps) => ps.filter((_, j) => j !== i))}
                          >
                            <CloseIcon width={16} height={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {err("photos")}
                </div>
                <div className="field field--full">
                  <label className="check" htmlFor={`${uid}-consent`}>
                    <input id={`${uid}-consent`} name="consent" type="checkbox" checked={fields.consent} onChange={(e) => set("consent", e.target.checked)} {...a11y("consent")} />
                    <span>
                      I agree to the <Link href="/cancellation-refund-policy">Cancellation &amp; Refund Policy</Link> and ask
                      for my service to be carried out within 14 days. <span className="req">*</span>
                    </span>
                  </label>
                  {err("consent")}
                </div>
              </div>

              {status === "error" && (
                <div className="form-alert" role="alert">
                  <p>{serverError}</p>
                  <div>
                    <a href={`tel:${PRIMARY_PHONE.tel}`}>Call {PRIMARY_PHONE.display}</a> ·{" "}
                    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                      WhatsApp us
                    </a>
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={status === "sending"} aria-busy={status === "sending"}>
                {status === "sending" ? (
                  <>
                    <span className="spinner" aria-hidden="true" /> Sending…
                  </>
                ) : (
                  "Request My Free Quote"
                )}
              </button>
              <p className="quote__privacy">
                We use your details only to quote and arrange your valet. See our <Link href="/privacy-policy">Privacy Policy</Link>.
              </p>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}
