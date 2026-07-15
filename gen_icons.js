const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'imagen_2026-07-15_001254054.svg');
const svg = fs.readFileSync(svgPath);

const sizes = [192, 512];

async function gen() {
  for (const size of sizes) {
    const bg = Buffer.from(
      '<svg width="' + size + '" height="' + size + '" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="' + size + '" height="' + size + '" fill="#0f1117"/></svg>'
    );

    const svgResized = await sharp(svg).resize(size, size).png().toBuffer();
    await sharp(bg)
      .composite([{ input: svgResized, top: 0, left: 0 }])
      .png()
      .toFile(path.join(__dirname, 'icon-' + size + '.png'));

    console.log('icon-' + size + '.png generado');
  }
}

gen().catch(e => console.error(e));
