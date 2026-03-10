(function () {
  var pathname = window.location.pathname || "/";
  var normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;

  // Allow normal static asset and WordPress export paths.
  if (/\.[a-z0-9]+$/i.test(normalizedPath) || normalizedPath.indexOf("/wp-") === 0) {
    return;
  }

  var validRoutes = {
    "/": true,
    "/about": true,
    "/contact": true,
    "/privacy-policy": true,
    "/cookie-policy": true,
    "/404": true,
    "/404.html": true,
    "/robots.txt": true,
    "/sitemap.xml": true,
    "/main-sitemap.xsl": true
  };

  if (validRoutes[normalizedPath]) {
    return;
  }

  var attemptedUrl = pathname + window.location.search + window.location.hash;
  var target = "/404/?from=" + encodeURIComponent(attemptedUrl);

  if (window.location.pathname !== "/404/" && window.location.pathname !== "/404/index.html") {
    window.location.replace(target);
  }
})();
