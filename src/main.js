(() => {
  const config = window.LANDING_CONFIG || {};
  document.querySelectorAll('[data-cta="web"]').forEach((link) => {
    if (config.appUrl) link.href = config.appUrl;
    link.rel = 'noopener noreferrer';
  });
  document.querySelectorAll('[data-cta="play"]').forEach((link) => {
    if (config.playUrl) {
      link.href = config.playUrl;
      link.rel = 'noopener noreferrer';
      link.removeAttribute('aria-disabled');
    } else {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
      link.removeAttribute('aria-label');
    }
  });
  const note = document.querySelector('[data-play-note]');
  if (note) note.hidden = Boolean(config.playUrl);
})();
