(function () {
  var STORAGE_KEY = "cd_cookie_consent";
  var COOKIE_NAME = "cd_cookie_consent";
  var CONSENT_ACCEPT = "accept";
  var CONSENT_DENY = "deny";
  var COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

  function getSavedConsent() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      if (value === CONSENT_ACCEPT || value === CONSENT_DENY) {
        return value;
      }
    } catch (e) {
      // Continue with cookie fallback only.
    }

    var match = document.cookie.match(new RegExp("(?:^|; )" + COOKIE_NAME + "=([^;]*)"));
    if (!match) {
      return null;
    }

    var cookieValue = decodeURIComponent(match[1]);
    return cookieValue === CONSENT_ACCEPT || cookieValue === CONSENT_DENY ? cookieValue : null;
  }

  function saveConsent(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      // localStorage may be unavailable, cookie is still written.
    }

    document.cookie = COOKIE_NAME + "=" + encodeURIComponent(value) + "; path=/; max-age=" + COOKIE_MAX_AGE + "; SameSite=Lax";
  }

  function dispatchConsentEvent(value) {
    document.dispatchEvent(
      new CustomEvent("cookie-consent:updated", {
        detail: {
          consent: value,
          googleCookiesAllowed: value === CONSENT_ACCEPT
        }
      })
    );
  }

  function enableDeferredGoogleScripts() {
    var deferredScripts = document.querySelectorAll('script[type="text/plain"][data-cookie-category="google"]');
    deferredScripts.forEach(function (script) {
      var replacement = document.createElement("script");
      if (script.src) {
        replacement.src = script.src;
      }
      if (script.textContent) {
        replacement.textContent = script.textContent;
      }

      Array.prototype.forEach.call(script.attributes, function (attr) {
        if (attr.name !== "type" && attr.name !== "data-cookie-category") {
          replacement.setAttribute(attr.name, attr.value);
        }
      });

      script.parentNode.insertBefore(replacement, script);
      script.parentNode.removeChild(script);
    });
  }

  function clearLegacyComplianzCookies() {
    var names = [
      "cmplz_banner-status",
      "cmplz_consented_services",
      "cmplz_policy_id",
      "cmplz_marketing",
      "cmplz_statistics",
      "cmplz_preferences",
      "cmplz_functional",
      "cmplz_cookie_data"
    ];

    names.forEach(function (name) {
      document.cookie = name + "=; path=/; max-age=0; SameSite=Lax";
    });
  }

  function removeLegacyBannerMarkup() {
    var oldBanner = document.getElementById("cmplz-cookiebanner-container");
    if (oldBanner) {
      oldBanner.remove();
    }

    var oldManage = document.getElementById("cmplz-manage-consent");
    if (oldManage) {
      oldManage.remove();
    }
  }

  function buildBanner() {
    if (document.getElementById("cd-cookie-banner")) {
      return;
    }

    var banner = document.createElement("aside");
    banner.id = "cd-cookie-banner";
    banner.className = "cd-cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Cookie notice");

    banner.innerHTML =
      '<h2 class="cd-cookie-title">Cookie Notice</h2>' +
      '<p class="cd-cookie-message">We use basic Google cookies to keep this site working and to understand traffic. You can accept or deny these cookies.</p>' +
      '<div class="cd-cookie-actions">' +
      '  <button type="button" class="cd-cookie-btn cd-cookie-accept" data-consent="accept">Accept</button>' +
      '  <button type="button" class="cd-cookie-btn cd-cookie-deny" data-consent="deny">Deny</button>' +
      '</div>' +
      '<p class="cd-cookie-links">' +
      '  <a href="cookie-policy/">Cookie Policy</a>' +
      '  <span aria-hidden="true"> | </span>' +
      '  <a href="privacy-policy/">Privacy Policy</a>' +
      '</p>';

    banner.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-consent]");
      if (!button) {
        return;
      }

      var choice = button.getAttribute("data-consent");
      saveConsent(choice);
      clearLegacyComplianzCookies();

      if (choice === CONSENT_ACCEPT) {
        enableDeferredGoogleScripts();
      }

      dispatchConsentEvent(choice);
      banner.remove();
    });

    document.body.appendChild(banner);
  }

  function applySavedConsent(consent) {
    if (!consent) {
      buildBanner();
      return;
    }

    if (consent === CONSENT_ACCEPT) {
      enableDeferredGoogleScripts();
    }

    dispatchConsentEvent(consent);
  }

  function init() {
    removeLegacyBannerMarkup();
    clearLegacyComplianzCookies();

    var consent = getSavedConsent();
    applySavedConsent(consent);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
