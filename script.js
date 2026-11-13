/* =========================================================
   UPCOMING POP-UPS — edit this list to update the site.
   - date:    "YYYY-MM-DD"  (events hide automatically after their date)
   - title:   name of the pop-up or market
   - place:   neighborhood or venue shown on the card
   - time:    any text, e.g. "8am – 1pm"
   - address: optional. Used for the "Get directions" link; if left
              as "", the link searches Google Maps for the place.
   The soonest event also fills the bar at the very top of the page.
   With no upcoming events, the section points visitors to Instagram.
   ========================================================= */
const EVENTS = [
  // No pop-ups listed yet. Copy the example below (without the // marks) for each real pop-up,
  // with a comma between events:
  //
  // {
  //   date: "2026-12-06",
  //   title: "Holiday Neighborhood Pop-Up",
  //   place: "South Park, San Diego",
  //   time: "8am – 12pm",
  //   address: ""
  // }
];

const INSTAGRAM = "https://www.instagram.com/beanfrostyfusion/";

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- Events + announcement bar ---------- */
(function renderEvents() {
  const list = document.getElementById("events-list");
  if (!list) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = EVENTS
    .map(e => ({ ...e, d: new Date(e.date + "T00:00:00") }))
    .filter(e => !isNaN(e.d) && e.d >= today)
    .sort((a, b) => a.d - b.d);

  if (!upcoming.length) {
    list.innerHTML =
      '<div class="events-empty">No pop-ups on the calendar right now. Follow us on ' +
      `<a href="${INSTAGRAM}" target="_blank" rel="noopener">Instagram</a> ` +
      "to hear about the next one first.</div>";
    return;
  }

  const fmt = (d, opts) => d.toLocaleDateString("en-US", opts);
  const directions = e =>
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(e.address || `${e.title} ${e.place}`);

  const [next, ...rest] = upcoming;

  // Bar at the top of the page
  const bar = document.getElementById("announce");
  if (bar) {
    bar.href = "#events";
    bar.innerHTML =
      `<strong>Next pop-up</strong>${fmt(next.d, { weekday: "short", month: "short", day: "numeric" })} · ` +
      `${esc(next.place)} · ${esc(next.time)} <span aria-hidden="true">→</span>`;
  }

  const featured = `
    <article class="event-next reveal">
      <svg aria-hidden="true"><use href="#bean-heart"/></svg>
      <p class="eyebrow">Next pop-up</p>
      <p class="when">${fmt(next.d, { weekday: "long" })},<br>${fmt(next.d, { month: "long", day: "numeric" })}</p>
      <div class="meta">
        <h3>${esc(next.title)}</h3>
        <p>${esc(next.place)} · ${esc(next.time)}</p>
      </div>
      <a class="btn btn-light" href="${directions(next)}" target="_blank" rel="noopener">Get directions</a>
    </article>`;

  const rows = rest.map(e => `
    <article class="event-row">
      <div class="event-date" aria-hidden="true">
        <span class="m">${fmt(e.d, { month: "short" })}</span><span class="d">${e.d.getDate()}</span><span class="w">${fmt(e.d, { weekday: "short" })}</span>
      </div>
      <div>
        <h3>${esc(e.title)}</h3>
        <p><span class="sr-only">${fmt(e.d, { weekday: "long", month: "long", day: "numeric" })}, </span>${esc(e.place)}<br>${esc(e.time)}</p>
      </div>
      <a class="dir" href="${directions(e)}" target="_blank" rel="noopener" aria-label="Directions to ${esc(e.title)}">Directions →</a>
    </article>`).join("");

  list.classList.toggle("single", !rest.length);
  list.innerHTML = featured + (rest.length ? `<div class="event-list reveal">${rows}</div>` : "");
})();

