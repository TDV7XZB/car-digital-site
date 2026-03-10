(function () {
  var pathname = window.location.pathname;
  var search = window.location.search;
  var hash = window.location.hash;
  var missingPathEl = document.getElementById("missing-path");

  function renderMissingPath() {
    var params = new URLSearchParams(search);
    var from = params.get("from") || (pathname + search + hash) || "the requested URL";

    if (missingPathEl) {
      missingPathEl.textContent = from;
    }
  }

  // If the current document is already a 404 UI (root /404.html or /404/), just render.
  if (pathname === "/404/" || pathname === "/404/index.html" || pathname === "/404.html" || missingPathEl) {
    renderMissingPath();
    return;
  }

  // Normalize unknown URLs to /404/ while preserving the originally requested URL.
  if (pathname !== "/404/" && pathname !== "/404/index.html" && pathname !== "/404.html") {
    var attemptedUrl = pathname + search + hash;
    var target = "/404/?from=" + encodeURIComponent(attemptedUrl);
    window.location.replace(target);
    return;
  }
})();
