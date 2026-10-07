# Akkhor Hasan — Portfolio

A single-page portfolio site in plain HTML, CSS and JavaScript (no build step).

## Preview

Double-click `index.html` to open it in your browser.

## Adding videos

Upload each video to YouTube (Unlisted is fine), then open `js/main.js` and paste its ID
at the top of the file:

```js
const SHOWREEL_ID = "dQw4w9WgXcQ";   // from youtube.com/watch?v=dQw4w9WgXcQ

const VIDEOS = [
  { id: "abc123XYZ", type: "Explainer", title: "Explainer video" },
  ...
];
```

Cards with an empty `id` show as "Coming soon".

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
