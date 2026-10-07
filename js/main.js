/* ==========================================================
   EDIT HERE — your videos
   Each video can come from YouTube OR Mux — fill in one of them.

   YouTube:  https://www.youtube.com/watch?v=dQw4w9WgXcQ  →  youtube: "dQw4w9WgXcQ"
             (Unlisted videos work fine)
   Mux:      Mux dashboard → your video → copy the "Playback ID"  →  mux: "abc123..."
             (Set the playback policy to "public")

   category: "long"  = Long form    (16:9 card)
             "short" = Short reels  (9:16 vertical card)
             "ai"    = AI-assisted  (16:9 card — add vertical: true for a 9:16 one)

   Videos with no youtube or mux ID show as "Coming soon".
   If YouTube won't play a video on other sites (embedding off, or a music
   copyright claim), add openOnYouTube: true — the card then opens it on YouTube.
   ========================================================== */

// Your showreel. Fill in one of the two when it's ready.
const SHOWREEL = { youtube: "", mux: "" };

const VIDEOS = [
  // Long form
  { category: "long", title: "Patuakhali tour", youtube: "XBaymnaQIKs", mux: "" },
  // YouTube blocks this one from playing on other sites — see README. Opens on YouTube for now.
  { category: "long", title: "Bandarban tour", youtube: "IQhB25PRd34", mux: "", openOnYouTube: true },
  { category: "long", title: "Promo for a digital coin", youtube: "Ps25Bw65mVQ", mux: "" },

  // Short reels
  { category: "short", title: "Meta ad — kitchen respray", youtube: "JdVpVBAg85k", mux: "" },
  { category: "short", title: "The ~100K-view Reel", youtube: "", mux: "" },
  { category: "short", title: "Travel reel", youtube: "", mux: "" },
  { category: "short", title: "Event highlight", youtube: "", mux: "" },

  // AI-assisted
  { category: "ai", title: "What If — intro video", youtube: "ea_uhSXMBXs", mux: "" },
  { category: "ai", title: "Spirit Guide — channel intro", youtube: "jg009Hiwgzw", mux: "" },
  { category: "ai", title: "Ad for solar leads", youtube: "p0YQxeuoCDU", mux: "", vertical: true },
];

/* ========================================================== */

const MUX_PLAYER_SRC = "https://cdn.jsdelivr.net/npm/@mux/mux-player@3.13.4";

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

/* ---------- Video players (YouTube or Mux) ---------- */
function youtubeEmbed(id) {
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
  iframe.title = "YouTube video";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  // YouTube rejects embeds that don't say which site they're on (error 153).
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  return iframe;
}

// The Mux player script is ~1MB, so it only loads the first time someone presses play.
let muxPlayerLoading = null;
function loadMuxPlayer() {
  if (!muxPlayerLoading) {
    muxPlayerLoading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = MUX_PLAYER_SRC;
      script.onload = resolve;
      script.onerror = () => { muxPlayerLoading = null; reject(); };
      document.head.appendChild(script);
    });
  }
  return muxPlayerLoading;
}

function muxEmbed(playbackId, title) {
  const player = document.createElement("mux-player");
  player.setAttribute("playback-id", playbackId);
  player.setAttribute("stream-type", "on-demand");
  player.setAttribute("accent-color", "#e62b1e");
  player.setAttribute("metadata-video-title", title);
  player.setAttribute("autoplay", "");
  return player;
}

function videoThumb(v) {
  if (v.mux) return `https://image.mux.com/${v.mux}/thumbnail.webp?width=960&time=2`;
  if (v.youtube) return `https://i.ytimg.com/vi/${v.youtube}/hqdefault.jpg`;
  return "";
}

// Replaces `container`'s contents with a playing video.
async function playVideo(container, v) {
  container.innerHTML = "";
  if (v.mux) {
    container.classList.add("is-loading");
    try {
      await loadMuxPlayer();
      container.appendChild(muxEmbed(v.mux, v.title));
    } catch {
      container.innerHTML = `<p class="video-error">Couldn't load the video. Please refresh and try again.</p>`;
    }
    container.classList.remove("is-loading");
  } else {
    container.appendChild(youtubeEmbed(v.youtube));
  }
}

