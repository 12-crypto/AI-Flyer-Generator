// agents/dataParserAgent.js
import { OllamaClient } from '../utils/ollamaClient.js';

export class DataParserAgent {
  constructor() {
    this.ollama = new OllamaClient();
    this.name = 'DataParser';
  }

  async parseOfferText(rawText) {
    console.log('📝 Data Parser Agent: Processing offer text...');
    
    const systemPrompt = 'You are a data extraction AI agent. Parse text into structured JSON. Be precise and extract all products.';
    
    const userPrompt = `Parse this grocery store offer text into structured JSON:

${rawText}

Extract for each product:
- name (full product name)
- price (as written, e.g., "$33.99" or "2 for $25")
- unit (e.g., "40LB", "10LB", "F.P", "each")
- specialOffer (true if bundle/discount like "2 for $X")
- offerType ("regular", "bundle", or "discount")
- category (rice, bread, frozen, snacks, oils, lentils, spices, etc.)

Respond with JSON:
{
  "products": [
    {
      "name": "Product Name",
      "price": "$X.XX",
      "unit": "UNIT",
      "specialOffer": true/false,
      "offerType": "type",
      "category": "category"
    }
  ]
}`;

    try {
      const result = await this.ollama.chatWithJSON(systemPrompt, userPrompt);
      const products = result.products || result.items || [];
      
      console.log(`✅ Data Parser: Extracted ${products.length} products`);
      return this.validateOfferData(products);
    } catch (error) {
      console.error('❌ Data Parser Error:', error.message);
      return this.fallbackParse(rawText);
    }
  }

  fallbackParse(rawText) {
    console.log('⚠️  Using fallback parser...');
    const lines = rawText.split('\n').filter(line => line.trim());
    const products = [];

    for (const line of lines) {
      const priceMatch = line.match(/\$[\d.]+/);
      if (priceMatch) {
        const parts = line.split(priceMatch[0]);
        const name = parts[0].trim();
        const price = priceMatch[0];
        const rest = parts[1] || '';
        
        products.push({
          name: name || 'Product',
          price: price,
          unit: rest.trim() || '',
          specialOffer: line.includes('for $') || line.includes('2 for'),
          offerType: line.includes('for $') ? 'bundle' : 'regular',
          category: 'general'
        });
      }
    }

    console.log(`✅ Fallback parser: Extracted ${products.length} products`);
    return products;
  }

  validateOfferData(products) {
    return products.map(product => ({
      name: product.name || 'Unknown Product',
      price: product.price || 'N/A',
      unit: product.unit || '',
      specialOffer: product.specialOffer || false,
      offerType: product.offerType || 'regular',
      category: product.category || 'general',
      image: product.image || null // Support for product images
    }));
  }
}
