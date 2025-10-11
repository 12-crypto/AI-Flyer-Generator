// simple-test.js - Test new design with logo
import { DesignAgent } from './agents/designAgent.js';
import fs from 'fs';

async function simpleTest() {
  console.log('🎨 Testing new design with Star Bazaar logo...\n');
  
  const designAgent = new DesignAgent();

  // Load data
  const data = JSON.parse(fs.readFileSync('./data/weekly-offers.json', 'utf-8'));
  const products = data.products;
  const saleInfo = data.saleInfo;

  // Create simple layout
  const layout = {
    products: products,
    grid: { columns: 5, rows: Math.ceil(products.length / 5) },
    colorScheme: { primary: '#FFD700', secondary: '#000000' }
  };

  try {
    console.log('🎨 Generating HTML with new design...');
    const html = await designAgent.generateHTML(layout, 'weekly', saleInfo);

    // Save HTML file
    const outputPath = './output/generated-flyers/new-design-test.html';
    if (!fs.existsSync('./output/generated-flyers')) {
      fs.mkdirSync('./output/generated-flyers', { recursive: true });
    }
    
    fs.writeFileSync(outputPath, html);
    
    console.log(`✅ HTML saved: ${outputPath}`);
    console.log('🌐 Open this file in your browser to see the new design!');
    console.log(`📦 Generated flyer with ${products.length} products`);
    console.log('✨ Features: Star Bazaar logo, alternating price colors, beautiful header\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

simpleTest();