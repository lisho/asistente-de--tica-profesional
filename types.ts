
export enum Sender {
  USER = 'user',
  AI = 'ai',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
  avatar?: string; 
}

// For Gemini API history
export interface GeminiMessagePart {
    text: string;
}
  
export interface GeminiChatHistoryItem {
    role: 'user' | 'model';
    parts: GeminiMessagePart[];
}

export interface AppMetadata { // This refers to the metadata.json content
  name: string; // General app name
  description: string; // General app description
  requestFramePermissions: string[];
  prompt: string; // General prompt if any, specific prompts are per-assistant
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface Conversation {
  id: string;
  userName: string;
  assistantKey: string; // Using AssistantKey enum might be better if imported, using string for simplicity if types.ts is isolated
  title: string;
  messages: Message[];
  timestamp: Date; // Last updated or creation date
}
