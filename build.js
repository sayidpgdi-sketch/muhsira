const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const root = __dirname;
const out = path.join(root, "dist");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const desktopStyles = `<style id="muhsira-desktop-layout">
@media (min-width: 900px) {
  html, body { width: 100%; min-width: 320px; }
  body { font-size: 16px; }
  header > div { max-width: 1240px; margin-inline: auto; padding-inline: 40px !important; height: 88px !important; }
  header img { width: 44px !important; height: 44px !important; }
  main { padding-top: 88px !important; padding-bottom: 48px !important; }
  main > div { width: 100%; }
  main > div > section { padding-left: max(40px, calc((100vw - 1160px) / 2)) !important; padding-right: max(40px, calc((100vw - 1160px) / 2)) !important; }
  main > div > section:first-child { min-height: 500px; justify-content: center; align-items: flex-start !important; padding-top: 76px !important; padding-bottom: 76px !important; }
  main > div > section:first-child > * { max-width: 760px; }
  main > div > section:first-child h1 { font-size: clamp(3rem, 5vw, 5.25rem) !important; line-height: 1.04 !important; max-width: 850px; }
  main > div > section:first-child p { max-width: 680px; font-size: 1.125rem !important; line-height: 1.8 !important; }
  main > div > section:first-child .max-w-xs { max-width: 430px !important; }
  #featured-projects { padding-top: 76px !important; padding-bottom: 76px !important; }
  #featured-projects > div:first-child { max-width: 760px; margin-bottom: 36px !important; }
  #featured-projects > div:nth-child(2) { display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px !important; align-items: stretch; }
  #featured-projects > div:nth-child(2) > div { padding: 32px !important; min-height: 320px; }
  main > div > section:not(:first-child) { padding-top: 64px !important; padding-bottom: 64px !important; }
  main > div > section:not(:first-child) > div:first-child { max-width: 900px; }
  main > div > section:not(:first-child) .grid { gap: 24px !important; }
  main > div > section:not(:first-child) .flex.flex-col.gap-space-md { display: grid !important; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px !important; }
  main > div > section:not(:first-child) .rounded-3xl { border-radius: 24px !important; }
  #contact-inquiry { max-width: 100%; }
  footer { padding-left: max(40px, calc((100vw - 1160px) / 2)) !important; padding-right: max(40px, calc((100vw - 1160px) / 2)) !important; }
}
</style>`;

function prepareHtml(file, isEntry = false) {
  let html = fs.readFileSync(path.join(root, file), "utf8");
  // Shared design tokens and site configuration are injected into every built page.
  // This keeps desktop/mobile page layouts distinct while centralizing cross-page rules.
  const sharedAssets = '<link rel="stylesheet" href="/shared-layout.css" data-muhsira-shared-layout>\n<script src="/shared-site.js" defer data-muhsira-shared-site></script>\n';
  if (!html.includes('data-muhsira-shared-layout')) {
    html = html.replace(/<\/head>/i, sharedAssets + '</head>');
  }
  html = html.replace(
    /(<img[^>]*alt="Muhsira Pananchery - Senior Accountant &amp; Operations Specialist"[^>]*src=")[^"]*(")/i,
    "$1/Main_screen_image.webp$2"
  );
  // Add desktop-only presentation styles to the desktop home page. The mobile home page stays unchanged.
  if (file === "desktop_screen_main.html") {
    html = html.replace("</head>", desktopStyles + "</head>");
  }
  if (isEntry) {
    const mobileRedirect = `<script>
(function () {
  var ua = navigator.userAgent || "";
  var mobile = /Android|iPhone|iPod|IEMobile|Opera Mini|Mobile/i.test(ua);
  if (mobile && !sessionStorage.getItem("muhsira-desktop-view")) {
    window.location.replace("/Mobile_screen_main.html");
  }
})();
</script>`;
    html = html.replace("</head>", mobileRedirect + "</head>");
  }
  return html;
}

(async () => {
  await sharp(path.join(root, "Main_screen_image.png"))
    .webp({ quality: 84, effort: 5 })
    .toFile(path.join(out, "Main_screen_image.webp"));

  fs.writeFileSync(path.join(out, "index.html"), prepareHtml("desktop_screen_main.html", true));
  fs.writeFileSync(path.join(out, "Mobile_screen_main.html"), prepareHtml("Mobile_screen_main.html"));
  fs.writeFileSync(path.join(out, "project_overview.html"), prepareHtml("project_overview.html"));
  // Replace the legacy mobile overview screen with the newly committed Project overview.html.
  fs.writeFileSync(path.join(out, "project_overview_mobile.html"), prepareHtml("Project overview.html"));
  fs.writeFileSync(path.join(out, "desktop_screen_main.html"), prepareHtml("desktop_screen_main.html"));
  fs.copyFileSync(path.join(root, "forms_mobile.html"), path.join(out, "forms_mobile.html"));
  fs.copyFileSync(path.join(root, "Forms_1.html"), path.join(out, "Forms_1.html"));
  fs.copyFileSync(path.join(root, "shared-layout.css"), path.join(out, "shared-layout.css"));
  fs.copyFileSync(path.join(root, "shared-site.js"), path.join(out, "shared-site.js"));
  fs.writeFileSync(path.join(out, "_headers"), ["/*", "  X-Content-Type-Options: nosniff", "  Referrer-Policy: strict-origin-when-cross-origin", ""].join("\n"));
  console.log("Built desktop layout and mobile page; optimized supplied image to WebP.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
