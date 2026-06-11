// Second targeted pass for locations that failed or got bad matches.
const QUERIES = {
  "khan-shatyr": "Khan Shatyr night Astana",
  "astana-grand-mosque": "Grand Mosque Nur-Sultan",
  "republic-square-almaty": "Monument of Independence Almaty",
  "kaindy-lake": "Lake Kaindy",
  "valley-of-balls": "Torysh Mangystau stone",
  "aktau-coast": "Aktau city Caspian sea",
  petropavl: "Petropavlovsk Kazakhstan street",
  semey: "Semipalatinsk bridge Irtysh",
  aktobe: "Nur Gasyr mosque Aktobe",
  kyzylorda: "Kyzylorda railway station",
  taldykorgan: "Taldykorgan city street",
};

const API = "https://commons.wikimedia.org/w/api.php";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function resolve(query) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const url = await tryResolve(query);
    if (url !== "RETRY") return url;
    await sleep(4000 * (attempt + 1));
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
  await sleep(2000);
}
console.log(JSON.stringify(out, null, 2));
