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

document.querySelectorAll('[data-polaroid-slider]').forEach((slider) => {
  const slides = [...slider.querySelectorAll('.polaroid-slide')];
  const dots = [...slider.querySelectorAll('.polaroid-dots span')];
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

const mailingForm = document.querySelector('#mailing-form');
const formMessage = document.querySelector('#form-message');

if (mailingForm && formMessage) {
  const cleanMailchimpMessage = (message) => {
    const template = document.createElement('template');
    template.innerHTML = String(message || '');
    return template.content.textContent.replace(/\s+/g, ' ').trim();
  };

  let activeMailchimpScript = null;

  mailingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!mailingForm.reportValidity()) return;

    const endpoint = mailingForm.dataset.mailchimpJson;
    const submitButton = mailingForm.querySelector('button[type="submit"]');
    const callbackName = `mailchimpCallback_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const formData = new FormData(mailingForm);
    const params = new URLSearchParams();

    formData.forEach((value, key) => params.append(key, value));
    params.append('c', callbackName);

    const cleanup = () => {
      submitButton.disabled = false;
      activeMailchimpScript?.remove();
      activeMailchimpScript = null;
      delete window[callbackName];
    };

    submitButton.disabled = true;
    formMessage.textContent = 'Sending you into the list...';

    window[callbackName] = (response) => {
      const responseMessage = cleanMailchimpMessage(response?.msg);

      if (response?.result === 'success') {
        formMessage.textContent = responseMessage || 'You’re subscribed. Welcome in ♡';
        mailingForm.reset();
      } else if (/already subscribed/i.test(responseMessage)) {
        formMessage.textContent = 'Looks like you’re already on the list. ♡';
      } else {
        formMessage.textContent = responseMessage || 'Something glitched. Try again in a moment.';
      }

      cleanup();
    };

    activeMailchimpScript?.remove();
    activeMailchimpScript = document.createElement('script');
    activeMailchimpScript.src = `${endpoint}&${params.toString()}`;
    activeMailchimpScript.onerror = () => {
      formMessage.textContent = 'Mailchimp did not respond. Try again in a moment.';
      cleanup();
    };
    document.body.appendChild(activeMailchimpScript);
  });
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

/*
 * “Eleanor After Hours” is an original, locally hosted instrumental.
 * The browser attempts autoplay; when policy blocks it, the first visitor
 * tap/click/key press starts the same seamless loop.
 */
const ambientAudio = document.querySelector('#ambient-audio');
const soundToggle = document.querySelector('.sound-toggle');
const soundLabel = soundToggle.querySelector('.sound-copy b');
const soundStatus = document.querySelector('.sound-status');
let visitorPausedMusic = false;
let musicIsPlaying = false;

ambientAudio.volume = 0.58;

function updateSoundControl(isPlaying) {
  musicIsPlaying = isPlaying;
  soundToggle.classList.toggle('playing', isPlaying);
  soundToggle.setAttribute('aria-pressed', String(isPlaying));
  soundToggle.setAttribute('aria-label', isPlaying ? 'Turn ambient music off' : 'Turn ambient music on');
  soundLabel.textContent = isPlaying ? 'Sound off' : 'Tap for music';
  soundStatus.textContent = isPlaying ? 'Ambient music is playing.' : 'Ambient music is paused.';
}

function armMusicUnlock() {
  document.addEventListener('pointerdown', unlockMusic, true);
  document.addEventListener('touchstart', unlockMusic, { capture: true, passive: true });
  document.addEventListener('keydown', unlockMusic, true);
}

function disarmMusicUnlock() {
  document.removeEventListener('pointerdown', unlockMusic, true);
  document.removeEventListener('touchstart', unlockMusic, true);
  document.removeEventListener('keydown', unlockMusic, true);
}

async function startMusic() {
  try {
    await ambientAudio.play();
    if (!ambientAudio.paused) {
      updateSoundControl(true);
      disarmMusicUnlock();
      return true;
    }
  } catch (error) {
    // Expected when the browser blocks unmuted autoplay before a gesture.
  }

  updateSoundControl(false);
  soundLabel.textContent = 'Tap for music';
  soundStatus.textContent = 'Music is ready. Tap or click to begin.';
  return false;
}

function unlockMusic(event) {
  if (musicIsPlaying || visitorPausedMusic || soundToggle.contains(event.target)) return;
  startMusic();
}

soundToggle.addEventListener('click', async () => {
  if (!ambientAudio.paused) {
    visitorPausedMusic = true;
    ambientAudio.pause();
    disarmMusicUnlock();
    updateSoundControl(false);
    soundLabel.textContent = 'Sound on';
    return;
  }

  visitorPausedMusic = false;
  const started = await startMusic();
  if (!started) armMusicUnlock();
});

ambientAudio.addEventListener('play', () => updateSoundControl(true));
ambientAudio.addEventListener('pause', () => {
  updateSoundControl(false);
  if (!visitorPausedMusic) armMusicUnlock();
});
ambientAudio.addEventListener('error', () => {
  updateSoundControl(false);
  soundLabel.textContent = 'Music unavailable';
  soundStatus.textContent = 'The ambient music file could not be loaded.';
});

armMusicUnlock();
window.addEventListener('load', startMusic, { once: true });
