
import React from 'react';
import { AssistantTheme } from '../assistants';

export interface AboutModalContentSection {
  heading: string;
  text: string;
}
export interface AboutModalContent {
  title: string;
  sections: AboutModalContentSection[];
}

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: AboutModalContent;
  theme: AssistantTheme;
  onOpenHelpGuideModal: () => void; // Nueva prop
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, content, theme, onOpenHelpGuideModal }) => {
  if (!isOpen) return null;

  const handleOpenGuide = () => {
    onClose(); // Cierra el modal actual
    onOpenHelpGuideModal(); // Abre el modal de guía
  };

  // FIX: Replaced <style jsx global> and combined style blocks using dangerouslySetInnerHTML
  const combinedStyles = `
    @keyframes modalShowAnimation {
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    .animate-modalShow {
      animation: modalShowAnimation 0.3s forwards;
    }
    .custom-scrollbar-themed::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar-themed::-webkit-scrollbar-track {
      background: #f8fafc; /* slate-50 */
      border-radius: 10px;
    }
    .custom-scrollbar-themed::-webkit-scrollbar-thumb {
       background-color: ${theme.accentBg.startsWith('bg-[#') ? theme.accentBg.substring(4, theme.accentBg.length - 1) : 'var(--theme-accent-color, #94a3b8)'};
       border-radius: 10px;
    }
     .custom-scrollbar-themed::-webkit-scrollbar-thumb:hover {
       background-color: ${theme.accentHoverBg.startsWith('hover:bg-[#') ? theme.accentHoverBg.substring(10, theme.accentHoverBg.length - 1) : 'var(--theme-accent-hover-color, #64748b)'};
    }
    :root {
      --theme-accent-color: ${theme.accentBg.startsWith('bg-[#') ? theme.accentBg.substring(4, theme.accentBg.length - 1) : '#94a3b8'};
      --theme-accent-hover-color: ${theme.accentHoverBg.startsWith('hover:bg-[#') ? theme.accentHoverBg.substring(10, theme.accentHoverBg.length - 1) : '#64748b'};
    }
  `;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="aboutModalTitle"
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 md:p-8 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="aboutModalTitle" className="text-2xl font-bold text-slate-700">{content.title}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
            aria-label="Cerrar modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 text-slate-600 text-sm md:text-base custom-scrollbar-themed" style={{ scrollbarColor: `${theme.accentBg.replace('bg-', '')} #e2e8f0`}}>
          {content.sections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-slate-700 mb-1 text-md md:text-lg">{section.heading}</h3>
              <p className="whitespace-pre-wrap">{section.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleOpenGuide}
            className={`px-4 py-2 text-sm bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2`}
            
          >
            ❓ Ver Guía General y Leyenda
          </button>
          <button
            onClick={onClose}
            className={`px-6 py-2 ${theme.accentBg} ${theme.accentText} rounded-lg ${theme.accentHoverBg} transition-colors focus:outline-none focus:ring-2 ${theme.accentBg.replace('bg-','focus:ring-')} focus:ring-offset-2`}
          >
            Entendido
          </button>
        </div>
      </div>
      {/* FIX: Removed jsx and global props, using dangerouslySetInnerHTML for combined styles */}
      <style dangerouslySetInnerHTML={{ __html: combinedStyles }} />
    </div>
  );
};
