(() => {
  const section = document.querySelector('.service-journey');
  if (!section) return;
  const viewport = section.querySelector('.service-viewport');
  const rail = section.querySelector('.service-rail');
  const cards = [...rail.querySelectorAll('.service-panel')];
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  let current = -1, cardStep = 1, travel = 1, distance = 1, startY = 0;
  let pending = false, needsLayout = true, previousX = -1;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function measure() {
    const top = innerWidth <= 900 ? 80 : 96;
    const width = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(rail).gap) || 0;
    cardStep = width + gap;
    travel = cardStep * (cards.length - 1);
    // Cover the whole rail with substantially less vertical scrolling.
    distance = Math.max(1, travel * .65);
    section.classList.add('is-pinned');
    section.style.setProperty('--service-top', `${top}px`);
    section.style.setProperty('--service-height', `${Math.max(220, innerHeight - top - 16)}px`);
    section.style.setProperty('--journey-distance', `${distance}px`);
    rail.style.setProperty('--service-tail', `${Math.max(0, viewport.clientWidth - width - gap)}px`);
    startY = section.getBoundingClientRect().top + scrollY - top;
    viewport.scrollLeft = 0;
    needsLayout = false;
  }
  function paint() {
    pending = false;
    if (needsLayout) measure();
    const fraction = clamp((scrollY - startY) / distance, 0, 1);
    const x = Math.round(fraction * travel * 100) / 100;
    if (x !== previousX) {
      rail.style.transform = `translate3d(${-x}px,0,0)`;
      previousX = x;
    }
    const index = Math.round(fraction * (cards.length - 1));
    if (index !== current) {
      if (current >= 0) cards[current].classList.remove('is-current');
      cards[index].classList.add('is-current');
      current = index;
    }
  }
  function schedule(layout = false) {
    needsLayout ||= layout;
    if (!pending) { pending = true; requestAnimationFrame(paint); }
  }
  function go(index) {
    if (needsLayout) measure();
    const target = clamp(index, 0, cards.length - 1);
    window.scrollTo({top: startY + target / (cards.length - 1) * distance, behavior: reduced.matches ? 'instant' : 'smooth'});
  }
  // Native wheel/touch scrolling stays fully responsive: no preventDefault,
  // gesture locks, timeouts or programmatic scrolling in the scroll handler.
  window.addEventListener('scroll', () => schedule(), { passive: true });
  window.addEventListener('resize', () => schedule(true), { passive: true });
  window.addEventListener('load', () => schedule(true), { once: true });
  viewport.addEventListener('keydown', event => {
    const targets = {ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: cards.length - 1};
    if (!(event.key in targets)) return;
    event.preventDefault();
    go(targets[event.key]);
  });
  rail.addEventListener('focusin', event => {
    const index = cards.indexOf(event.target.closest('.service-panel'));
    viewport.scrollLeft = 0;
    if (index >= 0 && index !== current) go(index);
  });
  const observer = new ResizeObserver(() => schedule(true));
  observer.observe(viewport);
  observer.observe(document.body);
  reduced.addEventListener('change', () => schedule());
  if (document.fonts) document.fonts.ready.then(() => schedule(true));
  schedule(true);
})();
