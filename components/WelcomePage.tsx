import React, { useState } from 'react';
import { EXAMPLE_PROMPTS } from '../constants/prompts';
import { ASSISTANT_REGISTRY, AssistantKey, AssistantTheme } from '../assistants'; 

interface WelcomePageProps {
  onUserIdentified: (name: string, assistantKey: AssistantKey) => void;
  initialAppMetadata: { name: string; description: string; }; 
  onOpenHelpGuideModal: () => void; // Nueva prop
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onUserIdentified, initialAppMetadata, onOpenHelpGuideModal }) => {
  const [nameInput, setNameInput] = useState('');
  const [selectedAssistantKey, setSelectedAssistantKey] = useState<AssistantKey>(AssistantKey.EULOGIO);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim() && selectedAssistantKey) {
      onUserIdentified(nameInput.trim(), selectedAssistantKey);
    }
  };

  const currentSelectedTheme = ASSISTANT_REGISTRY[selectedAssistantKey];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4 md:p-6 text-center">
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl max-w-xl w-full">
        <img
          src={currentSelectedTheme.avatarUrl}
          alt={`Avatar de ${currentSelectedTheme.name}`}
          className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto mb-4 border-4 border-slate-300 object-cover"
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{initialAppMetadata.name}</h1>
        <p className="text-slate-600 mb-6 text-sm md:text-base">{initialAppMetadata.description}</p>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-700 mb-3">Elige tu asistente:</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            {Object.values(AssistantKey).map((key) => {
              const assistant = ASSISTANT_REGISTRY[key];
              const isSelected = selectedAssistantKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedAssistantKey(key)}
                  className={`p-4 rounded-lg border-2 flex-1 text-left transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 ${
                    isSelected
                      ? `${assistant.accentBg} ${assistant.accentText} border-transparent shadow-lg ring-offset-2 ring-2 ${assistant.accentBg.replace('bg-','ring-')}`
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center">
                    <img src={assistant.avatarUrl} alt={assistant.name} className="w-10 h-10 rounded-full mr-3 border-2 border-white object-cover"/>
                    <div>
                      <p className={`font-semibold ${isSelected ? '' : 'text-slate-800'}`}>{assistant.name}</p>
                      <p className={`text-xs ${isSelected ? 'opacity-90' : 'text-slate-500'}`}>{assistant.tagline}</p>
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
              className={`w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition-shadow text-center ${currentSelectedTheme.accentBg.replace('bg-','focus:ring-')}`}
              required
              aria-label="Tu nombre"
            />
          </div>
          <button
            type="submit"
            className={`w-full ${currentSelectedTheme.accentBg} ${currentSelectedTheme.accentHoverBg} ${currentSelectedTheme.accentText} font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 ${currentSelectedTheme.accentBg.replace('bg-','focus:ring-')} focus:ring-offset-2`}
          >
            Entrar al chat con {ASSISTANT_REGISTRY[selectedAssistantKey].name}
          </button>
        </form>

        <div className="mt-8">
          <button
            onClick={onOpenHelpGuideModal}
            className={`text-sm ${currentSelectedTheme.accentBg.replace('bg-','text-')} hover:underline focus:outline-none focus:ring-2 ${currentSelectedTheme.accentBg.replace('bg-','focus:ring-')} focus:ring-offset-1 rounded p-1`}
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 mr-2 mt-0.5 ${currentSelectedTheme.accentBg.replace('bg-','text-')} flex-shrink-0`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                  </svg>
                  {prompt}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <footer className="mt-8 text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} {initialAppMetadata.name}.</p>
      </footer>
    </div>
  );
};
