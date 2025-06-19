
import React, { useState, useEffect, useRef } from 'react';
import { AssistantTheme } from '../assistants';

// START: Type definitions for Web Speech API
// Minimal interfaces to satisfy the compiler if global types are not available/found.

// Defines the structure for a single recognized speech alternative
interface ISpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

// Defines the structure for a single speech recognition result, which can contain multiple alternatives
interface ISpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number; // Number of alternatives
  item(index: number): ISpeechRecognitionAlternative; // Access an alternative by index
  [index: number]: ISpeechRecognitionAlternative; // Allow array-like access to alternatives
}

// Defines a list of speech recognition results
interface ISpeechRecognitionResultList {
  readonly length: number; // Number of results
  item(index: number): ISpeechRecognitionResult; // Access a result by index
  [index: number]: ISpeechRecognitionResult; // Allow array-like access to results
}

// Defines the event object for 'result' events from the SpeechRecognition API
interface CustomSpeechRecognitionEvent extends Event {
  readonly resultIndex: number; // Index of the current result in the results list
  readonly results: ISpeechRecognitionResultList; // The list of all results so far
  // readonly emma?: any; // For EMMA annotations, if used
  // readonly interpretation?: any; // For EMMA annotations, if used
}

// Defines the possible error codes for speech recognition errors
type SpeechRecognitionErrorCode =
  | 'no-speech'
  | 'aborted'
  | 'audio-capture'
  | 'network'
  | 'not-allowed'
  | 'service-not-allowed'
  | 'bad-grammar'
  | 'language-not-supported';

// Defines the event object for 'error' events from the SpeechRecognition API
interface CustomSpeechRecognitionErrorEvent extends Event {
  readonly error: SpeechRecognitionErrorCode; // The type of error that occurred
  readonly message: string; // A human-readable error message
}

// Defines the interface for an instance of the SpeechRecognition object
interface SpeechRecognitionInstance extends EventTarget {
  lang: string; // Language for recognition
  continuous: boolean; // Whether to capture continuously or stop after one result
  interimResults: boolean; // Whether to return interim (non-final) results
  grammars: any; // SpeechGrammarList; // Simplified for this context
  maxAlternatives: number; // Maximum number of alternatives to return for each result

  // Event handlers
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: CustomSpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: CustomSpeechRecognitionErrorEvent) => any) | null;
  // Other handlers like onaudiostart, onnomatch, onsoundstart, onsoundend, onspeechstart, onspeechend can be added if used.

  // Methods
  start(): void; // Starts speech recognition
  stop(): void; // Stops speech recognition and attempts to return a result
  abort(): void; // Stops speech recognition without returning a result
}

// Defines the interface for the SpeechRecognition constructor
interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}
// END: Type definitions

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  theme: AssistantTheme;
}

// FIX: Correctly get the SpeechRecognition constructor, trying standard and prefixed versions.
// Typed as SpeechRecognitionConstructor | undefined.
const SpeechRecognitionAPIConstructor: SpeechRecognitionConstructor | undefined =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

