// One-off: appends a batch of new locations to src/data/locations.ts. For each
// candidate it resolves a photo (Wikipedia lead image, Commons fallback),
// downloads it to public/locations/<id>.<ext>, and injects a typed entry with a
// local imageUrl + source attribution. Candidates whose image can't be fetched
// are skipped so no broken images ever ship. Re-running skips existing ids.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const NEW = [
  { id: "astana-grand-mosque", name: "Astana Grand Mosque", city: "Astana", region: "Astana", lat: 51.0906, lng: 71.4139, category: "architecture", difficulty: 1, wiki: "Astana Grand Mosque", commons: "Astana Grand Mosque exterior", fact: "Opened in 2022, Astana Grand Mosque is the largest mosque in Central Asia, holding up to 235,000 worshippers beneath a 90-meter golden dome." },
  { id: "peace-pyramid", name: "Palace of Peace and Reconciliation", city: "Astana", region: "Astana", lat: 51.1244, lng: 71.4594, category: "architecture", difficulty: 1, wiki: "Palace of Peace and Reconciliation", commons: "Palace of Peace and Reconciliation pyramid", fact: "Norman Foster's Palace of Peace and Reconciliation is a 62-meter glass pyramid built in 2006 to host a congress of world religions every three years." },
  { id: "astana-opera", name: "Astana Opera", city: "Astana", region: "Astana", lat: 51.1469, lng: 71.4203, category: "architecture", difficulty: 2, wiki: "Astana Opera", commons: "Astana Opera theatre building", fact: "Astana Opera, opened in 2013, is one of the largest opera houses in the world, its classical facade modeled on the great theaters of Europe." },
  { id: "panfilov-park", name: "Park of 28 Panfilov Guardsmen", city: "Almaty", region: "Almaty", lat: 43.2596, lng: 76.954, category: "monument", difficulty: 2, wiki: "Panfilov Park", commons: "Park 28 Panfilov Guardsmen memorial Almaty", fact: "This park honors an Almaty-raised division that fought outside Moscow in 1941; its eternal flame and towering war memorial anchor the city center." },
  { id: "green-bazaar", name: "Green Bazaar", city: "Almaty", region: "Almaty", lat: 43.2606, lng: 76.9596, category: "street", difficulty: 3, wiki: "Green Bazaar", commons: "Green Bazaar Almaty market hall", fact: "Almaty's Green Bazaar has traded since the 19th century — a riot of horse meat, kurt, dried fruit and spices under one Soviet-era roof." },
  { id: "first-president-park", name: "Park of the First President", city: "Almaty", region: "Almaty", lat: 43.1839, lng: 76.8853, category: "nature", difficulty: 3, wiki: "Park of the First President", commons: "Park First President Almaty alley", fact: "Laid out in 2001 at the foot of the mountains, this park spreads symmetrical alleys, fountains and a Japanese garden across 73 hectares of Almaty." },
  { id: "almaty-central-mosque", name: "Almaty Central Mosque", city: "Almaty", region: "Almaty", lat: 43.2616, lng: 76.9407, category: "architecture", difficulty: 2, wiki: "Central Mosque (Almaty)", commons: "Almaty Central Mosque", fact: "Almaty Central Mosque, finished in 1999, can hold 7,000 worshippers; its 47-meter minaret and turquoise dome rise above the old city." },
  { id: "valley-of-balls", name: "Torysh (Valley of Balls)", city: "Shetpe", region: "Mangystau Region", lat: 43.7, lng: 54.1, category: "nature", difficulty: 2, wiki: "Torysh", commons: "Torysh valley of balls concretions Mangystau", fact: "Torysh, the 'Valley of Balls', is scattered with thousands of stone spheres — mineral concretions formed on an ancient seabed millions of years ago." },
  { id: "altyn-emel-aktau", name: "Aktau Mountains", city: "Altyn-Emel", region: "Jetisu Region", lat: 43.9167, lng: 78.7, category: "nature", difficulty: 3, wiki: "Altyn-Emel National Park", commons: "Aktau mountains Altyn-Emel colored clay", fact: "The Aktau Mountains in Altyn-Emel are striped white, red and ochre — 400-million-year-old clays once at the bottom of a prehistoric sea." },
  { id: "korgalzhyn", name: "Korgalzhyn Reserve", city: "Korgalzhyn", region: "Akmola Region", lat: 50.5833, lng: 70.0, category: "nature", difficulty: 3, wiki: "Korgalzhyn Nature Reserve", commons: "Korgalzhyn reserve flamingos lake", fact: "The Korgalzhyn–Tengiz lakes are the world's northernmost nesting site of the pink flamingo, a UNESCO-listed wetland on the Central Asian flyway." },
  { id: "markakol", name: "Lake Markakol", city: "Urunkhaika", region: "East Kazakhstan Region", lat: 48.7667, lng: 85.75, category: "nature", difficulty: 3, wiki: "Markakol", commons: "Markakol lake Altai Kazakhstan", fact: "Lake Markakol, ringed by the Altai Mountains at 1,450 m, is a pristine reserve famed for its uskuch — a landlocked salmon found almost nowhere else." },
  { id: "aksu-canyon", name: "Aksu Canyon", city: "Zhabagly", region: "Turkistan Region", lat: 42.45, lng: 70.5, category: "nature", difficulty: 3, wiki: "Aksu-Zhabagly Nature Reserve", commons: "Aksu canyon Aksu-Zhabagly", fact: "The Aksu Canyon plunges 500 m through Aksu-Zhabagly, Central Asia's oldest nature reserve (1926), home to snow leopards and wild tulips." },
  { id: "tamgaly-petroglyphs", name: "Tamgaly Petroglyphs", city: "Tamgaly", region: "Jetisu Region", lat: 43.8, lng: 75.5333, category: "monument", difficulty: 3, wiki: "Tamgaly", commons: "Tamgaly Tanbaly petroglyphs", fact: "The Tamgaly gorge holds over 5,000 Bronze Age rock carvings, including sun-headed deities — a UNESCO World Heritage open-air gallery." },
  { id: "bektau-ata", name: "Bektau-Ata", city: "Balkhash", region: "Karaganda Region", lat: 47.2, lng: 75.05, category: "nature", difficulty: 3, wiki: "Bektau-Ata", commons: "Bektau-Ata granite mountains", fact: "Bektau-Ata is a granite massif rising abruptly from the steppe near Lake Balkhash, riddled with caves, a hidden lake and pink-rock spires." },
  { id: "aktobe", name: "Aktobe", city: "Aktobe", region: "Aktobe Region", lat: 50.2839, lng: 57.167, category: "street", difficulty: 2, wiki: "Aktobe", commons: "Aktobe city Nur Gasyr mosque", fact: "Aktobe, in the far west, grew from a tsarist fort of 1869; today the silver-domed Nur Gasyr mosque faces St. Nicholas Cathedral across the city." },
  { id: "kyzylorda", name: "Kyzylorda", city: "Kyzylorda", region: "Kyzylorda Region", lat: 44.8528, lng: 65.5092, category: "street", difficulty: 3, wiki: "Kyzylorda", commons: "Kyzylorda central square Kazakhstan", fact: "Kyzylorda, on the Syr Darya, was Kazakhstan's capital from 1925 to 1929. It is the gateway to Baikonur and the shrinking Aral Sea." },
  { id: "taraz-karakhan", name: "Karakhan Mausoleum", city: "Taraz", region: "Zhambyl Region", lat: 42.8989, lng: 71.3667, category: "monument", difficulty: 3, wiki: "Karakhan Mausoleum", commons: "Karakhan mausoleum Taraz", fact: "The Karakhan Mausoleum marks the grave of an 11th-century Karakhanid ruler; rebuilt in 1906, it gives the ancient Silk Road city of Taraz its skyline." },
  { id: "zharkent-mosque", name: "Zharkent Mosque", city: "Zharkent", region: "Jetisu Region", lat: 44.1656, lng: 80.0019, category: "architecture", difficulty: 2, wiki: "Zharkent Mosque", commons: "Zharkent mosque Chinese pagoda style", fact: "Zharkent Mosque (1895) near the Chinese border was built without nails by a Beijing architect — a Buddhist-style pagoda blended with Islamic worship." },
  { id: "kokshetau", name: "Kokshetau", city: "Kokshetau", region: "Akmola Region", lat: 53.2833, lng: 69.3833, category: "street", difficulty: 3, wiki: "Kokshetau", commons: "Kokshetau city Kazakhstan", fact: "Kokshetau sits among birch forests and lakes at the foot of Bukpa mountain, a northern city founded in 1824 and gateway to the Burabay resort." },
  { id: "zhezkazgan", name: "Zhezkazgan", city: "Zhezkazgan", region: "Ulytau Region", lat: 47.7833, lng: 67.7, category: "street", difficulty: 3, wiki: "Zhezkazgan", commons: "Zhezkazgan city Kazakhstan", fact: "Zhezkazgan rose around some of the world's richest copper deposits; the nearby Begazy-Dandybai burial mounds reach back to the Bronze Age." },
  { id: "otrar", name: "Otrar Ruins", city: "Otrar", region: "Turkistan Region", lat: 42.8519, lng: 68.3061, category: "monument", difficulty: 3, wiki: "Otrar", commons: "Otrar ancient city ruins aerial", fact: "Otrar was a great Silk Road city whose defiance of Genghis Khan in 1219 triggered the Mongol invasion; the conqueror Timur died here in 1405." },
  { id: "taldykorgan", name: "Taldykorgan", city: "Taldykorgan", region: "Jetisu Region", lat: 45.0156, lng: 78.3739, category: "street", difficulty: 3, wiki: "Taldykorgan", commons: "Taldykorgan city Kazakhstan", fact: "Taldykorgan, capital of the Jetisu region, grew from a 19th-century trading village into a green city of poplar-lined avenues near the Zhetysu Alatau." },
];

