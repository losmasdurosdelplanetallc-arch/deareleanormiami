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

document.querySelector('#year').textContent = new Date().getFullYear();

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
});

/*
 * "Eleanor After Hours" — a tiny original generative lo-fi soundscape.
 * It is synthesized in the browser, so there is no external audio file,
 * licensing dependency, or interruption while visitors move through the page.
 */
const soundToggle = document.querySelector('.sound-toggle');
const soundLabel = soundToggle.querySelector('.sound-copy b');
const soundStatus = document.querySelector('.sound-status');
const AudioContextClass = window.AudioContext || window.webkitAudioContext;

let audioContext;
let masterGain;
let nextBarTime = 0;
let barIndex = 0;
let schedulerId;
let soundIsPlaying = false;
let brushBuffer;

const bpm = 70;
const beatLength = 60 / bpm;
const barLength = beatLength * 4;
const chordProgression = [
  [50, 54, 57, 61], // Dmaj7
  [47, 50, 54, 57], // Bm7
  [43, 47, 50, 54], // Gmaj7
  [45, 52, 57, 59], // Aadd9
];
const melody = [
  [[.5, 69], [1.5, 66], [2.75, 64]],
  [[.75, 66], [2, 62], [3.25, 61]],
  [[.5, 62], [1.5, 66], [2.75, 69]],
  [[.75, 64], [1.75, 61], [3, 57]],
  [[.25, 69], [1.25, 71], [2.5, 66]],
  [[.5, 66], [1.75, 62], [3, 59]],
  [[.25, 62], [1.5, 64], [2.75, 66]],
  [[.5, 64], [1.5, 61], [3.25, 57]],
];

function midiToFrequency(note) {
  return 440 * (2 ** ((note - 69) / 12));
}

function playTone(note, start, duration, volume, type = 'triangle', cutoff = 1600, pan = 0) {
  const oscillator = audioContext.createOscillator();
  const harmonic = audioContext.createOscillator();
  const harmonicGain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  const envelope = audioContext.createGain();
  const panner = audioContext.createStereoPanner ? audioContext.createStereoPanner() : null;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(midiToFrequency(note), start);
  oscillator.detune.setValueAtTime((Math.random() - .5) * 3, start);
  harmonic.type = 'sine';
  harmonic.frequency.setValueAtTime(midiToFrequency(note) * 2, start);
  harmonic.detune.setValueAtTime(-3, start);
  harmonicGain.gain.value = .105;
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(cutoff, start);
  filter.Q.value = .7;
  envelope.gain.setValueAtTime(.0001, start);
  envelope.gain.exponentialRampToValueAtTime(volume, start + .055);
  envelope.gain.exponentialRampToValueAtTime(.0001, start + duration);

  oscillator.connect(filter);
  harmonic.connect(harmonicGain);
  harmonicGain.connect(filter);
  filter.connect(envelope);
  if (panner) {
    panner.pan.setValueAtTime(pan, start);
    envelope.connect(panner);
    panner.connect(masterGain);
  } else {
    envelope.connect(masterGain);
  }

  oscillator.start(start);
  harmonic.start(start);
  oscillator.stop(start + duration + .08);
  harmonic.stop(start + duration + .08);
}

function playSoftPulse(start) {
  const oscillator = audioContext.createOscillator();
  const envelope = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(72, start);
  oscillator.frequency.exponentialRampToValueAtTime(44, start + .2);
  envelope.gain.setValueAtTime(.026, start);
  envelope.gain.exponentialRampToValueAtTime(.0001, start + .34);
  oscillator.connect(envelope);
  envelope.connect(masterGain);
  oscillator.start(start);
  oscillator.stop(start + .34);
}

function createBrushBuffer() {
  const length = Math.floor(audioContext.sampleRate * .11);
  brushBuffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
  const data = brushBuffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    const fade = 1 - (i / length);
    data[i] = (Math.random() * 2 - 1) * fade * fade;
  }
}

function playBrush(start, volume = .01) {
  const source = audioContext.createBufferSource();
  const highpass = audioContext.createBiquadFilter();
  const envelope = audioContext.createGain();
  source.buffer = brushBuffer;
  highpass.type = 'highpass';
  highpass.frequency.value = 2600;
  envelope.gain.setValueAtTime(volume, start);
  envelope.gain.exponentialRampToValueAtTime(.0001, start + .1);
  source.connect(highpass);
  highpass.connect(envelope);
  envelope.connect(masterGain);
  source.start(start);
}

function createVinylTexture() {
  const seconds = 12;
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * seconds, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  let drift = 0;

  for (let i = 0; i < data.length; i += 1) {
    drift = (drift * .985) + ((Math.random() * 2 - 1) * .015);
    const dust = Math.random() > .99955 ? (Math.random() * 2 - 1) * .4 : 0;
    data[i] = (drift * .09) + dust;
  }

  const source = audioContext.createBufferSource();
  const highpass = audioContext.createBiquadFilter();
  const lowpass = audioContext.createBiquadFilter();
  const textureGain = audioContext.createGain();
  source.buffer = buffer;
  source.loop = true;
  highpass.type = 'highpass';
  highpass.frequency.value = 420;
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 3900;
  textureGain.gain.value = .018;
  source.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(textureGain);
  textureGain.connect(masterGain);
  source.start();
}

