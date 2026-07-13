# Dear Eleanor — one-page website draft

Open `index.html` in a browser or serve this folder with any static web server.

## What is working

- Fixed desktop navigation and full-screen mobile menu
- Smooth one-page navigation with active section states
- Responsive layouts for desktop, tablet, and mobile
- Back-to-top button
- Hero photo slideshow using the newest client-supplied Dear Eleanor photography
- Host-your-event section now uses a rotating venue slideshow with the new space photos and venue details
- Host-your-event slideshow is positioned on the left on desktop to vary the page rhythm, while mobile keeps the copy-first stack
- Dedicated Miami Community Radio section with an embedded live Twitch stream and a direct `mcr.watch` link
- Official live Instagram profile embed from `@dear_eleanor305`; its newest-post grid updates as the account posts
- Embedded Canva events calendar with a full-view fallback link
- `media.html` Media Mentions page with the Canva board embedded in the same card layout as the Events calendar
- Dedicated Bloom event-pitch page with a venue photo; the homepage button opens `pitch.html` so visitors choose to see the form
- Controlled Bloom chat bubble on the main page, separate from the isolated pitch form
- Fixed Instagram, Facebook, email, and phone contact bubbles with subtle desktop pointer lighting
- Live links for current events, Instagram, email, phone, and directions
- Email-only Mailchimp signup connected through Mailchimp’s JSONP endpoint with inline success/error messaging
- Accessible headings, labels, alt text, skip link, and reduced-motion support

## Next-phase integration points

- **Ticketing:** Replace the `View current events` URL with the chosen ticketing partner or connect individual event cards.
- **Media mentions:** `media.html` embeds the Canva board from `https://canva.link/mediamentions` using Canva’s `view?embed` URL. The menu/footer open the media page in a new tab from the homepage, and the page footer link opens the Canva board directly.
- **Newsletter:** `#mailchimp-lite-form` uses Mailchimp’s `post-json` endpoint with the `EMAIL` field only. Visitors enter their email and submit inline; Mailchimp’s response is shown below the field. Final subscription behavior still follows the audience settings in Mailchimp, including double opt-in if enabled.
- **Event form:** The Bloom pitch form is isolated inside a single iframe on `pitch.html`; the separate Bloom messenger bubble is mounted once on the main page.
- **Live radio:** The `#radio` section embeds Miami Community Radio’s Twitch stream with channel `miamicommunityradio247` and links directly to `https://mcr.watch/`. Twitch embeds require a real hosted domain, so `script.js` builds the player URL from the current hostname. Raw `file://` previews show an on-brand direct-link fallback instead of a broken embed.

## Live radio behavior

The site no longer tries to autoplay background music. Instead, visitors can intentionally listen or watch in the visible radio section. This avoids browser autoplay blocking and better matches the live-room experience: Miami Community Radio records live from Dear Eleanor, and visitors are invited to sit in when doors are open.

## Files

- `index.html` — content and section structure
- `media.html` — standalone Media Mentions page with embedded Canva board
- `styles.css` — full brand system and responsive layouts
- `script.js` — navigation, section states, reveal animation, mobile menu, Mailchimp, slideshow, and Bloom chat behavior
- `pitch.html` / `pitch.js` — standalone Bloom event-pitch page
- `assets/` — supplied logo, optimized client photography, new venue photos, and previous draft assets