const WIKI = "https://en.wikipedia.org/w/api.php";
const COMMONS = "https://commons.wikimedia.org/w/api.php";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": "qaida-game-setup/1.0" } });
    if (res.status === 429) { await sleep(3000 * (attempt + 1)); continue; }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
  throw new Error("rate limited");
}

async function fromWikipedia(title) {
  const params = new URLSearchParams({
    action: "query", format: "json", prop: "pageimages", piprop: "thumbnail",
    pithumbsize: "1280", titles: title, redirects: "1", origin: "*",
  });
  const data = await getJson(`${WIKI}?${params}`);
  const page = Object.values(data?.query?.pages ?? {})[0];
  return page?.thumbnail?.source ?? null;
}

async function fromCommons(query) {
  const params = new URLSearchParams({
    action: "query", format: "json", generator: "search",
    gsrsearch: `${query} filetype:bitmap`, gsrnamespace: "6", gsrlimit: "1",
    prop: "imageinfo", iiprop: "url", iiurlwidth: "1280", origin: "*",
  });
  const data = await getJson(`${COMMONS}?${params}`);
  const page = Object.values(data?.query?.pages ?? {})[0];
  return page?.imageinfo?.[0]?.thumburl ?? page?.imageinfo?.[0]?.url ?? null;
}

