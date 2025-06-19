import { GoogleGenAI, Chat } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants/appConfig';
import { GeminiChatHistoryItem } from "../types";

// API_KEY check remains the same
if (!process.env.API_KEY || process.env.API_KEY === "YOUR_GEMINI_API_KEY_REPLACE_ME") {
  console.warn(
    "API_KEY for Gemini is not configured. AI features will not work."
  );
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! }); 

let chatInstance: Chat | null = null; // This chatInstance is per-session, but system instruction can change.

const initializeChat = (history: GeminiChatHistoryItem[] = [], systemInstruction: string): Chat => {
    // Filter out the last empty AI message if it exists, as it's a placeholder for streaming
    const filteredHistory = history.filter((item, index) => {
      if (index === history.length -1 && item.role === 'model' && item.parts[0]?.text === '') {
        return false;
      }
      return true;
    });

  chatInstance = ai.chats.create({
    model: GEMINI_MODEL_NAME,
    config: {
      systemInstruction: systemInstruction, // Use passed systemInstruction
    },
    history: filteredHistory, 
  });
  return chatInstance;
};


export async function* getAssistantResponseStream(
  userMessage: string,
  history: GeminiChatHistoryItem[],
  systemInstruction: string // New parameter for assistant-specific instructions
): AsyncGenerator<string, void, undefined> {
  if (!process.env.API_KEY || process.env.API_KEY === "YOUR_GEMINI_API_KEY_REPLACE_ME") {
    yield "Error: La clave API de Gemini no está configurada. No puedo procesar tu solicitud.";
    return;
  }
  
  try {
    // Initialize chat with the specific system instruction for this call.
    // Pass history excluding the current user message, as sendMessage will add it.
    const chat = initializeChat(history.slice(0, -1), systemInstruction); 

    const stream = await chat.sendMessageStream({ message: userMessage });
    for await (const chunk of stream) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    // It's good practice to check the type of error and provide more specific messages
    // For example, if (error instanceof GoogleGenAIError) { ... }
    // For now, a generic message:
    yield "Lo siento, he tenido un problema al conectar con mis servicios de inteligencia. Por favor, inténtalo más tarde.";
  }
}
