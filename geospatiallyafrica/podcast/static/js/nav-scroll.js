(function () {
  var nav = document.querySelector('.nav-section');
  if (!nav) return;

  function update() {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
})();
