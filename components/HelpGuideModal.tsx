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

    const renderIcon = (iconKey?: string, fallbackEmoji?: string) => {
        const iconClass = `w-6 h-6 ${theme.accentBg.replace('bg-', 'text-')}`;
        
        switch (iconKey) {
            case 'changeAssistant':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                );
            case 'decreaseFont':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
                    </svg>
                );
            case 'increaseFont':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                    </svg>
                );
            case 'downloadPdf':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                );
            case 'viewFavorites':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.822.672l-4.684-2.795a.563.563 0 0 0-.652 0l-4.684 2.795a.562.562 0 0 1-.822-.672l1.285-5.385a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                );
            case 'clearChat':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.342.052.682.107 1.022.166m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                );
            case 'about':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                );
            case 'dictate':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125S10.875 5.754 10.875 6.375v7.5c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>
                );
            case 'send':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={iconClass}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                );
            case 'favoriteMessage':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.822.672l-4.684-2.795a.563.563 0 0 0-.652 0l-4.684 2.795a.562.562 0 0 1-.822-.672l1.285-5.385a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                );
            case 'copyMessage':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                    </svg>
                );
            case 'installApp':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                );
            default:
                return <span>{fallbackEmoji}</span>;
        }
    };

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
              {BUTTON_LEGEND_ITEMS.map((item: any, index: number) => (
                <div key={`legend-${index}`} className="p-3 border border-slate-200 rounded-md bg-slate-50 text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start mb-1 sm:mb-0"> 
                      <span 
                        className="inline-block text-center mr-2 flex-shrink-0" 
                        style={{minWidth: '30px'}}
                        aria-hidden="true"
                      >
                        {renderIcon(item.iconKey, item.icon)}
                      </span>
                      <span className="font-semibold text-slate-700">{item.name}</span>
                    </div>
                    <span 
                      className="text-xs text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded-full self-start mt-1 sm:mt-0 sm:ml-2 whitespace-nowrap"
                    > 
                      {item.location}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-2 sm:mt-1 sm:pl-[38px]">{item.description}</p>
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