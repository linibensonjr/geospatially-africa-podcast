(function () {
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.copy-link-btn');
    if (!btn) return;
    var url = btn.getAttribute('data-copy-url') || window.location.href;

    var done = function () {
      var icon = btn.querySelector('i');
      if (!icon) return;
      var originalClass = icon.className;
      icon.className = 'bi bi-check-lg';
      btn.classList.add('copied');
      setTimeout(function () {
        icon.className = originalClass;
        btn.classList.remove('copied');
      }, 1600);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done);
    } else {
      var temp = document.createElement('input');
      document.body.appendChild(temp);
      temp.value = url;
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      done();
    }
  });
})();
