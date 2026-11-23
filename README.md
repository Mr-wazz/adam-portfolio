# Adam O. Portfolio Website

Static site (HTML, CSS, JS). No build step. Hosted on Netlify (settings in `netlify.toml`), deployed from the `main` branch. `vercel.json` is kept in case of a move to Vercel.

## How updates go live
Every push to `main` deploys automatically on Netlify within about a minute.

## Files
- `index.html`: all page content
- `assets/styles.css`: design
- `assets/main.js`: menu, scroll effects, project filter, hero slideshow
- `assets/img/`: compressed screenshots (WebP) and share image
- `vercel.json`: clean URLs, caching and security headers
