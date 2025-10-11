// agents/exportAgent.js
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export class ExportAgent {
  constructor() {
    this.name = 'Export';
    this.outputDir = './output/generated-flyers';
  }

  async exportToPDF(html, filename) {
    console.log('💾 Export Agent: Generating PDF...');

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfPath = path.join(this.outputDir, `${filename}.pdf`);
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      });

      console.log(`✅ PDF saved: ${pdfPath}`);
      return pdfPath;
    } finally {
      await browser.close();
    }
  }

  async exportToPNG(html, filename) {
    console.log('🖼️  Export Agent: Generating PNG...');

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    try {
      const page = await browser.newPage();
  await page.emulateMediaType('screen');
      await page.setViewport({ width: 1200, height: 1600 });
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pngPath = path.join(this.outputDir, `${filename}.png`);
      await page.screenshot({
        path: pngPath,
        fullPage: true
      });

      console.log(`✅ PNG saved: ${pngPath}`);
      return pngPath;
    } finally {
      await browser.close();
    }
  }

  async exportPNGOnly(html, filename) {
    console.log('🖼️  Export Agent: Generating PNG only...');

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    try {
      const page = await browser.newPage();
      await page.emulateMediaType('screen');
      await page.setViewport({ width: 1200, height: 1600 });
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pngPath = path.join(this.outputDir, `${filename}.png`);
      await page.screenshot({
        path: pngPath,
        fullPage: true
      });

      console.log(`✅ PNG saved: ${pngPath}`);
      return pngPath;
    } finally {
      await browser.close();
    }
  }
}
