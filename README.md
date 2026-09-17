# Dear Eleanor website

Open `index.html` in a browser or serve this folder with any static web server.

## What is working

- Fixed desktop navigation and a mobile menu that remains scrollable on short screens
- Smooth one-page navigation with active section states
- Responsive layouts for desktop, tablet, and mobile
- Back-to-top button
- Hero photo slideshow using the newest client-supplied Dear Eleanor photography
- Book section uses a rotating venue slideshow with the new space photos and venue details
- Book slideshow is positioned on the left on desktop to vary the page rhythm, while mobile keeps the copy-first stack
- Dedicated Miami Community Radio section with an embedded live Twitch stream and a direct `mcr.watch/schedule` link
- Official live Instagram profile embed from `@dear_eleanor305`; its newest-post grid updates as the account posts
- `events.html` Events Calendar page with the Canva calendar embedded in the same card layout as Media Mentions
- `media.html` Media Mentions page with the Canva board embedded in the same card layout as the Events calendar
- Dedicated Bloom event-pitch page with a venue photo; the homepage button opens `pitch.html` so visitors choose to see the form
- Controlled Bloom chat bubble on the main page, separate from the isolated pitch form
- Fixed Instagram, Facebook, email, and phone contact bubbles with subtle desktop pointer lighting
- Live links for current events, Instagram, email, phone, and directions
- Email-only Mailchimp signup connected through Mailchimp’s JSONP endpoint with inline success/error messaging
- Accessible headings, labels, alt text, skip link, and reduced-motion support

## Next-phase integration points

- **Events calendar:** `events.html` embeds the Canva calendar from `https://canva.link/deareleanoreventscalendar` using Canva’s `view?embed` URL. The homepage Calendar menu item and “See full calendar” button open the events page in a new tab, and the page footer link opens the Canva calendar directly.
- **Ticketing:** “In House Events / Tickets and RSVP” embeds Dear Eleanor’s live Posh page at `https://posh.vip/g/dear-eleanor`. Posh switches to a single column at 800px, so the site keeps an 820px minimum internal viewport and scales it to fit smaller screens, showing two events side by side. “Open tickets” opens the full-size Posh page. Posh controls the event data, internal text size, and checkout.
- **Media mentions:** `media.html` embeds the Canva board from `https://canva.link/mediamentions` using Canva’s `view?embed` URL. The menu/footer open the media page in a new tab from the homepage, and the page footer link opens the Canva board directly.
- **Newsletter:** `#mailchimp-lite-form` uses Mailchimp’s `post-json` endpoint with the `EMAIL` field only. Visitors enter their email and submit inline; Mailchimp’s response is shown below the field. Final subscription behavior still follows the audience settings in Mailchimp, including double opt-in if enabled.
- **Event form:** The Bloom pitch form is isolated inside a single iframe on `pitch.html`; the separate Bloom messenger bubble is mounted once on the main page.
- **Live radio:** The `#radio` section embeds Miami Community Radio’s Twitch stream with channel `miamicommunityradio247` and links directly to `https://mcr.watch/schedule`. Twitch embeds require a real hosted domain, so `script.js` builds the player URL from the current hostname. Raw `file://` previews show an on-brand direct-link fallback instead of a broken embed.

## Live radio behavior

The site no longer tries to autoplay background music. Instead, visitors can intentionally listen or watch in the visible radio section. This avoids browser autoplay blocking and better matches the live-room experience: Miami Community Radio records live from Dear Eleanor, and visitors are invited to sit in when doors are open.

## Responsive verification — September 17, 2026

- Checked all four pages at 320, 390, 768, 1024, and 1440px widths in Chromium; the content and embed frames stay within the page.
- Calendar and media cards use a 4:5 frame and stack below their headings on mobile.
- Mobile contact bubbles sit along the bottom-left; chat and back-to-top retain their own space on the right.
- Verified menu opening/closing, Escape, short landscape menu scrolling, calendar opening in a new tab, back-to-top, and email input validation. No mailing-list subscription or ticket purchase was submitted during the audit.
- Verified the Bloom welcome screen advances to its contact fields and the outer frame grows with the actual form content, without accumulating empty space. No event pitch was submitted.
- The Twitch player loaded and reported the station offline during verification. Live playback depends on the station broadcasting.

## Files

- `index.html` — content and section structure
- `events.html` — standalone Events Calendar page with embedded Canva calendar
- `media.html` — standalone Media Mentions page with embedded Canva board
- `styles.css` — full brand system and responsive layouts
- `script.js` — navigation, section states, reveal animation, mobile menu, Mailchimp, slideshow, and Bloom chat behavior
- `pitch.html` / `pitch.js` — standalone Bloom event-pitch page
- `assets/` — supplied logo, optimized client photography, new venue photos, and previous draft assets
