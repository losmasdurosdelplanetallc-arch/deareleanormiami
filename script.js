const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.nav-link')];
const backToTop = document.querySelector('.back-to-top');
const sections = [...document.querySelectorAll('main section[id]')];
const reveals = document.querySelectorAll('.reveal');

function closeMenu() {
  menuButton.classList.remove('active');
  menuButton.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  document.body.style.overflow = '';
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.classList.toggle('active', !isOpen);
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('open', !isOpen);
  document.body.style.overflow = !isOpen ? 'hidden' : '';
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
  backToTop.classList.toggle('visible', window.scrollY > 650);
}, { passive: true });

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

reveals.forEach((element) => revealObserver.observe(element));

const bloomFrameMount = document.querySelector('[data-bloom-frame-mount]');
const bloomChatMount = document.querySelector('[data-bloom-chat-mount]');

if (bloomFrameMount) {
  window.bloomSettings = { userId: '38kd550x1dwvr', profileId: 'kxe70gwmz9o4z' };

  const bloomFrame = document.createElement('iframe');
  bloomFrame.className = 'bloom-form-frame';
  bloomFrame.title = 'Pitch your event form';
  bloomFrame.loading = 'lazy';
  bloomFrame.srcdoc = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          html, body { margin: 0; background: transparent; }
          body { font-family: Arial, sans-serif; overflow: hidden; }
          [picr-embeddable-direct-form] { width: 100%; min-height: 0; }
        </style>
      </head>
      <body>
        <div picr-embeddable-direct-form data-form-id="kxe70z2qxdo4z" style="width:100%;"></div>
        <script>
          window.bloomSettings = { userId: "38kd550x1dwvr", profileId: "kxe70gwmz9o4z" };
          if (void 0 === window.bloomScript) {
            window.bloomScript = document.createElement("script");
            window.bloomScript.async = !0;
            fetch("https://code.bloom.io/version?t=" + Date.now())
              .then(function (t) { return t.text(); })
              .then(function (t) {
                window.bloomScript.src = "https://code.bloom.io/widget.js?v=" + t;
                document.head.appendChild(window.bloomScript);
              });
          }

          function sendBloomHeight() {
            var form = document.querySelector("[picr-embeddable-direct-form]");
            var height = Math.max(
              360,
              document.documentElement.scrollHeight || 0,
              document.body.scrollHeight || 0,
              form ? form.scrollHeight : 0
            );
            parent.postMessage({ type: "dear-eleanor-bloom-height", height: height }, "*");
          }

          window.addEventListener("load", sendBloomHeight);
          if ("ResizeObserver" in window) {
            new ResizeObserver(sendBloomHeight).observe(document.body);
          }
          new MutationObserver(sendBloomHeight).observe(document.body, { childList: true, subtree: true, attributes: true });
          setTimeout(sendBloomHeight, 500);
          setTimeout(sendBloomHeight, 1500);
          setTimeout(sendBloomHeight, 3000);
        <\/script>
      </body>
    </html>
  `;

  bloomFrameMount.replaceChildren(bloomFrame);

  window.addEventListener('message', (event) => {
    if (event.source !== bloomFrame.contentWindow || event.data?.type !== 'dear-eleanor-bloom-height') return;
    const nextHeight = Math.ceil(Number(event.data.height));
    if (!Number.isFinite(nextHeight)) return;
    bloomFrame.style.height = `${Math.min(Math.max(nextHeight + 8, 360), 1200)}px`;
  });
}

if (bloomChatMount) {
  window.bloomSettings = { userId: '38kd550x1dwvr', profileId: 'kxe70gwmz9o4z' };

  if (typeof window.bloomScript === 'undefined') {
    window.bloomScript = document.createElement('script');
    window.bloomScript.async = true;
    fetch(`https://code.bloom.io/version?t=${Date.now()}`)
      .then((response) => response.text())
      .then((version) => {
        window.bloomScript.src = `https://code.bloom.io/widget.js?v=${version}`;
        document.head.appendChild(window.bloomScript);
      });
  }
}

document.querySelectorAll('[data-photo-slider], [data-polaroid-slider]').forEach((slider) => {
  const slides = [...slider.querySelectorAll('.photo-slide, .polaroid-slide')];
  const dots = [...slider.querySelectorAll('.photo-dots span, .polaroid-dots span')];
  const prefersReducedSlideMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeSlide = 0;

  if (slides.length < 2) return;

  const showSlide = (nextIndex) => {
    activeSlide = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => slide.classList.toggle('is-active', index === activeSlide));
    dots.forEach((dot, index) => dot.classList.toggle('is-active', index === activeSlide));
  };

  if (!prefersReducedSlideMotion) {
    window.setInterval(() => showSlide(activeSlide + 1), 3400);
  }
});

