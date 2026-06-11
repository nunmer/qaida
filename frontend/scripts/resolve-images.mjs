// One-off helper: resolves a Wikimedia Commons photo URL for each location
// search query. Output is pasted into src/data/locations.ts as imageUrl.
// Usage: node scripts/resolve-images.mjs

const QUERIES = {
  bayterek: "Bayterek tower Astana",
  "khan-shatyr": "Khan Shatyr entertainment center building",
  "hazrat-sultan": "Hazrat Sultan Mosque Astana",
  "nur-alem": "Nur Alem pavilion Expo 2017",
  "astana-grand-mosque": "Astana Grand Mosque exterior",
  "ascension-cathedral": "Ascension Cathedral Almaty",
  medeu: "Medeu skating rink",
  shymbulak: "Shymbulak ski resort",
  "big-almaty-lake": "Big Almaty Lake",
  "kok-tobe": "Kok Tobe Almaty",
  "republic-square-almaty": "Independence Monument Almaty",
  "charyn-canyon": "Charyn Canyon",
  "kolsai-lakes": "Kolsai lakes",
  "kaindy-lake": "Lake Kaindy sunken forest",
  "singing-dune": "Singing Dune Altyn-Emel",
  "tamgaly-petroglyphs": "Tamgaly petroglyphs",
  "yasawi-mausoleum": "Mausoleum of Khoja Ahmed Yasawi",
  "aisha-bibi": "Aisha Bibi mausoleum",
  bozzhyra: "Bozzhyra Mangystau",
  sherkala: "Sherkala mountain",
  "valley-of-balls": "Torysh valley of balls Mangystau",
  "aktau-coast": "Aktau Caspian sea embankment",
  baikonur: "Baikonur cosmodrome Soyuz launch",
  burabay: "Borovoe Burabay lake Okzhetpes",
  balkhash: "Balkhash city Kazakhstan",
  karaganda: "Karaganda miners culture palace",
  shymkent: "Shymkent Ordabasy square",
  atyrau: "Atyrau Ural river bridge",
  oral: "Uralsk Oral Kazakhstan city",
  aktobe: "Aktobe city Kazakhstan",
  kostanay: "Kostanay city Kazakhstan",
  petropavl: "Petropavl Kazakhstan city",
  "pavlodar-mosque": "Mashkhur Jusup Mosque Pavlodar",
  semey: "Semey suspension bridge Irtysh",
  oskemen: "Ust-Kamenogorsk city Kazakhstan",
  kyzylorda: "Kyzylorda city Kazakhstan",
  taldykorgan: "Taldykorgan Kazakhstan",
};

const API = "https://commons.wikimedia.org/w/api.php";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function resolve(query) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const url = await tryResolve(query);
    if (url !== "RETRY") return url;
    await sleep(3000 * (attempt + 1));
  }
  throw new Error(`rate limited for "${query}"`);
}

async function tryResolve(query) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: "1",
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "1280",
    origin: "*",
  });
  const res = await fetch(`${API}?${params}`, {
    headers: { "User-Agent": "qaida-game-setup/1.0" },
  });
  if (res.status === 429) return "RETRY";
  if (!res.ok) throw new Error(`HTTP ${res.status} for "${query}"`);
  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  return page?.imageinfo?.[0]?.thumburl ?? page?.imageinfo?.[0]?.url ?? null;
}

const out = {};
for (const [id, query] of Object.entries(QUERIES)) {
  try {
    out[id] = await resolve(query);
  } catch (err) {
    out[id] = null;
    console.error(`FAILED ${id}: ${err.message}`);
  }
  await sleep(1500);
}
console.log(JSON.stringify(out, null, 2));
