/* Héloïse Lloris · vanilla JS, no dependencies.
   Reveals + scrollspy (IntersectionObserver), scroll-linked stage & puzzle,
   counters, countdown, native <dialog> lightbox, Formspree AJAX submit. */
(() => {
  "use strict";
  const doc = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---- manifesto: split into words so they light up as you read ---- */
  $$("[data-words]").forEach((el) => {
    const gold = /^(24K|Gold\.?|first)$/;
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) =>
      `<span class="w${gold.test(w) ? " gold" : ""}">${w.replace(/&/g, "&amp;")}</span>`).join(" ");
  });

  /* ---- heavy below-the-fold images load only when they are about to be seen ---- */
  const deferIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const img = e.target;
      img.srcset = img.dataset.srcset;
      delete img.dataset.defer;
      deferIO.unobserve(img);
    });
  }, { rootMargin: "120% 0px" });
  $$("img[data-defer]").forEach((img) => deferIO.observe(img));

  /* ---- reveal on scroll ---- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      revealIO.unobserve(e.target);
      const n = e.target.querySelector("[data-count]");
      if (n) countUp(n);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
  $$("[data-reveal]").forEach((el) => revealIO.observe(el));

  function countUp(el) {
    const end = +el.dataset.count;
    if (reduce) return;
    const start = end > 1000 ? end - 60 : 0;
    const t0 = performance.now(), dur = 1600;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(start + (end - start) * (1 - Math.pow(1 - k, 4)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---- scrollspy ---- */
  const links = new Map($$(".nav a").map((a) => [a.getAttribute("href").slice(1), a]));
  const spyIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.removeAttribute("aria-current"));
      const a = links.get(e.target.id);
      if (a) a.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("[data-spy]").forEach((s) => spyIO.observe(s));

  /* close mobile menu after choosing a link */
  const menu = $("#primary-nav");
  menu?.addEventListener("click", (e) => {
    if (e.target.closest("a") && menu.matches(":popover-open")) menu.hidePopover();
  });

  /* ---- scroll-linked effects (one rAF-throttled listener) ---- */
  const head = $(".masthead");
  const stage = $(".stage"), stageWin = $(".stage__window"), stageCopy = $(".stage__copy");
  const puzzle = $("[data-puzzle]");
  const words = $$(".manifesto__text .w");
  const para = $$("[data-parallax]");
  let ticking = false;

  function onScroll() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    const max = doc.scrollHeight - vh;
    doc.style.setProperty("--scroll", max > 0 ? (y / max).toFixed(4) : 0);
    head.classList.toggle("is-scrolled", y > 40);
    if (reduce) return;

    if (stage) {
      const r = stage.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - vh) * 1.35));
      stageWin.style.setProperty("--p", p.toFixed(4));
      stageCopy.style.setProperty("--p", p.toFixed(4));
    }
    if (puzzle) {
      const r = puzzle.getBoundingClientRect();
      const a = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.75 + r.height * 0.25)));
      puzzle.style.setProperty("--a", a.toFixed(4));
      puzzle.classList.toggle("is-whole", a >= 1);
    }
    if (words.length) {
      const r = words[0].parentElement.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      const lit = Math.round(k * words.length);
      words.forEach((w, i) => w.classList.toggle("on", i < lit));
    }
    para.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      el.style.setProperty("--py", ((r.top + r.height / 2 - vh / 2) * +el.dataset.parallax).toFixed(1));
    });
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
  onScroll();
  if (reduce) words.forEach((w) => w.classList.add("on"));

  /* ---- New Year countdown (always the next 1 January, visitor's local time) ---- */
  const cd = $("[data-countdown]");
  if (cd) {
    const now = new Date();
    const target = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
    const yearLabel = $("[data-countdown-year]");
    if (yearLabel) yearLabel.textContent = `New Year’s Eve ${now.getFullYear()}`;
    const units = Object.fromEntries($$("[data-unit]", cd).map((el) => [el.dataset.unit, el]));
    const pad = (n) => String(n).padStart(2, "0");
    const tick = () => {
      let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      const d = Math.floor(s / 86400); s %= 86400;
      const h = Math.floor(s / 3600); s %= 3600;
      units.d.textContent = pad(d); units.h.textContent = pad(h);
      units.m.textContent = pad(Math.floor(s / 60)); units.s.textContent = pad(s % 60);
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---- enquiry shortcuts pre-select the form topic ---- */
  const topic = $("#f-topic");
  $$("[data-enquire]").forEach((a) => a.addEventListener("click", () => {
    const v = a.dataset.enquire;
    if (topic && [...topic.options].some((o) => o.value === v)) topic.value = v;
  }));

  /* ---- lightbox on native <dialog>: focus trap + Esc for free ---- */
  const lb = $("#lightbox");
  const items = $$("[data-gallery] [data-full]");
  if (lb && items.length) {
    const img = $("img", lb), cap = $("figcaption", lb);
    let i = 0;
    const show = (n) => {
      i = (n + items.length) % items.length;
      const src = items[i].querySelector("img");
      img.src = items[i].dataset.full; img.alt = src.alt; cap.textContent = src.alt;
      img.style.animation = "none"; img.offsetWidth; img.style.animation = "";
    };
    items.forEach((b, n) => b.addEventListener("click", () => { show(n); lb.showModal(); }));
    $(".lightbox__prev", lb).addEventListener("click", () => show(i - 1));
    $(".lightbox__next", lb).addEventListener("click", () => show(i + 1));
    lb.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(i - 1);
      if (e.key === "ArrowRight") show(i + 1);
    });
    lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  }

  /* ---- Formspree AJAX submit ---- */
  const form = $("#contact-form");
  if (form) {
    const status = $(".form__status", form);
    const btn = $("button[type=submit]", form);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      btn.disabled = true; btn.textContent = "Sending…"; status.className = "form__status"; status.textContent = "";
      try {
        const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        status.className = "form__status ok";
        status.textContent = "Merci. Your enquiry has been received and the Maison will reply personally.";
      } catch {
        status.className = "form__status err";
        status.textContent = "Something went wrong. Please email info@Heloise-Lloris.com directly.";
      } finally {
        btn.disabled = false; btn.textContent = "Send enquiry";
      }
    });
  }

  const yr = $("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
