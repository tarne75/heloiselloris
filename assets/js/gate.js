/* Héloïse Lloris · "Your Vintage" age gate. Vanilla JS, no dependencies. */
(() => {
  "use strict";
  const gate = document.getElementById("gate");
  if (!gate || !gate.open) return;

  const LEGAL_AGE = 18;
  const DAYS = 30;
  const html = document.documentElement;
  const now = new Date();
  const thisYear = now.getFullYear();
  const reel = gate.querySelector(".dial__reel");
  const enter = gate.querySelector("[data-enter]");
  const confirmBox = gate.querySelector(".gate__confirm");
  const ask = gate.querySelector(".gate__ask");
  const wait = gate.querySelector(".gate__wait");
  const remember = gate.querySelector(".gate__remember input");
  const desc = gate.querySelector("#gate-desc");
  let selected = thisYear, moved = false, birthdayPassed = null, pending = null;
  const clampY = (y) => Math.min(thisYear, Math.max(1920, y));
  const go = (delta) => { pending = clampY((pending ?? selected) + delta); centreOn(pending, true); };

  /* Esc must not dismiss the gate */
  gate.addEventListener("cancel", (e) => e.preventDefault());

  /* a visitor already turned away this session sees the same answer */
  try { if (sessionStorage.getItem("hl-age-wait")) showWait(+sessionStorage.getItem("hl-age-wait")); } catch (e) {}

  /* ---- build the reel: 1920 … this year ---- */
  const frag = document.createDocumentFragment();
  for (let y = 1920; y <= thisYear; y++) {
    const li = document.createElement("li");
    li.id = "vy-" + y; li.textContent = y; li.setAttribute("role", "option"); li.dataset.y = y;
    frag.appendChild(li);
  }
  reel.appendChild(frag);
  const items = [...reel.children];

  const itemFor = (y) => document.getElementById("vy-" + y);
  function centreOn(y, smooth) {
    const li = itemFor(y); if (!li) return;
    reel.scrollTo({ left: li.offsetLeft - (reel.clientWidth - li.offsetWidth) / 2, behavior: smooth ? "smooth" : "instant" });
  }

  let raf = 0;
  function paint() {
    raf = 0;
    const mid = reel.scrollLeft + reel.clientWidth / 2;
    let best = null, bestD = Infinity;
    for (const li of items) {
      const c = li.offsetLeft + li.offsetWidth / 2;
      const d = Math.abs(c - mid);
      if (d < reel.clientWidth) li.style.setProperty("--k", Math.min(1, d / (li.offsetWidth * 2.4)).toFixed(3));
      if (d < bestD) { bestD = d; best = li; }
    }
    if (best && +best.dataset.y !== selected) {
      selected = +best.dataset.y; moved = true; birthdayPassed = null;
      confirmBox.hidden = true;
    }
    items.forEach((li) => li.setAttribute("aria-selected", li === best ? "true" : "false"));
    if (best) reel.setAttribute("aria-activedescendant", best.id);
    if (pending === selected) pending = null;
  }
  reel.addEventListener("scrollend", () => { pending = null; });
  reel.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(paint); }, { passive: true });

  /* wheel scrolls the reel horizontally */
  reel.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { e.preventDefault(); reel.scrollBy({ left: e.deltaY, behavior: "instant" }); }
  }, { passive: false });

  /* drag to spin on desktop */
  let dragX = null, startLeft = 0;
  reel.addEventListener("pointerdown", (e) => {
    startLeft = reel.scrollLeft; pending = null;
    if (e.pointerType !== "mouse") return;
    dragX = e.clientX; startLeft = reel.scrollLeft; reel.style.scrollSnapType = "none"; reel.style.cursor = "grabbing";
  });
  addEventListener("pointermove", (e) => { if (dragX !== null) reel.scrollLeft = startLeft - (e.clientX - dragX); });
  addEventListener("pointerup", () => {
    if (dragX === null) return;
    dragX = null; reel.style.scrollSnapType = ""; reel.style.cursor = "";
    requestAnimationFrame(() => centreOn(selected, true));
  });

  reel.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (li && Math.abs(reel.scrollLeft - startLeft) < 4) centreOn(+li.dataset.y, true);
  });
  gate.querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => {
    go(+b.dataset.step);
  }));
  reel.addEventListener("keydown", (e) => {
    const map = { ArrowLeft: -1, ArrowRight: 1, PageUp: -10, PageDown: 10 };
    if (e.key in map) { e.preventDefault(); go(map[e.key]); }
    if (e.key === "Home") { e.preventDefault(); centreOn(1920, true); }
    if (e.key === "End") { e.preventDefault(); centreOn(thisYear, true); }
    if (e.key === "Enter") { e.preventDefault(); enter.click(); }
  });

  gate.querySelectorAll("[data-bday]").forEach((b) => b.addEventListener("click", () => {
    birthdayPassed = b.dataset.bday === "yes";
    gate.querySelectorAll("[data-bday]").forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
    enter.focus();
  }));

  enter.addEventListener("click", () => {
    if (!moved) { nudge(); return; }
    const age = thisYear - selected;
    if (age === LEGAL_AGE && birthdayPassed === null) {
      confirmBox.hidden = false;
      confirmBox.querySelector("button").focus();
      return;
    }
    if (age > LEGAL_AGE || (age === LEGAL_AGE && birthdayPassed)) return uncork();
    const yearsLeft = age === LEGAL_AGE ? 1 : LEGAL_AGE - age;
    try { sessionStorage.setItem("hl-age-wait", yearsLeft); } catch (e) {}
    showWait(yearsLeft);
  });

  function nudge() {
    desc.textContent = "Turn the dial to your year of birth, then uncork.";
    const w = gate.querySelector(".dial__window");
    w.classList.remove("shake"); void w.offsetWidth; w.classList.add("shake");
    reel.focus();
  }

  function showWait(n) {
    ask.hidden = true; wait.hidden = false;
    const s = wait.querySelector("[data-wait]");
    if (s && n) s.textContent = n <= 1 ? "very soon" : `in ${n} years`;
    wait.querySelector("a").focus();
  }

  function uncork() {
    if (remember.checked) {
      try { localStorage.setItem("hl-age-ok", String(Date.now() + DAYS * 864e5)); } catch (e) {}
    }
    /* golden bubbles burst out of the seam */
    const burst = document.createElement("div");
    burst.className = "gate__burst";
    for (let i = 0; i < 34; i++) {
      const b = document.createElement("i");
      const a = Math.random() * Math.PI * 2, r = 120 + Math.random() * Math.min(innerWidth, innerHeight) * 0.6;
      b.style.cssText = `--x:${Math.cos(a) * r}px;--y:${Math.sin(a) * r - 80}px;--s:${3 + Math.random() * 9}px;--dl:${0.35 + Math.random() * 0.35}s`;
      burst.appendChild(b);
    }
    gate.appendChild(burst);
    gate.classList.add("is-opening");
    html.classList.add("opening");
    setTimeout(() => {
      gate.close(); gate.remove();
      html.classList.remove("gated", "opening");
      document.querySelector(".brand")?.focus({ preventScroll: true });
    }, 2300);
  }

  /* start on this year: the visitor turns back to their own vintage */
  requestAnimationFrame(() => { centreOn(thisYear, false); paint(); moved = false; reel.focus({ preventScroll: true }); });
})();
