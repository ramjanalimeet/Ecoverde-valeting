"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type DragEvent, type FormEvent } from "react";
import { PET_OPTIONS, PRIMARY_PHONE, whatsappLink } from "@/data/site";
import {
  ACCEPT_ATTR,
  MAX_FILES,
  NOT_SURE,
  QUOTE_OPTIONS,
  resolvePreset,
  validatePhotos,
  validateQuote,
  type FieldErrors,
  type QuoteFields,
} from "@/lib/quote";
import { CheckIcon, CloseIcon, UploadIcon, WhatsAppIcon } from "./Icons";

const EMPTY: QuoteFields = {
  name: "",
  phone: "",
  address: "",
  email: "",
  car: "",
  pets: PET_OPTIONS[0],
  service: NOT_SURE,
  message: "",
  consent: false,
};

type Status = "idle" | "sending" | "success" | "error";

/**
 * The free-quote form. Used inside the pop-up (QuoteModal) and inline on /contact.
 * `preset` preselects a service; `nonce` changes each time the pop-up opens.
 */
export default function QuoteForm({ preset, nonce, onClose }: { preset?: string | null; nonce?: number; onClose?: () => void }) {
  const [fields, setFields] = useState<QuoteFields>(EMPTY);
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [sentName, setSentName] = useState("");
  const [dragging, setDragging] = useState(false);
  // The specific service page the visitor came from (e.g. "Lease Return Valet"), sent with the request
  const [detail, setDetail] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uid = useId();

  useEffect(() => {
    const r = resolvePreset(preset);
    if (r) {
      setFields((f) => ({ ...f, service: r.option }));
      setDetail(r.detail);
    }
    setStatus((st) => (st === "success" ? "idle" : st));
  }, [preset, nonce]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const set = <K extends keyof QuoteFields>(k: K, v: QuoteFields[K]) => {
    setFields((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const addFiles = (list: FileList | File[] | null) => {
    const next = [...photos, ...Array.from(list ?? [])];
    const err = validatePhotos(next);
    setErrors((e) => ({ ...e, photos: err }));
    if (!err) setPhotos(next);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
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
        setDetail("");
        setPhotos([]);
        return;
      }
      if (data.errors) setErrors(data.errors);
      setServerError(
        data.message || "Sorry — we couldn't send your request just now. Please call or WhatsApp us and we'll quote you straight away."
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

  if (status === "success") {
    return (
      <div className="qf qf__success" ref={successRef} tabIndex={-1} role="status">
        <span className="qf__success-icon">
          <CheckIcon width={28} height={28} />
        </span>
        <h2>Thanks, {sentName}! Your request is in.</h2>
        <p>John will call you shortly on your number to confirm a tailored quote and a time that suits you.</p>
        <p>Want to speak now, or send your photos straight away? Message us on WhatsApp.</p>
        <div className="qf__success-actions">
          <a
            className="btn btn--whatsapp"
            href={whatsappLink(`Hi John, I've just sent a quote request on your website — my name is ${sentName}.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon width={18} height={18} /> Continue on WhatsApp
          </a>
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => {
              setStatus("idle");
              onClose?.();
            }}
          >
            {onClose ? "Close" : "Send another request"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="qf" aria-labelledby={`${uid}-title`}>
      <p className="eyebrow">Free Quote · No Obligation</p>
      <h2 id={`${uid}-title`} className="qf__title">
        Request your free quote
      </h2>
      <p className="qf__intro">
        Tell us about your car and <strong>John will call you to confirm your price</strong>.
      </p>

      {/* Honeypot — hidden from people, tempting to bots */}
      <div className="hp" aria-hidden="true">
        <label>
          Company <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="qf__grid">
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
        <div className="field field--full">
          <label htmlFor={`${uid}-email`}>
            Email <span className="opt">(optional — for your quote)</span>
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
            {PET_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {err("pets")}
        </div>
        <div className="field field--full">
          <label htmlFor={`${uid}-service`}>Service you&apos;re interested in</label>
          <input type="hidden" name="service_detail" value={detail} />
          <select
            id={`${uid}-service`}
            name="service"
            value={fields.service}
            onChange={(e) => {
              set("service", e.target.value);
              setDetail("");
            }}
            {...a11y("service")}
          >
            {QUOTE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {err("service")}
        </div>
        <div className="field field--full">
          <label htmlFor={`${uid}-message`}>
            Anything else? <span className="opt">(optional)</span>
          </label>
          <textarea id={`${uid}-message`} name="message" rows={2} placeholder="Condition, stains, scratches, when you'd like us…" value={fields.message} onChange={(e) => set("message", e.target.value)} {...a11y("message")} />
          {err("message")}
        </div>
        <div className="field field--full">
          <span className="field__label" id={`${uid}-photos-label`}>
            Upload photos of your car <span className="opt">(helps us quote)</span>
          </span>
          <label
            className={`drop${dragging ? " is-dragging" : ""}${errors.photos ? " drop--error" : ""}`}
            htmlFor={`${uid}-photos`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <span className="drop__main">
              <UploadIcon width={18} height={18} /> Tap to add photos
            </span>
            <small id={`${uid}-photos-hint`}>or drag &amp; drop — interior &amp; exterior</small>
          </label>
          <input
            ref={fileRef}
            id={`${uid}-photos`}
            className="sr-only"
            name="photos"
            type="file"
            accept={ACCEPT_ATTR}
            multiple
            onChange={(e) => addFiles(e.target.files)}
            aria-labelledby={`${uid}-photos-label`}
            {...a11y("photos", `${uid}-photos-hint`)}
          />
          {photos.length > 0 && (
            <ul className="upload__list" aria-label={`${photos.length} of ${MAX_FILES} photos added`}>
              {photos.map((p, i) => (
                <li key={`${p.name}-${i}`}>
                  <span>{p.name}</span>
                  <button type="button" className="icon-btn icon-btn--sm" aria-label={`Remove ${p.name}`} onClick={() => setPhotos((ps) => ps.filter((_, j) => j !== i))}>
                    <CloseIcon width={14} height={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {err("photos")}
        </div>
        <div className="field field--full">
          <label className="consent" htmlFor={`${uid}-consent`}>
            <input id={`${uid}-consent`} name="consent" type="checkbox" checked={fields.consent} onChange={(e) => set("consent", e.target.checked)} {...a11y("consent")} />
            <span>
              I agree to the <Link href="/cancellation-refund-policy">Cancellation &amp; Refund Policy</Link> and ask for my service
              to be carried out within 14 days.
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

      <button type="submit" className="btn btn--primary btn--block qf__submit" disabled={status === "sending"} aria-busy={status === "sending"}>
        {status === "sending" ? (
          <>
            <span className="spinner" aria-hidden="true" /> Sending…
          </>
        ) : (
          "Request My Free Quote"
        )}
      </button>
      <p className="qf__privacy">
        We use your details only to quote and arrange your valet. See our <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
    </form>
  );
}