const mailchimpLiteForm = document.querySelector('#mailchimp-lite-form');
const mailchimpMessage = document.querySelector('#mailchimp-message');

function cleanMailchimpMessage(message) {
  const temporaryMessage = document.createElement('div');
  temporaryMessage.innerHTML = String(message || '');
  return temporaryMessage.textContent.replace(/^\d+\s*-\s*/, '').trim();
}

if (mailchimpLiteForm && mailchimpMessage) {
  mailchimpLiteForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!mailchimpLiteForm.reportValidity()) return;

    const emailInput = mailchimpLiteForm.querySelector('input[name="EMAIL"]');
    const honeypotInput = mailchimpLiteForm.querySelector('.mailchimp-honeypot input');
    const submitButton = mailchimpLiteForm.querySelector('button[type="submit"]');
    const callbackName = `dearEleanorMailchimp${Date.now()}`;
    const params = new URLSearchParams({
      u: '5148aa7d3075518d8b04c80cf',
      id: 'f926f30c99',
      f_id: '00ef40e0f0',
      EMAIL: emailInput.value.trim(),
      c: callbackName
    });

    if (honeypotInput?.value) {
      params.set(honeypotInput.name, honeypotInput.value);
    }

    const requestScript = document.createElement('script');
    const cleanup = () => {
      requestScript.remove();
      delete window[callbackName];
      submitButton.disabled = false;
    };
    const timeout = window.setTimeout(() => {
      mailchimpMessage.textContent = 'Hmm — try again in a moment ♡';
      cleanup();
    }, 10000);

    submitButton.disabled = true;
    mailchimpMessage.textContent = 'Sending...';

    window[callbackName] = (response) => {
      window.clearTimeout(timeout);
      const message = cleanMailchimpMessage(response?.msg);

      if (response?.result === 'success') {
        const needsConfirmation = /confirm|check your email|inbox/i.test(message);
        mailchimpMessage.textContent = needsConfirmation ? 'Almost done — check your email to confirm ♡' : 'Thanks — you’re subscribed ♡';
        mailchimpLiteForm.reset();
      } else {
        mailchimpMessage.textContent = message || 'Something went sideways — try again?';
      }

      cleanup();
    };

    requestScript.addEventListener('error', () => {
      window.clearTimeout(timeout);
      mailchimpMessage.textContent = 'Hmm — try again in a moment ♡';
      cleanup();
    }, { once: true });

    requestScript.src = `https://gmail.us12.list-manage.com/subscribe/post-json?${params.toString()}`;
    document.body.append(requestScript);
  });
}

const radioEmbed = document.querySelector('[data-radio-embed]');
const radioFallback = document.querySelector('[data-radio-fallback]');

if (radioEmbed) {
  const host = window.location.hostname;

  if (host) {
    const radioParams = new URLSearchParams({
      channel: 'miamicommunityradio247',
      parent: host,
      autoplay: 'false',
      muted: 'false'
    });

    radioEmbed.src = `https://player.twitch.tv/?${radioParams.toString()}`;
    if (radioFallback) radioFallback.hidden = true;
  } else {
    radioEmbed.hidden = true;
    if (radioFallback) radioFallback.hidden = false;
  }
}

document.querySelector('#year').textContent = new Date().getFullYear();

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
});

const ambientPointerMedia = window.matchMedia('(pointer: fine) and (min-width: 901px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const cursorAmbient = document.querySelector('.cursor-ambient');

if (ambientPointerMedia.matches && !reducedMotion.matches) {
  let pointerX = -500;
  let pointerY = -500;
  let glowX = -500;
  let glowY = -500;

  const drawAmbientLight = () => {
    glowX += (pointerX - glowX) * 0.085;
    glowY += (pointerY - glowY) * 0.085;
    cursorAmbient.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
    window.requestAnimationFrame(drawAmbientLight);
  };

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursorAmbient.classList.add('cursor-visible');

    const target = event.target instanceof Element ? event.target : null;
    const isLightSection = target?.closest('.about-section, .pitch-panel, .creative-bridge, .contact-section');
    cursorAmbient.classList.toggle('on-light', Boolean(isLightSection));
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', () => {
    cursorAmbient.classList.remove('cursor-visible');
  });

  drawAmbientLight();
}
