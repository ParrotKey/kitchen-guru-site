import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(root, "data", "cities.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const baseUrl = data.baseUrl.replace(/\/$/, "");
const liveCities = data.waveOne;

const forbiddenClaims = [
  /#1/i,
  /number one/i,
  /official partner/i,
  /official sponsor/i,
  /partnered with/i,
  /endorsed by/i,
  /official .* city/i,
  /available now in/i,
  /fastest[-\s]?growing/i,
  /thousands of/i,
  /trusted by/i,
  /best pickleball/i,
  /\b\d+\s+(active\s+)?players\b/i,
  /\b\d+\s+courts?\s+in\b/i,
  /ranked/i,
  /guaranteed/i
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function stripTags(value) {
  return String(value)
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cityUrl(city) {
  return `${baseUrl}/cities/${city.slug}/`;
}

function pageShell({ title, description, canonical, body, extraHead = "" }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${esc(canonical)}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${esc(canonical)}" />
<meta name="theme-color" content="#07110d" />
<link rel="icon" href="${canonical.endsWith("/cities/") ? "../assets/logo.svg" : "../../assets/logo.svg"}" type="image/svg+xml" />
${extraHead}
<link rel="stylesheet" href="${canonical.endsWith("/cities/") ? "../assets/legal.css" : "../../assets/legal.css"}" />
<style>
  :root {
    --ink:#07110d; --ink-2:#12251d; --paper:#fbfcf4; --paper-2:#eef4de;
    --line:rgba(7,17,13,.14); --muted:#5a6a62; --court:#08795f;
    --optic:#d7ff4b; --clay:#e66f43; --sky:#9fd9cd; --white:#fff; --radius:8px;
  }
  body { margin:0; font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; color:var(--ink); background:var(--paper); line-height:1.48; }
  a { color:inherit; text-decoration:none; }
  a:visited { color:#4f3177; }
  .topbar a:visited, footer a:visited, .dark-band a:visited, .button:visited { color:inherit; }
  a:focus-visible, button:focus-visible, input:focus-visible { outline:3px solid var(--optic); outline-offset:4px; }
  .skip-link { position:absolute; left:14px; top:12px; z-index:50; transform:translateY(-140%); background:var(--optic); color:var(--ink); border-radius:var(--radius); padding:12px 16px; font-weight:950; }
  .skip-link:focus { transform:translateY(0); }
  .wrap { width:min(1120px,calc(100% - 40px)); margin-inline:auto; }
  .topbar { position:sticky; top:0; z-index:20; background:rgba(7,17,13,.9); backdrop-filter:blur(16px); border-bottom:1px solid rgba(255,255,255,.14); }
  .nav { min-height:68px; display:flex; align-items:center; justify-content:space-between; gap:20px; color:var(--white); }
  .brand { display:inline-flex; align-items:center; gap:12px; font-weight:900; }
  .brand img { width:38px; height:38px; border-radius:10px; background:var(--paper); }
  .navlinks { display:flex; align-items:center; gap:14px; font-size:15px; font-weight:850; color:rgba(255,255,255,.86); }
  .navlinks a { min-height:44px; display:inline-flex; align-items:center; }
  .button { display:inline-flex; min-height:44px; align-items:center; justify-content:center; border-radius:var(--radius); padding:11px 16px; font-size:14px; font-weight:900; border:1px solid transparent; }
  .button.primary { background:var(--optic); color:var(--ink); }
  .button.dark { background:var(--ink); color:var(--white); }
  .button.ghost { border-color:rgba(255,255,255,.24); color:var(--white); }
  .hero { position:relative; min-height:72svh; color:var(--white); background:var(--ink); overflow:hidden; display:grid; align-items:end; }
  .court-bg { position:absolute; inset:0; opacity:.92; background:
    radial-gradient(circle at 70% 20%, rgba(215,255,75,.20), transparent 24%),
    linear-gradient(90deg, rgba(7,17,13,.94), rgba(7,17,13,.58) 44%, rgba(7,17,13,.28)),
    repeating-linear-gradient(90deg, transparent 0 70px, rgba(255,255,255,.08) 71px 73px),
    linear-gradient(140deg, #08795f 0 46%, #0b5f78 46% 55%, #08795f 55% 100%);
  }
  .court-lines { position:absolute; inset:10% 8%; border:2px solid rgba(251,252,244,.78); transform:perspective(900px) rotateX(58deg) rotateZ(-8deg); transform-origin:center; box-shadow:0 30px 90px rgba(0,0,0,.38); }
  .court-lines::before, .court-lines::after { content:""; position:absolute; background:rgba(251,252,244,.75); }
  .court-lines::before { left:50%; top:0; width:2px; height:100%; }
  .court-lines::after { left:0; top:48%; width:100%; height:2px; }
  .hero-inner { position:relative; padding:120px 0 70px; max-width:840px; }
  .kicker { display:inline-flex; align-items:center; gap:9px; color:var(--optic); font-size:14px; text-transform:uppercase; letter-spacing:.08em; font-weight:950; }
  .kicker::before { content:""; width:30px; height:2px; background:currentColor; }
  h1,h2,h3,p { margin:0; }
  h1 { margin-top:18px; font-size:clamp(48px,9vw,118px); line-height:.88; letter-spacing:0; font-weight:950; }
  .lede { margin-top:24px; max-width:660px; font-size:clamp(18px,2vw,24px); color:rgba(255,255,255,.82); }
  .hero-actions { display:flex; gap:12px; flex-wrap:wrap; margin-top:30px; }
  section { padding:82px 0; }
  .section-head { display:grid; grid-template-columns:.8fr 1.2fr; gap:38px; align-items:end; margin-bottom:38px; }
  .section-head h2 { font-size:clamp(34px,5vw,68px); line-height:.94; font-weight:940; }
  .section-head p { color:#43514a; font-size:18px; max-width:620px; }
  .grid-3 { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); border:1px solid var(--line); }
  .panel { min-height:280px; padding:26px; border-right:1px solid var(--line); background:var(--paper); display:flex; flex-direction:column; justify-content:space-between; }
  .panel:last-child { border-right:0; }
  .panel small { color:var(--court); font-size:14px; letter-spacing:.08em; text-transform:uppercase; font-weight:950; }
  .panel h3 { margin-top:14px; font-size:clamp(25px,3vw,38px); line-height:1; font-weight:930; }
  .panel p { color:#43514a; font-size:16px; }
  .dark-band { background:var(--ink); color:var(--white); }
  .dark-band p { color:rgba(255,255,255,.84); }
  .alert-layout { display:grid; grid-template-columns:.9fr 1.1fr; gap:44px; align-items:center; }
  .selector { border:1px solid rgba(255,255,255,.18); background:rgba(255,255,255,.07); border-radius:var(--radius); padding:18px; }
  .selector-row { display:grid; grid-template-columns:1fr auto; gap:14px; align-items:center; margin-top:10px; border:1px solid rgba(255,255,255,.13); border-radius:var(--radius); padding:15px; }
  .selector-row.active { border-color:rgba(215,255,75,.55); background:rgba(215,255,75,.1); }
  .selector-row span { display:block; color:rgba(255,255,255,.82); font-size:14px; font-weight:750; margin-top:4px; }
  .pill { display:inline-flex; min-height:36px; align-items:center; border-radius:999px; padding:7px 12px; background:var(--optic); color:var(--ink); font-size:13px; font-weight:950; text-transform:uppercase; letter-spacing:.06em; }
  .nearby { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; }
  .nearby a { border:1px solid var(--line); border-radius:var(--radius); padding:18px; background:var(--white); font-weight:900; }
  .city-list { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; }
  .city-list a { border:1px solid var(--line); background:var(--white); border-radius:var(--radius); padding:18px; font-weight:900; }
  .breadcrumb { padding:18px 0 0; font-size:15px; font-weight:850; color:#43514a; }
  .breadcrumb ol { display:flex; flex-wrap:wrap; gap:8px; align-items:center; padding:0; margin:0; list-style:none; }
  .breadcrumb a { text-decoration:underline; text-underline-offset:3px; }
  .faq-list { display:grid; gap:12px; }
  .faq-item { border:1px solid var(--line); border-radius:var(--radius); padding:20px; background:var(--white); }
  .faq-item h3 { font-size:20px; line-height:1.2; margin-bottom:8px; }
  .faq-item p { color:#43514a; font-size:16px; }
  .note { color:#43514a; font-size:16px; margin-top:18px; }
  footer { background:#050a08; color:rgba(255,255,255,.66); padding:42px 0 28px; }
  footer .footer-grid { display:grid; grid-template-columns:1.2fr 1fr 1fr; gap:28px; }
  footer a { display:block; color:rgba(255,255,255,.72); margin-top:8px; font-weight:700; }
  @media (max-width: 820px) {
    .nav { flex-wrap:wrap; padding:10px 0 12px; }
    .navlinks { width:100%; flex-wrap:wrap; justify-content:flex-start; gap:10px; }
    .navlinks .button { padding-inline:14px; }
    .wrap { width:min(100% - 28px,1120px); }
    .section-head,.alert-layout,footer .footer-grid { grid-template-columns:1fr; }
    .grid-3,.nearby,.city-list { grid-template-columns:1fr; }
    .panel { min-height:220px; border-right:0; border-bottom:1px solid var(--line); }
    .panel:last-child { border-bottom:0; }
    .hero-inner { padding:96px 0 52px; }
  }
</style>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
${body}
</body>
</html>
`;
}

function header(prefix = "../") {
  return `<header class="topbar">
  <div class="wrap nav">
    <a class="brand" href="${prefix}index.html" aria-label="Kitchen Guru home"><img src="${prefix}assets/logo.svg" alt="" /><span>Kitchen Guru</span></a>
    <nav class="navlinks" aria-label="Primary navigation">
      <a href="${prefix}cities/">Cities</a>
      <a href="${prefix}support.html">Support</a>
      <a class="button primary" href="mailto:info@parrotkey.us?subject=Kitchen%20Guru%20beta%20updates">Join beta</a>
    </nav>
  </div>
</header>`;
}

function footer(prefix = "../") {
  return `<footer>
  <div class="wrap footer-grid">
    <div><a class="brand" href="${prefix}index.html"><img src="${prefix}assets/logo.svg" alt="" /><span>Kitchen Guru</span></a><p class="note">Live court signal, saved-court alerts, and safer player connections for pickleball.</p></div>
    <div><strong>Product</strong><a href="${prefix}cities/">Cities</a><a href="${prefix}index.html#alerts">Court alerts</a><a href="${prefix}index.html#plus">Kitchen Guru+</a></div>
    <div><strong>Legal and help</strong><a href="${prefix}privacy.html">Privacy Policy</a><a href="${prefix}terms.html">Terms</a><a href="${prefix}community.html">Community Guidelines</a><a href="${prefix}deletion.html">Delete your account</a><a href="${prefix}support.html">Support</a></div>
  </div>
</footer>`;
}

function nearbyLinks(city) {
  return city.nearby
    .map((slug) => liveCities.find((candidate) => candidate.slug === slug))
    .filter(Boolean)
    .map((nearby) => `<a href="../${nearby.slug}/">${esc(nearby.name)}<br><span class="note">${esc(nearby.state)}</span></a>`)
    .join("\n");
}

function cityFaqItems(city) {
  return [
    {
      question: `How does Kitchen Guru help pickleball players in ${city.name}?`,
      answer: `Kitchen Guru helps ${city.name} players follow saved courts, check anonymous court activity, and connect with players they actually meet at public courts. It is built for the local problem that ${city.painPoint}.`
    },
    {
      question: `Can I choose which ${city.name} courts send alerts?`,
      answer: `Yes. The alert model is court-specific: save the courts you actually play, then use those saved courts for future player-needed and court-update alerts.`
    },
    {
      question: "Will strangers see my name or exact location?",
      answer: "No. The first layer is anonymous court activity. Names, presence, and direct messages are for mutual friends after both players approve the connection."
    },
    {
      question: "Is Kitchen Guru free to join?",
      answer: "The public pages are collecting beta interest. The app starts with a free account path, while Kitchen Guru+ features remain part of the controlled release plan."
    },
    {
      question: "Who is Kitchen Guru for?",
      answer: "Kitchen Guru is intended for adults 18 and older who meet at public pickleball courts, want less guessing before they leave, and prefer simple court-level alerts instead of noisy group chats."
    }
  ];
}

function faqHtml(items) {
  return items.map((item) => `<article class="faq-item"><h3>${esc(item.question)}</h3><p>${esc(item.answer)}</p></article>`).join("\n");
}

function localEvidenceHtml(city) {
  if (!Array.isArray(city.localEvidence) || city.localEvidence.length === 0) return "";

  const rows = city.localEvidence.map((item) => `<article class="faq-item">
    <h3>${esc(item.sourceLabel)}</h3>
    <p>${esc(item.note)}</p>
    <p class="note"><a href="${esc(item.sourceUrl)}">Source</a></p>
  </article>`).join("\n");

  return `<section>
    <div class="wrap section-head">
      <div class="kicker">Local source check</div>
      <div>
        <h2>Public-source notes for ${esc(city.name)}.</h2>
        <p>These notes come from municipal, county, or parks pages. They support local context without claiming that Kitchen Guru is already live at every court.</p>
      </div>
    </div>
    <div class="wrap faq-list">${rows}</div>
  </section>`;
}

function cityPage(city) {
  const title = `Pickleball in ${city.name} - Find Games & Players | Kitchen Guru`;
  const description = `Find pickleball players in ${city.name} with saved-court alerts, anonymous court activity, and beta access from Kitchen Guru.`;
  const faqItems = cityFaqItems(city);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: title,
        description,
        url: cityUrl(city)
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Kitchen Guru", item: `${baseUrl}/` },
          { "@type": "ListItem", position: 2, name: "Cities", item: `${baseUrl}/cities/` },
          { "@type": "ListItem", position: 3, name: city.name, item: cityUrl(city) }
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      }
      ]
  };
  const body = `${header("../../")}
<nav class="breadcrumb wrap" aria-label="Breadcrumb"><ol><li><a href="../../index.html">Kitchen Guru</a></li><li aria-hidden="true">/</li><li><a href="../">Cities</a></li><li aria-hidden="true">/</li><li aria-current="page">${esc(city.name)}</li></ol></nav>
<main id="main">
  <section class="hero">
    <div class="court-bg" aria-hidden="true"></div>
    <div class="court-lines" aria-hidden="true"></div>
    <div class="wrap hero-inner">
      <div class="kicker">${esc(city.name)} pickleball</div>
      <h1>Find your next pickleball game in ${esc(city.name)}.</h1>
      <p class="lede">Kitchen Guru helps ${esc(city.name)} players follow the courts they actually use, see anonymous court activity, and connect after real games.</p>
      <div class="hero-actions">
        <a class="button primary" href="mailto:info@parrotkey.us?subject=Kitchen%20Guru%20${encodeURIComponent(city.name)}%20beta">Join the ${esc(city.name)} beta list</a>
        <a class="button ghost" href="../">See all cities</a>
      </div>
    </div>
  </section>
  <section>
    <div class="wrap section-head">
      <div class="kicker">${esc(city.metro)}</div>
      <div>
        <h2>Less guessing before you leave.</h2>
        <p>${esc(city.context[0])} ${esc(city.context[1])}</p>
      </div>
    </div>
    <div class="wrap grid-3">
      <article class="panel"><div><small>Local rhythm</small><h3>${esc(city.season)}.</h3></div><p>${esc(city.context[2])}</p></article>
      <article class="panel"><div><small>The pain</small><h3>Do not waste the play window.</h3></div><p>In ${esc(city.name)}, ${esc(city.painPoint)}.</p></article>
      <article class="panel"><div><small>The product</small><h3>Follow courts, not noise.</h3></div><p>Kitchen Guru pings saved courts and keeps stranger visibility at the court-activity level.</p></article>
    </div>
  </section>
  <section class="dark-band">
    <div class="wrap alert-layout">
      <div>
        <div class="kicker">Saved-court alerts</div>
        <h2>Only the ${esc(city.name)} courts you choose.</h2>
        <p>Kitchen Guru is not built around random radius blasts. Pick the courts that fit your routine, then get a simple signal when that exact place needs players.</p>
      </div>
      <div class="selector" aria-label="Illustrative saved-court alert preview">
        <div class="selector-row active"><div><strong>Your weekday court</strong><span>Doubles may need two more</span></div><span class="pill">Saved</span></div>
        <div class="selector-row active"><div><strong>Your weekend court</strong><span>Recent court update</span></div><span class="pill">Saved</span></div>
        <div class="selector-row"><div><strong>A park near you</strong><span>Add only if you actually play there</span></div><span class="pill">Add</span></div>
      </div>
    </div>
  </section>
  ${localEvidenceHtml(city)}
  <section>
    <div class="wrap section-head">
      <div class="kicker">Anonymous first</div>
      <div>
        <h2>Useful court activity without exposing strangers.</h2>
        <p>Non-friends can see that a court has activity. Names, presence, and messages are for accepted friends after mutual approval.</p>
      </div>
    </div>
    <div class="wrap grid-3">
      <article class="panel"><div><small>Before</small><h3>Check the court pulse.</h3></div><p>See whether a saved court looks worth the trip before you head out.</p></article>
      <article class="panel"><div><small>During</small><h3>Share a simple update.</h3></div><p>A member can post a court-level note like needing players or a good open-play window.</p></article>
      <article class="panel"><div><small>After</small><h3>Build the local crew.</h3></div><p>Connect with players you actually meet, then coordinate again without starting another giant group thread.</p></article>
    </div>
  </section>
  <section class="dark-band">
    <div class="wrap section-head">
      <div class="kicker">Nearby markets</div>
      <div>
        <h2>Pickleball does not stop at city lines.</h2>
        <p>Kitchen Guru city pages link nearby markets so players can follow real regional routines without making unsupported local availability claims.</p>
      </div>
    </div>
    <div class="wrap nearby">${nearbyLinks(city)}</div>
  </section>
  <section>
    <div class="wrap section-head">
      <div class="kicker">Founding beta</div>
      <div>
        <h2>Help shape Kitchen Guru in ${esc(city.name)}.</h2>
        <p>This is beta interest, not a claim that every ${esc(city.name)} court is live. Join the list, bring your court crew, and help us launch the simple way to find players.</p>
        <p class="note">Kitchen Guru is intended for adults 18+. Meet at public courts and play safe.</p>
      </div>
    </div>
  </section>
  <section>
    <div class="wrap section-head">
      <div class="kicker">${esc(city.name)} FAQ</div>
      <div>
        <h2>Simple answers before you join.</h2>
        <p>These answers stay intentionally practical: what the app does, what it does not expose, and how court-specific alerts work.</p>
      </div>
    </div>
    <div class="wrap faq-list">${faqHtml(faqItems)}</div>
  </section>
</main>
${footer("../../")}`;
  return pageShell({
    title,
    description,
    canonical: cityUrl(city),
    body,
    extraHead: `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
  });
}

function hubPage() {
  const byCluster = Map.groupBy(liveCities, (city) => city.cluster);
  const title = "Kitchen Guru Cities - Pickleball Games and Players";
  const description = "Explore Kitchen Guru city pages for pickleball players, saved-court alerts, anonymous court activity, and beta access.";
  const canonical = `${baseUrl}/cities/`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: title,
        description,
        url: canonical
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Kitchen Guru", item: `${baseUrl}/` },
          { "@type": "ListItem", position: 2, name: "Cities", item: canonical }
        ]
      }
    ]
  };
  const clusters = [...byCluster.entries()].map(([cluster, cities]) => `
    <section>
      <div class="wrap section-head"><div class="kicker">${esc(cluster)}</div><div><h2>${esc(cluster)} pickleball cities.</h2><p>Local pages for Kitchen Guru beta interest, saved-court alerts, and court-level pickup-game coordination.</p></div></div>
      <div class="wrap city-list">${cities.map((city) => `<a href="${city.slug}/">${esc(city.name)}<br><span class="note">${esc(city.state)}</span></a>`).join("\n")}</div>
    </section>
  `).join("\n");
  const body = `${header("../")}
<nav class="breadcrumb wrap" aria-label="Breadcrumb"><ol><li><a href="../index.html">Kitchen Guru</a></li><li aria-hidden="true">/</li><li aria-current="page">Cities</li></ol></nav>
<main id="main">
  <section class="hero">
    <div class="court-bg" aria-hidden="true"></div>
    <div class="court-lines" aria-hidden="true"></div>
    <div class="wrap hero-inner">
      <div class="kicker">Kitchen Guru cities</div>
      <h1>Find pickleball players city by city.</h1>
      <p class="lede">Kitchen Guru is building local court-signal pages for major pickleball markets: saved-court alerts, anonymous court activity, and beta access for adult pickup players.</p>
      <div class="hero-actions"><a class="button primary" href="mailto:info@parrotkey.us?subject=Kitchen%20Guru%20city%20beta">Join beta list</a><a class="button ghost" href="../">Back to Kitchen Guru</a></div>
    </div>
  </section>
  ${clusters}
  <section>
    <div class="wrap section-head">
      <div class="kicker">Next wave</div>
      <div><h2>Pickleball-heavy markets are queued next.</h2><p>${data.waveTwo.map((city) => `${city.name}, ${city.stateAbbr}`).join("; ")}. These are not published until the first wave passes review.</p></div>
    </div>
  </section>
</main>
${footer("../")}`;
  return pageShell({
    title,
    description,
    canonical,
    body,
    extraHead: `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
  });
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(relative, contents) {
  const full = path.join(root, relative);
  ensureDir(path.dirname(full));
  fs.writeFileSync(full, contents.replace(/[ \t]+$/gm, ""));
}

function lintClaims(relative, html) {
  const text = stripTags(html);
  const failures = forbiddenClaims.filter((pattern) => pattern.test(text));
  if (failures.length) {
    throw new Error(`${relative} contains forbidden claim(s): ${failures.map(String).join(", ")}`);
  }
}

function wordSet(html) {
  return new Set(stripTags(html).toLowerCase().match(/[a-z0-9]+/g) || []);
}

function citySimilarityReport() {
  const pages = liveCities.map((city) => ({
    slug: city.slug,
    words: wordSet(cityPage(city))
  }));
  const scores = [];
  for (let i = 0; i < pages.length; i += 1) {
    for (let j = i + 1; j < pages.length; j += 1) {
      let intersection = 0;
      for (const word of pages[i].words) if (pages[j].words.has(word)) intersection += 1;
      const union = new Set([...pages[i].words, ...pages[j].words]).size;
      scores.push({
        pair: `${pages[i].slug}/${pages[j].slug}`,
        score: union ? intersection / union : 0
      });
    }
  }
  scores.sort((a, b) => a.score - b.score);
  const average = scores.reduce((sum, entry) => sum + entry.score, 0) / scores.length;
  return {
    cityPages: pages.length,
    averageJaccard: Number(average.toFixed(3)),
    minJaccard: Number(scores[0].score.toFixed(3)),
    maxJaccard: Number(scores.at(-1).score.toFixed(3)),
    mostSimilarPair: scores.at(-1).pair
  };
}

function generate() {
  lintClaims("index.html", fs.readFileSync(path.join(root, "index.html"), "utf8"));
  const hub = hubPage();
  lintClaims("cities/index.html", hub);
  writeFile("cities/index.html", hub);
  for (const city of liveCities) {
    const html = cityPage(city);
    const relative = `cities/${city.slug}/index.html`;
    lintClaims(relative, html);
    writeFile(relative, html);
  }
  const urls = [
    `${baseUrl}/`,
    `${baseUrl}/privacy.html`,
    `${baseUrl}/terms.html`,
    `${baseUrl}/support.html`,
    `${baseUrl}/community.html`,
    `${baseUrl}/deletion.html`,
    `${baseUrl}/cities/`,
    ...liveCities.map(cityUrl)
  ];
  writeFile("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${esc(url)}</loc></url>`).join("\n")}
</urlset>
`);
  writeFile("robots.txt", `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`);
  console.log(`Generated ${liveCities.length} city pages plus hub, sitemap, and robots.txt.`);
}

if (process.argv.includes("--quality")) {
  console.log(JSON.stringify(citySimilarityReport(), null, 2));
} else if (process.argv.includes("--check")) {
  lintClaims("index.html", fs.readFileSync(path.join(root, "index.html"), "utf8"));
  for (const city of liveCities) lintClaims(`cities/${city.slug}/index.html`, cityPage(city));
  lintClaims("cities/index.html", hubPage());
  console.log(`Check passed for ${liveCities.length} city pages.`);
} else {
  generate();
}
