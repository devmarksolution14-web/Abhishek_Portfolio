// Generates placeholder cover + gallery images for every project.
// Run with: node scripts/generate-placeholders.mjs
// Replace the output files in /public/images/projects with real images any time.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const out = path.join(process.cwd(), "public", "images", "projects");
await mkdir(out, { recursive: true });

const projects = [
  ["khanchi-darbar-resort", "Khanchi Darbar Resort", "Marketing"],
  ["devmark-agency-website", "DevMark Agency Website", "Web"],
  ["real-estate-platform", "Real Estate Platform", "Web"],
  ["ride-sharing-app-nepal", "Ride-Sharing App for Nepal", "Web"],
  ["nova-decor", "Nova Decor", "Strategy"],
  ["connectuni-brand-video", "ConnectUni Brand Video", "Design"],
  ["annapurna-dental-blog", "Annapurna Dental Blog", "Marketing"],
  ["bagmati-school-proposal", "Bagmati School Proposal", "Strategy"],
];

// Warm, earthy bases — no purple/blue gradients.
const bases = ["#14171F", "#1A1C14", "#1C1714", "#121915", "#191514", "#16181C", "#1B1A12", "#131617"];
const lime = "#C6FF3D";

function svg(i, n) {
  const W = 1600;
  const H = 1200;
  const base = bases[i % bases.length];
    const shapes = [
    // 1: big arch + circle
    `<path d="M1100 880 V460 a210 210 0 0 1 420 0 V880 Z" fill="${lime}" opacity="0.92"/>
     <circle cx="880" cy="330" r="90" fill="none" stroke="${lime}" stroke-width="3"/>
     <rect x="120" y="760" width="640" height="2" fill="#EDEBE6" opacity="0.25"/>`,
    // 2: grid of cards
    Array.from({ length: 6 }, (_, k) => {
      const x = 120 + (k % 3) * 470;
      const y = 300 + Math.floor(k / 3) * 400;
      return `<rect x="${x}" y="${y}" width="420" height="340" rx="28" fill="${k === 1 ? lime : "#232733"}" opacity="${k === 1 ? 0.9 : 0.8}"/>`;
    }).join(""),
    // 3: concentric rings + bars
    `${[420, 320, 220, 120].map((r, k) => `<circle cx="1150" cy="620" r="${r}" fill="none" stroke="${k === 3 ? lime : "#EDEBE6"}" stroke-opacity="${k === 3 ? 1 : 0.18}" stroke-width="${k === 3 ? 6 : 2}"/>`).join("")}
     ${[0, 1, 2, 3, 4].map((k) => `<rect x="${140 + k * 110}" y="${980 - (k + 1) * 90}" width="70" height="${(k + 1) * 90}" rx="10" fill="${k === 4 ? lime : "#232733"}"/>`).join("")}`,
  ][(n - 1) % 3];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="g" cx="0.85" cy="0.1" r="0.9">
      <stop offset="0" stop-color="${lime}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="${base}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.6" fill="#EDEBE6" opacity="0.07"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="${base}"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  ${shapes}
  <text x="120" y="${H - 80}" font-family="Consolas, 'Courier New', monospace" font-size="28" fill="#A3A19B">PLACEHOLDER IMAGE — REPLACE IN /public/images/projects</text>
</svg>`;
}

for (const [i, [slug]] of projects.entries()) {
  for (const n of [1, 2, 3]) {
    const file = path.join(out, `${slug}-${n}.jpg`);
    await sharp(Buffer.from(svg(i, n))).jpeg({ quality: 82, mozjpeg: true }).toFile(file);
  }
}
console.log(`Generated ${projects.length * 3} placeholder images in ${out}`);