/* Showreel */
const showreelFrame = document.getElementById("showreel-frame");
const showreelPlay = document.getElementById("showreelPlay");
if (SHOWREEL.youtube || SHOWREEL.mux) {
  document.getElementById("showreelStatus").textContent = "· watch now";
  showreelPlay.addEventListener("click", () => playVideo(showreelFrame, { ...SHOWREEL, title: "Showreel" }));
} else {
  showreelPlay.disabled = true;
  showreelPlay.setAttribute("aria-label", "Showreel coming soon");
}

/* Video grid */
const CATEGORY_LABELS = { long: "Long form", short: "Short reel", ai: "AI-assisted" };
const videoGrid = document.getElementById("videoGrid");

VIDEOS.forEach(v => {
  const hasVideo = Boolean(v.youtube || v.mux);
  const vertical = v.category === "short" || v.vertical;
  const card = document.createElement("div");
  card.className = "video-card reveal"
    + (vertical ? " video-card--vertical" : "")
    + (hasVideo ? "" : " video-card--soon");
  card.dataset.vcat = v.category;

  const meta = `
    <div class="video-card__meta">
      <p class="video-card__type">${CATEGORY_LABELS[v.category] || ""}</p>
      <h3 class="video-card__title">${v.title}</h3>
    </div>`;

  if (hasVideo) {
    card.innerHTML = `
      <img class="video-card__thumb" src="${videoThumb(v)}" alt="" loading="lazy">
      ${meta}
      ${v.openOnYouTube
        ? `<a class="video-card__btn" href="https://www.youtube.com/watch?v=${v.youtube}" target="_blank" rel="noopener" aria-label="Watch ${v.title} on YouTube"><i class="fa-brands fa-youtube"></i></a>`
        : `<button class="video-card__btn" aria-label="Play ${v.title}"><i class="fa-solid fa-play"></i></button>`}`;
    if (!v.openOnYouTube) card.querySelector("button").addEventListener("click", () => playVideo(card, v));
  } else {
    card.innerHTML = meta;
  }
  videoGrid.appendChild(card);
});

// Layout tweaks per tab:
// - landscape and vertical videos mixed: landscape stacked on the left, vertical beside them
// - odd number of landscape videos: the first goes full width so rows come out even
Object.keys(CATEGORY_LABELS).forEach(cat => {
  const cards = videoGrid.querySelectorAll(`.video-card[data-vcat="${cat}"]`);
  const landscape = [...cards].filter(c => !c.classList.contains("video-card--vertical"));
  const mixed = landscape.length > 0 && landscape.length < cards.length;
  if (mixed) cards.forEach(c => c.classList.add("video-card--mixed"));
  else if (landscape.length % 2 === 1 && landscape.length > 1) landscape[0].classList.add("video-card--featured");
});

/* Video category tabs */
const videoTabs = document.querySelectorAll(".video-filter");
function showVideoCategory(cat) {
  videoTabs.forEach(t => {
    t.classList.toggle("is-active", t.dataset.vcat === cat);
    t.setAttribute("aria-selected", String(t.dataset.vcat === cat));
  });
  videoGrid.querySelectorAll(".video-card").forEach(c => c.classList.toggle("is-hidden", c.dataset.vcat !== cat));
  document.querySelectorAll(".video-note").forEach(n => { n.hidden = n.dataset.vcat !== cat; });
}
videoTabs.forEach(t => t.addEventListener("click", () => showVideoCategory(t.dataset.vcat)));
showVideoCategory("long");

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
document.querySelectorAll(".filter[data-filter]").forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    document.querySelectorAll(".filter[data-filter]").forEach(b => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-selected", String(b === btn));
    });
    works.forEach(w => w.classList.toggle("is-hidden", w.dataset.cat !== filter));
    document.querySelectorAll(".campaign-note[data-campaign]").forEach(n => { n.hidden = n.dataset.campaign !== filter; });
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
