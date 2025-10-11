
import React from 'react';
import { AssistantTheme } from '../assistants';
import { Conversation, BeforeInstallPromptEvent } from '../types';
import { InstallPWAButton } from './InstallPWAButton';
import SidebarFeedbackButton from "./SidebarFeedbackButton";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  theme: AssistantTheme;
  appMetadataName: string;
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewConversation: () => void;
  onLoadConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void; 
  userName: string | null;
  deferredInstallPrompt: BeforeInstallPromptEvent | null;
  isStandalone: boolean;
  onInstallClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  theme,
  appMetadataName,
  conversations,
  currentConversationId,
  onNewConversation,
  onLoadConversation,
  onDeleteConversation,
  userName,
  deferredInstallPrompt,
  isStandalone,
  onInstallClick
}) => {
  const sidebarBg = 'bg-slate-800'; 
  const textColor = 'text-slate-100';
  const hoverBg = 'hover:bg-slate-700';
  const activeBg = 'bg-slate-600'; 

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full ${sidebarBg} ${textColor} w-72 flex flex-col shadow-lg z-40
                    transform transition-transform duration-300 ease-in-out 
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Menú de conversaciones"
      >
        {/* Close button for mobile (remains visible only on mobile due to parent md:hidden on overlay, good for UX) */}
        <button 
            onClick={onToggle} 
            className="md:hidden absolute top-3 right-3 text-slate-300 hover:text-white p-1 z-50" // z-50 to be above content
            aria-label="Cerrar menú"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <div className="p-5 text-center border-b border-slate-700">
          <img
            src={theme.avatarUrl}
            alt={`Avatar de ${theme.name}`}
            className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-slate-500 object-cover shadow-md"
          />
          <h2 className="text-xl font-semibold text-white">{theme.name}</h2>
          <p className="text-xs text-slate-300 mt-1 px-2">{theme.tagline}</p>
        </div>

        <div className="p-4 border-b border-slate-700">
          <button
            onClick={onNewConversation}
            className="w-full flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-800"
            aria-label="Iniciar una nueva conversación"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nueva Conversación
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-1 custom-scrollbar-sidebar">
          <h3 className="text-sm font-semibold text-slate-400 mb-2 px-1">Conversaciones Anteriores</h3>
          {conversations.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No hay conversaciones guardadas.</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                role="button"
                tabIndex={0}
                onClick={() => onLoadConversation(conv.id)}
                onKeyDown={(e) => e.key === 'Enter' && onLoadConversation(conv.id)}
                className={`group flex items-center justify-between w-full p-2.5 rounded-md text-sm cursor-pointer transition-colors
                            ${conv.id === currentConversationId ? `${activeBg} text-white font-medium` : `${textColor} ${hoverBg} hover:text-white`}
                            focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 focus:ring-offset-slate-800`}
                aria-current={conv.id === currentConversationId ? "page" : undefined}
              >
                <span className="truncate flex-grow" title={conv.title}>{conv.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onDeleteConversation(conv.id);
                  }}
                  title="Eliminar conversación"
                  aria-label={`Eliminar conversación titulada ${conv.title}`}
                  className={`ml-2 p-1 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-700 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity
                              ${conv.id === currentConversationId ? 'text-slate-300 hover:text-red-300' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.342.052.682.107 1.022.166m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
        
        {deferredInstallPrompt && !isStandalone && (
          <div className="p-4 mt-auto">
            <InstallPWAButton onClick={onInstallClick} theme={theme} isFixed={false} />
          </div>
        )}

        <div className="p-4 flex justify-center">
          <SidebarFeedbackButton />
        </div>

        <div className={`p-4 ${deferredInstallPrompt && !isStandalone ? '' : 'mt-auto'} border-t border-slate-700 text-center`}>
          <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} {appMetadataName}</p>
        </div>
      </aside>
      <style>{`
        .custom-scrollbar-sidebar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar-sidebar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar-sidebar::-webkit-scrollbar-thumb {
            background: #475569; /* slate-600 */
            border-radius: 3px;
        }
        .custom-scrollbar-sidebar::-webkit-scrollbar-thumb:hover {
            background: #334155; /* slate-700 */
        }
      `}</style>
    </>
  );
};
