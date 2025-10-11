// test.js - Quick test to verify Ollama connection
import { OllamaClient } from './utils/ollamaClient.js';

async function testOllama() {
  console.log('🧪 Testing Ollama connection with Llama 2 7B...\n');
  
  const client = new OllamaClient();
  
  try {
    const isHealthy = await client.checkHealth();
    
    if (!isHealthy) {
      console.log('\n❌ Ollama test failed!');
      console.log('💡 Start Ollama with: ollama serve');
      console.log('💡 Download model with: ollama pull llama2:7b\n');
      return;
    }

    console.log('\n🧪 Testing simple chat...');
    const response = await client.chat(
      'You are a helpful assistant.',
      'What is 2+2? Answer in one word.'
    );
    console.log('Response:', response);

    console.log('\n🧪 Testing JSON chat...');
    const jsonResponse = await client.chatWithJSON(
      'You are a data assistant.',
      'Return JSON with a greeting message. Format: {"message": "Hello"}'
    );
    console.log('JSON Response:', jsonResponse);

    console.log('\n✅ All tests passed! System is ready.\n');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n💡 Make sure Ollama is running: ollama serve\n');
  }
}

testOllama();
