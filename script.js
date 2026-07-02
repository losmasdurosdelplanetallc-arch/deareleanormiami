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

const mailingForm = document.querySelector('#mailing-form');
const formMessage = document.querySelector('#form-message');

mailingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = new FormData(mailingForm).get('email');
  formMessage.textContent = `You’re on the list, ${email}. Welcome in ♡`;
  mailingForm.reset();
});

const pitchForm = document.querySelector('#pitch-form');
const pitchFormMessage = document.querySelector('#pitch-form-message');

pitchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(pitchForm);
  const value = (name) => String(data.get(name) || '').trim() || 'Not provided';
  const subject = `Event pitch: ${value('eventTitle')}`;
  const body = [
    'Hi Dear Eleanor team,',
    '',
    'I’d love to pitch an event:',
    '',
    `EVENT NAME: ${value('eventTitle')}`,
    `EVENT TYPE: ${value('eventType')}`,
    `SHORT PITCH:\n${value('description')}`,
    '',
    `PREFERRED DATE(S) + TIME: ${value('dates')}`,
    `EXPECTED ATTENDANCE: ${value('attendance')}`,
    `TICKET PRICE / BUDGET: ${value('price')}`,
    `ESTIMATED DURATION: ${value('duration')}`,
    `SETUP / SOUND / ACCESSIBILITY NEEDS:\n${value('needs')}`,
    '',
    'CONTACT',
    `Name: ${value('name')}`,
    `Email: ${value('email')}`,
    `Phone: ${value('phone')}`,
    `Instagram / website: ${value('social')}`,
    '',
    'Thank you!',
  ].join('\n');

  pitchFormMessage.textContent = 'Your pitch is ready—finish sending it in your email app. ♡';
  window.location.href = `mailto:DearEleanorMiami@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.querySelector('#year').textContent = new Date().getFullYear();

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
});

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