/* ---------- Header: transparent over the hero, solid after scrolling ---------- */
(function header() {
  const header = document.getElementById("site-header");
  const hero = document.getElementById("home");
  if (!header || !hero) return;
  const update = () => {
    const limit = hero.offsetTop + hero.offsetHeight - header.offsetHeight - 40;
    header.classList.toggle("at-top", window.scrollY < limit);
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
})();

/* ---------- Light / dark theme button ----------
   The starting theme is chosen in index.html (saved choice, otherwise the device setting). */
(function theme() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const root = document.documentElement;
  const saved = () => { try { return localStorage.getItem("bff-theme"); } catch (e) { return null; } };
  const label = () => btn.setAttribute("aria-label", root.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  label();

  btn.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("bff-theme", root.dataset.theme); } catch (e) {}
    label();
  });

  // Follow the device if it switches between light and dark, until the visitor picks one here
  window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener?.("change", e => {
    if (saved()) return;
    root.dataset.theme = e.matches ? "dark" : "light";
    label();
  });
})();

/* ---------- Mobile nav ---------- */
(function nav() {
  const header = document.getElementById("site-header");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  const setOpen = open => {
    links.classList.toggle("open", open);
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setOpen(!links.classList.contains("open")));
  links.addEventListener("click", e => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });
})();

/* ---------- Highlight the current section in the nav ---------- */
(function activeLink() {
  if (!("IntersectionObserver" in window)) return;
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]:not(.btn)')];
  const byId = Object.fromEntries(links.map(a => [a.getAttribute("href").slice(1), a]));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(a => a.classList.remove("active"));
      byId[en.target.id]?.classList.add("active");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  Object.keys(byId).forEach(id => { const s = document.getElementById(id); if (s) io.observe(s); });
})();

/* ---------- Fade sections in as they scroll into view ---------- */
(function reveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { items.forEach(el => el.classList.add("in")); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  items.forEach(el => io.observe(el));
})();

/* ---------- Package buttons preselect the form ---------- */
document.querySelectorAll("[data-package]").forEach(btn => {
  btn.addEventListener("click", () => {
    const select = document.getElementById("f-package");
    if (select) select.value = btn.dataset.package;
  });
});

/* ---------- Booking form ---------- */
(function bookingForm() {
  const form = document.getElementById("booking-form");
  if (!form) return;
  const status = document.getElementById("form-status");
  const submit = form.querySelector('button[type="submit"]');

  // Earliest selectable event date = today
  const dateInput = document.getElementById("f-date");
  const t = new Date();
  dateInput.min = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;

  const messageFor = input => {
    if (input.validity.valueMissing) return "Required";
    if (input.validity.typeMismatch) return "Please enter a valid email";
    if (input.validity.rangeUnderflow) return input.id === "f-guests" ? "Catering is for 30+ guests" : "Please choose a future date";
    return "Please check this field";
  };

  const check = field => {
    const input = field.querySelector("input, select, textarea");
    field.classList.remove("invalid");
    field.querySelector(".err")?.remove();
    input?.removeAttribute("aria-invalid");
    if (!input || input.checkValidity()) return null;
    field.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
    const err = document.createElement("span");
    err.className = "err";
    err.textContent = messageFor(input);
    field.appendChild(err);
    return input;
  };

  // Clear an error as soon as the field is fixed
  form.addEventListener("input", e => {
    const field = e.target.closest(".field");
    if (field?.classList.contains("invalid")) check(field);
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    const bad = [...form.querySelectorAll(".field")].map(check).filter(Boolean);
    if (bad.length) { bad[0].focus(); return; }

    submit.disabled = true;
    submit.textContent = "Sending…";

    try {
      const res = await fetch(form.dataset.endpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === "false" || data.success === false) throw new Error(data.message || "Request failed");

      form.reset();
      status.classList.add("ok");
      status.textContent = "Thank you! We got your request and will be in touch soon.";
    } catch (err) {
      status.classList.add("bad");
      status.innerHTML = 'Sorry, something went wrong. Please email us at <a href="mailto:gibran.corro05@gmail.com">gibran.corro05@gmail.com</a>.';
    } finally {
      submit.disabled = false;
      submit.textContent = "Send booking request";
    }
  });
})();

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
