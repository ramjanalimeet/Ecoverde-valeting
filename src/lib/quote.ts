// Shared quote-form rules — used by the client form and the /api/quote route.
import { ALL_MENU_SERVICES, PET_OPTIONS } from "@/data/site";

export const NOT_SURE = "not-sure";
export const MAX_FILES = 6;
export const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB each
export const MAX_TOTAL_BYTES = 24 * 1024 * 1024; // 24 MB total
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
export const ACCEPT_ATTR = ".jpg,.jpeg,.png,.webp,.heic,.heif";

export type QuoteFields = {
  name: string;
  phone: string;
  address: string;
  email: string;
  car: string;
  pets: string;
  service: string;
  message: string;
  consent: boolean;
};

export type FieldErrors = Partial<Record<keyof QuoteFields | "photos", string>>;

const UK_PHONE = /^(?:\+44\s?|0044\s?|0)(?:\d\s?){9,10}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** The options shown in the quote form's "Service you're interested in" dropdown. */
export const QUOTE_OPTIONS = [
  { value: NOT_SURE, label: "Not sure — please advise" },
  { value: "mini-full-valet", label: "Mini / Full Valet" },
  { value: "premium-supercar-detailing", label: "Premium / Supercar Detailing" },
  { value: "paint-correction-ceramic", label: "Paint Correction & Ceramic Coating" },
  { value: "interior-deep-clean-steam", label: "Interior Deep Clean & Steam" },
  { value: "soft-top-cleaning-proofing", label: "Soft-Top Cleaning & Proofing" },
  { value: "restoration-refurb", label: "Restoration & Refurb" },
] as const;

/** Which dropdown option each service page / link preselects. */
const PAGE_TO_OPTION: Record<string, string> = {
  "valeting-service": "mini-full-valet",
  "mobile-car-wash": "mini-full-valet",
  "lease-return-valet": "mini-full-valet",
  "pre-sale-valet": "mini-full-valet",
  "used-car-valet": "mini-full-valet",
  "maintenance-packages": "mini-full-valet",
  "gift-vouchers": "mini-full-valet",
  "fleet-commercial": "mini-full-valet",
  "car-detailing": "premium-supercar-detailing",
  "supercar-detailing": "premium-supercar-detailing",
  "classic-car-detailing": "premium-supercar-detailing",
  "leather-upholstery": "premium-supercar-detailing",
  "paint-correction": "paint-correction-ceramic",
  "ceramic-coating": "paint-correction-ceramic",
  "interior-deep-clean": "interior-deep-clean-steam",
  "mould-odour-removal": "interior-deep-clean-steam",
  "soft-top-cleaning": "soft-top-cleaning-proofing",
  "car-restoration": "restoration-refurb",
  "alloy-wheel-refurb": "restoration-refurb",
  "dent-removal": "restoration-refurb",
  "bumper-scuff-repair": "restoration-refurb",
  "bodywork-respray": "restoration-refurb",
};

const isOption = (v: string) => QUOTE_OPTIONS.some((o) => o.value === v);

/** Resolve a preset (?service=<slug>) into the dropdown option plus the specific page it came from. */
export function resolvePreset(slug?: string | null): { option: string; detail: string } | null {
  if (!slug) return null;
  if (isOption(slug)) return { option: slug, detail: "" };
  const option = PAGE_TO_OPTION[slug];
  if (!option) return null;
  const page = ALL_MENU_SERVICES.find((s) => s.slug === slug)?.label ?? "";
  const optLabel = QUOTE_OPTIONS.find((o) => o.value === option)?.label ?? "";
  return { option, detail: page && page !== optLabel ? page : "" };
}

/** Label for a dropdown option, optionally followed by the specific service page, e.g. "Mini / Full Valet (Lease Return Valet)". */
export const serviceLabel = (value: string, detail = "") => {
  const base = QUOTE_OPTIONS.find((o) => o.value === value)?.label ?? "";
  if (!base) return "";
  const d = ALL_MENU_SERVICES.find((s) => s.label === detail)?.label;
  return d ? `${base} (${d})` : base;
};

export function validateQuote(f: QuoteFields): FieldErrors {
  const e: FieldErrors = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  else if (f.name.length > 100) e.name = "Please keep your name under 100 characters.";
  if (!UK_PHONE.test(f.phone.trim().replace(/[-()]/g, ""))) e.phone = "Please enter a valid UK phone number, e.g. 07123 456789.";
  if (f.address.trim().length < 3) e.address = "Please tell us where we should come to you.";
  else if (f.address.length > 200) e.address = "Please keep the address under 200 characters.";
  if (f.email.trim() && !EMAIL.test(f.email.trim())) e.email = "That email address doesn't look right.";
  if (f.car.trim().length < 2) e.car = "Please tell us the make and model.";
  else if (f.car.length > 100) e.car = "Please keep this under 100 characters.";
  if (f.pets && !PET_OPTIONS.includes(f.pets)) e.pets = "Please choose an option.";
  if (!f.service) e.service = "Please choose a service, or “Not sure”.";
  else if (!serviceLabel(f.service)) e.service = "Please choose a service from the list.";
  if (f.message.length > 2000) e.message = "Please keep this under 2,000 characters.";
  if (!f.consent) e.consent = "Please tick the box above to send your request.";
  return e;
}

const okType = (f: { type: string; name: string }) =>
  ACCEPTED_TYPES.includes(f.type.toLowerCase()) || (!f.type && /\.(jpe?g|png|webp|heic|heif)$/i.test(f.name));

export function validatePhotos(files: { size: number; type: string; name: string }[]): string | undefined {
  if (files.length > MAX_FILES) return `Please upload up to ${MAX_FILES} photos.`;
  if (files.some((f) => !okType(f))) return "Photos must be JPG, PNG, WebP or HEIC.";
  if (files.some((f) => f.size > MAX_FILE_BYTES)) return "Each photo must be 8 MB or smaller.";
  if (files.reduce((n, f) => n + f.size, 0) > MAX_TOTAL_BYTES) return "Photos must be 24 MB or smaller in total.";
  return undefined;
}
