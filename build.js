const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const root = __dirname;
const out = path.join(root, "dist");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

function prepareHtml(file, isEntry = false) {
  let html = fs.readFileSync(path.join(root, file), "utf8");
  // Use the supplied portfolio image locally instead of a remote portrait URL.
  html = html.replace(
    /(<img[^>]*alt="Muhsira Pananchery - Senior Accountant &amp; Operations Specialist"[^>]*src=")[^"]*(")/i,
    "$1/Main_screen_image.webp$2"
  );
  if (isEntry) {
    const mobileRedirect = `<script>
(function () {
  var mobile = /Android|iPhone|iPod|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent) ||
    (window.matchMedia && window.matchMedia("(max-width: 767px)").matches);
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
  fs.writeFileSync(path.join(out, "desktop_screen_main.html"), prepareHtml("desktop_screen_main.html"));
  fs.copyFileSync(path.join(root, "forms_mobile.html"), path.join(out, "forms_mobile.html"));
  fs.writeFileSync(path.join(out, "_headers"), ["/*", "  X-Content-Type-Options: nosniff", "  Referrer-Policy: strict-origin-when-cross-origin", ""].join("\n"));
  console.log("Built desktop and mobile pages; optimized supplied image to WebP.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
