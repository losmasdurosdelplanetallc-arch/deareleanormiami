# Dear Eleanor — one-page website draft

Open `index.html` in a browser or serve this folder with any static web server.

## What is working

- Fixed desktop navigation and full-screen mobile menu
- Smooth one-page navigation with active section states
- Responsive layouts for desktop, tablet, and mobile
- Back-to-top button
- Live links for current events, Instagram, email, phone, and directions
- Front-end newsletter success state (visual demo only; no mailing platform is connected yet)
- Accessible headings, labels, alt text, skip link, and reduced-motion support

## Next-phase integration points

- **Canva calendar:** In `index.html`, replace the contents of `.canva-placeholder` with the Canva iframe embed code.
- **Ticketing:** Replace the `View current events` URL with the chosen ticketing partner or connect individual event cards.
- **Instagram:** Replace `.insta-grid` with the selected Instagram feed/embed provider.
- **Newsletter:** Connect `#mailing-form` to the client’s email platform and remove the demo submit handler in `script.js`.

## Files

- `index.html` — content and section structure
- `styles.css` — full brand system and responsive layouts
- `script.js` — navigation, section states, reveal animation, mobile menu, and form feedback
- `assets/` — supplied logo plus photography sourced from Dear Eleanor’s existing website
