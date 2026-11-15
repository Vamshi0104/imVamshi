# Portfolio refinement audit

## Gaps and changes

| Gap | Implemented improvement | Remaining limit |
| --- | --- | --- |
| Project explanations lacked depth | Structured summary, engineering approach, stack, and workflows for the four featured projects; Robyn source, website, and package actions | Additional production metrics and detailed trade-offs need actual project evidence |
| Generic links looked project-specific | General GitHub destinations now say “GitHub profile” with an explanatory note | Public GitHub API verification resolved ten source-link gaps; URL Shorten Service, Multilingual AI Chatbot, and Song Recommender still have no confidently matched public repository |
| Oversized image payload | Dimensioned, lazy-decoded WebP images; original images preserved | Five low-resolution or unrelated previews now use original vector workflow covers labeled “System concept”; originals remain preserved |
| External icon and map overhead | Local SVG-mask icons and a map loaded only after interaction | Google Fonts remains external, with a system fallback and swap behavior |
| Keyboard and dialog details | Skip link, explicit menu state, pressed filter state, 44px controls, native modal focus return, correct outside-click closing, Escape cleanup | This is not a complete assistive-technology certification |
| Fragile JavaScript assumptions | Safe optional local storage, no-JavaScript content/navigation fallback, loader timeout, page restoration updates | Interactive project filtering and preview still require JavaScript |
| Contact friction and unnecessary identifier | Removed the daily device lockout and generated device identifier; request timeout, duplicate-submit protection, and direct email fallback | Live Formspree delivery was not tested, to avoid sending an unsolicited message |
| Simulated download progress | Honest browser-download-request status | A static page cannot verify that the visitor saved the PDF |
| Search recovery and state | Multi-word matching, pressed filter states, empty-state reset, and preserved filter focus | No backend search is needed for the current 15-project collection |
| SEO, maintenance, and layout consistency | Canonical URL, absolute social image, ProfilePage structured data, clean sitemap, safe redundant CSS cleanup, compact section spacing, offline checks | Live search indexing, social crawlers, Core Web Vitals, and cross-browser rendering require deployment/real-device checks |

## Verification

- Offline asset, anchor, ID, contact-field, structured-data, and sitemap checks pass.
- JavaScript syntax and patch whitespace checks pass.
- Browser: search expansion, zero-result state, reset, Enter-to-open, Escape-to-close, native focus restoration, and body scroll-unlock verified.
- Responsive document-width checks passed at 320, 390, 768, 1024, and 1440px.
- Dark and light themes reviewed in the local browser.
- Map confirmed not to create an iframe before interaction.
- No broken loaded images or browser error/warning messages observed in the local preview.
- Reduced-motion and no-JavaScript fallbacks reviewed in source; dedicated runtime emulation was not available in the browser surface.

## Image payload

The portrait and project image collection was reduced from 4,964,327 bytes to 328,746 bytes (approximately 93.4%). This is the total collection, not a measured first-page transfer or Lighthouse result. Originals remain in the repository for future editing.

## Resume chooser and source verification follow-up

- Replaced the two visible download actions with one **Download Resume** trigger in both the resume section and PDF preview.
- The bottom dialog presents one-page and detailed PDFs, closes after selection, and shows a download status message.
- Both files were downloaded through the browser and compared byte-for-byte with the original PDFs. Both match.
- Keyboard Escape, restored focus, scroll unlocking, and cancellation back to the PDF preview were verified.
- Chooser fit checked at 320×568, 390×844, 768×1024, and 844×390, without horizontal page overflow.
- Verified public repository names through `https://api.github.com/users/Vamshi0104/repos?per_page=100` and used exact repository URLs for matching projects.
- Added benchmark and source links for ProofPathBench.
- Replaced an unrelated Vintage Knowledge image in Find Me with a labeled location-sharing concept cover; corrected its stack to include Java and Spring Boot, matching the public repository description.
- Static checks now validate both resume choices and SVG cover integrity.

## Honest completion criteria

A “10/10” rating is subjective. The remaining work is evidence and production validation: dedicated project URLs, stronger original screenshots where available, verified project outcomes, authorized contact-delivery testing, and deployed accessibility/performance checks. No invented metrics or audit scores were added.

Changes are local; no deployment, push, or contact submission was performed.
