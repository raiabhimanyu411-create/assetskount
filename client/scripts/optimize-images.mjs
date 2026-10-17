// Crops the photography out of the deck slides (their left half is a blank
// white text area) and writes web-optimised WebP files to public/assets/photos.
// Run with: npm run images
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const source = new URL("../public/assets/deck/", import.meta.url);
const output = new URL("../public/assets/photos/", import.meta.url);

const photos = [
  { file: "image13.jpg", name: "tablet-review" },
  { file: "image14.jpg", name: "shelf-check" },
  { file: "image15.jpg", name: "counter-scan" },
  { file: "image16.jpg", name: "laptop-review" },
  { file: "image17.jpg", name: "team-planning" },
  { file: "image18.jpg", name: "client-meeting" },
];

// Finds the first column (from the left) that is clearly part of the photo.
async function findPhotoEdge(path) {
  const { data, info } = await sharp(path).greyscale().raw().toBuffer({ resolveWithObject: true });
  for (let x = 0; x < info.width; x += 1) {
    let sum = 0;
    for (let y = 0; y < info.height; y += 1) sum += data[y * info.width + x];
    if (sum / info.height < 200) return x;
  }
  return 0;
}

await mkdir(output, { recursive: true });

for (const { file, name } of photos) {
  const path = fileURLToPath(new URL(file, source));
  const { width, height } = await sharp(path).metadata();
  const left = await findPhotoEdge(path);
  const cropWidth = width - left;

  const target = (suffix) => fileURLToPath(new URL(`${name}${suffix}.webp`, output));

  await sharp(path)
    .extract({ left, top: 0, width: cropWidth, height })
    .webp({ quality: 80 })
    .toFile(target(""));

  await sharp(path)
    .extract({ left, top: 0, width: cropWidth, height })
    .resize({ width: 480 })
    .webp({ quality: 74 })
    .toFile(target("-sm"));

  // The uncropped frame is kept for full-bleed layouts that fade the left side.
  await sharp(path).webp({ quality: 80 }).toFile(target("-wide"));

  console.log(`${name}: ${cropWidth}x${height} (cropped ${left}px)`);
}