// FIX: browserSupportsSpeechRecognition checks the existence of the constructor.
const browserSupportsSpeechRecognition = !!SpeechRecognitionAPIConstructor;

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, theme }) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechApiError, setSpeechApiError] = useState<string | null>(null);

  // FIX: Use the SpeechRecognitionInstance interface for the ref's current type.
  const speechRecognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const initialInputTextRef = useRef<string>('');

  useEffect(() => {
    // FIX: Ensure the constructor exists before trying to use it.
    if (!browserSupportsSpeechRecognition || !SpeechRecognitionAPIConstructor) {
      setSpeechApiError("Tu navegador no soporta el reconocimiento de voz.");
      return;
    }

    // FIX: Instantiate using the (now correctly typed) SpeechRecognitionAPIConstructor.
    const recognition: SpeechRecognitionInstance = new SpeechRecognitionAPIConstructor();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechApiError(null);
    };

    // FIX: Use the CustomSpeechRecognitionEvent interface for the event parameter.
    recognition.onresult = (event: CustomSpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        // Access SpeechRecognitionResult using .item() or direct indexing (if type allows)
        const speechResult = event.results[i]; // event.results.item(i) would also work
        if (speechResult.isFinal) {
          // Access SpeechRecognitionAlternative using .item() or direct indexing
          finalTranscript += speechResult[0].transcript; // speechResult.item(0).transcript
        } else {
          interimTranscript += speechResult[0].transcript;
        }
      }
      
      const currentTranscript = finalTranscript || interimTranscript;
      
      if (initialInputTextRef.current.trim() === '') {
        setInputValue(currentTranscript);
      } else {
        setInputValue(initialInputTextRef.current + (initialInputTextRef.current.endsWith(' ') || currentTranscript.startsWith(' ') ? '' : ' ') + currentTranscript);
      }

      if (finalTranscript) {
        initialInputTextRef.current = initialInputTextRef.current.trim() === '' ? finalTranscript : initialInputTextRef.current + (initialInputTextRef.current.endsWith(' ') || finalTranscript.startsWith(' ') ? '' : ' ') + finalTranscript;
      }
    };

    // FIX: Use the CustomSpeechRecognitionErrorEvent interface for the event parameter.
    recognition.onerror = (event: CustomSpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = "Error en el reconocimiento de voz.";
      if (event.error === 'no-speech') {
        errorMessage = "No se detectó voz. Inténtalo de nuevo.";
      } else if (event.error === 'audio-capture') {
        errorMessage = "Error al capturar audio. Revisa tu micrófono.";
      } else if (event.error === 'not-allowed') {
        errorMessage = "Permiso para usar el micrófono denegado. Habilítalo en la configuración de tu navegador.";
      }
      setSpeechApiError(errorMessage);
      setIsListening(false);
    };

    recognition.onend = () => {
      if(!speechApiError && isListening){
        setIsListening(false);
      }
    };

    speechRecognitionRef.current = recognition;

    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };
  }, [speechApiError, isListening]);

  const handleMicClick = () => {
    if (!speechRecognitionRef.current || !browserSupportsSpeechRecognition) return;

    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false); 
    } else {
      setSpeechApiError(null); 
      initialInputTextRef.current = inputValue; 
      speechRecognitionRef.current.start();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isListening && speechRecognitionRef.current) {
       speechRecognitionRef.current.stop(); 
       setIsListening(false);
    }
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
      initialInputTextRef.current = ''; 
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (!isListening) { 
        initialInputTextRef.current = e.target.value;
    }
  };

  const canUseMic = browserSupportsSpeechRecognition && speechApiError !== "Permiso para usar el micrófono denegado. Habilítalo en la configuración de tu navegador." && speechApiError !== "Tu navegador no soporta el reconocimiento de voz.";


  return (
    <form onSubmit={handleSubmit} className="p-4 bg-slate-200 border-t border-slate-300">
      <div className="flex items-end space-x-2">
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Escribe tu mensaje o usa el micrófono..."
          className={`flex-grow p-3 border border-slate-400 rounded-lg focus:ring-2 ${theme.accentBg.replace('bg-','focus:ring-')} focus:border-transparent outline-none transition-shadow resize-y min-h-[48px]`}
          style={{ whiteSpace: 'pre-wrap' }}
          disabled={isLoading}
          rows={1}
          aria-label="Campo de entrada de mensaje"
          aria-describedby={speechApiError ? "speech-error-message" : undefined}
        />
        {browserSupportsSpeechRecognition && (
            <button
                type="button"
                onClick={handleMicClick}
                className={`p-3 rounded-lg ${theme.accentText} transition-colors ${
                    isLoading || !canUseMic
                    ? 'bg-slate-400 cursor-not-allowed opacity-70'
                    : isListening 
                        ? `${theme.accentBg.replace('bg-','bg-red-500')} hover:${theme.accentBg.replace('bg-','hover:bg-red-600')}`
                        : `${theme.accentBg} ${theme.accentHoverBg}`
                }`}
                disabled={isLoading || !canUseMic}
                title={isListening ? "Detener dictado" : "Comenzar dictado por voz"}
                aria-label={isListening ? "Detener dictado por voz" : "Comenzar dictado por voz"}
                aria-pressed={isListening}
            >
                {isListening ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                    <path d="M6 10.5a.75.75 0 0 1 .75.75v.75a4.5 4.5 0 0 0 9 0v-.75a.75.75 0 0 1 1.5 0v.75a6 6 0 1 1-12 0v-.75A.75.75 0 0 1 6 10.5Z" />
                </svg>
                ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125S10.875 5.754 10.875 6.375v7.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
                )}
            </button>
        )}
        <button
          type="submit"
          className={`p-3 rounded-lg ${theme.accentText} transition-colors ${
            isLoading ? 'bg-slate-400 cursor-not-allowed' : `${theme.accentBg} ${theme.accentHoverBg}`
          }`}
          disabled={isLoading}
          aria-label="Enviar mensaje"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
        </button>
      </div>
      {speechApiError && (
        <p id="speech-error-message" className="text-xs text-red-600 mt-1 text-center" role="alert">
          {speechApiError}
        </p>
      )}
    </form>
  );
};
