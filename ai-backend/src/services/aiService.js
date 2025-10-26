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

export async function getLLMResponse(inputText) {
  try {
    const prompt = PromptTemplate.fromTemplate("{input}");
    const chain = new LLMChain({ llm: model, prompt });
    const response = await chain.call({ input: inputText });
    return response.text;
  } catch (error) {
    console.error('LLM Error:', error);
    throw error;
  }
}
