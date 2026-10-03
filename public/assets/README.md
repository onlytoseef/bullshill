# Assets

Static files served from the root URL. Anything here is public.

`public/assets/logo.svg` → referenced in code as `/assets/logo.svg`

## Folders

| Folder    | Contents                                              |
| --------- | ----------------------------------------------------- |
| `brand/`  | Logo (SVG preferred), wordmark, favicon source        |
| `images/` | Photos, hero art, case-study shots, team headshots    |
| `icons/`  | UI + service icons, social icons (SVG)                |
| `video/`  | Background loops, showreel (MP4/WebM)                 |
| `fonts/`  | Only self-hosted font files — skip if using Google Fonts |

## Notes

- **SVG for anything vector** — logos, icons. Scales cleanly, tiny filesize.
- **Raster photos**: ship the largest version you have. `next/image` generates
  resized WebP variants at build/request time, so don't pre-compress.
- Avoid spaces in filenames — use `case-study-hero.jpg`, not `case study hero.jpg`.