async function download(url, target) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": "qaida-image-fetch/1.0" } });
    if (res.status === 429) { await sleep(8000 * (attempt + 1)); continue; }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    writeFileSync(target, Buffer.from(await res.arrayBuffer()));
    return;
  }
  throw new Error("rate limited (429)");
}

const file = new URL("../src/data/locations.ts", import.meta.url);
let src = readFileSync(file, "utf8");
const outDir = new URL("../public/locations/", import.meta.url);

function entryText(loc, localUrl, source) {
  return `  {
    id: "${loc.id}",
    name: "${loc.name}",
    city: "${loc.city}",
    region: "${loc.region}",
    lat: ${loc.lat},
    lng: ${loc.lng},
    category: "${loc.category}",
    difficulty: ${loc.difficulty},
    fact: "${loc.fact}",
    imageUrl: "${localUrl}",
    source:
      "${source}",
  },
`;
}

const added = [];
const skipped = [];

for (const loc of NEW) {
  if (src.includes(`id: "${loc.id}"`)) { console.error(`exists ${loc.id}`); continue; }
  let url = null;
  try {
    url = await fromWikipedia(loc.wiki);
    if (!url) url = await fromCommons(loc.commons);
  } catch (err) {
    console.error(`resolve fail ${loc.id}: ${err.message}`);
  }
  if (!url) { skipped.push(loc.id); console.error(`SKIP (no image) ${loc.id}`); await sleep(1800); continue; }

  const ext = url.toLowerCase().includes(".png") ? "png" : "jpg";
  const target = new URL(`${loc.id}.${ext}`, outDir);
  try {
    if (!existsSync(target)) await download(url, target);
  } catch (err) {
    skipped.push(loc.id);
    console.error(`SKIP (download fail) ${loc.id}: ${err.message}`);
    await sleep(1800);
    continue;
  }
  added.push(entryText(loc, `/locations/${loc.id}.${ext}`, url));
  console.error(`ADD  ${loc.id} (${ext})`);
  await sleep(1800);
}

if (added.length) {
  const anchor = "];\n\nexport const LANDMARK_POOL";
  if (!src.includes(anchor)) { console.error("ANCHOR NOT FOUND — aborting"); process.exit(1); }
  src = src.replace(anchor, `${added.join("")}];\n\nexport const LANDMARK_POOL`);
  writeFileSync(file, src);
}
console.error(`\nADDED ${added.length}, SKIPPED ${skipped.length}: ${skipped.join(", ")}`);
