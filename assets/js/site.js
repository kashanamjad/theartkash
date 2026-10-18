/* The Artkash — page behaviour. All text and media come from /content/site.json (edited in Pages CMS). */
(async () => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const canHover = () => matchMedia("(hover:hover)").matches;
  const isPhone = () => innerWidth <= 760;

  const C = await fetch("/content/site.json", { cache: "no-cache" }).then((r) => r.json());

  /* ---------- Text from content ---------- */
  const words = (C.hero.headline || "").split(/\s+/).filter(Boolean);
  $("#headline").innerHTML = words.map((w) => `<span class="w">${esc(w)}</span>`).join(" ") + ` <span class="w brush">${esc(C.hero.headline_brush)}</span>`;
  $("#hero-button").textContent = C.hero.button || "What we do";
  $("#contact-h").textContent = C.contact.headline;
  $("#contact-p").textContent = C.contact.text;
  $("#foot").textContent = C.footer;
  const more = $("#more-work");
  more.href = C.more_work.url; more.querySelector("span").textContent = C.more_work.label;

  /* ---------- Services ---------- */
  const ICONS = {
    film: '<rect x="2.5" y="6" width="13" height="12" rx="2"/><path d="m15.5 10 6-3v10l-6-3"/>',
    event: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><circle cx="12" cy="15.5" r="2"/>',
    camera: '<path d="M3 8a2 2 0 0 1 2-2h2.5l1.5-2h6l1.5 2H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="4"/>',
    social: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="m10.5 9.5 4 2.5-4 2.5z"/>',
    post: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  };
  $("#services-list").innerHTML = C.services.map((s) =>
    `<div class="svc fi"><svg data-d="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">${ICONS[s.icon] || ICONS.film}</svg><b>${esc(s.title)}</b><span>${esc(s.text)}</span></div>`).join("");

  /* ---------- Team ---------- */
  const placeholder = '<svg viewBox="0 0 200 300"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfc8c1"/><stop offset="1" stop-color="#e3ddd6"/></linearGradient></defs><circle cx="100" cy="80" r="42" fill="url(#g)"/><path d="M20 300c0-90 30-150 80-150s80 60 80 150z" fill="url(#g)"/></svg>';
  $("#team-list").innerHTML = C.team.map((m) => {
    const inner = `<div class="cut" data-d="20">${m.photo ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}">` : placeholder}</div><b>${esc(m.name)}${m.link ? ' <i class="go">↗</i>' : ""}</b><span>${esc(m.role)}</span>`;
    return m.link ? `<a class="member fi" href="${esc(m.link)}" aria-label="${esc(m.name)} — portfolio">${inner}</a>` : `<div class="member fi">${inner}</div>`;
  }).join("");

  /* ---------- Contact ---------- */
  const k = C.contact, wa = (k.whatsapp || "").replace(/[^\d]/g, "");
  $("#ways").innerHTML = [
    k.email && `<a href="mailto:${esc(k.email)}?subject=${encodeURIComponent("New shoot enquiry")}">Email ↗</a>`,
    wa && `<a href="https://wa.me/${wa}?text=${encodeURIComponent(k.whatsapp_message || "")}">WhatsApp ↗</a>`,
    k.instagram && `<a href="${esc(k.instagram)}">Instagram ↗</a>`,
  ].filter(Boolean).join("");

  /* ---------- Hero: floating photos ----------
     Each spot: x,y = % of the screen, w = width in px, d = depth (0 near/sharp → 1 far/blurred), ar = height/width.
     m = [x,y,w] on phones (spots without m are hidden on phones). Photos fill the spots in order. */
  const SPOTS = [
    { ar: .697, x: 5, y: 15, w: 240, d: .1, m: [4, 13, 150] },
    { ar: 1.25, x: 81, y: 11, w: 150, d: .1, m: [70, 10, 92] },
    { ar: 1.2, x: 14, y: 60, w: 170, d: .15, m: [6, 63, 104] },
    { ar: .6, x: 66, y: 65, w: 260, d: .12, m: [50, 67, 170] },
    { ar: 1.25, x: 30, y: 5, w: 120, d: .5, m: [44, 4, 72] },
    { ar: 1.25, x: 91, y: 64, w: 96, d: .5, m: [82, 55, 62] },
    { ar: 1.5, x: 2, y: 42, w: 96, d: .6 },
    { ar: 1.25, x: 60, y: 6, w: 110, d: .55 },
    { ar: .6, x: 42, y: 76, w: 180, d: .45, m: [30, 86, 110] },
    { ar: 1.25, x: 47, y: 9, w: 84, d: .85 },
    { ar: 1.25, x: 85, y: 78, w: 120, d: .5 },
    { ar: .6, x: 18, y: 31, w: 130, d: .85, m: [42, 26, 86] },
    { ar: 1.25, x: 66, y: 13, w: 104, d: .4, m: [74, 31, 70] },
    { ar: 1.25, x: 2, y: 74, w: 84, d: .9 },
    { ar: 1.25, x: 33, y: 77, w: 84, d: .9 },
    { ar: 1.25, x: 93, y: 30, w: 80, d: .9 },
    { ar: 1.25, x: 6, y: 33, w: 60, d: .85, m: [6, 34, 58], only: "m" },
  ];
  const hero = $(".hero"), box = $("#frames");
  let els = [];
  function buildHero() {
    box.innerHTML = ""; els = [];
    const phone = isPhone(), W = hero.clientWidth, H = hero.clientHeight;
    C.hero.photos.slice(0, SPOTS.length).forEach((src, i) => {
      const f = SPOTS[i];
      if (phone && !f.m) return;
      if (!phone && f.only === "m") return;
      const [x, y, w] = phone ? f.m : [f.x, f.y, f.w];
      const el = document.createElement("div"); el.className = "f";
      el.style.left = (x / 100) * W + "px"; el.style.top = (y / 100) * H + "px"; el.style.width = w + "px";
      el.style.zIndex = Math.round((1 - f.d) * 10);
      const ox = x < 35 ? "0%" : x > 65 ? "100%" : "50%", oy = y < 40 ? "0%" : y > 50 ? "100%" : "50%"; // grow away from the edges
      const blur = (2 + f.d * 7).toFixed(1), op = (1 - f.d * .35).toFixed(2), pop = (1.18 + f.d * 1.1).toFixed(2);
      el.innerHTML = `<div class="drift" style="--dx:${(i % 2 ? 1 : -1) * (8 + (i % 5) * 3)}px;--dy:${(i % 3 ? -1 : 1) * (6 + (i % 4) * 3)}px;--dur:${10 + (i % 6) * 2}s;--del:-${i}s"><div class="card" style="transform-origin:${ox} ${oy};height:${Math.round(w * f.ar)}px;--blur:${blur}px;--op:${op};--pop:${pop}"><img src="${esc(src)}" alt=""></div></div>`;
      el._amp = 6 + (1 - f.d) * 34;
      box.appendChild(el); els.push(el);
      const card = $(".card", el);
      card.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") activate(el); });
      card.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") activate(null); });
      card.addEventListener("click", (e) => { if (!canHover()) { e.stopPropagation(); activate(el.classList.contains("active") ? null : el); } });
    });
  }
  function activate(el) { els.forEach((e) => e.classList.toggle("active", e === el)); hero.classList.toggle("has-active", !!el); }
  hero.addEventListener("click", () => { if (!canHover()) activate(null); });

  // Cursor drift: near photos move more than far ones. A finger drag pans the same way.
  let tx = 0, ty = 0, cx = 0, cy = 0, drag = null, px = 0, py = 0;
  hero.addEventListener("pointermove", (e) => {
    if (e.pointerType === "mouse") { const r = hero.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width) * 2 - 1; ty = ((e.clientY - r.top) / r.height) * 2 - 1; }
    else if (drag) { px = Math.max(-1.5, Math.min(1.5, drag.px + (e.clientX - drag.x) / 120)); py = Math.max(-1.5, Math.min(1.5, drag.py + (e.clientY - drag.y) / 300)); tx = -px; ty = -py; }
  });
  hero.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { tx = 0; ty = 0; } });
  hero.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") drag = { x: e.clientX, y: e.clientY, px, py }; });
  addEventListener("pointerup", () => (drag = null));
  (function loop() {
    cx += (tx - cx) * .06; cy += (ty - cy) * .06;
    els.forEach((el) => (el.style.transform = `translate(${(-cx * el._amp).toFixed(2)}px,${(-cy * el._amp).toFixed(2)}px)`));
    requestAnimationFrame(loop);
  })();
  buildHero();
  let rw = innerWidth; addEventListener("resize", () => { if (Math.abs(innerWidth - rw) > 40) { rw = innerWidth; buildHero(); } });
  $$("h1 .w").forEach((w, i) => (w.style.animationDelay = .85 + i * .14 + "s"));
  if (!canHover()) $("#hint").textContent = "Tap a photo to bring it forward";
  requestAnimationFrame(() => document.body.classList.add("loaded"));

  /* ---------- Section titles: brush paints in on scroll ---------- */
  const hbo = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); hbo.unobserve(e.target); } }), { threshold: .6 });
  $$(".hb").forEach((el) => hbo.observe(el));

  /* ---------- Colour field behind the glass: section colours, soft blends in the gaps, brand glows ---------- */
  const paint = document.createElement("div"); paint.id = "paint"; document.body.prepend(paint);
  const L = "#f3f0ec", STONE = "#e6e0d9", DARK = "#231f1f", RED = "#98171a";
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)), rgb = (c) => `rgb(${c.join(",")})`;
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  function drawPaint() {
    const H = document.documentElement.scrollHeight, sec = (id) => document.getElementById(id);
    const pad = (el, side) => parseFloat(getComputedStyle(el)["padding" + side]) || 0;
    const gap = (a, b) => { const p = sec(a), n = sec(b); return [p.offsetTop + p.offsetHeight - pad(p, "Bottom") + 16, n.offsetTop + pad(n, "Top") - 24]; };
    const h = sec("top");
    const B = [[h.offsetTop + h.offsetHeight - 360, sec("services").offsetTop + 60, L, STONE], [...gap("services", "work"), STONE, DARK], [...gap("work", "team"), DARK, L], [...gap("team", "contact"), L, RED]];
    const stops = [`${L} 0px`];
    B.forEach(([from, to, c1, c2]) => { const a = hex(c1), b = hex(c2); for (let k = 0; k <= 12; k++) { const t = k / 12, e = t * t * (3 - 2 * t); stops.push(`${rgb(mix(a, b, e))} ${Math.round(from + (to - from) * t)}px`); } });
    stops.push(`${RED} ${H}px`);
    paint.style.height = H + "px";
    paint.style.background = `linear-gradient(to bottom,${stops.join(",")})`;
    const at = (id) => sec(id).offsetTop, W = innerWidth;
    const G = [[at("services") - 80, .12, "#c9b8a8", 520], [at("services") + 260, .82, "#98171a", 380], [at("work") + 120, .08, "#98171a", 460],
      [at("work") + 620, .9, "#6b5d55", 520], [at("team") - 60, .5, "#c9b8a8", 600], [at("team") + 380, .1, "#98171a", 360], [at("contact") - 120, .85, "#98171a", 520]];
    paint.innerHTML = G.map(([y, x, c, d]) => `<i class="glow" style="top:${y - d / 2}px;left:${x * W - d / 2}px;width:${d}px;height:${d}px;background:${c}"></i>`).join("");
  }
  addEventListener("load", drawPaint); addEventListener("resize", drawPaint); drawPaint();
  new ResizeObserver(drawPaint).observe(document.body);

  /* ---------- Cursor depth in every section + glass highlight ---------- */
  if (canHover()) {
    const secs = $$("section.block,.contact").map((el) => ({ el, items: $$("[data-d]", el), tx: 0, ty: 0, x: 0, y: 0 }));
    secs.forEach((S) => {
      S.el.addEventListener("pointermove", (e) => {
        const r = S.el.getBoundingClientRect();
        S.tx = ((e.clientX - r.left) / r.width) * 2 - 1; S.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
        S.el.style.setProperty("--px", e.clientX - r.left + "px"); S.el.style.setProperty("--py", e.clientY - r.top + "px"); S.el.classList.add("lit");
      });
      S.el.addEventListener("pointerleave", () => { S.tx = 0; S.ty = 0; S.el.classList.remove("lit"); });
    });
    let gx = 0, gy = 0, cgx = 0, cgy = 0;
    addEventListener("pointermove", (e) => { gx = (e.clientX / innerWidth) * 2 - 1; gy = (e.clientY / innerHeight) * 2 - 1; });
    (function loop() {
      secs.forEach((S) => {
        S.x += (S.tx - S.x) * .07; S.y += (S.ty - S.y) * .07;
        if (Math.abs(S.x) < .001 && Math.abs(S.y) < .001 && !S.tx && !S.ty) return;
        S.items.forEach((it) => { const d = +it.dataset.d; it.style.transform = `translate3d(${(S.x * d).toFixed(2)}px,${(S.y * d * .6).toFixed(2)}px,0)`; });
      });
      cgx += (gx - cgx) * .04; cgy += (gy - cgy) * .04;
      $$("#paint .glow").forEach((g, i) => { const k = i % 2 ? 1 : -1; g.style.transform = `translate3d(${(cgx * 40 * k).toFixed(1)}px,${(cgy * 28).toFixed(1)}px,0)`; });
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Links ---------- */
  // Menu links bring the section to the middle of the screen (or to the top if it is taller than the screen).
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const id = a.getAttribute("href").slice(1), el = id && document.getElementById(id);
    if (!el || id === "top") return;
    e.preventDefault();
    const r = el.getBoundingClientRect(), y = scrollY + r.top - (r.height < innerHeight ? (innerHeight - r.height) / 2 : 16);
    scrollTo({ top: Math.max(0, y), behavior: "smooth" }); history.replaceState(null, "", "#" + id);
  }));
  // Other websites always open in a new tab so this page stays open.
  $$('a[href^="http"]').forEach((a) => {
    if (a.host === location.host) return;
    a.target = "_blank"; a.rel = "noopener";
    a.addEventListener("click", (e) => { e.preventDefault(); window.open(a.href, "_blank", "noopener"); });
  });
  // Phones: tap an item to bring it into focus.
  $$(".focus-group").forEach((g) => g.addEventListener("click", (e) => {
    if (canHover()) return;
    const it = e.target.closest(".fi"); $$(".fi", g).forEach((x) => x.classList.toggle("on", x === it)); g.classList.toggle("touching", !!it);
  }));

  /* ---------- Work: stacked slider. The centre slide plays its film; side slides sit back, smaller and blurred. ---------- */
  const FILMS = C.films.map((f) => ({ t: f.client, s: f.title, src: f.video, img: f.poster, r: f.shape === "vertical" ? 9 / 16 : 16 / 9 }));
  const PHOTOS = C.photos.map((p) => ({ t: p.client, s: p.title, img: p.image, r: 1.5 }));
  const deck = $("#deck"), cap = $("#cap");
  let items = FILMS, cur = 0, muted = true, slides = [], moved = false;
  const ICON = {
    snd: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9a4 4 0 0 1 0 6"/></svg>',
    mute: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l4 6M21 9l-4 6"/></svg>',
    fs: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
  };
  function buildDeck() {
    deck.innerHTML = "";
    slides = items.map((it, i) => {
      const el = document.createElement("div"); el.className = "slide" + (it.src ? " is-film" : "");
      el.innerHTML = `<img src="${esc(it.img)}" alt="${esc(it.t + " — " + it.s)}">` + (it.src ? `<video playsinline loop muted preload="none"></video><button class="ctl snd" aria-label="Sound">${ICON.mute}</button><button class="ctl fs" aria-label="Full screen">${ICON.fs}</button><div class="prog"><i></i></div>` : "");
      if (!it.src) $("img", el).addEventListener("load", (e) => { it.r = e.target.naturalWidth / e.target.naturalHeight; layout(); }, { once: true });
      el.addEventListener("click", () => { if (!moved && i !== cur) go(i); });
      const v = $("video", el);
      if (v) {
        v.addEventListener("playing", () => el.classList.add("playing"));
        v.addEventListener("timeupdate", () => { if (v.duration) $(".prog i", el).style.width = (v.currentTime / v.duration) * 100 + "%"; });
        $(".snd", el).onclick = (e) => { e.stopPropagation(); muted = !muted; sound(); };
        $(".fs", el).onclick = (e) => { e.stopPropagation(); (v.requestFullscreen || v.webkitEnterFullscreen || function () {}).call(v); };
      }
      deck.appendChild(el); return el;
    });
    cur = 0; layout(); caption(); play();
  }
  function layout() {
    const n = items.length, H = deck.clientHeight, Wv = innerWidth, phone = Wv <= 760;
    const W = phone ? Wv * .84 : Math.min(Wv * .5, 820);
    slides.forEach((el, i) => {
      let d = i - cur; if (d > n / 2) d -= n; if (d < -n / 2) d += n; const a = Math.abs(d);
      const r = items[i].r; let w, h;
      if (r >= 1) { w = W; h = w / r; if (h > H) { h = H; w = h * r; } } else { h = H; w = h * r; }
      el.style.width = w + "px"; el.style.height = h + "px";
      const step = phone ? [0, .62, 1.05] : [0, .56, .95], sc = phone ? [1, .8, .62] : [1, .74, .56];
      const x = (a > 2 ? 1.4 : step[a]) * W * Math.sign(d), k = a > 2 ? .4 : sc[a];
      el.style.transform = `translate(calc(-50% + ${x}px),-50%) scale(${k})`;
      el.style.zIndex = 10 - a; el.style.opacity = a > 2 ? 0 : 1;
      el.style.filter = a === 0 ? "none" : `blur(${a === 1 ? 4 : 7}px) saturate(.85)`;
      el.style.pointerEvents = a > 2 ? "none" : "auto";
      el.classList.toggle("active", a === 0);
    });
  }
  function caption() {
    cap.classList.add("out");
    setTimeout(() => { const it = items[cur]; $("b", cap).textContent = it.t; $("span", cap).textContent = it.s; cap.classList.remove("out"); }, 250);
  }
  function sound() { slides.forEach((el, i) => { const v = $("video", el); if (!v) return; const on = i === cur && !muted; v.muted = !on; $(".snd", el).innerHTML = on ? ICON.snd : ICON.mute; }); }
  function play() {
    slides.forEach((el, i) => {
      const v = $("video", el); if (!v) return;
      if (i === cur) { if (!v.getAttribute("src")) v.src = items[i].src; v.play().catch(() => {}); }
      else if (v.getAttribute("src")) { v.pause(); v.removeAttribute("src"); v.load(); el.classList.remove("playing"); } // stop downloading films that left the centre
    });
    sound();
  }
  function go(i) { cur = (i + items.length) % items.length; layout(); caption(); play(); }
  $("#next").onclick = () => go(cur + 1);
  $("#prev").onclick = () => go(cur - 1);
  // Mouse drag
  let x0 = null;
  deck.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse" || e.target.closest(".ctl")) return; x0 = e.clientX; moved = false; });
  addEventListener("pointermove", (e) => { if (x0 !== null && Math.abs(e.clientX - x0) > 8) moved = true; });
  addEventListener("pointerup", (e) => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (dx < -50) go(cur + 1); else if (dx > 50) go(cur - 1); setTimeout(() => (moved = false), 0); });
  // Two-finger trackpad swipe sideways; up/down still scrolls the page
  let wlock = 0, wsum = 0;
  deck.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault(); wsum += e.deltaX;
    if (Date.now() < wlock || Math.abs(wsum) < 40) return;
    go(cur + (wsum > 0 ? 1 : -1)); wsum = 0; wlock = Date.now() + 650;
  }, { passive: false });
  // Finger swipe on phones
  let t0 = null;
  deck.addEventListener("touchstart", (e) => { const t = e.touches[0]; t0 = { x: t.clientX, y: t.clientY }; }, { passive: true });
  deck.addEventListener("touchend", (e) => {
    if (!t0) return; const t = e.changedTouches[0], dx = t.clientX - t0.x, dy = t.clientY - t0.y; t0 = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) { moved = true; go(cur + (dx < 0 ? 1 : -1)); setTimeout(() => (moved = false), 300); }
  }, { passive: true });
  // Pause when the slider scrolls out of view
  new IntersectionObserver(([e]) => { const v = slides[cur] && $("video", slides[cur]); if (!v || !v.getAttribute("src")) return; e.isIntersecting ? v.play().catch(() => {}) : v.pause(); }, { threshold: .3 }).observe(deck);
  addEventListener("resize", layout);
  $$(".tabs button").forEach((b) => b.addEventListener("click", () => {
    $$(".tabs button").forEach((x) => x.classList.toggle("on", x === b));
    items = b.dataset.tab === "photos" ? PHOTOS : FILMS; buildDeck();
  }));
  buildDeck();
})();
