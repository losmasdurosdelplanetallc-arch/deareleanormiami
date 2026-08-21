const bloomFrameMount = document.querySelector('[data-bloom-frame-mount]');

if (bloomFrameMount) {
  const bloomFrame = document.createElement('iframe');
  bloomFrame.className = 'bloom-form-frame';
  bloomFrame.title = 'Pitch your event form';
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
