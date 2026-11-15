# Vamshi Krishna Madhavan — Portfolio

Static portfolio for software engineering, data systems, developer tools, and AI research.

## Local preview

Run `python3 -m http.server 8765` from this directory and open `http://localhost:8765`.
There is no build step or JavaScript runtime dependency.

## Checks

- `python3 scripts/check-site.py` checks local assets, anchors, duplicate IDs, structured metadata, contact fields, and the sitemap.
- `node --check assets/js/script.js` checks JavaScript syntax.
- `git diff --check` checks patch formatting.
- `python3 scripts/tidy-css.py` removes safe duplicate CSS declarations while retaining cascade order and fallback values.

## Content and assets

Project content lives in `assets/js/script.js`; public profile, experience, publications, and recommendations live in `index.html`.
Recommendations retain their original full text inside native disclosure controls.
Original images are preserved. The page serves dimensioned WebP images from `assets/images/optimized/`.
Public project links were checked against the GitHub repository list. A project with no confidently matched public source still links honestly to the general GitHub profile. Five vector workflow covers are explicitly labeled as concepts, not product screenshots.

The contact form posts to the existing Formspree endpoint. End-to-end message delivery requires an authorized live submission; offline checks do not verify delivery.
Maps load only after visitor interaction. The site does not create a contact-device identifier.

The single **Download Resume** action opens a bottom format chooser for one-page or detailed PDFs. Native direct-download links remain available when JavaScript is disabled.

## Accessibility and motion

The page uses native dialogs, keyboard-operable cards and disclosures, a skip link, filter state, image alternatives, and reduced-motion styles.
The typewriter pauses offscreen and while the document is hidden. Scrolling remains native; wheel and touch inputs are not intercepted.
With JavaScript disabled, navigation, content, publication links, resume downloads, native contact submission, and basic project links remain available.
