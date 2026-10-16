(() => {
  const config = window.LANDING_CONFIG || {};
  document.querySelectorAll('[data-cta="web"]').forEach((link) => {
    if (config.appUrl) link.href = config.appUrl;
  });
  document.querySelectorAll('[data-cta="play"]').forEach((link) => {
    if (config.playUrl) {
      link.href = config.playUrl;
      link.textContent = 'Tải trên Google Play';
    } else {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
      link.textContent = 'Android: sắp có trên Google Play';
    }
  });
})();
