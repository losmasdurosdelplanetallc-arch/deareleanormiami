# Dear Eleanor — one-page website draft

Open `index.html` in a browser or serve this folder with any static web server.

## What is working

- Fixed desktop navigation and full-screen mobile menu
- Smooth one-page navigation with active section states
- Responsive layouts for desktop, tablet, and mobile
- Back-to-top button
- Original locally hosted lo-fi instrumental with autoplay attempt, reliable first-interaction fallback, and persistent sound control
- Official live Instagram profile embed from `@dear_eleanor305`; its newest-post grid updates as the account posts
- Embedded Canva events calendar with a full-view fallback link
- Live links for current events, Instagram, email, phone, and directions
- Front-end newsletter success state (visual demo only; no mailing platform is connected yet)
- Accessible headings, labels, alt text, skip link, and reduced-motion support

## Next-phase integration points

- **Ticketing:** Replace the `View current events` URL with the chosen ticketing partner or connect individual event cards.
- **Newsletter:** Connect `#mailing-form` to the client’s email platform and remove the demo submit handler in `script.js`.

## Background music behavior

The original “Eleanor After Hours” instrumental is hosted locally in `assets/eleanor-after-hours.wav`; no third-party stream or music license is required. Its eight-bar arrangement combines warm Rhodes-style chords, gentle bass, brushed rhythm, a restrained melody, and soft room tone. The site attempts to autoplay it. Browsers that block unmuted autoplay will start it on the visitor’s first tap, click, or key interaction. The persistent sound control always allows visitors to pause or resume it and only shows a playing state after the audio file is truly playing.

## Files

- `index.html` — content and section structure
- `styles.css` — full brand system and responsive layouts
- `script.js` — navigation, section states, reveal animation, mobile menu, and form feedback
- `assets/` — supplied logo plus photography sourced from Dear Eleanor’s existing website
