// Rewrites src/data/locations.ts: imageUrl -> local /locations/<id>.<ext>,
// preserving the original Wikimedia URL in a `source` field for attribution.
import { readFileSync, writeFileSync } from "node:fs";

const file = new URL("../src/data/locations.ts", import.meta.url);
let src = readFileSync(file, "utf8");

const entries = [
  ...src.matchAll(/id:\s*"([^"]+)"[\s\S]*?imageUrl:\s*\n?\s*"(https[^"]+)"/g),
].map((m) => ({ id: m[1], url: m[2] }));

for (const { id, url } of entries) {
  const ext = url.toLowerCase().includes(".png") ? "png" : "jpg";
  const local = `/locations/${id}.${ext}`;
  const block = `imageUrl: "${local}",\n    source:\n      "${url}",`;
  // Replace the exact imageUrl assignment (single- or multi-line formatting).
  const pattern = new RegExp(
    `imageUrl:\\s*\\n?\\s*"${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}",`,
  );
  if (!pattern.test(src)) {
    console.error("NOT FOUND:", id);
    process.exitCode = 1;
    continue;
  }
  src = src.replace(pattern, block);
  console.log("rewrote", id, "->", local);
}

writeFileSync(file, src);
console.log("done");
