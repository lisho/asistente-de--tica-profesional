
import React, { useState } from 'react';
import { EXAMPLE_PROMPTS } from '../constants/prompts';
import { ASSISTANT_REGISTRY, AssistantKey, getDefaultAssistantTheme } from '../assistants'; 
import { GEMINI_AVATAR_URL } from '../constants/appConfig';

interface WelcomePageProps {
  onUserIdentified: (name: string, assistantKey: AssistantKey) => void;
  initialAppMetadata: { name: string; description: string; }; 
  onOpenHelpGuideModal: () => void;
}

// Define un tema neutro para cuando ningún asistente está seleccionado
const NEUTRAL_UI_THEME = {
  accentBg: 'bg-slate-500',
  accentHoverBg: 'hover:bg-slate-600',
  accentText: 'text-white',
  focusRingColor: 'focus:ring-slate-500',
  textColor: 'text-slate-500' // Para iconos de ideas para empezar
};

export const WelcomePage: React.FC<WelcomePageProps> = ({ onUserIdentified, initialAppMetadata, onOpenHelpGuideModal }) => {
  const [nameInput, setNameInput] = useState('');
  // selectedAssistantKey controla el tema de los botones/submit y qué asistente se envía al formulario.
  // Se inicializa a null para que ningún asistente esté seleccionado por defecto.
  const [selectedAssistantKey, setSelectedAssistantKey] = useState<AssistantKey | null>(null);
  // explicitlySelectedKey controla el avatar dinámico que se muestra en la parte superior.
  // null significa que se usará el avatar genérico (gemini.png).
  const [explicitlySelectedKey, setExplicitlySelectedKey] = useState<AssistantKey | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim() && selectedAssistantKey) {
      onUserIdentified(nameInput.trim(), selectedAssistantKey);
    }
  };

  const handleAssistantCardClick = (key: AssistantKey) => {
    setSelectedAssistantKey(key); 
    setExplicitlySelectedKey(key); 
  };

  // El tema de los elementos de la UI (botones, inputs) se basa en selectedAssistantKey.
  // Si no hay ninguno seleccionado, usa el tema neutro.
  const themeForUiElements = selectedAssistantKey 
    ? ASSISTANT_REGISTRY[selectedAssistantKey]
    : {
        accentBg: NEUTRAL_UI_THEME.accentBg,
        accentHoverBg: NEUTRAL_UI_THEME.accentHoverBg,
        accentText: NEUTRAL_UI_THEME.accentText,
        // Adaptar focus ring y text color según la estructura de AssistantTheme
        accentBg_replace_bg_with_focus_ring: NEUTRAL_UI_THEME.focusRingColor, // Custom key for simplicity
        accentBg_replace_bg_with_text: NEUTRAL_UI_THEME.textColor // Custom key for simplicity
      };
  
  const actualThemeForUiElements = selectedAssistantKey 
    ? ASSISTANT_REGISTRY[selectedAssistantKey]
    : { 
        ...getDefaultAssistantTheme(), // Fallback for other theme properties if needed
        accentBg: NEUTRAL_UI_THEME.accentBg,
        accentHoverBg: NEUTRAL_UI_THEME.accentHoverBg,
        accentText: NEUTRAL_UI_THEME.accentText,
      };

  const focusRingClass = selectedAssistantKey 
    ? ASSISTANT_REGISTRY[selectedAssistantKey].accentBg.replace('bg-','focus:ring-') 
    : NEUTRAL_UI_THEME.focusRingColor;

  const examplePromptIconColor = selectedAssistantKey
    ? ASSISTANT_REGISTRY[selectedAssistantKey].accentBg.replace('bg-', 'text-')
    : NEUTRAL_UI_THEME.textColor;


  const avatarUrlToDisplay = explicitlySelectedKey
    ? ASSISTANT_REGISTRY[explicitlySelectedKey].avatarUrl
    : GEMINI_AVATAR_URL;
  
  const altTextForAvatar = explicitlySelectedKey
    ? `Avatar de ${ASSISTANT_REGISTRY[explicitlySelectedKey].name}`
    : "Avatar del Asistente de IA";

  const submitButtonText = selectedAssistantKey
    ? `Entrar al chat con ${ASSISTANT_REGISTRY[selectedAssistantKey].name}`
    : "Selecciona un asistente y escribe tu nombre";

  const isSubmitDisabled = !nameInput.trim() || !selectedAssistantKey;

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-100 p-4 md:p-6 text-center overflow-y-auto">
      <div className="flex flex-col items-center justify-center w-full my-auto">
        <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl max-w-xl w-full">
          <img
            src={avatarUrlToDisplay}
            alt={altTextForAvatar}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto mb-4 border-4 border-slate-300 object-cover"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{initialAppMetadata.name}</h1>
          <p className="text-slate-600 mb-6 text-sm md:text-base">{initialAppMetadata.description}</p>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-700 mb-3">Elige tu asistente:</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
              {Object.values(AssistantKey).map((key) => {
                const assistant = ASSISTANT_REGISTRY[key];
                const isCurrentlySelectedForStyling = selectedAssistantKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleAssistantCardClick(key)}
                    className={`p-4 rounded-lg border-2 flex-1 text-left transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 ${
                      isCurrentlySelectedForStyling
                        ? `${assistant.accentBg} ${assistant.accentText} border-transparent shadow-lg ring-offset-2 ring-2 ${assistant.accentBg.replace('bg-','ring-')}`
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700'
                    }`}
                    aria-pressed={isCurrentlySelectedForStyling}
                  >
                    <div className="flex items-center">
                      <img src={assistant.avatarUrl} alt={assistant.name} className="w-10 h-10 rounded-full mr-3 border-2 border-white object-cover"/>
                      <div>
                        <p className={`font-semibold ${isCurrentlySelectedForStyling ? '' : 'text-slate-800'}`}>{assistant.name}</p>
                        <p className={`text-xs ${isCurrentlySelectedForStyling ? 'opacity-90' : 'text-slate-500'}`}>{assistant.tagline}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-slate-700 mb-1 sr-only">
                Tu nombre
              </label>
              <input
                id="userName"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Escribe tu nombre para comenzar"
                className={`w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition-shadow text-center ${focusRingClass}`}
                required
                aria-label="Tu nombre"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`w-full ${actualThemeForUiElements.accentBg} ${actualThemeForUiElements.accentText} font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 ${focusRingClass} focus:ring-offset-2 ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : actualThemeForUiElements.accentHoverBg}`}
            >
              {submitButtonText}
            </button>
          </form>

          <div className="mt-8">
            <button
              onClick={onOpenHelpGuideModal}
              className={`text-sm ${selectedAssistantKey ? ASSISTANT_REGISTRY[selectedAssistantKey].accentBg.replace('bg-','text-') : NEUTRAL_UI_THEME.textColor} hover:underline focus:outline-none focus:ring-2 ${focusRingClass} focus:ring-offset-1 rounded p-1`}
            >
              ❓ Guía de Uso y Leyenda de Botones
            </button>
          </div>

          {EXAMPLE_PROMPTS.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h2 className="text-lg font-semibold text-slate-700 mb-3">Algunas ideas para empezar:</h2>
              <ul className="space-y-2 text-left">
                {EXAMPLE_PROMPTS.map((prompt, index) => (
                  <li key={index} className="text-sm text-slate-500 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 mr-2 mt-0.5 ${examplePromptIconColor} flex-shrink-0`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                    </svg>
                    {prompt}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <footer className="w-full max-w-xl mt-8 mb-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} {initialAppMetadata.name}.</p>
        </footer>
      </div>
    </div>
  );
};
