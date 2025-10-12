// scripts/generate-ppt.js - Generates a manager-ready PPT deck
import fs from 'fs';
import path from 'path';
import PptxGenJS from 'pptxgenjs';

function findLatestFlyerPng() {
  const dir = path.resolve('output/generated-flyers');
  if (!fs.existsSync(dir)) return null;
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.png'))
    .map((f) => ({ name: f, time: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a, b) => b.time - a.time);
  return files.length ? path.join(dir, files[0].name) : null;
}

function today() {
  const d = new Date();
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

async function generate() {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';

  const brandGreen = '2e7d32';
  const brandYellow = 'ffd54f';
  const brandBlack = '111111';

  // Title slide
  let slide = pptx.addSlide({ sectionTitle: 'Overview' });
  slide.background = { color: brandGreen };
  slide.addText('Grocery Flyer Generator', {
    x: 0.5, y: 1.3, w: 12, h: 1.2,
    fontFace: 'Arial Black', fontSize: 44, bold: true, color: 'FFFFFF', align: 'center'
  });
  slide.addText('STAR BAZAAR • Manager Brief', {
    x: 0.5, y: 2.4, w: 12, h: 0.6,
    fontFace: 'Arial', fontSize: 22, color: 'FFFFFF', align: 'center'
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 3.2, y: 3.1, w: 6.6, h: 0.6, fill: { color: brandYellow }, line: { color: brandBlack, width: 1.5 },
  });
  slide.addText(`Generated on ${today()}`, {
    x: 3.2, y: 3.1, w: 6.6, h: 0.6, fontFace: 'Arial Black', fontSize: 16, bold: true, color: brandBlack, align: 'center'
  });

  // Problem & Outcome slide
  slide = pptx.addSlide({ sectionTitle: 'Overview' });
  slide.addText('What this solves', { x: 0.5, y: 0.6, w: 12, h: 0.6, fontFace: 'Arial Black', fontSize: 28, bold: true });
  slide.addText(
    [
      { text: '\u2022 Create professional, on-brand weekly flyers in minutes.\n' },
      { text: '\u2022 Uses your product data and images; no AI “special offers”.\n' },
      { text: '\u2022 Exports print-ready PNGs with consistent layout & colors.\n' },
      { text: '\u2022 Reusable template: just swap weekly JSON data.' }
    ],
    { x: 0.8, y: 1.3, w: 10.8, h: 3, fontFace: 'Arial', fontSize: 20, lineSpacing: 24 }
  );

  // Architecture slide
  slide = pptx.addSlide({ sectionTitle: 'Architecture' });
  slide.addText('System Architecture', { x: 0.5, y: 0.6, w: 12, h: 0.6, fontFace: 'Arial Black', fontSize: 28, bold: true });
  slide.addText(
    [
      { text: 'Node.js services and agents:', options: { bold: true } },
      { text: '\n  • CoordinatorAgent – orchestrates flow' },
      { text: '\n  • DataParserAgent – parses raw text / JSON' },
      { text: '\n  • LayoutAgent – grid planning' },
      { text: '\n  • DesignAgent – Handlebars HTML/CSS generation' },
      { text: '\n  • ExportAgent – Puppeteer PNG export' },
      { text: '\nIntegrations: Handlebars, Puppeteer, optional LLM (Ollama) for structure.' }
    ],
    { x: 0.8, y: 1.2, w: 10.8, h: 3.2, fontFace: 'Arial', fontSize: 18, lineSpacing: 22 }
  );

  // Workflow slide
  slide = pptx.addSlide({ sectionTitle: 'Workflow' });
  slide.addText('Weekly Workflow', { x: 0.5, y: 0.6, w: 12, h: 0.6, fontFace: 'Arial Black', fontSize: 28, bold: true });
  slide.addText(
    [
      { text: '1. Provide data: data/weekly-offers.json (products + saleInfo)\n' },
      { text: '2. Run generator: node index.js data/weekly-offers.json\n' },
      { text: '3. Output: PNG in output/generated-flyers/\n' },
      { text: '4. Share with print / socials' }
    ],
    { x: 0.8, y: 1.3, w: 10.8, h: 2.2, fontFace: 'Arial', fontSize: 20, lineSpacing: 24 }
  );

  // Design principles slide
  slide = pptx.addSlide({ sectionTitle: 'Design' });
  slide.addText('Design Principles & Symmetry', { x: 0.5, y: 0.6, w: 12, h: 0.6, fontFace: 'Arial Black', fontSize: 28, bold: true });
  slide.addText(
    [
      { text: '\u2022 Clear visual hierarchy: header banner, grid cards, footer.\n' },
      { text: '\u2022 5-column grid with consistent gutters and aligned baselines.\n' },
      { text: '\u2022 Alternating price badges by column for rhythm & scannability.\n' },
      { text: '\u2022 Two-line name clamp for neat rows; bottom-aligned price/units.\n' },
      { text: '\u2022 Brand colors (green/yellow/black) and strong contrast.\n' },
      { text: '\u2022 Accessible sizes, large tap targets, bold typography.' }
    ],
    { x: 0.8, y: 1.3, w: 10.8, h: 3.2, fontFace: 'Arial', fontSize: 19, lineSpacing: 24 }
  );

  // Features slide
  slide = pptx.addSlide({ sectionTitle: 'Features' });
  slide.addText('Key Features', { x: 0.5, y: 0.6, w: 12, h: 0.6, fontFace: 'Arial Black', fontSize: 28, bold: true });
  slide.addText(
    [
      { text: '\u2022 PNG-only export for reliability on macOS.\n' },
      { text: '\u2022 Embedded logo and product images.\n' },
      { text: '\u2022 Weekly banner with single-line dates.\n' },
      { text: '\u2022 Footer: promo banner, contact bar, accept badge.\n' },
      { text: '\u2022 Simple inputs; reusable week to week.' }
    ],
    { x: 0.8, y: 1.3, w: 10.8, h: 2.8, fontFace: 'Arial', fontSize: 20, lineSpacing: 24 }
  );

  // Sample flyer slide
  const latestPng = findLatestFlyerPng();
  slide = pptx.addSlide({ sectionTitle: 'Sample' });
  slide.addText('Latest Flyer', { x: 0.5, y: 0.6, w: 12, h: 0.6, fontFace: 'Arial Black', fontSize: 28, bold: true });
  if (latestPng && fs.existsSync(latestPng)) {
    slide.addImage({ path: latestPng, x: 1.2, y: 1.2, w: 10.6, h: 6.0, rounding: 6 });
  } else {
    slide.addText('No flyer PNG found. Generate one first.', { x: 1.2, y: 1.6, w: 10.6, h: 1, fontSize: 22, color: 'AA0000' });
  }

  // Next steps slide
  slide = pptx.addSlide({ sectionTitle: 'Next' });
  slide.addText('Next Steps', { x: 0.5, y: 0.6, w: 12, h: 0.6, fontFace: 'Arial Black', fontSize: 28, bold: true });
  slide.addText(
    [
      { text: '\u2022 Add promo scheduling & version history.\n' },
      { text: '\u2022 Multi-language support.\n' },
      { text: '\u2022 Export presets for social sizes.\n' },
      { text: '\u2022 Optional price validation rules.' }
    ],
    { x: 0.8, y: 1.3, w: 10.8, h: 2.4, fontFace: 'Arial', fontSize: 20, lineSpacing: 24 }
  );

  // Contact slide
  slide = pptx.addSlide({ sectionTitle: 'Contact' });
  slide.background = { color: brandBlack };
  slide.addText('STAR BAZAAR', { x: 0.5, y: 1.3, w: 12, h: 0.8, fontFace: 'Arial Black', fontSize: 40, bold: true, color: 'FFFFFF', align: 'center' });
  slide.addText('2431 W Main St, Norristown, PA - 19403  •  starbazaarpa@gmail.com  •  484 986 0990', {
    x: 0.5, y: 2.2, w: 12, h: 0.6, fontFace: 'Arial', fontSize: 18, color: 'FFFFFF', align: 'center'
  });

  const outDir = path.resolve('output/presentations');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `Star-Bazaar-Flyer-Generator-${new Date().toISOString().split('T')[0]}.pptx`);
  await pptx.writeFile({ file });
  console.log(`✅ PPT created: ${file}`);
}

generate().catch((e) => {
  console.error('❌ Failed to generate PPT:', e);
  process.exit(1);
});
