// utils/ollamaClient.js
import ollama from 'ollama';
import dotenv from 'dotenv';

dotenv.config();

export class OllamaClient {
  constructor() {
    this.host = process.env.OLLAMA_HOST || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama2:7b';
    console.log(`🦙 Ollama Client initialized: ${this.model} @ ${this.host}`);
  }

  async chat(systemPrompt, userPrompt, options = {}) {
    try {
      const response = await ollama.chat({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        stream: false,
        options: {
          temperature: options.temperature || 0.3,
          num_predict: options.maxTokens || 2000,
          ...options
        }
      });

      return response.message.content;
    } catch (error) {
      console.error('❌ Ollama Chat Error:', error.message);
      throw new Error(`Ollama chat failed: ${error.message}`);
    }
  }

  async chatWithJSON(systemPrompt, userPrompt, options = {}) {
    try {
      const enhancedSystem = `${systemPrompt}\n\nIMPORTANT: You MUST respond with valid JSON only. No markdown, no code blocks, no explanations. Just pure JSON.`;
      
      const response = await ollama.chat({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: enhancedSystem
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        stream: false,
        format: 'json',
        options: {
          temperature: options.temperature || 0.2,
          num_predict: options.maxTokens || 2000,
          ...options
        }
      });

      const content = response.message.content;
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        // Try to extract JSON from markdown code blocks
        const jsonMatch = content.match(/``````/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1]);
        }
        
        // Try to find JSON object directly
        const objectMatch = content.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          return JSON.parse(objectMatch[0]);
        }
        
        throw new Error('Could not extract valid JSON from response');
      }
    } catch (error) {
      console.error('❌ Ollama JSON Chat Error:', error.message);
      throw error;
    }
  }

  async checkHealth() {
    try {
      const models = await ollama.list();
      console.log(`✅ Ollama is running. Available models: ${models.models.length}`);
      
      const modelBase = this.model.split(':')[0];
      const hasModel = models.models.some(m => m.name.includes(modelBase));
      
      if (!hasModel) {
        console.warn(`⚠️  Model '${this.model}' not found.`);
        console.log(`💡 Download it with: ollama pull ${this.model}`);
        return false;
      }
      
      console.log(`✅ Model '${this.model}' is ready!`);
      return true;
    } catch (error) {
      console.error('❌ Ollama health check failed:', error.message);
      console.log('💡 Make sure Ollama is running. Start it with: ollama serve');
      return false;
    }
  }
}
