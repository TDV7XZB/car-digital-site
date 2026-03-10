(function () {
  var pathname = window.location.pathname || "/";
  var search = window.location.search || "";
  var hash = window.location.hash || "";

  function detectBasePath() {
    var host = window.location.hostname || "";
    var path = window.location.pathname || "/";

    if (host.indexOf("github.io") === -1) {
      return "";
    }

    var segments = path.split("/").filter(Boolean);
    return segments.length ? "/" + segments[0] : "";
  }

  var basePath = detectBasePath();

  function toRoutePath(path) {
    if (basePath && path.indexOf(basePath + "/") === 0) {
      return path.slice(basePath.length) || "/";
    }

    if (basePath && path === basePath) {
      return "/";
    }

    return path;
  }

  var routePath = toRoutePath(pathname);
  var normalizedPath = routePath.length > 1 ? routePath.replace(/\/$/, "") : routePath;

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

  var attemptedUrl = routePath + search + hash;
  var target = (basePath || "") + "/404/?from=" + encodeURIComponent(attemptedUrl);

  if (normalizedPath !== "/404" && normalizedPath !== "/404.html") {
    window.location.replace(target);
  }
})();
