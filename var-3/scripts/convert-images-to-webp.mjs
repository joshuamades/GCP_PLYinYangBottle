import fs from "fs";
import path from "path";
import sharp from "sharp";

const IMAGE_ROOT = path.resolve("public/assets/images");
const SKIPPED_IMAGES = new Set([
  "BgVar3.png",
]);

const QUALITY_RULES = [
  { pattern: /BgVar1Var2\.png$/i, quality: 62, alphaQuality: 85 },
  { pattern: /AppIcon\.png$/i, quality: 72, alphaQuality: 90 },
  { pattern: /YingYangBottle\.png$/i, quality: 78, alphaQuality: 92 },
  { pattern: /Liquids[\\/]/i, quality: 78, alphaQuality: 92 },
];

async function convertImagesToWebp(root) {
  if (!fs.existsSync(root)) {
    throw new Error(`Image folder not found: ${root}`);
  }

  const files = listPngFiles(root);
  let converted = 0;
  let savedBytes = 0;

  for (const filePath of files) {
    const relativePath = path.relative(root, filePath).replace(/\\/g, "/");
    const fileName = path.basename(filePath);

    if (SKIPPED_IMAGES.has(fileName)) {
      console.log(`Skipped unused image: ${relativePath}`);
      continue;
    }

    const outputPath = filePath.replace(/\.png$/i, ".webp");
    const inputSize = fs.statSync(filePath).size;
    const options = getWebpOptions(relativePath);

    await sharp(filePath)
      .webp({
        quality: options.quality,
        alphaQuality: options.alphaQuality,
        effort: 6,
      })
      .toFile(outputPath);

    const outputSize = fs.statSync(outputPath).size;
    converted += 1;
    savedBytes += Math.max(inputSize - outputSize, 0);

    console.log(
      `Converted ${relativePath}: ${formatBytes(inputSize)} -> ${formatBytes(outputSize)}`,
    );
  }

  console.log(
    `Converted ${converted} PNG files. Estimated source savings: ${formatBytes(savedBytes)}.`,
  );
}

function listPngFiles(root) {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      files.push(...listPngFiles(fullPath));
      continue;
    }

    if (entry.isFile() && /\.png$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function getWebpOptions(relativePath) {
  const match = QUALITY_RULES.find(({ pattern }) => pattern.test(relativePath));

  return {
    quality: match?.quality ?? 80,
    alphaQuality: match?.alphaQuality ?? 92,
  };
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

convertImagesToWebp(IMAGE_ROOT).catch((error) => {
  console.error(error);
  process.exit(1);
});
