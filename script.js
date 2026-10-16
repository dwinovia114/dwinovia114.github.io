(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('is-visible'));
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const searchOpen = document.getElementById('search-open');
  const searchPanel = document.getElementById('search-panel');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('project-search');
  const searchable = [...document.querySelectorAll('[data-search]')];
  const noResults = document.getElementById('no-results');
  if (searchOpen && searchPanel && searchInput) {
    searchOpen.addEventListener('click', () => {
      searchPanel.hidden = !searchPanel.hidden;
      if (!searchPanel.hidden) searchInput.focus();
    });
    searchClose.addEventListener('click', () => { searchPanel.hidden = true; searchInput.value = ''; filterProjects(''); });
    searchInput.addEventListener('input', () => filterProjects(searchInput.value.trim().toLowerCase()));
  }
  function filterProjects(query) {
    let shown = 0;
    searchable.forEach(item => {
      const text = (item.dataset.search || '') + ' ' + item.textContent;
      const match = !query || text.toLowerCase().includes(query);
      item.classList.toggle('search-hidden', !match);
      item.style.display = match ? '' : 'none';
      if (match) shown++;
    });
    if (noResults) noResults.hidden = !query || shown > 0;
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => navObserver.observe(section));
  }
})();