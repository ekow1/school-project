import { ChatOpenAI } from "@langchain/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";

dotenv.config();
process.env.OPENAI_API_KEY = process.env.OPEN_ROUTER; // 👈 this is the fix

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPEN_ROUTER,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  modelName: "mistralai/mistral-7b-instruct",
  temperature: 0.7,
  maxTokens: 1000,
});

export async function getLLMResponse(inputText, conversationHistory = []) {
  try {
    // Debug: Log the conversation history
    console.log('🔍 Conversation History Debug:');
    console.log('📊 Total messages:', conversationHistory.length);
    conversationHistory.forEach((msg, index) => {
      console.log(`📝 Message ${index + 1}:`, {
        id: msg.id,
        prompt: msg.prompt?.substring(0, 50) + '...',
        response: msg.response?.substring(0, 50) + '...',
        hasResponse: !!(msg.response && msg.response.trim() !== '')
      });
    });
    
    // Create conversation context
    let contextPrompt = `You are a helpful fire safety assistant. You provide expert advice on fire prevention, safety procedures, and emergency response. Always stay focused on fire safety topics and provide practical, actionable advice.\n\n`;
    
    if (conversationHistory.length > 0) {
      contextPrompt += `Previous conversation:\n`;
      conversationHistory.forEach(msg => {
        // Only include messages with actual responses (not empty ones or error messages)
        if (msg.response && msg.response.trim() !== '' && !msg.response.includes('trouble processing')) {
          contextPrompt += `Human: ${msg.prompt}\nAssistant: ${msg.response}\n\n`;
        }
      });
    }
    
    contextPrompt += `Current question: ${inputText}\n\nPlease provide a helpful fire safety response:`;
    
    console.log('🔍 Final Context Prompt Length:', contextPrompt.length);
    console.log('🔍 Context Preview:', contextPrompt.substring(0, 200) + '...');
    
    const prompt = PromptTemplate.fromTemplate("{input}");
    const chain = new LLMChain({ llm: model, prompt });
    console.log('🔍 About to call AI service...');
    const response = await chain.call({ input: contextPrompt });
    console.log('🔍 AI Response received:', !!response);
    console.log('🔍 Response text length:', response?.text?.length || 0);
    
    // Ensure we have a valid response
    if (!response.text || response.text.trim() === '') {
      throw new Error('Empty response from AI service');
    }
    
    return response.text;
  } catch (error) {
    console.error('🚨 LLM Error Details:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error type:', error.constructor.name);
    console.error('Environment check - OPEN_ROUTER exists:', !!process.env.OPEN_ROUTER);
    console.error('Environment check - OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
    
    // Return a fallback response instead of throwing
    return `I apologize, but I'm having trouble processing your request right now. Please try again. If the problem persists, please rephrase your question about fire safety.`;
  }
}
