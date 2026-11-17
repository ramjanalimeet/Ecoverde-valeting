"use client";

import { useEffect } from "react";
import data from "@/content/clone/reviews.json";

/**
 * The live site's page interactions (assets/js/main.js), limited to the page body so the
 * app's own header, footer and quote pop-up are left alone. Re-runs on every client navigation.
 */
const LIVE_HOST = /(^|\.)ecoverdevaleting\.co\.uk$/i;

function reviewCard(r: { n: string; d: string; t: string }) {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return (
    `<article class="rcard"><div class="rc-top"><span class="av">${esc(r.n.charAt(0))}</span>` +
    `<div class="who"><b>${esc(r.n)}</b><small>${esc(r.d)} · Google</small></div>${data.gicon}</div>` +
    `<div class="stars">★★★★★</div><p>${esc(r.t)}</p></article>`
  );
}

/** Opens the app's quote pop-up (QuoteModal listens for clicks on links to #quote). */
function openQuote() {
  const a = document.createElement("a");
  a.href = "#quote";
  a.hidden = true;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function CloneEnhancer() {
  useEffect(() => {
    const root = document.getElementById("lv-root");
    if (!root) return;
    const cleanups: (() => void)[] = [];
    const on = <K extends keyof HTMLElementEventMap>(el: EventTarget, type: K | string, fn: (e: never) => void, opts?: AddEventListenerOptions) => {
      el.addEventListener(type, fn as EventListener, opts);
      cleanups.push(() => el.removeEventListener(type, fn as EventListener, opts));
    };

    /* ---- review marquee ---- */
    const half = Math.ceil(data.reviews.length / 2);
    const fill = (el: Element | null, list: typeof data.reviews) => {
      if (!el || el.childElementCount) return;
      const html = list.map(reviewCard).join("");
      el.innerHTML = html + html; // duplicated for a seamless loop
    };
    fill(root.querySelector("#mqTop"), data.reviews.slice(0, half));
    fill(root.querySelector("#mqBot"), data.reviews.slice(half));

    /* ---- scroll reveal ---- */
    const reveals = root.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      );
      reveals.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    } else {
      reveals.forEach((el) => el.classList.add("in"));
    }

    /* ---- eco decor parallax (desktop only; follows the screen size if the window is resized) ---- */
    const deco = root.querySelectorAll<HTMLElement>(".deco-item[data-parallax]");
    if (deco.length) {
      const desktop = matchMedia("(min-width: 769px)");
      const reduced = matchMedia("(prefers-reduced-motion: reduce)");
      let ticking = false;
      const active = () => desktop.matches && !reduced.matches;
      const run = () => {
        ticking = false;
        if (!active()) {
          deco.forEach((el) => (el.style.transform = ""));
          return;
        }
        const vh = innerHeight;
        const rects = Array.from(deco, (el) => el.getBoundingClientRect());
        deco.forEach((el, i) => {
          const c = rects[i].top + rects[i].height / 2 - vh / 2;
          const sp = parseFloat(el.dataset.parallax || "") || 0.1;
          el.style.transform = `translateY(${(-c * sp).toFixed(1)}px)`;
        });
      };
      const onPara = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(run);
        }
      };
      on(window, "scroll", onPara, { passive: true });
      on(window, "resize", onPara, { passive: true });
      on(desktop, "change", onPara);
      run();
    }

    /* ---- "What's included" pop-up ---- */
    let incModal: HTMLDivElement | null = null;
    let incLast: HTMLElement | null = null;
    if (root.querySelector("[data-inc]")) {
      incModal = document.createElement("div");
      incModal.className = "modal inc-modal";
      incModal.id = "incModal";
      incModal.setAttribute("aria-hidden", "true");
      incModal.innerHTML =
        '<div class="modal-backdrop" data-incclose></div>' +
        '<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="incTitle">' +
        '<button class="modal-x" data-incclose aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
        '<div class="modal-body"><div class="modal-head"><span class="eyebrow">What\'s included</span><h3 id="incTitle"></h3></div>' +
        '<div class="inc-content" id="incContent"></div>' +
        '<div class="inc-actions"><a class="btn btn-primary inc-fullpage" href="#" style="display:none">View full page →</a><button class="btn btn-primary inc-quote" data-book>Get a Free Quote</button></div>' +
        "</div></div>";
      root.appendChild(incModal);
      const m = incModal;
      cleanups.push(() => m.remove());
    }
    const incOpen = (key: string, label: string | null, page: string | null) => {
      const src = root.querySelector(`#inc-${CSS.escape(key)}`);
      if (!src || !incModal) return;
      const full = incModal.querySelector<HTMLAnchorElement>(".inc-fullpage")!;
      const quote = incModal.querySelector<HTMLButtonElement>(".inc-quote")!;
      incModal.querySelector("#incTitle")!.textContent = label || "What's included";
      incModal.querySelector("#incContent")!.innerHTML = src.innerHTML;
      if (page) {
        full.href = page;
        full.style.display = "";
        quote.className = "btn btn-ghost inc-quote";
      } else {
        full.style.display = "none";
        quote.className = "btn btn-primary inc-quote";
      }
      incLast = document.activeElement as HTMLElement | null;
      incModal.classList.add("open");
      incModal.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("modal-open");
      incModal.querySelector(".modal-card")!.scrollTop = 0;
    };
    const incClose = () => {
      if (!incModal?.classList.contains("open")) return;
      incModal.classList.remove("open");
      incModal.setAttribute("aria-hidden", "true");
      document.documentElement.classList.remove("modal-open");
      incLast?.focus?.();
    };
    cleanups.push(() => document.documentElement.classList.remove("modal-open"));

    /* ---- clicks inside the page body ---- */
    root.querySelectorAll(".price-row").forEach((row) => row.classList.add("bookable"));
    on(root, "click", (e: MouseEvent) => {
      const t = e.target as Element;
      const inc = t.closest("[data-inc]");
      if (inc) {
        e.preventDefault();
        incOpen(inc.getAttribute("data-inc") || "", inc.getAttribute("data-inc-label"), inc.getAttribute("data-inc-page"));
        return;
      }
      if (t.closest("[data-incclose]")) {
        incClose();
        return;
      }
      if (t.closest("[data-book]")) {
        e.preventDefault();
        incClose();
        openQuote();
        return;
      }
      const card = t.closest(".price-row.bookable");
      if (card && !t.closest(".inc-btn") && !t.closest("a")) openQuote();
    });
    on(document, "keydown", (e: KeyboardEvent) => {
      if (e.key === "Escape") incClose();
    });

    /* ---- FAQ: one open at a time ---- */
    const faqs = root.querySelectorAll<HTMLDetailsElement>("details.faq");
    faqs.forEach((d) =>
      on(d, "toggle", () => {
        if (d.open) faqs.forEach((o) => o !== d && o.removeAttribute("open"));
      }),
    );

    /* ---- Trustindex (domain-locked: real widget only on the live domain, fallback elsewhere) ---- */
    const tiWidget = root.querySelector<HTMLElement>("#ti-widget");
    if (tiWidget) {
      const tiCert = root.querySelector<HTMLElement>("#ti-certificate");
      const onRealDomain = LIVE_HOST.test(location.hostname);
      const load = (el: HTMLElement | null, attr: string) => {
        const url = el?.getAttribute(attr);
        if (!el || !url) return;
        const s = document.createElement("script");
        s.defer = true;
        s.async = true;
        s.src = url;
        el.appendChild(s);
      };
      let started = false;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const start = () => {
        if (started) return;
        started = true;
        if (onRealDomain) {
          load(tiCert, "data-ti-cert");
          load(tiWidget, "data-ti-widget");
        }
        timer = setTimeout(
          () => {
            if (tiWidget.offsetHeight < 120 && !tiWidget.querySelector(".ti-placeholder")) {
              tiWidget.insertAdjacentHTML(
                "beforeend",
                '<div class="ti-placeholder"><svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>' +
                  "<p><b>5.0 from 560+ verified reviews</b> on Trustindex — live across Google, Checkatrade, Bark, Facebook &amp; Yell.<br>" +
                  '<a href="https://www.trustindex.io/reviews/www.ecoverdevaleting.co.uk" target="_blank" rel="noopener" style="color:var(--emerald);font-weight:600">Read all our reviews →</a></p></div>',
              );
            }
          },
          onRealDomain ? 5000 : 250,
        );
      };
      const tiIo = new IntersectionObserver(
        (entries) => {
          if (entries.some((x) => x.isIntersecting)) {
            tiIo.disconnect();
            start();
          }
        },
        { rootMargin: "900px 0px" },
      );
      tiIo.observe(tiWidget);
      const fallback = setTimeout(start, 12000);
      cleanups.push(() => {
        tiIo.disconnect();
        clearTimeout(fallback);
        clearTimeout(timer);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
