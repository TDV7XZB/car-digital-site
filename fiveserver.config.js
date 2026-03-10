module.exports = {
  // Keep Five Server fallback on the project's custom 404 page.
  file: '404.html',

  // Force unknown pretty URLs to your custom 404 route in local development.
  middleware: [
    function custom404Redirect(req, res, next) {
      var url = req.url || '/';
      var pathname = url.split('?')[0] || '/';
      var cleanPath = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;

      // Skip assets, WordPress-export paths, and known valid pages.
      if (/\.[a-z0-9]+$/i.test(cleanPath) || cleanPath.indexOf('/wp-') === 0) {
        return next();
      }

      var valid = {
        '/': true,
        '/about': true,
        '/contact': true,
        '/privacy-policy': true,
        '/cookie-policy': true,
        '/404': true,
        '/404.html': true,
        '/robots.txt': true,
        '/sitemap.xml': true,
      };

      if (valid[cleanPath]) {
        return next();
      }

      res.statusCode = 302;
      res.setHeader('Location', '/404/?from=' + encodeURIComponent(url));
      res.end();
    }
  ]
};
