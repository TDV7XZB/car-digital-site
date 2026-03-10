(function () {
  var pathname = window.location.pathname;
  var search = window.location.search;
  var hash = window.location.hash;
  var missingPathEl = document.getElementById("missing-path");

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

  function renderMissingPath() {
    var params = new URLSearchParams(search);
    var from = params.get("from") || (routePath + search + hash) || "the requested URL";

    if (missingPathEl) {
      missingPathEl.textContent = from;
    }
  }

  // If the current document is already a 404 UI (root /404.html or /404/), just render.
  if (routePath === "/404/" || routePath === "/404/index.html" || routePath === "/404.html" || missingPathEl) {
    renderMissingPath();
    return;
  }

  // Normalize unknown URLs to /404/ while preserving the originally requested URL.
  if (routePath !== "/404/" && routePath !== "/404/index.html" && routePath !== "/404.html") {
    var attemptedUrl = routePath + search + hash;
    var target = (basePath || "") + "/404/?from=" + encodeURIComponent(attemptedUrl);
    window.location.replace(target);
    return;
  }
})();
