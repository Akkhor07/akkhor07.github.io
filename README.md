# Akkhor Hasan — Portfolio

A single-page portfolio site in plain HTML, CSS and JavaScript (no build step).

## Preview

Double-click `index.html` to open it in your browser.

## Adding videos

Each video can come from **YouTube** or **Mux**. Open `js/main.js` and fill in the list at the top:

```js
const SHOWREEL = { youtube: "", mux: "PLAYBACK_ID" };

const VIDEOS = [
  { category: "long",  title: "Explainer video", youtube: "dQw4w9WgXcQ", mux: "" },
  { category: "short", title: "Travel reel",     youtube: "", mux: "PLAYBACK_ID" },
  { category: "ai",    title: "AI-generated ad", youtube: "", mux: "PLAYBACK_ID", vertical: true },
];
```

- **YouTube ID:** the part after `v=` in the video link. Unlisted videos work.
- **Mux playback ID:** Mux dashboard → your video → "Playback ID". Its playback policy must be **public**.
- **category:** `long` (Long form, 16:9), `short` (Short reels, 9:16) or `ai` (AI-assisted, 16:9;
  add `vertical: true` for a 9:16 one).

Videos with neither ID show as "Coming soon".

If a YouTube video shows "This video is unavailable" on the site, YouTube is blocking it from playing
on other websites. Check YouTube Studio → the video → Details → Show more → **Allow embedding**, and
look for a music copyright claim. Until it's fixed, add `openOnYouTube: true` and the card opens the
video on YouTube instead. The Mux player only downloads when someone presses play,
so it doesn't slow down the page.

## Adding designs

1. Put a WebP version of the image in `assets/img/` (a full-size version and a `-thumb` version).
2. Copy one of the `<figure class="work">` blocks in `index.html` and change the paths and caption.
   `data-cat="tedx"` or `data-cat="rag"` decides which campaign tab it appears under.

## Folders

| Path | What's in it |
|---|---|
| `index.html` | All page content |
| `css/style.css` | Styling. Colors are at the top in `:root` |
| `js/main.js` | Videos list, animations, gallery and lightbox |
| `assets/img/` | Optimized images used by the site |
| `_source/` | Your original files. Kept locally, never uploaded (see `.gitignore`) |

## After changing CSS or JS

Bump the `?v=` number on the `css/style.css` and `js/main.js` links at the top and bottom of
`index.html` (for example `?v=5` → `?v=6`). That makes browsers download the new files right away
instead of showing a cached copy for up to 10 minutes.
