/* ==========================================================
   EDIT HERE — your videos
   Upload to YouTube (Unlisted is fine) and paste the video ID:
   https://www.youtube.com/watch?v=dQw4w9WgXcQ  →  id: "dQw4w9WgXcQ"
   ========================================================== */

// Your showreel. Leave "" until it's ready.
const SHOWREEL_ID = "";

// Your best edits. Cards with id: "" show as "Coming soon".
const VIDEOS = [
  { id: "", type: "Explainer", title: "Explainer video" },
  { id: "", type: "Ad", title: "Ad for a US client" },
  { id: "", type: "Event film", title: "TEDxRUET 2025" },
  { id: "", type: "Travel", title: "Travel film" },
];

/* ========================================================== */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Nav ---------- */
const nav = document.querySelector(".nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 30);
}, { passive: true });

function setMenu(open) {
  navLinks.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
}
navToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("is-open")));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));

/* ---------- YouTube embeds ---------- */
function youtubeEmbed(id) {
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
  iframe.title = "YouTube video";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  return iframe;
}

/* Showreel */
const showreelFrame = document.getElementById("showreel-frame");
const showreelPlay = document.getElementById("showreelPlay");
if (SHOWREEL_ID) {
  document.getElementById("showreelStatus").textContent = "· watch now";
  showreelPlay.addEventListener("click", () => {
    showreelFrame.querySelector(".showreel__poster").remove();
    showreelFrame.appendChild(youtubeEmbed(SHOWREEL_ID));
  });
} else {
  showreelPlay.disabled = true;
  showreelPlay.setAttribute("aria-label", "Showreel coming soon");
}

/* Video grid */
const videoGrid = document.getElementById("videoGrid");
VIDEOS.forEach(v => {
  const card = document.createElement("div");
  card.className = "video-card reveal" + (v.id ? "" : " video-card--soon");
  const meta = `
    <div class="video-card__meta">
      <p class="video-card__type">${v.type}</p>
      <h3 class="video-card__title">${v.title}</h3>
    </div>`;
  if (v.id) {
    card.innerHTML = `
      <img class="video-card__thumb" src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy">
      ${meta}
      <button class="video-card__btn" aria-label="Play ${v.title}"><i class="fa-solid fa-play"></i></button>`;
    card.querySelector("button").addEventListener("click", () => {
      card.innerHTML = "";
      card.appendChild(youtubeEmbed(v.id));
    });
  } else {
    card.innerHTML = meta;
  }
  videoGrid.appendChild(card);
});

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-in");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ---------- Count-up numbers ---------- */
function countUp(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) { el.textContent = target + suffix; return; }
  const duration = 1600;
  const start = performance.now();
  (function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  })(start);
}
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    countUp(entry.target);
    countObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });
document.querySelectorAll("[data-count]").forEach(el => countObserver.observe(el));

/* ---------- Design filters ---------- */
const works = [...document.querySelectorAll(".work")];
document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    document.querySelectorAll(".filter").forEach(b => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-selected", String(b === btn));
    });
    works.forEach(w => w.classList.toggle("is-hidden", w.dataset.cat !== filter));
    document.querySelectorAll(".campaign-note").forEach(n => { n.hidden = n.dataset.campaign !== filter; });
  });
});

/* ---------- Lightbox ---------- */
const lightbox = document.getElementById("lightbox");
const lbImg = lightbox.querySelector("img");
const lbCaption = lightbox.querySelector("figcaption");
let lbIndex = 0;
let lastFocus = null;

const visibleWorks = () => works.filter(w => !w.classList.contains("is-hidden"));

function showWork(i) {
  const list = visibleWorks();
  lbIndex = (i + list.length) % list.length;
  const work = list[lbIndex];
  lbImg.src = work.dataset.full;
  lbImg.alt = work.querySelector("img").alt;
  lbCaption.textContent = work.querySelector("figcaption").textContent.replace(/\s+/g, " ").trim()
    .replace(/^(TEDxRUET|RUET '20 Rag)/, "$1 · ");
}
function openLightbox(work) {
  lastFocus = document.activeElement;
  showWork(visibleWorks().indexOf(work));
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightbox.querySelector(".lightbox__close").focus();
}
function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}

works.forEach(work => {
  work.tabIndex = 0;
  work.setAttribute("role", "button");
  work.addEventListener("click", () => openLightbox(work));
  work.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(work); }
  });
});
lightbox.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
lightbox.querySelector(".lightbox__nav--prev").addEventListener("click", () => showWork(lbIndex - 1));
lightbox.querySelector(".lightbox__nav--next").addEventListener("click", () => showWork(lbIndex + 1));
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showWork(lbIndex - 1);
  if (e.key === "ArrowRight") showWork(lbIndex + 1);
});

/* Swipe in lightbox on phones */
let touchX = null;
lightbox.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener("touchend", e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) showWork(lbIndex + (dx < 0 ? 1 : -1));
  touchX = null;
});

/* ---------- Custom "View" cursor over designs ---------- */
const cursor = document.querySelector(".cursor");
if (window.matchMedia("(hover: hover)").matches) {
  window.addEventListener("mousemove", e => {
    cursor.style.translate = `${e.clientX}px ${e.clientY}px`;
  }, { passive: true });
  works.forEach(w => {
    w.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
    w.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
  });
}
