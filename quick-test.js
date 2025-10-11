// quick-test.js - Generate HTML only (no PDF) for testing
import { CoordinatorAgent } from './agents/coordinatorAgent.js';
import { LayoutAgent } from './agents/layoutAgent.js';
import { DesignAgent } from './agents/designAgent.js';
import { OllamaClient } from './utils/ollamaClient.js';
import fs from 'fs';

async function quickTest() {
  console.log('🚀 Quick Test - HTML Generation Only\n');
  
  const ollama = new OllamaClient();
  const coordinator = new CoordinatorAgent();
  const layoutAgent = new LayoutAgent();
  const designAgent = new DesignAgent();

  // Load data
  const data = JSON.parse(fs.readFileSync('./data/weekly-offers.json', 'utf-8'));
  const products = data.products;
  const saleInfo = data.saleInfo;

  try {
    // Check Ollama
    const isHealthy = await ollama.checkHealth();
    if (!isHealthy) {
      throw new Error('Ollama not ready');
    }

    console.log('🤖 Analyzing offers...');
    const orchestration = await coordinator.orchestrate(products, 'weekly');

    console.log('📐 Creating layout...');
    const layout = await layoutAgent.generateLayout(products, orchestration.layoutPlan);
    const optimizedLayout = await layoutAgent.optimizeLayout(layout);

    console.log('🎨 Generating HTML...');
    const html = await designAgent.generateHTML(optimizedLayout, 'weekly', saleInfo);

    // Save HTML file
    const outputPath = './output/generated-flyers/test-flyer.html';
    if (!fs.existsSync('./output/generated-flyers')) {
      fs.mkdirSync('./output/generated-flyers', { recursive: true });
    }
    
    fs.writeFileSync(outputPath, html);
    
    console.log(`✅ HTML saved: ${outputPath}`);
    console.log('🌐 Open this file in your browser to see the flyer!');
    console.log(`📦 Generated flyer with ${products.length} products\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

quickTest();