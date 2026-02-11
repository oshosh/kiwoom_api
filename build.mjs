import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TEMPLATE_PATH = path.join(ROOT, "api.template.html");
const OUT_DIR = path.join(ROOT, "public");
const OUT_HTML = path.join(OUT_DIR, "api.html");
const OUT_ADS_TXT = path.join(OUT_DIR, "ads.txt");

function env(name, fallback = "") {
  return (process.env[name] ?? fallback).trim();
}

function normalizePubId(value) {
  const v = (value || "").trim();
  if (!v) return "";
  return v.startsWith("pub-") ? v : `pub-${v}`;
}

function buildAdsenseHead(client) {
  // AdSense client is not a secret, but we keep it in ENV for easy rotation.
  return `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}" crossorigin="anonymous"></script>`;
}

function buildAdsenseSection({ client, slot }) {
  return `
      <section class="card" aria-label="광고" style="padding: 14px 20px">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px">
          <strong style="font-size:13px;color:#5d6b85">Sponsored</strong>
          <span style="font-size:12px;color:#94a3b8">Google AdSense</span>
        </div>
        <ins class="adsbygoogle"
             style="display:block; min-height: 90px"
             data-ad-client="${client}"
             data-ad-slot="${slot}"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </section>
  `.trim();
}

function buildAdsTxtLine(pubId) {
  // Most common AdSense ads.txt format for Google.
  return `google.com, ${pubId}, DIRECT, f08c47fec0942fa0`;
}

function main() {
  const enabled =
    ["1", "true", "yes", "on"].includes(env("ADSENSE_ENABLE").toLowerCase()) ||
    false;

  const client = env("ADSENSE_CLIENT"); // e.g. ca-pub-xxxxxxxxxxxxxxxx
  const slot = env("ADSENSE_SLOT"); // numeric ad slot id

  const pubId = normalizePubId(env("ADSENSE_PUB_ID")); // pub-xxxxxxxxxxxxxxxx
  const adsTxtOverride = env("ADS_TXT_LINE"); // optional full line override

  const template = fs.readFileSync(TEMPLATE_PATH, "utf8");

  let head = "";
  let section = "";

  if (enabled && client && slot) {
    head = buildAdsenseHead(client);
    section = buildAdsenseSection({ client, slot });
  }

  const html = template
    .replaceAll("{{ADSENSE_HEAD}}", head)
    .replaceAll("{{ADSENSE_SECTION}}", section);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_HTML, html, "utf8");

  // ads.txt
  if (adsTxtOverride) {
    fs.writeFileSync(OUT_ADS_TXT, `${adsTxtOverride}\n`, "utf8");
  } else if (pubId) {
    fs.writeFileSync(OUT_ADS_TXT, `${buildAdsTxtLine(pubId)}\n`, "utf8");
  } else {
    fs.writeFileSync(
      OUT_ADS_TXT,
      `# TODO: Set ADSENSE_PUB_ID (or ADS_TXT_LINE) in Vercel Environment Variables.\n`,
      "utf8",
    );
  }

  // Helpful build output
  console.log(`[build] wrote ${path.relative(ROOT, OUT_HTML)}`);
  console.log(`[build] wrote ${path.relative(ROOT, OUT_ADS_TXT)}`);
  console.log(
    `[build] adsense ${enabled && client && slot ? "ENABLED" : "DISABLED"}`,
  );
}

main();

