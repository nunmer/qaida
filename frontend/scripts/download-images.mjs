// Downloads every imageUrl in src/data/locations.ts to public/locations/<id>.jpg
// so the game serves photos locally instead of hotlinking Wikimedia.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const src = readFileSync(new URL("../src/data/locations.ts", import.meta.url), "utf8");
const entries = [
  ...src.matchAll(/id:\s*"([^"]+)"[\s\S]*?imageUrl:\s*\n?\s*"([^"]+)"/g),
].map((m) => ({ id: m[1], url: m[2] }));

const outDir = new URL("../public/locations/", import.meta.url);
mkdirSync(outDir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failed = 0;

for (const { id, url } of entries) {
  const ext = url.toLowerCase().includes(".png") ? "png" : "jpg";
  const target = new URL(`${id}.${ext}`, outDir);
  if (existsSync(target)) {
    console.log("skip (exists)", id);
    continue;
  }
  let done = false;
  for (let attempt = 0; attempt < 5 && !done; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "qaida-image-fetch/1.0 (one-time setup)" },
      });
      if (res.status === 429) {
        console.log(`429 on ${id}, waiting...`);
        await sleep(15000 * (attempt + 1));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(target, buf);
      console.log("ok", id, `${Math.round(buf.length / 1024)}KB`);
      done = true;
    } catch (err) {
      console.log("err", id, err.message);
      await sleep(5000);
    }
  }
  if (!done) failed++;
  await sleep(3000);
}
console.log(failed === 0 ? "ALL DOWNLOADED" : `${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
