/* Shared site configuration and small cross-page consistency helpers. */
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
    forms: "/forms_mobile.html"
  };
  document.documentElement.dataset.muhsiraLayout = /Mobile|Android|iPhone|iPod/i.test(navigator.userAgent) ? "mobile" : "desktop";
  // Mark existing page-specific regions so one shared stylesheet can govern them
  // without replacing navigation, page content, or mobile-specific controls.
  document.querySelectorAll("header").forEach(function (node) { node.dataset.muhsiraSharedRegion = "header"; });
  document.querySelectorAll("footer").forEach(function (node) { node.dataset.muhsiraSharedRegion = "footer"; });
  document.querySelectorAll('a[href="mailto:muhsiraayyub@gmail.com"]').forEach(function (link) {
    link.setAttribute("aria-label", link.getAttribute("aria-label") || "Email " + config.name);
  });
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (link) {
    if (link.target === "_blank") link.rel = "noopener noreferrer";
  });
})();