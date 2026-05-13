// ===== Ritmas Pramogų Klubas — UI =====

(function () {
  // Nav scroll state
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (window.scrollY > 30) nav?.classList.add('scrolled');
    else nav?.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  toggle?.addEventListener('click', () => menu?.classList.toggle('open'));
  document.querySelectorAll('.nav-menu a').forEach(a => {
    a.addEventListener('click', () => menu?.classList.remove('open'));
  });

  // Fade-in observer
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

  // Contact form (mailto fallback - no backend)
  const form = document.querySelector('#contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent('Užklausa iš ritmas.lt: ' + (data.get('event') || 'renginio užklausa'));
    const body = encodeURIComponent(
      `Vardas: ${data.get('name') || ''}\n` +
      `El. paštas: ${data.get('email') || ''}\n` +
      `Telefonas: ${data.get('phone') || ''}\n` +
      `Renginio tipas: ${data.get('event') || ''}\n` +
      `Žmonių skaičius: ${data.get('people') || ''}\n` +
      `Data: ${data.get('date') || ''}\n` +
      `Erdvė: ${data.get('venue') || ''}\n\n` +
      `Žinutė:\n${data.get('message') || ''}`
    );
    window.location.href = `mailto:ritmo@ritmo.lt?subject=${subject}&body=${body}`;
  });

  // Current year in footer
  const yr = document.querySelector('#yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
