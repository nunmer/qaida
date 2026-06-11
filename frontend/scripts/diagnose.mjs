// Loads the game in headless Chromium, captures console output, network
// failures, element geometry and a screenshot. Usage: node scripts/diagnose.mjs
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const logs = [];
page.on("console", (msg) => logs.push(`[console.${msg.type()}] ${msg.text()}`));
page.on("pageerror", (err) => logs.push(`[pageerror] ${err.message}`));
page.on("requestfailed", (req) =>
  logs.push(`[requestfailed] ${req.url()} :: ${req.failure()?.errorText}`),
);

await page.goto("http://localhost:3000/play?mode=quick", {
  waitUntil: "networkidle",
  timeout: 30000,
});
await page.waitForTimeout(6000);

const report = await page.evaluate(() => {
  const pick = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      w: Math.round(r.width),
      h: Math.round(r.height),
      x: Math.round(r.x),
      y: Math.round(r.y),
      visible: r.width > 0 && r.height > 0,
    };
  };
  const canvas = document.querySelector("canvas.maplibregl-canvas");
  let webgl = "n/a";
  try {
    const test = document.createElement("canvas");
    webgl = test.getContext("webgl2") || test.getContext("webgl") ? "available" : "UNAVAILABLE";
  } catch {
    webgl = "threw";
  }
  return {
    webgl,
    mapRoot: pick(".maplibregl-map"),
    mapCanvas: canvas
      ? {
          cssW: canvas.style.width,
          cssH: canvas.style.height,
          attrW: canvas.width,
          attrH: canvas.height,
        }
      : null,
    streetViewIframeOrCanvas: Boolean(
      document.querySelector(".gm-style, [aria-label*='Street'], canvas:not(.maplibregl-canvas)"),
    ),
    photoShown: Boolean(document.querySelector("img[alt*='Kazakhstan']")),
    submitText: document.querySelector("button[disabled], button")?.textContent,
    bodyOverflowChildren: document.querySelectorAll("canvas").length,
  };
});

console.log(JSON.stringify(report, null, 2));
console.log("--- console/network log ---");
for (const l of logs) console.log(l);

await page.screenshot({ path: "scripts/diagnose.png", fullPage: false });
console.log("screenshot: scripts/diagnose.png");
await browser.close();
