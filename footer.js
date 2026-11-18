(() => {
  document.querySelectorAll('.studio-footer-subscribe').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const email = new FormData(form).get('email');
      const status = form.parentElement.querySelector('.studio-footer-subscribe-status');
      status.textContent = 'Your email app will open. Send the request there to subscribe.';
      window.location.href = `mailto:globaxify.official@gmail.com?subject=${encodeURIComponent('Newsletter subscription request')}&body=${encodeURIComponent(`Please add ${email} to the Globaxify newsletter.`)}`;
    });
  });
})();
