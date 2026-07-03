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
  const mailtoUrl = `mailto:DearEleanorMiami@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.assign(mailtoUrl);
});
