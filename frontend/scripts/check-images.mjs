// Verifies every remote source URL in src/data/locations.ts responds with HTTP 200.
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../src/data/locations.ts", import.meta.url), "utf8");
const urls = [
  ...src.matchAll(/(?:imageUrl|source):\s*\n?\s*"(https[^"]+)"/g),
].map((m) => m[1]);

let bad = 0;
for (const url of urls) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": "qaida-check/1.0" },
    });
    if (!res.ok) {
      bad++;
      console.log("BAD", res.status, url);
    }
  } catch (err) {
    bad++;
    console.log("ERR", url, err.message);
  }
  await new Promise((r) => setTimeout(r, 400));
}
console.log(`checked ${urls.length}, bad ${bad}`);
process.exit(bad === 0 ? 0 : 1);
