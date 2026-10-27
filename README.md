# SynergyDev Website

Static website for SynergyDev (Web Development & Digital Solution). No build step required.

## Structure

- `index.html` – Home
- `about/`, `services/`, `projects/`, `process/`, `contact/` – main pages (clean URLs via folder index files)
- `projects/<slug>/` – project detail pages (ktrog, ktrog-admin, chasly, villa-jambu-klutuk, fun-english, rustic-market)
- `assets/styles.css` – all styles
- `assets/main.js` – navigation, scroll effects, contact form (opens WhatsApp)
- `assets/projects/<slug>.jpg` – optional project screenshots (see below)
- `404.html`, `robots.txt`, `sitemap.xml`, `.nojekyll`

## Deploy to GitHub Pages

1. Create a new repository on GitHub (for example `synergydev-website`).
2. Upload **all files and folders** in this folder, keeping the structure. The `.nojekyll` file must be included.
3. Go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
4. Wait a minute, then open the URL GitHub shows.

### Custom domain (optional)

1. In **Settings → Pages → Custom domain**, enter `syinergydev.work.gd` and save.
2. Add a `CNAME` file in the root with the single line `syinergydev.work.gd`.
3. Point your DNS to GitHub Pages as described in GitHub's documentation.

If you use a different domain, search for `https://syinergydev.work.gd` across all files and replace it (canonical links, Open Graph tags, sitemap, robots.txt, and footer links).

## Adding project screenshots

Save screenshots as JPG files in `assets/projects/` using these names:

- `ktrog.jpg`
- `ktrog-admin.jpg`
- `chasly.jpg`
- `villa-jambu-klutuk.jpg`
- `fun-english.jpg`
- `rustic-market.jpg`

If a file is missing, the page shows the project name as a placeholder instead.

## Contact form

The contact form has no backend. Submitting it opens WhatsApp with the inquiry details filled in, so no server is needed.

## Notes

- Keep project status accurate. Chasly is marked **In Development** and Rustic Market is marked **Website Concept / Demo**.
- Social media links are intentionally omitted until official accounts exist.
