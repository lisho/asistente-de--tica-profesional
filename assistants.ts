import { 
  EULOGIO_AVATAR_URL,
  PEPI_AVATAR_URL
} from './constants/appConfig';
import { 
  ABOUT_EULOGIO_CONTENT,
  ABOUT_PEPI_CONTENT
} from './constants/modalContent';
import {
  EULOGIO_SYSTEM_INSTRUCTION,
  PEPI_SYSTEM_INSTRUCTION
} from './constants/systemInstructions';
import { AboutModalContent } from './components/AboutModal'; 

export enum AssistantKey {
  EULOGIO = 'eulogio',
  PEPI = 'pepi',
}

export interface AssistantTheme {
  // Colors
  primaryBg: string;
  primaryText: string;
  secondaryBg: string; // AI message bubble
  secondaryText: string;
  accentBg: string; // User message bubble, buttons
  accentText: string;
  accentHoverBg: string;
  iconColor: string;
  iconHoverColor: string;
  // Details
  avatarUrl: string;
  name: string;
  tagline: string;
  systemInstruction: string;
  aboutContent: AboutModalContent;
  initialGreeting: (userName: string) => string;
  appTitle: string;
  appDescription: string;
}

export const ASSISTANT_REGISTRY: Record<AssistantKey, AssistantTheme> = {
  [AssistantKey.EULOGIO]: {
    primaryBg: 'bg-[#7A8D9B]',      // Custom hex for Eulogio's base: cool, desaturated blue-grey
    primaryText: 'text-white',      // White text for good contrast
    secondaryBg: 'bg-slate-200',    // Light grey for AI bubbles (maintains readability)
    secondaryText: 'text-slate-800', // Dark text on light AI bubble
    accentBg: 'bg-slate-600',       // Darker slate for user bubbles & accents, related to primary
    accentText: 'text-white',
    accentHoverBg: 'hover:bg-slate-700',// Slightly darker for hover
    iconColor: 'text-slate-300',    // Lighter grey icons on the primaryBg
    iconHoverColor: 'hover:text-white', // White for icon hover
    avatarUrl: EULOGIO_AVATAR_URL,
    name: 'Eulogio',
    tagline: 'Tu Asistente de Trabajo Social',
    systemInstruction: EULOGIO_SYSTEM_INSTRUCTION,
    aboutContent: ABOUT_EULOGIO_CONTENT,
    initialGreeting: (userName: string) => `Hola ${userName}. Soy Eulogio. Llevo muchos años en esto del Trabajo Social y la ética profesional en España. Pregunta lo que necesites, pero vayamos al grano. ¿En qué puedo ilustrarte hoy?`,
    appTitle: "Eulogio: Asistente de Trabajo Social",
    appDescription: "Un asistente de IA experto en trabajo social, deontología y ética profesional, basado en el conocimiento de la práctica en España. Eulogio te ayudará a navegar complejos escenarios éticos y deontológicos en el ámbito del trabajo social.",
  },
  [AssistantKey.PEPI]: {
    primaryBg: 'bg-[#EED0C6]',       // Custom hex for Clara's base: very light, warm, peachy-pink pastel
    primaryText: 'text-rose-900',    // Dark, warm reddish-brown for contrast on light pastel
    secondaryBg: 'bg-rose-50',       // Very light, complementary pinkish tone for AI messages
    secondaryText: 'text-rose-700',   // Readable dark rose on light AI bubble
    accentBg: 'bg-[#D8BFD8]',         // New: Thistle - a pale greyish violet / pastel lavender
    accentText: 'text-slate-800',    // New: Dark text for contrast on the new light accentBg
    accentHoverBg: 'hover:bg-[#C9AEC9]',// New: Slightly darker thistle for hover
    iconColor: 'text-rose-700',      // Matches secondaryText, visible on primaryBg
    iconHoverColor: 'hover:text-rose-900', // Darker for icon hover
    avatarUrl: PEPI_AVATAR_URL,
    name: 'Pepi',
    tagline: 'Tu Asistente de Bienestar Social',
    systemInstruction: PEPI_SYSTEM_INSTRUCTION,
    aboutContent: ABOUT_PEPI_CONTENT,
    initialGreeting: (userName: string) => `¡Hola, ${userName}, corazón! Soy Pepi, ¡qué alegría tenerte aquí! Estoy lista para ayudarte con tus dudas sobre ética y bienestar social con todo mi cariño y apoyo. ¿En qué puedo ser tu guía hoy?`,
    appTitle: "Pepi: Asistente de Bienestar Social",
    appDescription: "Una asistente IA especializada en bienestar social y ética profesional en España. Pepi te ofrece apoyo y orientación con un enfoque claro y empático.",
  }
};

// Helper to get the default assistant if none is selected or found
export const getDefaultAssistantKey = (): AssistantKey => AssistantKey.EULOGIO;
export const getDefaultAssistantTheme = (): AssistantTheme => ASSISTANT_REGISTRY[getDefaultAssistantKey()];
