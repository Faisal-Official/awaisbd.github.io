const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const allNavLinks = [...document.querySelectorAll('.site-nav a')];
const hashNavLinks = allNavLinks.filter((link) => link.getAttribute('href')?.startsWith('#'));
const revealItems = document.querySelectorAll('.reveal');
const glow = document.querySelector('.cursor-glow');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation?.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

allNavLinks.forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    navigation?.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const sections = [...document.querySelectorAll('main section[id]')];
if (hashNavLinks.length && 'IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      hashNavLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { threshold: 0.35 });
  sections.forEach((section) => sectionObserver.observe(section));
}

if (window.matchMedia('(pointer: fine)').matches && glow) {
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!expanded));
    trigger.closest('.accordion-item')?.classList.toggle('open', !expanded);
  });
});

const copyButton = document.querySelector('.copy-email');
copyButton?.addEventListener('click', async () => {
  const email = copyButton.dataset.email || '';
  const status = document.querySelector('.copy-status');
  try {
    await navigator.clipboard.writeText(email);
    if (status) status.textContent = 'Email address copied.';
  } catch {
    if (status) status.textContent = `Copy this email: ${email}`;
  }
});

const contactForm = document.querySelector('#contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = contactForm.querySelector('.form-status');
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    if (status) status.textContent = 'Please complete the required fields.';
    return;
  }
  const data = new FormData(contactForm);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const company = String(data.get('company') || '').trim();
  const market = String(data.get('market') || '').trim();
  const message = String(data.get('message') || '').trim();
  const subject = encodeURIComponent(`B2B outreach enquiry from ${name}${company ? ` — ${company}` : ''}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nCompany: ${company || 'Not provided'}\nTarget market: ${market || 'Not provided'}\n\nProject details:\n${message}`);
  if (status) status.textContent = 'Opening your email application…';
  window.location.href = `mailto:mawais4793@gmail.com?subject=${subject}&body=${body}`;
});

document.querySelectorAll('#year').forEach((year) => {
  year.textContent = new Date().getFullYear();
});
