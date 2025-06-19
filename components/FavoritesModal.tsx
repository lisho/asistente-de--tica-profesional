
import React from 'react';
import { Message, Sender } from '../types';
import { AssistantTheme } from '../assistants';
import { jsPDF } from 'jspdf';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  favoriteMessageIds: string[];
  onToggleFavorite: (messageId: string) => void;
  userName: string | null;
  theme: AssistantTheme;
}

interface FavoriteInteraction {
  id: string;
  userMessage: Message | null;
  aiMessage: Message;
}

// Simplified markdown renderer for modal (bold, links, basic lists)
const renderModalMarkdown = (text: string): React.ReactNode[] => {
  const outputNodes: React.ReactNode[] = [];
  let keyCounter = 0;

  text.split('\n').forEach((lineContent, lineIdx) => {
    let currentLineNodes: React.ReactNode[] = [lineContent];

    let pass1Nodes: React.ReactNode[] = [];
    currentLineNodes.forEach(node => {
      if (typeof node === 'string') {
        const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
        let lastIndex = 0;
        let match;
        while ((match = linkRegex.exec(node)) !== null) {
          if (match.index > lastIndex) {
            pass1Nodes.push(node.substring(lastIndex, match.index));
          }
          pass1Nodes.push(
            <a
              key={`fav-link-${lineIdx}-${keyCounter++}`}
              href={match[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {match[1]}
            </a>
          );
          lastIndex = linkRegex.lastIndex;
        }
        if (lastIndex < node.length) {
          pass1Nodes.push(node.substring(lastIndex));
        }
      } else {
        pass1Nodes.push(node);
      }
    });
    currentLineNodes = pass1Nodes;

    let pass2Nodes: React.ReactNode[] = [];
    currentLineNodes.forEach(node => {
      if (typeof node === 'string') {
        const boldRegex = /\*\*(.*?)\*\*/g;
        let lastIndex = 0;
        let match;
        while ((match = boldRegex.exec(node)) !== null) {
          if (match.index > lastIndex) {
            pass2Nodes.push(node.substring(lastIndex, match.index));
          }
          pass2Nodes.push(<strong key={`fav-bold-${lineIdx}-${keyCounter++}`}>{match[1]}</strong>);
          lastIndex = boldRegex.lastIndex;
        }
        if (lastIndex < node.length) {
          pass2Nodes.push(node.substring(lastIndex));
        }
      } else {
        pass2Nodes.push(node);
      }
    });
    currentLineNodes = pass2Nodes;
    
    const isListItem = lineContent.trim().startsWith('* ') || lineContent.trim().startsWith('- ');
    if (isListItem) {
        let contentForListItem = [...currentLineNodes];
        if (contentForListItem.length > 0 && typeof contentForListItem[0] === 'string') {
            const firstNodeStr = contentForListItem[0] as string;
            const strippedFirstNode = firstNodeStr.replace(/^(\s*)[*-]\s+/, '');
            if (strippedFirstNode.length < firstNodeStr.length) { 
                if (strippedFirstNode.length > 0) {
                    contentForListItem[0] = strippedFirstNode;
                } else {
                    contentForListItem.shift(); 
                }
            }
        }
      outputNodes.push(
        <div key={`fav-li-${lineIdx}-${keyCounter++}`} className="flex items-start my-0.5" role="listitem">
          <span aria-hidden="true" className="mr-2 ml-4 text-slate-700 select-none">•</span>
          <div className="flex-1">{contentForListItem}</div>
        </div>
      );
    } else {
      outputNodes.push(<div key={`fav-p-${lineIdx}-${keyCounter++}`}>{currentLineNodes}</div>);
    }
  });
  return outputNodes;
};


export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  messages,
  favoriteMessageIds,
  onToggleFavorite,
  userName,
  theme
}) => {
  if (!isOpen) return null;

  const favoriteInteractions: FavoriteInteraction[] = favoriteMessageIds
    .map(favId => {
      const aiMsgIndex = messages.findIndex(m => m.id === favId && m.sender === Sender.AI);
      if (aiMsgIndex === -1) return null;

      const aiMessage = messages[aiMsgIndex];
      let userMessage: Message | null = null;

      // Look for the closest preceding user message
      for (let i = aiMsgIndex - 1; i >= 0; i--) {
        if (messages[i].sender === Sender.USER) {
          userMessage = messages[i];
          break; 
        }
        // If we hit another AI message before a user message, this AI message might be a standalone favorite
        // or the user message is much further back. For simplicity, we take the closest one.
        if (messages[i].sender === Sender.AI) {
            break;
        }
      }
      return { id: aiMessage.id, userMessage, aiMessage };
    })
    .filter(interaction => interaction !== null) as FavoriteInteraction[];
  
  favoriteInteractions.sort((a, b) => a.aiMessage.timestamp.getTime() - b.aiMessage.timestamp.getTime()); // Chronological for PDF

  const handleDownloadFavoritesPdf = () => {
    if (!userName || favoriteInteractions.length === 0) {
      alert("No hay favoritos para descargar o falta información del usuario.");
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      const MARGIN = 30;
      const TOP_MARGIN_INITIAL = 40;
      const TOP_MARGIN_NEW_PAGE = 30;
      const BOTTOM_MARGIN = 30;
      const MAX_LINE_WIDTH = pageWidth - MARGIN * 2;

      const FONT_SIZE_TITLE = 16;
      const FONT_SIZE_SUBTITLE = 12;
      const FONT_SIZE_SENDER = 10;
      const FONT_SIZE_TIMESTAMP = 8;
      const FONT_SIZE_TEXT = 10;
      
      const LINE_HEIGHT_SENDER = FONT_SIZE_SENDER * 1.2;
      const LINE_HEIGHT_TIMESTAMP = FONT_SIZE_TIMESTAMP * 1.2;
      const LINE_HEIGHT_TEXT = FONT_SIZE_TEXT * 1.2;

      const PADDING_AFTER_TITLE = 5;
      const PADDING_AFTER_SUBTITLE = 15;
      const PADDING_AFTER_SENDER = 2;
      const PADDING_AFTER_TIMESTAMP = 4;
      const PADDING_BETWEEN_MESSAGES_IN_INTERACTION = 8;
      const PADDING_BETWEEN_INTERACTIONS = 15;

      let y = TOP_MARGIN_INITIAL;

      doc.setFontSize(FONT_SIZE_TITLE);
      doc.text(`Mis Favoritos - Conversación con ${theme.name}`, pageWidth / 2, y, { align: 'center' });
      y += FONT_SIZE_TITLE + PADDING_AFTER_TITLE;

      doc.setFontSize(FONT_SIZE_SUBTITLE);
      doc.text(`Exportado por: ${userName}`, pageWidth / 2, y, { align: 'center'});
      y += FONT_SIZE_SUBTITLE + PADDING_AFTER_SUBTITLE;

      favoriteInteractions.forEach((interaction, index) => {
        let interactionBlockHeight = 0;
        
        // Pre-process user message text and lines (if exists) for height calculation and drawing
        let userPdfText: string | null = null;
        let userTextLines: string[] | null = null;
        if (interaction.userMessage) {
          userPdfText = interaction.userMessage.text.replace(/\*\*(.*?)\*\*/g, '$1');
          userPdfText = userPdfText.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1 ($2)');
          userTextLines = doc.splitTextToSize(userPdfText, MAX_LINE_WIDTH);

          interactionBlockHeight += LINE_HEIGHT_SENDER + PADDING_AFTER_SENDER;
          interactionBlockHeight += LINE_HEIGHT_TIMESTAMP + PADDING_AFTER_TIMESTAMP;
          interactionBlockHeight += userTextLines.length * LINE_HEIGHT_TEXT;
          interactionBlockHeight += PADDING_BETWEEN_MESSAGES_IN_INTERACTION;
        }

        // Fix: Process AI message text once and reuse for height calculation and drawing, avoiding redeclaration.
        let processedAiPdfText = interaction.aiMessage.text.replace(/\*\*(.*?)\*\*/g, '$1');
        processedAiPdfText = processedAiPdfText.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1 ($2)');
        const processedAiTextLines = doc.splitTextToSize(processedAiPdfText, MAX_LINE_WIDTH);
        
        // Calculate height contribution from AI message (using pre-processed lines)
        interactionBlockHeight += LINE_HEIGHT_SENDER + PADDING_AFTER_SENDER;
        interactionBlockHeight += LINE_HEIGHT_TIMESTAMP + PADDING_AFTER_TIMESTAMP;
        interactionBlockHeight += processedAiTextLines.length * LINE_HEIGHT_TEXT;

        if (index < favoriteInteractions.length -1) {
            interactionBlockHeight += PADDING_BETWEEN_INTERACTIONS;
        }
        
        if (y + interactionBlockHeight > pageHeight - BOTTOM_MARGIN) {
          doc.addPage();
          y = TOP_MARGIN_NEW_PAGE;
        }

        // Draw user message (using pre-processed lines, if exists)
        if (interaction.userMessage && userTextLines) { // Check userTextLines as it's derived from userPdfText
          doc.setFontSize(FONT_SIZE_SENDER);
          doc.setTextColor(0, 0, 0);
          doc.text(`${userName}:`, MARGIN, y);
          y += LINE_HEIGHT_SENDER + PADDING_AFTER_SENDER;

          doc.setFontSize(FONT_SIZE_TIMESTAMP);
          doc.setTextColor(128, 128, 128);
          doc.text(interaction.userMessage.timestamp.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }), MARGIN, y);
          y += LINE_HEIGHT_TIMESTAMP + PADDING_AFTER_TIMESTAMP;
          doc.setTextColor(0, 0, 0);

          doc.setFontSize(FONT_SIZE_TEXT);
          doc.text(userTextLines, MARGIN, y);
          y += userTextLines.length * LINE_HEIGHT_TEXT;
          y += PADDING_BETWEEN_MESSAGES_IN_INTERACTION;
        }

        // Draw AI message (using pre-processed lines)
        doc.setFontSize(FONT_SIZE_SENDER);
        doc.setTextColor(0, 0, 0);
        doc.text(`${theme.name}:`, MARGIN, y);
        y += LINE_HEIGHT_SENDER + PADDING_AFTER_SENDER;

        doc.setFontSize(FONT_SIZE_TIMESTAMP);
        doc.setTextColor(128, 128, 128);
        doc.text(interaction.aiMessage.timestamp.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }), MARGIN, y);
        y += LINE_HEIGHT_TIMESTAMP + PADDING_AFTER_TIMESTAMP;
        doc.setTextColor(0, 0, 0);

        doc.setFontSize(FONT_SIZE_TEXT);
        doc.text(processedAiTextLines, MARGIN, y);
        y += processedAiTextLines.length * LINE_HEIGHT_TEXT;

        if (index < favoriteInteractions.length -1) {
            // Draw a separator line
            if (y + PADDING_BETWEEN_INTERACTIONS / 2 > pageHeight - BOTTOM_MARGIN) {
                 doc.addPage(); y = TOP_MARGIN_NEW_PAGE;
            } else {
                y += PADDING_BETWEEN_INTERACTIONS / 2;
                doc.setDrawColor(200, 200, 200); // Light grey line
                doc.line(MARGIN, y, pageWidth - MARGIN, y);
                y += PADDING_BETWEEN_INTERACTIONS / 2;
            }
        }
      });

      doc.save(`favoritos_${theme.name.toLowerCase().replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF for favorites:", error);
      alert("Ocurrió un error al generar el PDF de favoritos. Por favor, inténtalo de nuevo.");
    }
  };


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="favoritesModalTitle"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 md:p-8 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '85vh' }} 
      >
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 id="favoritesModalTitle" className="text-2xl font-bold text-slate-700">Mis Favoritos</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
            aria-label="Cerrar modal de favoritos"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto flex-grow pr-2 -mr-2 custom-scrollbar">
          {favoriteInteractions.length === 0 ? (
            <p className="text-slate-600 text-center py-8">No has guardado ninguna interacción como favorita todavía.</p>
          ) : (
            favoriteInteractions.map(interaction => ( // Use chronologically sorted for display consistency if desired
              <div key={interaction.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group shadow-sm">
                {interaction.userMessage && (
                  <div className="mb-3 pb-3 border-b border-slate-200">
                    <div className="flex items-start space-x-2 mb-1">
                       <div className={`w-7 h-7 rounded-full ${theme.accentBg} ${theme.accentText} flex items-center justify-center font-semibold text-xs self-start flex-shrink-0 mt-0.5`} aria-label="Tu avatar">
                        TÚ
                       </div>
                       <div>
                          <p className="text-xs text-slate-500 font-medium">
                            {userName || "Usuario"} - {interaction.userMessage.timestamp.toLocaleDateString([], {day: '2-digit', month: '2-digit', year: 'numeric'})} {interaction.userMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <div className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">
                            {renderModalMarkdown(interaction.userMessage.text)}
                          </div>
                       </div>
                    </div>
                  </div>
                )}
                <div>
                  <div className="flex items-start space-x-2 mb-1">
                    <img src={theme.avatarUrl} alt={`${theme.name} avatar`} className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"/>
                    <div>
                        <p className="font-semibold text-slate-700 text-sm">{theme.name}</p>
                        <p className="text-xs text-slate-500">
                        {interaction.aiMessage.timestamp.toLocaleDateString([], {day: '2-digit', month: '2-digit', year: 'numeric'})} {interaction.aiMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <div className="mt-1 text-sm text-slate-800 whitespace-pre-wrap">
                           {renderModalMarkdown(interaction.aiMessage.text)}
                        </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onToggleFavorite(interaction.aiMessage.id)}
                  title="Quitar de favoritos"
                  aria-label="Quitar esta interacción de favoritos"
                  className={`absolute top-3 right-3 p-1.5 bg-slate-200 hover:bg-red-100 rounded-full text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 outline-none focus:ring-2 ${theme.accentBg.replace('bg-','focus:ring-').replace('pink-500','ring-red-400').replace('sky-500','ring-red-400')}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500 group-hover:text-red-500 transition-colors">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.502 2.825c-.995.608-2.23-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 text-right flex-shrink-0 pt-4 border-t border-slate-200 flex justify-end space-x-3">
          {favoriteInteractions.length > 0 && (
            <button
              onClick={handleDownloadFavoritesPdf}
              className={`px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 flex items-center space-x-2`}
              aria-label="Descargar favoritos como PDF"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span>Descargar Favoritos (PDF)</span>
            </button>
          )}
          <button
            onClick={onClose}
            className={`px-6 py-2 ${theme.accentBg} ${theme.accentText} rounded-lg ${theme.accentHoverBg} transition-colors focus:outline-none focus:ring-2 ${theme.accentBg.replace('bg-','focus:ring-')} focus:ring-offset-2`}
          >
            Cerrar
          </button>
        </div>
      </div>
      <style>{`
        @keyframes modalShowAnimation {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modalShow {
          animation: modalShowAnimation 0.3s forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9; /* slate-100 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8; /* slate-400 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b; /* slate-500 */
        }
      `}</style>
    </div>
  );
};
