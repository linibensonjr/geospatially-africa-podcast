(function () {
  function loadEmbed(facade) {
    var embedUrl = facade.getAttribute('data-embed-url');
    if (!embedUrl) return;
    var title = facade.getAttribute('data-title') || 'YouTube video';

    var wrap = document.createElement('div');
    wrap.className = 'yt-embed-iframe-wrap';

    var iframe = document.createElement('iframe');
    var sep = embedUrl.indexOf('?') > -1 ? '&' : '?';
    iframe.src = embedUrl + sep + 'autoplay=1';
    iframe.title = title;
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    iframe.frameBorder = '0';

    wrap.appendChild(iframe);
    facade.replaceWith(wrap);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.yt-embed-facade').forEach(function (facade) {
      facade.addEventListener('click', function () { loadEmbed(facade); });
      facade.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          loadEmbed(facade);
        }
      });
    });
  });
})();
