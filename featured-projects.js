(() => {
  const carousel = document.querySelector('.case-carousel');
  if (!carousel) return;
  const cards = [...carousel.querySelectorAll('.case-card')];
  const dots = [...carousel.querySelectorAll('.case-pagination button')];
  const status = carousel.querySelector('.case-status');
  let current = 0;
  function show(index, announce = true) {
    current = (index + cards.length) % cards.length;
    cards.forEach((card, i) => {
      const active = i === current;
      card.classList.toggle('is-active', active);
      card.classList.toggle('is-previous', i === (current + cards.length - 1) % cards.length);
      card.classList.toggle('is-next', i === (current + 1) % cards.length);
      card.inert = !active;
      card.setAttribute('aria-hidden', String(!active));
      dots[i].setAttribute('aria-current', String(active));
    });
    if (announce) status.textContent = `Project ${current + 1} of ${cards.length}: ${cards[current].querySelector('h3').textContent}`;
  }
  show(0, false);
  carousel.classList.add('is-ready');
  carousel.querySelector('.case-arrows').hidden = false;
  carousel.querySelector('.case-pagination').hidden = false;
  carousel.querySelector('.case-prev').addEventListener('click', () => show(current - 1));
  carousel.querySelector('.case-next').addEventListener('click', () => show(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  carousel.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    // Move focus to a persistent control before hiding a focused project link.
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    if (event.target.closest('.case-card')) carousel.querySelector(direction === 1 ? '.case-next' : '.case-prev').focus();
    show(current + direction);
  });
})();
