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
});

export async function getLLMResponse(inputText, conversationHistory = []) {
  try {
    // Create conversation context
    let contextPrompt = `You are a helpful fire safety assistant. You provide expert advice on fire prevention, safety procedures, and emergency response.`;
    
    if (conversationHistory.length > 0) {
      contextPrompt += `\n\nPrevious conversation:\n`;
      conversationHistory.forEach(msg => {
        // Only include messages with actual responses (not empty ones)
        if (msg.response && msg.response.trim() !== '') {
          contextPrompt += `Human: ${msg.prompt}\nAssistant: ${msg.response}\n\n`;
        }
      });
    }
    
    contextPrompt += `\nCurrent question: ${inputText}`;
    
    const prompt = PromptTemplate.fromTemplate("{input}");
    const chain = new LLMChain({ llm: model, prompt });
    const response = await chain.call({ input: contextPrompt });
    
    // Ensure we have a valid response
    if (!response.text || response.text.trim() === '') {
      throw new Error('Empty response from AI service');
    }
    
    return response.text;
  } catch (error) {
    console.error('LLM Error:', error);
    // Return a fallback response instead of throwing
    return `I apologize, but I'm having trouble processing your request right now. Please try again. If the problem persists, please rephrase your question about fire safety.`;
  }
}
