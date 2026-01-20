import { GoogleGenAI, Chat } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants/appConfig';
import { GeminiChatHistoryItem } from "../types";

// API_KEY check for Vite environment
const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_REPLACE_ME") {
  console.warn(
    "API_KEY for Gemini is not configured. AI features will not work."
  );
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

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
  systemInstruction: string // New parameter for assistant-specific instructions
): AsyncGenerator<string, void, undefined> {
  if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_REPLACE_ME") {
    yield "Error: La clave API de Gemini no está configurada. No puedo procesar tu solicitud.";
    return;
  }

  try {
    // Initialize chat with the specific system instruction for this call.
    // Pass history excluding the current user message, as sendMessage will add it.
    const chat = initializeChat(history.slice(0, -1), systemInstruction);

    const stream = await chat.sendMessageStream({ message: userMessage });
    for await (const chunk of stream) {
      yield chunk.text || "";
    }
  } catch (error: any) {
    console.error("Gemini API error:", error);

    // Provide specific error messages based on the error type
    if (error?.error?.code === 503 || error?.error?.status === "UNAVAILABLE") {
      yield "Disculpa, en este momento no puedo acceder a mi base de conocimientos porque el servicio está sobrecargado. Espera unos minutos y pregúntame de nuevo, por favor. Te atenderé en cuanto pueda.";
    } else if (error?.message?.includes("Incomplete JSON")) {
      yield "Vaya, se ha interrumpido mi conexión mientras procesaba tu consulta. ¿Podrías repetir tu pregunta? Esta vez debería funcionar.";
    } else if (error?.error?.code === 429 || error?.message?.includes("quota")) {
      yield "Me temo que hemos alcanzado el límite de consultas por hoy. Tendrás que volver más tarde o contactar con el administrador del sistema.";
    } else if (error?.message?.includes("API key") || error?.error?.code === 401) {
      yield "Hay un problema con mi configuración que me impide responderte. Por favor, contacta con el administrador del sistema para que lo solucione.";
    } else if (error?.message?.includes("network") || error?.message?.includes("fetch")) {
      yield "Parece que no consigo conectarme. ¿Podrías verificar tu conexión a Internet? Cuando esté lista, estaré aquí para ayudarte.";
    } else {
      // Generic error message for unknown errors
      yield "Lo siento, he tenido un problema inesperado y no he podido procesar tu consulta. Inténtalo de nuevo más tarde, y si el problema persiste, avisa al administrador.";
    }
  }
}
