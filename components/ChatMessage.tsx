
import React, { useState } from 'react';
import { Message, Sender } from '../types';
import { AssistantTheme } from '../assistants';

// --- CodeBlock Component and CodeBlockProps REMOVED ---

// --- Helper function to render non-code text segments (paragraphs, bold, links, lists) ---
// This function (renderNonCodeText) remains as it handles general markdown styling
// for non-code text, which is now applied to all message content.
const renderNonCodeText = (textSegment: string, baseKey: string): React.ReactNode[] => {
  const segmentNodes: React.ReactNode[] = [];
  let innerKeyCounter = 0;

  textSegment.split('\n').forEach((lineContent, lineIdx) => {
    let currentLineNodes: React.ReactNode[] = [lineContent];

    // Step 1: Process links [text](url)
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
              key={`${baseKey}-link-${lineIdx}-${innerKeyCounter++}`}
              href={match[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
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

    // Step 2: Process bold **text**
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
          pass2Nodes.push(<strong key={`${baseKey}-bold-${lineIdx}-${innerKeyCounter++}`}>{match[1]}</strong>);
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

    // Step 3: Handle list items presentation
    const trimmedLine = lineContent.trim();
    const isListItem = trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ');
    if (isListItem) {
      let contentForListItem = [...currentLineNodes];
      if (contentForListItem.length > 0 && typeof contentForListItem[0] === 'string') {
        const firstNodeStr = contentForListItem[0] as string;
        const strippedFirstNode = firstNodeStr.replace(/^(\s*)[*-]\s+/, '$1'); 
        
        if (strippedFirstNode !== firstNodeStr) {
          contentForListItem[0] = strippedFirstNode;
        } else if (firstNodeStr.trim().startsWith('* ') || firstNodeStr.trim().startsWith('- ')) { 
           contentForListItem[0] = firstNodeStr.trim().substring(2);
        }
      }
      
      segmentNodes.push(
        <div key={`${baseKey}-li-${lineIdx}-${innerKeyCounter++}`} className="flex items-start my-0.5" role="listitem">
          <span aria-hidden="true" className="mr-2 ml-4 text-slate-700 select-none">•</span>
          <div className="flex-1">{contentForListItem}</div>
        </div>
      );
    } else {
      if (currentLineNodes.some(node => (typeof node === 'string' && node.trim() !== '') || typeof node !== 'string' )) {
         segmentNodes.push(<div key={`${baseKey}-p-${lineIdx}-${innerKeyCounter++}`}>{currentLineNodes}</div>);
      }
    }
  });

  return segmentNodes;
};

// --- Main Markdown Renderer ---
// Now, renderMarkdown simply uses renderNonCodeText for all content.
// The 'theme' parameter is removed as it was only for the deleted CodeBlock.
const renderMarkdown = (text: string): React.ReactNode[] => {
  const nodes = renderNonCodeText(text, "message-content"); // Use a base key for uniqueness

  // Handle empty text case
  if (nodes.length === 0 && text.trim() === '') {
    return [<span key="empty-text">&nbsp;</span>];
  }
  return nodes;
};


interface ChatMessageProps {
  message: Message;
  theme: AssistantTheme;
  isFavorite: boolean;
  onToggleFavorite: (messageId: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, theme, isFavorite, onToggleFavorite }) => {
  const isUser = message.sender === Sender.USER;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!message.text) return;
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onToggleFavorite(message.id);
  };

  const userBubbleColor = theme.accentBg;
  const userTextColor = theme.accentText;
  const aiBubbleColor = theme.secondaryBg;
  const aiTextColor = theme.secondaryText;

  return (
    <div className={`group flex items-end space-x-2 ${isUser ? 'justify-end' : 'justify-start'}`} role="log">
      {!isUser && (
        <img 
          src={message.avatar || theme.avatarUrl} 
          alt={`Avatar de ${theme.name}`} 
          className="w-8 h-8 rounded-full object-cover self-start flex-shrink-0" 
        />
      )}
      <div 
        className={`relative max-w-md lg:max-w-lg p-3 rounded-lg shadow ${
          isUser 
            ? `${userBubbleColor} ${userTextColor} rounded-br-none` 
            : `${aiBubbleColor} ${aiTextColor} rounded-bl-none`
        }`}
      >
        <div className="text-sm prose-sm prose-slate max-w-none message-text-content">
           {/* Theme parameter removed from renderMarkdown call */}
           {renderMarkdown(message.text)}
        </div>
        <p className={`text-xs mt-1 timestamp-text ${
            isUser 
                ? (userTextColor === 'text-white' ? 'text-opacity-75 text-white' : 'text-slate-500')
                : (aiTextColor.includes('slate') || aiTextColor.includes('gray') || aiTextColor.includes('neutral') ? 'text-slate-500' : 'opacity-70') 
            } text-${isUser ? 'right' : 'left'}`}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        
        {!isUser && message.text && (
          <div className="absolute -top-3 -right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
            <button
              onClick={handleFavoriteClick}
              title={isFavorite ? "Quitar de favoritos" : "Guardar como favorito"}
              aria-label={isFavorite ? "Quitar este mensaje de favoritos" : "Guardar este mensaje como favorito"}
              className={`p-1.5 bg-slate-300 hover:bg-slate-400 rounded-full text-slate-700 focus:opacity-100 outline-none focus:ring-2 ${theme.accentBg.replace('bg-','focus:ring-')}`}
            >
              {isFavorite ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.502 2.825c-.995.608-2.23-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.822.672l-4.684-2.795a.563.563 0 0 0-.652 0l-4.684 2.795a.562.562 0 0 1-.822-.672l1.285-5.385a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleCopy}
              title={copied ? "Copiado!" : "Copiar mensaje"}
              aria-label={copied ? "Mensaje copiado al portapapeles" : `Copiar mensaje de ${theme.name} al portapapeles`}
              className={`p-1.5 bg-slate-300 hover:bg-slate-400 rounded-full text-slate-700 focus:opacity-100 outline-none focus:ring-2 ${theme.accentBg.replace('bg-','focus:ring-')}`}
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
      {isUser && (
         <div className={`w-8 h-8 rounded-full ${userBubbleColor} ${userTextColor} flex items-center justify-center font-semibold text-sm self-start flex-shrink-0`} aria-label="Tu avatar">
           TÚ
         </div>
      )}
    </div>
  );
};
