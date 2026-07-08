# Dear Eleanor — one-page website draft

Open `index.html` in a browser or serve this folder with any static web server.

## What is working

- Fixed desktop navigation and full-screen mobile menu
- Smooth one-page navigation with active section states
- Responsive layouts for desktop, tablet, and mobile
- Back-to-top button
- Miami Community Radio sound control connected to MCR's Twitch channel when the site is hosted, with the original local lo-fi instrumental as a fallback for file previews or blocked embeds
- Official live Instagram profile embed from `@dear_eleanor305`; its newest-post grid updates as the account posts
- Embedded Canva events calendar with a full-view fallback link
- Dedicated Bloom event-pitch page; the homepage button opens `pitch.html` so visitors choose to see the form
- Controlled Bloom chat bubble on the main page, separate from the isolated pitch form
- Compact rotating Polaroid slideshow in the About section
- Fixed Instagram, Facebook, email, and phone contact bubbles with subtle desktop pointer lighting
- Live links for current events, Instagram, email, phone, and directions
- Email-only Mailchimp signup connected through Mailchimp’s JSONP endpoint with inline success/error messaging
- Accessible headings, labels, alt text, skip link, and reduced-motion support

## Next-phase integration points

- **Ticketing:** Replace the `View current events` URL with the chosen ticketing partner or connect individual event cards.
- **Newsletter:** `#mailchimp-lite-form` uses Mailchimp’s `post-json` endpoint with the `EMAIL` field only. Visitors enter their email and submit inline; Mailchimp’s response is shown below the field. Final subscription behavior still follows the audience settings in Mailchimp, including double opt-in if enabled.
- **Event form:** The Bloom pitch form is isolated inside a single iframe on `pitch.html`; the separate Bloom messenger bubble is mounted once on the main page.
- **Live radio:** The fixed sound control loads Miami Community Radio through the Twitch player API using channel `miamicommunityradio247`. Twitch requires the final hosted domain as the embed parent, so local `file://` previews will use the fallback audio instead. The adjacent `MCR live` link opens `https://mcr.watch/` directly.

## Background music behavior

The site now prioritizes Miami Community Radio from `mcr.watch`, which is powered by a Twitch embed. Browsers may still block unmuted autoplay, so the control preloads the player where possible and starts on the visitor’s first tap, click, or key interaction. If Twitch does not confirm playback quickly, cannot load because the page is being opened as a local file, or is blocked/offline, the original “Eleanor After Hours” instrumental in `assets/eleanor-after-hours.wav` plays as a fallback. The persistent sound control always allows visitors to pause or resume sound and includes a direct `MCR live` link.

## Files

- `index.html` — content and section structure
- `styles.css` — full brand system and responsive layouts
- `script.js` — navigation, section states, reveal animation, mobile menu, music, and Bloom chat behavior
- `pitch.html` / `pitch.js` — standalone Bloom event-pitch page
- `assets/` — supplied logo plus photography sourced from Dear Eleanor’s existing website
