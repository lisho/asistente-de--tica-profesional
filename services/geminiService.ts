import { GoogleGenAI, Chat } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants/appConfig';
import { GeminiChatHistoryItem } from "../types";
import { logApiUsage } from "./apiUsageTracker";

// API_KEYS check for Vite environment - Supports multiple keys separated by comma
const API_KEYS_RAW = import.meta.env.VITE_API_KEY || "";
const API_KEYS = API_KEYS_RAW.split(",").map(k => k.trim()).filter(k => k && k !== "YOUR_GEMINI_API_KEY_REPLACE_ME");

let currentKeyIndex = 0;

if (API_KEYS.length === 0) {
  console.warn(
    "API_KEY for Gemini is not configured. AI features will not work."
  );
}

// Function to get a fresh instance of the AI SDK with the current key
const getAiInstance = () => {
    return new GoogleGenAI({ apiKey: API_KEYS[currentKeyIndex] });
};

let ai = getAiInstance();

let chatInstance: Chat | null = null; // This chatInstance is per-session, but system instruction can change.

const initializeChat = (history: GeminiChatHistoryItem[] = [], systemInstruction: string): Chat => {
  // Filter out the last empty AI message if it exists, as it's a placeholder for streaming
  const filteredHistory = history.filter((item, index) => {
    if (index === history.length - 1 && item.role === 'model' && item.parts[0]?.text === '') {
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
  systemInstruction: string,
  assistantName: string // NEW PARAMETER
): AsyncGenerator<string, void, undefined> {
  if (API_KEYS.length === 0) {
    yield "Error: La clave API de Gemini no está configurada. No puedo procesar tu solicitud.";
    return;
  }

  // Attempt counter to avoid infinite loops if all keys are failing
  let attempts = 0;
  const maxAttempts = API_KEYS.length;

  while (attempts < maxAttempts) {
    try {
      // Pass history excluding the current user message, as sendMessage will add it.
      const chat = initializeChat(history.slice(0, -1), systemInstruction);

      const stream = await chat.sendMessageStream({ message: userMessage });
      
      let finalUsageMetadata: any = null;

      for await (const chunk of stream) {
        // Collect usage metadata if available (typically present on the final chunk)
        if (chunk.usageMetadata) {
          finalUsageMetadata = chunk.usageMetadata;
        }
        yield chunk.text || "";
      }
      
      // If we got here, it means success. Log usage and Break the try loop.
      if (finalUsageMetadata) {
        // Fire & Forget: Don't await it so we don't block the UI
        logApiUsage(
          assistantName,
          finalUsageMetadata.promptTokenCount || 0,
          finalUsageMetadata.candidatesTokenCount || 0,
          finalUsageMetadata.totalTokenCount || 0
        );
      } else {
        console.warn("No usage metadata received from Gemini.");
      }

      return; 

    } catch (error: any) {
      console.error(`Gemini API error (Key Index ${currentKeyIndex}):`, error);
      attempts++;

      // Check if it's an error that warrants a key switch
      const isQuotaError = error?.error?.code === 429 || error?.message?.toLowerCase().includes("quota") || error?.message?.toLowerCase().includes("exhausted");
      const isAuthError = error?.message?.toLowerCase().includes("api key") || error?.error?.code === 401;
      
      if ((isQuotaError || isAuthError) && attempts < maxAttempts) {
         // Rotate to the next key and recreate the AI instance
         currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
         ai = getAiInstance();
         console.warn(`Rotating to next API key (Index ${currentKeyIndex}) and retrying...`);
         continue; // Retry the while loop with the new key and instance
      }

      // If we shouldn't retry or we've run out of keys, yield the error message
      if (error?.error?.code === 503 || error?.error?.status === "UNAVAILABLE") {
        yield "Disculpa, en este momento no puedo acceder a mi base de conocimientos porque el servicio está sobrecargado. Espera unos minutos y pregúntame de nuevo, por favor.";
      } else if (error?.message?.includes("Incomplete JSON")) {
        yield "Vaya, se ha interrumpido mi conexión mientras procesaba tu consulta. ¿Podrías repetir tu pregunta? Esta vez debería funcionar.";
      } else if (isQuotaError) {
        yield "Me temo que hemos alcanzado el límite de todas las claves API disponibles por ahora. Por favor, contacta con el administrador del sistema.";
      } else if (isAuthError) {
        yield "Hay un problema con la configuración de las claves API. Por favor, contacta con el administrador del sistema.";
      } else if (error?.message?.includes("network") || error?.message?.includes("fetch")) {
        yield "Parece que no consigo conectarme. ¿Podrías verificar tu conexión a Internet?";
      } else {
        yield "Lo siento, he tenido un problema inesperado y no he podido procesar tu consulta. Inténtalo de nuevo más tarde.";
      }
      return; // Exit after yielding error
    }
  }
}
