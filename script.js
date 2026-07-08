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
 * Miami Community Radio is the preferred background sound. It uses the
 * Twitch player from mcr.watch when available, with “Eleanor After Hours”
 * kept as a local fallback for file previews or blocked embeds.
 */
const ambientAudio = document.querySelector('#ambient-audio');
const soundToggle = document.querySelector('.sound-toggle');
const soundLabel = soundToggle.querySelector('.sound-copy b');
const soundSubLabel = soundToggle.querySelector('.sound-copy small');
const soundStatus = document.querySelector('.sound-status');
const radioPlayerMount = document.querySelector('#mcr-player');
const radioChannel = soundToggle.dataset.radioChannel || 'miamicommunityradio247';
const radioUrl = soundToggle.dataset.radioUrl || 'https://mcr.watch/';
let visitorPausedMusic = false;
let musicIsPlaying = false;
let activeSoundSource = 'radio';
let twitchPlayer = null;
let twitchPlayerPromise = null;
let twitchEventsBound = false;

ambientAudio.volume = 0.58;

function updateSoundControl(isPlaying, source = activeSoundSource) {
  musicIsPlaying = isPlaying;
  activeSoundSource = source;
  soundToggle.classList.toggle('playing', isPlaying);
  soundToggle.setAttribute('aria-pressed', String(isPlaying));
  soundToggle.setAttribute('aria-label', isPlaying ? 'Turn site sound off' : 'Turn Miami Community Radio on');
  soundLabel.textContent = isPlaying ? 'Radio off' : 'Tap for radio';
  soundSubLabel.textContent = source === 'fallback' ? 'Eleanor fallback' : 'Miami Community Radio';
  soundStatus.textContent = isPlaying
    ? (source === 'fallback' ? 'Fallback music is playing.' : 'Miami Community Radio is playing.')
    : 'Site sound is paused.';
}

function canUseTwitchPlayer() {
  return radioPlayerMount && window.location.protocol !== 'file:' && Boolean(window.location.hostname);
}

function loadTwitchPlayerApi() {
  if (window.Twitch?.Player) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-twitch-player-api]');
    if (existingScript) {
      existingScript.addEventListener('load', resolve, { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://player.twitch.tv/js/embed/v1.js';
    script.async = true;
    script.dataset.twitchPlayerApi = 'true';
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.append(script);
  });
}

function bindTwitchEvents(player) {
  if (twitchEventsBound || !window.Twitch?.Player) return;
  twitchEventsBound = true;

  if (window.Twitch.Player.PLAY) {
    player.addEventListener(window.Twitch.Player.PLAY, () => {
      ambientAudio.pause();
      updateSoundControl(true, 'radio');
      disarmMusicUnlock();
    });
  }

  if (window.Twitch.Player.PAUSE) {
    player.addEventListener(window.Twitch.Player.PAUSE, () => {
      if (activeSoundSource === 'radio') updateSoundControl(false, 'radio');
      if (!visitorPausedMusic) armMusicUnlock();
    });
  }

  if (window.Twitch.Player.OFFLINE) {
    player.addEventListener(window.Twitch.Player.OFFLINE, () => {
      if (activeSoundSource === 'radio') updateSoundControl(false, 'radio');
      soundLabel.textContent = 'Open radio';
      soundSubLabel.textContent = 'MCR live ↗';
      soundStatus.textContent = 'Miami Community Radio is offline or unavailable here. Open the live stream directly.';
      if (!visitorPausedMusic) startFallbackMusic();
    });
  }
}

async function getTwitchPlayer() {
  if (!canUseTwitchPlayer()) throw new Error('Twitch player needs a hosted domain.');
  if (twitchPlayer) return twitchPlayer;
  if (twitchPlayerPromise) return twitchPlayerPromise;

  twitchPlayerPromise = loadTwitchPlayerApi().then(() => new Promise((resolve, reject) => {
    try {
      const player = new window.Twitch.Player(radioPlayerMount.id, {
        channel: radioChannel,
        parent: [window.location.hostname],
        width: 320,
        height: 180,
        autoplay: false,
        muted: false,
        controls: false
      });

      const finishReady = () => {
        twitchPlayer = player;
        bindTwitchEvents(player);
        try {
          player.setVolume(0.62);
          player.setMuted(false);
        } catch (error) {
          // Twitch may ignore commands until the embed is fully ready.
        }
        resolve(player);
      };

      if (window.Twitch?.Player?.READY) {
        player.addEventListener(window.Twitch.Player.READY, finishReady);
        window.setTimeout(finishReady, 2200);
      } else {
        window.setTimeout(finishReady, 700);
      }
    } catch (error) {
      reject(error);
    }
  }));

  return twitchPlayerPromise;
}

async function preloadOrAutoplaySound() {
  if (!canUseTwitchPlayer()) {
    startMusic();
    return;
  }

  try {
    const player = await getTwitchPlayer();
    player.setMuted(false);
    player.setVolume(0.62);
    player.play();
    soundStatus.textContent = 'Miami Community Radio is ready. Tap for radio if it does not begin automatically.';
  } catch (error) {
    startFallbackMusic();
  }
}

async function startFallbackMusic() {
  try {
    await ambientAudio.play();
    if (!ambientAudio.paused) {
      updateSoundControl(true, 'fallback');
      disarmMusicUnlock();
      return true;
    }
  } catch (error) {
    // Expected when autoplay is blocked before a visitor gesture.
  }

  return false;
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
  soundStatus.textContent = 'Opening Miami Community Radio...';

  try {
    const player = await getTwitchPlayer();
    ambientAudio.pause();
    player.setMuted(false);
    player.setVolume(0.62);
    player.play();
    updateSoundControl(true, 'radio');
    disarmMusicUnlock();
    return true;
  } catch (error) {
    const fallbackStarted = await startFallbackMusic();
    if (fallbackStarted) {
      disarmMusicUnlock();
      return true;
    }
  }

  updateSoundControl(false);
  soundLabel.textContent = 'Tap for radio';
  soundSubLabel.textContent = 'MCR live ↗';
  soundStatus.textContent = 'Radio is ready. Tap or click to begin, or open the live stream.';
  return false;
}

function unlockMusic(event) {
  if (musicIsPlaying || visitorPausedMusic || soundToggle.contains(event.target)) return;
  startMusic();
}

soundToggle.addEventListener('click', async () => {
  if (musicIsPlaying) {
    visitorPausedMusic = true;
    ambientAudio.pause();
    try {
      twitchPlayer?.pause();
    } catch (error) {
      // Ignore player pause failures from the third-party embed.
    }
    disarmMusicUnlock();
    updateSoundControl(false);
    return;
  }

  visitorPausedMusic = false;
  const started = await startMusic();
  if (!started) armMusicUnlock();
});

ambientAudio.addEventListener('play', () => updateSoundControl(true, 'fallback'));
ambientAudio.addEventListener('pause', () => {
  if (activeSoundSource === 'fallback') updateSoundControl(false, 'fallback');
  if (!visitorPausedMusic) armMusicUnlock();
});
ambientAudio.addEventListener('error', () => {
  updateSoundControl(false);
  soundLabel.textContent = 'Open radio';
  soundSubLabel.textContent = 'MCR live ↗';
  soundStatus.textContent = 'The fallback music file could not be loaded. Open the live stream directly.';
});

armMusicUnlock();
window.addEventListener('load', preloadOrAutoplaySound, { once: true });
