import React from 'react';
import { AssistantTheme } from '../assistants';
import { HOW_TO_USE_SECTIONS, BUTTON_LEGEND_ITEMS } from '../constants/modalContent';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: AssistantTheme; 
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

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
      width: 8px;
    }
    .custom-scrollbar-themed::-webkit-scrollbar-track {
      background: #f1f5f9; /* slate-100 */
      border-radius: 10px;
    }
    .custom-scrollbar-themed::-webkit-scrollbar-thumb {
      background-color: ${theme.accentBg.startsWith('bg-[#') ? theme.accentBg.substring(4, theme.accentBg.length - 1) : 'var(--theme-accent-color, #64748b)'}; /* Use theme accent color or fallback */
      border-radius: 10px;
    }
    .custom-scrollbar-themed::-webkit-scrollbar-thumb:hover {
      background-color: ${theme.accentHoverBg.startsWith('hover:bg-[#') ? theme.accentHoverBg.substring(10, theme.accentHoverBg.length - 1) : 'var(--theme-accent-hover-color, #475569)'};
    }
    :root {
      --theme-accent-color: ${theme.accentBg.startsWith('bg-[#') ? theme.accentBg.substring(4, theme.accentBg.length - 1) : '#64748b'};
      --theme-accent-hover-color: ${theme.accentHoverBg.startsWith('hover:bg-[#') ? theme.accentHoverBg.substring(10, theme.accentHoverBg.length - 1) : '#475569'};
    }
  `;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[70] transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="helpGuideModalTitle"
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 md:p-8 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 id="helpGuideModalTitle" className="text-2xl font-bold text-slate-800">Guía de Uso y Leyenda de Botones</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
            aria-label="Cerrar modal de guía"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-6 overflow-y-auto flex-grow pr-3 -mr-1 custom-scrollbar-themed" style={{ scrollbarColor: `${theme.accentBg.replace('bg-', '')} #e2e8f0`}}>
          <div>
            <h3 className="text-xl font-semibold text-slate-700 mb-3 border-b pb-2">Cómo Usar la Aplicación</h3>
            {HOW_TO_USE_SECTIONS.map((section, index) => (
              <div key={`htu-${index}`} className="mb-4">
                <h4 className="font-semibold text-md text-slate-700 mt-2 mb-1">{section.heading}</h4>
                {section.text && <p className="text-sm text-slate-600 whitespace-pre-wrap">{section.text}</p>}
                {section.points && (
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    {section.points.map((point, pIndex) => (
                      <li key={`htu-point-${index}-${pIndex}`} className="text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: point.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-2">Leyenda de Botones</h3>
            <div className="space-y-3">
              {BUTTON_LEGEND_ITEMS.map((item, index) => (
                <div key={`legend-${index}`} className="p-3 border border-slate-200 rounded-md bg-slate-50 text-sm">
                  <div className="flex items-center mb-1">
                    <span className={`inline-block text-center mr-2 font-mono text-lg ${theme.accentBg.replace('bg-','text-')}`} style={{minWidth: '30px'}}>{item.icon}</span>
                    <span className="font-semibold text-slate-700">{item.name}</span>
                    <span className="ml-auto text-xs text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded-full">{item.location}</span>
                  </div>
                  <p className="text-slate-600 pl-10">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-right flex-shrink-0 pt-4 border-t border-slate-200">
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