function scheduleBar(time, arrangementIndex) {
  const progressionIndex = arrangementIndex % chordProgression.length;
  const chord = chordProgression[progressionIndex];
  const root = chord[0] - 12;

  chord.forEach((note, index) => {
    playTone(note, time + (index * .028), barLength * .94, .021, index % 2 ? 'sine' : 'triangle', 1050, (index - 1.5) * .12);
  });

  playTone(root, time, beatLength * 1.5, .047, 'sine', 460, -.08);
  playTone(root + 7, time + (beatLength * 2), beatLength * 1.4, .036, 'sine', 460, .08);
  playSoftPulse(time);
  playSoftPulse(time + (beatLength * 2));
  playBrush(time + (beatLength * 1.5), .008);
  playBrush(time + (beatLength * 3.5), .01);

  melody[arrangementIndex % melody.length].forEach(([beat, note], noteIndex) => {
    playTone(note, time + (beatLength * beat), beatLength * .78, .018, 'sine', 1550, noteIndex % 2 ? .2 : -.2);
  });

  if (arrangementIndex === 3 || arrangementIndex === 7) {
    playTone(chord[1] + 24, time + (beatLength * 3.3), beatLength * .42, .009, 'sine', 2400, .28);
  }
}

function scheduleMusic() {
  while (nextBarTime < audioContext.currentTime + 1.4) {
    scheduleBar(nextBarTime, barIndex % melody.length);
    nextBarTime += barLength;
    barIndex += 1;
  }
}

function initializeSoundscape() {
  audioContext = new AudioContextClass();
  masterGain = audioContext.createGain();
  const compressor = audioContext.createDynamicsCompressor();
  masterGain.gain.value = .0001;
  compressor.threshold.value = -22;
  compressor.knee.value = 18;
  compressor.ratio.value = 3;
  compressor.attack.value = .04;
  compressor.release.value = .5;
  masterGain.connect(compressor);
  compressor.connect(audioContext.destination);
  createBrushBuffer();
  createVinylTexture();
  nextBarTime = audioContext.currentTime + .08;
  scheduleMusic();
  schedulerId = window.setInterval(scheduleMusic, 700);
}

function updateSoundControl(isPlaying) {
  soundIsPlaying = isPlaying;
  soundToggle.classList.toggle('playing', isPlaying);
  soundToggle.setAttribute('aria-pressed', String(isPlaying));
  soundToggle.setAttribute('aria-label', isPlaying ? 'Turn ambient music off' : 'Turn ambient music on');
  soundLabel.textContent = isPlaying ? 'Sound off' : 'Sound on';
  soundStatus.textContent = isPlaying ? 'Ambient music is playing.' : 'Ambient music is paused.';
}

function fadeSoundIn() {
  const now = audioContext.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, .0001), now);
  masterGain.gain.exponentialRampToValueAtTime(.28, now + 1.25);
  updateSoundControl(true);
}

function fadeSoundOut() {
  const now = audioContext.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, .0001), now);
  masterGain.gain.exponentialRampToValueAtTime(.0001, now + .75);
  updateSoundControl(false);
}

async function attemptToStartSound(fromVisitorGesture = false) {
  if (!audioContext) initializeSoundscape();

  const resumeAttempt = audioContext.state === 'suspended'
    ? audioContext.resume().then(() => true).catch(() => false)
    : Promise.resolve(true);

  // A pointer/key event is an explicit browser-approved audio gesture.
  // Update immediately while the context finishes resuming.
  if (fromVisitorGesture) {
    fadeSoundIn();
    resumeAttempt.then((resumed) => {
      if (!resumed) {
        fadeSoundOut();
        soundLabel.textContent = 'Tap for sound';
      }
    });
    return true;
  }

  // Autoplay promises can remain pending indefinitely when a browser blocks them.
  const resumed = await Promise.race([
    resumeAttempt,
    new Promise((resolve) => window.setTimeout(() => resolve(false), 450)),
  ]);

  if (resumed && audioContext.state === 'running') {
    fadeSoundIn();
    return true;
  }

  soundStatus.textContent = 'Ambient music will begin with your first interaction.';
  soundLabel.textContent = 'Tap for sound';
  return false;
}

async function unlockSoundOnInteraction(event) {
  if (soundIsPlaying || soundToggle.contains(event.target)) return;
  const started = await attemptToStartSound(true);
  if (started) {
    document.removeEventListener('pointerdown', unlockSoundOnInteraction, true);
    document.removeEventListener('keydown', unlockSoundOnInteraction, true);
  }
}

if (!AudioContextClass) {
  soundToggle.disabled = true;
  soundLabel.textContent = 'Sound unavailable';
} else {
  soundToggle.addEventListener('click', async () => {
    if (soundIsPlaying) {
      fadeSoundOut();
    } else {
      await attemptToStartSound(true);
    }
  });

  // Autoplay succeeds where the visitor/browser has granted permission.
  // Otherwise the same soundscape starts on the first interaction anywhere.
  window.addEventListener('load', () => attemptToStartSound(false), { once: true });
  document.addEventListener('pointerdown', unlockSoundOnInteraction, true);
  document.addEventListener('keydown', unlockSoundOnInteraction, true);
}
