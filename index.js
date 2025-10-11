// index.js - Main application with JSON input support
import { CoordinatorAgent } from './agents/coordinatorAgent.js';
import { DataParserAgent } from './agents/dataParserAgent.js';
import { LayoutAgent } from './agents/layoutAgent.js';
import { DesignAgent } from './agents/designAgent.js';
import { ExportAgent } from './agents/exportAgent.js';
import { OllamaClient } from './utils/ollamaClient.js';
import fs from 'fs';
import path from 'path';

class FlyerGeneratorSystem {
  constructor() {
    this.ollama = new OllamaClient();
    this.coordinator = new CoordinatorAgent();
    this.dataParser = new DataParserAgent();
    this.layoutAgent = new LayoutAgent();
    this.designAgent = new DesignAgent();
    this.exportAgent = new ExportAgent();
  }

  async initialize() {
    console.log('\n🚀 Initializing Flyer Generator (M3 Mac + Llama 2 7B)...\n');
    
    const isHealthy = await this.ollama.checkHealth();
    if (!isHealthy) {
      throw new Error('Ollama is not ready. Start with: ollama serve');
    }
    
    console.log('✅ System ready on MacBook Air M3!\n');
  }

  loadFromJSON(filePath) {
    console.log(`📂 Loading offers from: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    console.log(`✅ Loaded ${data.products?.length || 0} products from JSON\n`);
    return data;
  }

  async generateFromJSON(jsonFilePath) {
    const data = this.loadFromJSON(jsonFilePath);
    
    const products = data.products || [];
    const saleInfo = data.saleInfo || {};
    const templateType = saleInfo.templateType || 'weekly';
    
    return await this.generateFlyer(products, templateType, saleInfo);
  }

  async generateFromText(rawOfferText, templateType = 'weekly', saleInfo = {}) {
    console.log('📝 Parsing raw text offers...\n');
    
    const products = await this.dataParser.parseOfferText(rawOfferText);
    return await this.generateFlyer(products, templateType, saleInfo);
  }

  async generateFlyer(products, templateType = 'weekly', saleInfo = {}) {
    console.log('📋 Starting flyer generation...\n');

    try {
      await this.initialize();

      console.log('🤖 Step 1: Analyzing offers...');
      const orchestration = await this.coordinator.orchestrate(products, templateType);

      console.log('📐 Step 2: Creating layout...');
      const layout = await this.layoutAgent.generateLayout(
        products,
        orchestration.layoutPlan
      );
      const optimizedLayout = await this.layoutAgent.optimizeLayout(layout);

      console.log('🎨 Step 3: Generating design...');
      const html = await this.designAgent.generateHTML(optimizedLayout, templateType, saleInfo);

      console.log('💾 Step 4: Exporting PNG...\n');
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `flyer-${templateType}-${timestamp}`;
      
      const pngPath = await this.exportAgent.exportPNGOnly(html, filename);

      console.log('\n✅ Flyer generation complete!');
      console.log(`🖼️  PNG: ${pngPath}`);
      console.log(`📦 Products: ${products.length}\n`);

      return {
        success: true,
        pngPath,
        productCount: products.length,
        orchestration
      };
    } catch (error) {
      console.error('\n❌ Flyer generation failed:', error.message);
      throw error;
    }
  }

  listJSONFiles() {
    const dataDir = './data';
    if (!fs.existsSync(dataDir)) {
      console.log('⚠️  Data directory not found. Creating it...');
      fs.mkdirSync(dataDir, { recursive: true });
      return [];
    }

    const files = fs.readdirSync(dataDir)
      .filter(file => file.endsWith('.json'))
      .map(file => path.join(dataDir, file));

    return files;
  }
}

// Command Line Interface
const args = process.argv.slice(2);
const system = new FlyerGeneratorSystem();

async function main() {
  if (args.length === 0) {
    console.log('\n📋 Flyer Generator - M3 Mac + Llama 2 7B');
    console.log('='.repeat(50));
    console.log('\nUsage:');
    console.log('  node index.js <json-file>         Generate from JSON file');
    console.log('  node index.js --list              List available JSON files');
    console.log('  node index.js --example           Run example generation');
    console.log('\nExamples:');
    console.log('  node index.js data/weekly-offers.json');
    console.log('  node index.js data/diwali-sale.json');
    console.log('\n');
    return;
  }

  const command = args[0];

  try {
    if (command === '--list') {
      console.log('\n📁 Available JSON files:\n');
      const files = system.listJSONFiles();
      
      if (files.length === 0) {
        console.log('  No JSON files found in ./data directory');
        console.log('  Create a JSON file with your offers first!\n');
      } else {
        files.forEach((file, index) => {
          console.log(`  ${index + 1}. ${file}`);
        });
        console.log('\n');
      }
      return;
    }

    if (command === '--example') {
      console.log('\n🧪 Running example generation...\n');
      
      const exampleOffers = `
Laxmi sonamasoori 40lb $33.99
Deep tandoori naan f.p $6.99 
Laxmi basmati rice 10lb 2 for $25 
Frooti 27 x 200ml pack $12.99 
Maggi 560gm 2 for $7 
Parliament atta 20lb $12.99 
Brio sunflower oil 5lt $15.99 
      `.trim();

      const result = await system.generateFromText(exampleOffers, 'weekly', {
        storeName: 'STAR BAZAAR',
        dateRange: 'OCTOBER 10 TO OCTOBER 17',
        address: '2431 W Main St, Norristown, PA - 19403',
        email: 'starbazaarpa@gmail.com',
        phone: '484 986 0990'
      });

      console.log('✨ Example generation complete!');
      return;
    }

    if (command.endsWith('.json')) {
      const result = await system.generateFromJSON(command);
      console.log('✨ Generation successful!');
      return;
    }

    console.log('\n❌ Invalid command.\n');

  } catch (error) {
    console.error('\n💥 Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  1. Make sure Ollama is running: ollama serve');
    console.error('  2. Check if llama2:7b is installed: ollama list');
    console.error('  3. Pull the model if needed: ollama pull llama2:7b\n');
    process.exit(1);
  }
}

main();
