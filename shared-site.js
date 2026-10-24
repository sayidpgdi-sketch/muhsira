/* Canonical shared site shell and cross-page helpers. */
(function () {
  "use strict";
  var config = window.MUHSIRA_SITE = {
    name: "Muhsira Pananchery",
    email: "muhsiraayyub@gmail.com",
    whatsapp: "https://wa.me/918075522811",
    homeDesktop: "/",
    homeMobile: "/Mobile_screen_main.html",
    projectDesktop: "/project_overview.html",
    projectMobile: "/project_overview_mobile.html",
    forms: "/Forms_1.html",
    formsAlt: "/forms_mobile.html"
  };
  var mobileQuery = window.matchMedia("(max-width: 767px)");
  document.documentElement.dataset.muhsiraLayout = mobileQuery.matches ? "mobile" : "desktop";

  document.querySelectorAll("header").forEach(function (node) {
    node.dataset.muhsiraSharedRegion = "header";
  });
  document.querySelectorAll("footer").forEach(function (node) {
    node.dataset.muhsiraSharedRegion = "footer";
  });
  document.querySelectorAll('a[href="mailto:muhsiraayyub@gmail.com"]').forEach(function (link) {
    link.setAttribute("aria-label", link.getAttribute("aria-label") || "Email " + config.name);
  });
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (link) {
    if (link.target === "_blank") link.rel = "noopener noreferrer";
  });

  // One canonical mobile navigation header is mounted on every built page.
  // It intentionally leaves each page's content and desktop navigation untouched.
  if (mobileQuery.matches && !document.querySelector("[data-muhsira-canonical-mobile-header]")) {
    var shell = document.createElement("header");
    shell.className = "muhsira-mobile-header";
    shell.setAttribute("data-muhsira-canonical-mobile-header", "");
    shell.innerHTML =
      '<a class="muhsira-mobile-brand" href="' + config.homeMobile + '" aria-label="Muhsira home">Muhsira Pananchery</a>' +
      '<button class="muhsira-menu-toggle" type="button" aria-expanded="false" aria-controls="muhsira-mobile-menu" aria-label="Open main menu">' +
      '<span aria-hidden="true">☰</span></button>' +
      '<nav id="muhsira-mobile-menu" class="muhsira-mobile-menu" hidden aria-label="Main menu">' +
      '<a href="' + config.homeMobile + '">Home</a>' +
      '<a href="' + config.projectMobile + '">Project Overview</a>' +
      '<a href="' + config.forms + '">Form 1 — Entrepreneur Survey</a>' +
      '<a href="' + config.formsAlt + '">Forms</a>' +
      '</nav>';
    document.body.insertBefore(shell, document.body.firstChild);
    var toggle = shell.querySelector(".muhsira-menu-toggle");
    var menu = shell.querySelector(".muhsira-mobile-menu");
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close main menu" : "Open main menu");
      menu.hidden = !open;
    });
    document.addEventListener("click", function (event) {
      if (!shell.contains(event.target)) {
        menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open main menu");
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open main menu");
        toggle.focus();
      }
    });
  }
})();