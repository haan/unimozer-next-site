import { stat } from "node:fs/promises";
import sharp from "sharp";

const jobs = [
  {
    name: "UML diagram carousel image",
    input: "src/assets/screenshots/sources/feature-uml-diagram.png",
    outputWebp: "src/assets/screenshots/feature-uml-diagram.webp",
    outputJpeg: "src/assets/screenshots/feature-uml-diagram.jpg",
    extract: { left: 0, top: 100, width: 1426, height: 802 },
    resize: { width: 1600, height: 900 },
    webp: { quality: 84, effort: 6 },
    jpeg: { quality: 86, mozjpeg: true },
  },
  {
    name: "Wizard carousel image",
    input: "src/assets/screenshots/sources/feature-wizard.png",
    outputWebp: "src/assets/screenshots/feature-wizard.webp",
    outputJpeg: "src/assets/screenshots/feature-wizard.jpg",
    extract: { left: 64, top: 286, width: 1200, height: 675 },
    resize: { width: 1600, height: 900 },
    webp: { quality: 84, effort: 6 },
    jpeg: { quality: 86, mozjpeg: true },
  },
];

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function processJob(job) {
  const inputStats = await stat(job.input);

  const pipeline = sharp(job.input)
    .extract(job.extract)
    .resize(job.resize.width, job.resize.height);

  await pipeline.clone().webp(job.webp).toFile(job.outputWebp);
  await pipeline.clone().jpeg(job.jpeg).toFile(job.outputJpeg);

  const outputWebpStats = await stat(job.outputWebp);
  const outputJpegStats = await stat(job.outputJpeg);

  console.log(`[OK] ${job.name}: ${job.input} (${formatKb(inputStats.size)})`);
  console.log(`     -> ${job.outputWebp} (${formatKb(outputWebpStats.size)})`);
  console.log(`     -> ${job.outputJpeg} (${formatKb(outputJpegStats.size)})`);
}

async function main() {
  for (const job of jobs) {
    await processJob(job);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error("Screenshot processing failed:", message);
  process.exit(1);
});
