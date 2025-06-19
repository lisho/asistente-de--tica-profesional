
import React from 'react';
import { AssistantTheme } from '../assistants';

interface HeaderProps {
  theme: AssistantTheme;
  onRequestClearChat: () => void;
  onOpenAboutModal: () => void;
  onOpenFavoritesModal: () => void;
  onDownloadChatPdf: () => void;
  onRequestChangeAssistant: () => void;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  currentFontSizeLevel: number;
  minFontSizeLevel: number;
  maxFontSizeLevel: number;
  onOpenHelpGuideModal: () => void; // Nueva prop
}

export const Header: React.FC<HeaderProps> = ({ 
  theme,
  onRequestClearChat, 
  onOpenAboutModal,
  onOpenFavoritesModal,
  onDownloadChatPdf,
  onRequestChangeAssistant,
  onIncreaseFontSize,
  onDecreaseFontSize,
  currentFontSizeLevel,
  minFontSizeLevel,
  maxFontSizeLevel,
  onOpenHelpGuideModal // Recibir la nueva prop
}) => {
  const buttonBaseStyle = `p-2 rounded-full transition-colors focus:outline-none focus:ring-2 ${theme.accentBg.replace('bg-','focus:ring-')}`;
  const iconStyle = `${theme.iconColor} ${theme.iconHoverColor}`;
  const disabledStyle = 'opacity-50 cursor-not-allowed';

  return (
    <header className={`${theme.primaryBg} ${theme.primaryText} p-4 flex items-center justify-between shadow-md`}>
      <div className="flex items-center space-x-3">
        <img 
          src={theme.avatarUrl} 
          alt={`Avatar de ${theme.name}`} 
          className="w-12 h-12 rounded-full border-2 border-slate-300 object-cover"
        />
        <div>
          <h1 className="text-xl font-semibold">{theme.name}</h1>
          <p className={`text-sm ${theme.primaryText === 'text-white' ? 'opacity-80' : 'text-slate-600'}`}>{theme.tagline}</p>
        </div>
      </div>
      <div className="flex items-center space-x-1 md:space-x-2">
        <button
          onClick={onRequestChangeAssistant}
          title="Cambiar de asistente"
          aria-label="Volver a la página de selección de asistente"
          className={`${buttonBaseStyle} ${iconStyle} ${theme.primaryBg.replace('bg-','hover:bg-opacity-75 hover:bg-')}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
        </button>

        {/* Font Size Controls */}
        <button
          onClick={onDecreaseFontSize}
          title="Disminuir tamaño de fuente"
          aria-label="Disminuir tamaño de fuente"
          disabled={currentFontSizeLevel <= minFontSizeLevel}
          className={`${buttonBaseStyle} ${iconStyle} ${theme.primaryBg.replace('bg-','hover:bg-opacity-75 hover:bg-')} ${currentFontSizeLevel <= minFontSizeLevel ? disabledStyle : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
          </svg>
        </button>
        <button
          onClick={onIncreaseFontSize}
          title="Aumentar tamaño de fuente"
          aria-label="Aumentar tamaño de fuente"
          disabled={currentFontSizeLevel >= maxFontSizeLevel}
          className={`${buttonBaseStyle} ${iconStyle} ${theme.primaryBg.replace('bg-','hover:bg-opacity-75 hover:bg-')} ${currentFontSizeLevel >= maxFontSizeLevel ? disabledStyle : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
          </svg>
        </button>
        
        <button
          onClick={onDownloadChatPdf}
          title="Descargar chat (PDF)"
          aria-label="Descargar historial del chat como PDF"
          className={`${buttonBaseStyle} ${iconStyle} ${theme.primaryBg.replace('bg-','hover:bg-opacity-75 hover:bg-')}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </button>
        <button
          onClick={onOpenFavoritesModal}
          title="Ver favoritos"
          aria-label="Abrir modal con interacciones favoritas"
          className={`${buttonBaseStyle} ${iconStyle} ${theme.primaryBg.replace('bg-','hover:bg-opacity-75 hover:bg-')}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.822.672l-4.684-2.795a.563.563 0 0 0-.652 0l-4.684 2.795a.562.562 0 0 1-.822-.672l1.285-5.385a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
        </button>
        <button
          onClick={onRequestClearChat}
          title="Limpiar chat"
          aria-label="Limpiar historial del chat"
          className={`${buttonBaseStyle} ${iconStyle} ${theme.primaryBg.replace('bg-','hover:bg-opacity-75 hover:bg-')}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.342.052.682.107 1.022.166m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
        <button
          onClick={onOpenAboutModal} // Esto abre el AboutModal, que ahora tendrá la opción de abrir HelpGuideModal
          title={`Acerca de ${theme.name}`}
          aria-label={`Abrir modal con información acerca de ${theme.name}`}
          className={`${buttonBaseStyle} ${iconStyle} ${theme.primaryBg.replace('bg-','hover:bg-opacity-75 hover:bg-')}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
        </button>
      </div>
    </header>
  );
};
