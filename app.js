(() => {
  'use strict';
  const root = document.documentElement;
  const toggle = document.querySelector('[data-language-toggle]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('#main-nav');
  function setLanguage(language, remember = false) {
    const zh = language === 'zh';
    root.lang = zh ? 'zh-CN' : 'en';
    document.title = document.body.dataset[zh ? 'titleZh' : 'titleEn'];
    const description = document.querySelector('meta[name="description"]');
    description.content = description.dataset[zh ? 'zh' : 'en'];
    toggle.textContent = zh ? 'EN' : '中文';
    toggle.setAttribute('aria-label', zh ? 'Switch to English' : '切换为中文');
    toggle.lang = zh ? 'en' : 'zh-CN';
    document.querySelectorAll('[data-alt-en]').forEach(img => {
      img.alt = img.dataset[zh ? 'altZh' : 'altEn'];
    });
    document.querySelectorAll('[data-label-en]').forEach(element => {
      element.setAttribute('aria-label', element.dataset[zh ? 'labelZh' : 'labelEn']);
    });
    document.querySelectorAll('a[href]').forEach(link => {
      if (!link.dataset.originalHref) link.dataset.originalHref = link.getAttribute('href');
      const url = new URL(link.dataset.originalHref, location.href);
      if (url.origin === location.origin) {
        url.searchParams.set('lang', zh ? 'zh' : 'en');
        link.href = url.href;
      }
    });
    menuButton.setAttribute('aria-label', zh ? '打开或关闭导航' : 'Open or close navigation');
    if (remember) {
      try { localStorage.setItem('portfolio-language', language); } catch (_) { /* Optional preference. */ }
      try {
        const url = new URL(location.href);
        url.searchParams.set('lang', language);
        history.replaceState(null, '', url);
      } catch (_) { /* File previews still work. */ }
    }
  }
  let language = new URLSearchParams(location.search).get('lang');
  if (language !== 'zh' && language !== 'en') {
    try { language = localStorage.getItem('portfolio-language'); } catch (_) { language = 'en'; }
  }
  setLanguage(language === 'zh' ? 'zh' : 'en');
  toggle.addEventListener('click', () => setLanguage(root.lang === 'en' ? 'zh' : 'en', true));
  function closeMenu() {
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
      menuButton.focus();
    }
  });
})();
