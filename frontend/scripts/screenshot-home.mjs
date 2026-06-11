// Quick visual check: capture the home page. Usage: node scripts/screenshot-home.mjs
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("http://localhost:3000/", {
  waitUntil: "networkidle",
  timeout: 30000,
});
await page.waitForTimeout(1500);
await page.screenshot({ path: "scripts/home.png", fullPage: false });
await browser.close();
console.log("saved scripts/home.png");
