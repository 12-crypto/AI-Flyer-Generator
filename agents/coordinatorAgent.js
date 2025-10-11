// agents/coordinatorAgent.js
import { OllamaClient } from '../utils/ollamaClient.js';

export class CoordinatorAgent {
  constructor() {
    this.ollama = new OllamaClient();
    this.name = 'Coordinator';
  }

  async orchestrate(offerData, templateType = 'weekly') {
    console.log('🤖 Coordinator Agent: Starting flyer generation...');
    
    try {
      const analysis = await this.analyzeOffers(offerData);
      const layoutPlan = await this.planLayout(analysis, templateType);
      
      return {
        success: true,
        analysis,
        layoutPlan,
        templateType,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Coordinator Error:', error.message);
      throw error;
    }
  }

  async analyzeOffers(offerData) {
    const systemPrompt = 'You are a retail marketing expert AI agent. Analyze grocery offers and respond with valid JSON only.';
    
    const userPrompt = `Analyze these grocery offers and categorize them:

${JSON.stringify(offerData, null, 2)}

Tasks:
1. Group by category (rice, bread, frozen, snacks, oils, lentils, etc.)
2. Identify best deals (biggest discounts, bundle offers like "2 for $X")
3. Suggest 3-5 products that should be featured prominently
4. Count total products
5. Find special promotions

Respond with JSON:
{
  "categories": {"category_name": ["product1", "product2"]},
  "featuredProducts": ["product_name1", "product_name2"],
  "totalCount": number,
  "specialPromotions": ["promotion1", "promotion2"]
}`;

    try {
      const analysis = await this.ollama.chatWithJSON(systemPrompt, userPrompt);
      console.log(`✅ Analysis complete: ${analysis.totalCount || offerData.length} products`);
      return analysis;
    } catch (error) {
      console.error('⚠️  Analysis failed, using fallback');
      return {
        categories: { general: offerData.map(p => p.name) },
        featuredProducts: offerData.slice(0, 3).map(p => p.name),
        totalCount: offerData.length,
        specialPromotions: []
      };
    }
  }

  async planLayout(analysis, templateType) {
    const systemPrompt = 'You are a graphic design expert AI agent. Create layout plans and respond with valid JSON only.';
    
    const userPrompt = `Create a layout plan for a grocery flyer:

Analysis: ${JSON.stringify(analysis, null, 2)}
Template: ${templateType}

Design a layout with:
1. Grid structure (5 columns is standard)
2. Featured product positions (which should be in top row)
3. Color scheme (primary and secondary colors)
4. Typography hierarchy
5. Section organization

Respond with JSON:
{
  "grid": {"columns": 5, "rows": number},
  "featuredProducts": ["product_name1"],
  "colorScheme": {"primary": "#FFD700", "secondary": "#000000"},
  "typography": {"featured": "28px", "regular": "16px"},
  "sections": ["section1", "section2"]
}`;

    try {
      const layoutPlan = await this.ollama.chatWithJSON(systemPrompt, userPrompt);
      console.log('✅ Layout plan created');
      return layoutPlan;
    } catch (error) {
      console.error('⚠️  Layout planning failed, using fallback');
      return {
        grid: { columns: 5, rows: Math.ceil(analysis.totalCount / 5) },
        featuredProducts: analysis.featuredProducts || [],
        colorScheme: { primary: '#FFD700', secondary: '#000000' },
        typography: { featured: '28px', regular: '16px' },
        sections: Object.keys(analysis.categories || {})
      };
    }
  }
}
