import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

import sharp from "sharp";

const out = async (file, pipeline) => {
  mkdirSync(dirname(file), { recursive: true });
  const info = await pipeline.toFile(file);
  console.log(file, info.size, `${info.width}x${info.height}`);
};

await out(
  "public/images/environment/velis-electro.webp",
  sharp("/tmp/ailes-extract/pptx-image1.jpeg")
    .rotate()
    .resize({ width: 1800, withoutEnlargement: true })
    .webp({ quality: 82 }),
);
await out(
  "public/images/environment/bron-fox.webp",
  sharp("/tmp/ailes-extract/pptx-image2.png")
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 82 }),
);
await out(
  "public/images/stories/marie-marvingt.webp",
  sharp("/tmp/ailes-extract/elles-image1.png")
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 }),
);
await out(
  "public/images/stories/elisabeth-boselli.webp",
  sharp("/tmp/ailes-extract/elles-image3.png")
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 }),
);
await out(
  "public/images/stories/reine-givord.webp",
  sharp("/tmp/ailes-extract/elles-image6.png")
    .rotate()
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 82 }),
);

const emailSvg = (fill) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="28">
  <text x="0" y="20" font-family="Avenir Next, Segoe UI, Helvetica, Arial, sans-serif" font-size="15" font-weight="700" fill="${fill}">info2@aileslyonnaises.com</text>
</svg>`);

await out(
  "public/images/brand/email-on-light.webp",
  sharp(emailSvg("#031735")).png().webp({ lossless: true }),
);
await out(
  "public/images/brand/email-on-dark.webp",
  sharp(emailSvg("#ffffff")).png().webp({ lossless: true }),
);
