
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { LoadingSpinner } from './components/LoadingSpinner';
import { WelcomePage } from './components/WelcomePage';
import { Message, Sender, GeminiChatHistoryItem, AppMetadata, BeforeInstallPromptEvent } from './types';
import { getAssistantResponseStream } from './services/geminiService';
import { AboutModal } from './components/AboutModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { FavoritesModal } from './components/FavoritesModal';
import { InstallPWAButton } from './components/InstallPWAButton';
import { OfflineBanner } from './components/OfflineBanner';
import { HelpGuideModal } from './components/HelpGuideModal'; // Nueva importación
import { jsPDF } from 'jspdf';
import { ASSISTANT_REGISTRY, AssistantKey, AssistantTheme, getDefaultAssistantKey, getDefaultAssistantTheme } from './assistants';

const MIN_FONT_SIZE_LEVEL = -2; 
const MAX_FONT_SIZE_LEVEL = 2;  
const DEFAULT_FONT_SIZE_LEVEL = 0; 

const App: React.FC = () => {
  const [appMetadata, setAppMetadata] = useState<AppMetadata | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedAssistantKey, setSelectedAssistantKey] = useState<AssistantKey | null>(null);
  const [currentTheme, setCurrentTheme] = useState<AssistantTheme>(getDefaultAssistantTheme());

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [showClearConfirmationModal, setShowClearConfirmationModal] = useState(false);
  const [favoriteMessageIds, setFavoriteMessageIds] = useState<string[]>([]);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);

  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(DEFAULT_FONT_SIZE_LEVEL);

  const [isHelpGuideModalOpen, setIsHelpGuideModalOpen] = useState(false); // Nuevo estado

  useEffect(() => {
    fetch('metadata.json')
      .then(response => response.json())
      .then((data: AppMetadata) => setAppMetadata(data))
      .catch(error => {
        console.error("Could not load app metadata:", error);
        setAppMetadata({ 
          name: "Asistente (Error)",
          description: "No se pudieron cargar los detalles. Intente recargar.",
          requestFramePermissions: [],
          prompt: ""
        });
      });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedAssistantKey = localStorage.getItem('selectedAssistantKey') as AssistantKey | null;
    const storedFavorites = localStorage.getItem('favoriteMessageIds');
    const storedFontSizeLevel = localStorage.getItem('fontSizeLevel');

    if (storedFavorites) {
      try {
        const parsedFavorites = JSON.parse(storedFavorites);
        if (Array.isArray(parsedFavorites)) setFavoriteMessageIds(parsedFavorites);
      } catch (error) { console.error("Error parsing favorites:", error); localStorage.removeItem('favoriteMessageIds');}
    }

    if (storedFontSizeLevel) {
      const level = parseInt(storedFontSizeLevel, 10);
      if (!isNaN(level) && level >= MIN_FONT_SIZE_LEVEL && level <= MAX_FONT_SIZE_LEVEL) {
        setFontSizeLevel(level);
      } else {
        localStorage.removeItem('fontSizeLevel');
      }
    }

    if (storedUserName && storedAssistantKey && ASSISTANT_REGISTRY[storedAssistantKey]) {
      const theme = ASSISTANT_REGISTRY[storedAssistantKey];
      setUserName(storedUserName);
      setSelectedAssistantKey(storedAssistantKey);
      setCurrentTheme(theme);

      const storedMessages = localStorage.getItem(`messages_${storedUserName}_${storedAssistantKey}`);
      if (storedMessages) {
        try {
          const parsedMessages: Message[] = JSON.parse(storedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp) 
          }));
          setMessages(parsedMessages);
        } catch (error) {
          console.error("Error parsing messages from localStorage:", error);
          localStorage.removeItem(`messages_${storedUserName}_${storedAssistantKey}`);
          initializeChatMessages(storedUserName, theme); 
        }
      } else {
        initializeChatMessages(storedUserName, theme);
      }
    } else {
      localStorage.removeItem('userName');
      localStorage.removeItem('selectedAssistantKey');
      Object.values(AssistantKey).forEach(key => {
        if (storedUserName) localStorage.removeItem(`messages_${storedUserName}_${key}`);
      });
      localStorage.removeItem('chatAppMessages'); 
    }
  }, []); 


  useEffect(() => {
    if (userName && selectedAssistantKey && messages.length > 0) {
      localStorage.setItem(`messages_${userName}_${selectedAssistantKey}`, JSON.stringify(messages));
    }
  }, [messages, userName, selectedAssistantKey]);

  useEffect(() => {
    localStorage.setItem('fontSizeLevel', fontSizeLevel.toString());
  }, [fontSizeLevel]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); 
      setDeferredInstallPrompt(e as BeforeInstallPromptEvent);
      console.log('`beforeinstallprompt` event was fired.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    const handleAppInstalled = () => {
      setDeferredInstallPrompt(null);
      console.log('PWA was installed');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    const checkStandaloneMode = () => {
        const runningStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (runningStandalone) {
            console.log("App is running in standalone mode.");
        }
        setIsStandalone(runningStandalone);
    };
    checkStandaloneMode();
  }, []);


  const initializeChatMessages = useCallback((name: string, theme: AssistantTheme) => {
    setMessages([
      {
        id: 'initial-greeting',
        text: theme.initialGreeting(name),
        sender: Sender.AI,
        timestamp: new Date(),
        avatar: theme.avatarUrl,
      }
    ]);
  }, []); 

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages]);

  const handleUserIdentified = useCallback((name: string, assistantKey: AssistantKey) => {
    if (name.trim() && assistantKey && ASSISTANT_REGISTRY[assistantKey]) { 
      const trimmedName = name.trim();
      const theme = ASSISTANT_REGISTRY[assistantKey];
      
      if(userName && selectedAssistantKey && (userName !== trimmedName || selectedAssistantKey !== assistantKey)) {
          localStorage.removeItem(`messages_${userName}_${selectedAssistantKey}`);
      }

      setUserName(trimmedName);
      setSelectedAssistantKey(assistantKey);
      setCurrentTheme(theme);
      localStorage.setItem('userName', trimmedName);
      localStorage.setItem('selectedAssistantKey', assistantKey);
      
      const storedMessages = localStorage.getItem(`messages_${trimmedName}_${assistantKey}`);
      if (storedMessages) {
        try {
          const parsedMessages: Message[] = JSON.parse(storedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(parsedMessages);
        } catch (e) {
          localStorage.removeItem(`messages_${trimmedName}_${assistantKey}`);
          initializeChatMessages(trimmedName, theme);
        }
      } else {
        initializeChatMessages(trimmedName, theme); 
      }
    }
  }, [initializeChatMessages, userName, selectedAssistantKey]);

  const handleSendMessage = useCallback(async (userMessageText: string) => {
    if (!userMessageText.trim() || !userName || !selectedAssistantKey) return;
    if (!isOnline) {
      const offlineUserMsg: Message = {
        id: Date.now().toString(),
        text: userMessageText,
        sender: Sender.USER,
        timestamp: new Date(),
      };
      const offlineAIMsg: Message = {
          id: `ai-offline-${Date.now()}`,
          text: "Parece que estás desconectado. No puedo procesar tu mensaje ahora mismo. Por favor, revisa tu conexión a internet.",
          sender: Sender.AI,
          timestamp: new Date(),
          avatar: currentTheme.avatarUrl,
      };
      setMessages(prevMessages => [...prevMessages, offlineUserMsg, offlineAIMsg]);
      return;
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: Sender.USER,
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setIsLoading(true);

    const currentChatHistory: GeminiChatHistoryItem[] = messages.map(msg => ({
        role: msg.sender === Sender.USER ? 'user' : 'model',
        parts: [{ text: msg.text }],
    }));
    
    const aiMessageId = `ai-${Date.now()}`;
    setMessages(prevMessages => [
        ...prevMessages,
        {
            id: aiMessageId,
            text: '',
            sender: Sender.AI,
            timestamp: new Date(),
            avatar: currentTheme.avatarUrl,
        },
    ]);

    try {
      const historyForGemini = [...currentChatHistory, { role: 'user' as 'user', parts: [{ text: userMessageText }] }];
      for await (const chunk of getAssistantResponseStream(userMessageText, historyForGemini, currentTheme.systemInstruction)) {
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: msg.text + chunk } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === aiMessageId ? { ...msg, text: "Lo siento, he encontrado un error al procesar tu solicitud. Por favor, inténtalo de nuevo." } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, userName, selectedAssistantKey, currentTheme, isOnline]);

  const handleRequestClearChat = () => setShowClearConfirmationModal(true);

  const handleConfirmClearChat = () => {
    if (userName && selectedAssistantKey) {
      localStorage.removeItem(`messages_${userName}_${selectedAssistantKey}`); 
      initializeChatMessages(userName, currentTheme);
    }
    setShowClearConfirmationModal(false);
  };

  const handleCancelClearChat = () => setShowClearConfirmationModal(false);

  const openAboutModal = () => setIsAboutModalOpen(true);
  const closeAboutModal = () => setIsAboutModalOpen(false);

  const handleToggleFavorite = useCallback((messageId: string) => {
    setFavoriteMessageIds(prevFavorites => {
      const newFavorites = prevFavorites.includes(messageId)
        ? prevFavorites.filter(id => id !== messageId)
        : [...prevFavorites, messageId];
      localStorage.setItem('favoriteMessageIds', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const handleOpenFavoritesModal = () => setIsFavoritesModalOpen(true);
  const handleCloseFavoritesModal = () => setIsFavoritesModalOpen(false);

  const handleRequestChangeAssistant = () => {
    setUserName(null);
    setSelectedAssistantKey(null);
    setMessages([]); 
    localStorage.removeItem('userName');
    localStorage.removeItem('selectedAssistantKey');
  };

  const handleDownloadChatPdf = () => {
    if (!appMetadata || !userName || !selectedAssistantKey || messages.length === 0) {
      alert("No hay mensajes para descargar o la aplicación no está completamente cargada.");
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
      const FONT_SIZE_TIMESTAMP = 8;
      const FONT_SIZE_TEXT = 10;
      
      const LINE_HEIGHT_TIMESTAMP = FONT_SIZE_TIMESTAMP * 1.2;
      const LINE_HEIGHT_TEXT = FONT_SIZE_TEXT * 1.2;
  
      const PADDING_AFTER_TITLE = 5;
      const PADDING_AFTER_SUBTITLE = 15;
      const PADDING_AFTER_TIMESTAMP = 4;
      const PADDING_BETWEEN_MESSAGES = 10;
  
      let y = TOP_MARGIN_INITIAL;
  
      doc.setFontSize(FONT_SIZE_TITLE);
      doc.text(currentTheme.name, pageWidth / 2, y, { align: 'center' });
      y += FONT_SIZE_TITLE + PADDING_AFTER_TITLE;
  
      doc.setFontSize(FONT_SIZE_SUBTITLE);
      doc.text(`Conversación con ${userName}`, pageWidth / 2, y, { align: 'center'});
      y += FONT_SIZE_SUBTITLE + PADDING_AFTER_SUBTITLE;
  
      messages.forEach((msg) => {
        const senderPrefix = msg.sender === Sender.USER ? `${userName}:` : `${currentTheme.name}:`;
        const timestampText = msg.timestamp.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
        
        let pdfText = msg.text.replace(/\*\*(.*?)\*\*/g, '$1'); 
        pdfText = pdfText.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1 ($2)');
        const messageContent = `${senderPrefix} ${pdfText}`;
        
        doc.setFontSize(FONT_SIZE_TEXT);
        const textLines = doc.splitTextToSize(messageContent, MAX_LINE_WIDTH);
        const textBlockHeight = textLines.length * LINE_HEIGHT_TEXT;
        const timestampBlockHeight = LINE_HEIGHT_TIMESTAMP;
        const totalMessageHeight = timestampBlockHeight + PADDING_AFTER_TIMESTAMP + textBlockHeight;
  
        if (y + totalMessageHeight > pageHeight - BOTTOM_MARGIN) {
          doc.addPage();
          y = TOP_MARGIN_NEW_PAGE; 
        }
  
        doc.setFontSize(FONT_SIZE_TIMESTAMP);
        doc.setTextColor(128, 128, 128); 
        doc.text(timestampText, MARGIN, y);
        y += timestampBlockHeight + PADDING_AFTER_TIMESTAMP;
        doc.setTextColor(0, 0, 0); 
  
        if (y + textBlockHeight > pageHeight - BOTTOM_MARGIN) {
            doc.addPage();
            y = TOP_MARGIN_NEW_PAGE;
        }
        doc.setFontSize(FONT_SIZE_TEXT);
        doc.text(textLines, MARGIN, y);
        y += textBlockHeight;
  
        y += PADDING_BETWEEN_MESSAGES;
      });
  
      doc.save(`chat_${selectedAssistantKey}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Ocurrió un error al generar el PDF. Por favor, inténtalo de nuevo.");
    }
  };

  const handleInstallClick = async () => {
    if (!deferredInstallPrompt) {
      console.log("Deferred install prompt not available.");
      return;
    }
    deferredInstallPrompt.prompt(); 
    const { outcome } = await deferredInstallPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredInstallPrompt(null); 
  };

  const handleIncreaseFontSize = () => {
    setFontSizeLevel(prev => Math.min(prev + 1, MAX_FONT_SIZE_LEVEL));
  };

  const handleDecreaseFontSize = () => {
    setFontSizeLevel(prev => Math.max(prev - 1, MIN_FONT_SIZE_LEVEL));
  };

  const getFontSizeClass = (level: number): string => {
    if (level <= -2) return 'chat-font-xs'; 
    if (level === -1) return 'chat-font-sm'; 
    if (level === 0) return 'chat-font-md'; 
    if (level === 1) return 'chat-font-lg'; 
    if (level >= 2) return 'chat-font-xl'; 
    return 'chat-font-md';
  };

  const openHelpGuideModal = () => setIsHelpGuideModalOpen(true);
  const closeHelpGuideModal = () => setIsHelpGuideModalOpen(false);

  if (!appMetadata) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-100 p-6">
        <LoadingSpinner />
        <p className="text-slate-700 mt-4">Cargando configuración...</p>
      </div>
    );
  }

  if (!userName || !selectedAssistantKey || !ASSISTANT_REGISTRY[selectedAssistantKey]) {
    return (
    <>
      <WelcomePage
        onUserIdentified={handleUserIdentified}
        initialAppMetadata={{name: appMetadata.name, description: appMetadata.description}}
        onOpenHelpGuideModal={openHelpGuideModal} // Pasar la función
      />
      {deferredInstallPrompt && !isStandalone && (
        <InstallPWAButton 
          onClick={handleInstallClick} 
          theme={ASSISTANT_REGISTRY[getDefaultAssistantKey()]}
        />
      )}
       <HelpGuideModal
        isOpen={isHelpGuideModalOpen}
        onClose={closeHelpGuideModal}
        theme={ASSISTANT_REGISTRY[getDefaultAssistantKey()]} // Usar tema por defecto en WelcomePage
      />
    </>
    );
  }

  return (
    <>
      {!isOnline && <OfflineBanner theme={currentTheme} />}
      <div className={`flex flex-col h-screen max-w-3xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden ${getFontSizeClass(fontSizeLevel)}`}>
        <Header 
          theme={currentTheme}
          onRequestClearChat={handleRequestClearChat}
          onOpenAboutModal={openAboutModal}
          onOpenFavoritesModal={handleOpenFavoritesModal}
          onDownloadChatPdf={handleDownloadChatPdf}
          onRequestChangeAssistant={handleRequestChangeAssistant}
          onIncreaseFontSize={handleIncreaseFontSize}
          onDecreaseFontSize={handleDecreaseFontSize}
          currentFontSizeLevel={fontSizeLevel}
          minFontSizeLevel={MIN_FONT_SIZE_LEVEL}
          maxFontSizeLevel={MAX_FONT_SIZE_LEVEL}
          onOpenHelpGuideModal={openHelpGuideModal} // Pasar la función
        />
        <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              message={msg}
              theme={currentTheme}
              isFavorite={favoriteMessageIds.includes(msg.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
          {isLoading && messages[messages.length-1]?.sender === Sender.AI && messages[messages.length-1]?.text === '' && (
            <div className="flex justify-start items-center space-x-2">
              <img src={currentTheme.avatarUrl} alt={currentTheme.name} className="w-10 h-10 rounded-full" />
              <LoadingSpinner /> 
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} theme={currentTheme} />
      </div>

      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={closeAboutModal} 
        content={currentTheme.aboutContent}
        theme={currentTheme}
        onOpenHelpGuideModal={openHelpGuideModal} // Pasar la función
      />

      <ConfirmationModal
        isOpen={showClearConfirmationModal}
        onClose={handleCancelClearChat}
        onConfirm={handleConfirmClearChat}
        title="Confirmar Limpieza del Chat"
        message="¿Estás seguro de que quieres borrar todos los mensajes de esta conversación? Esta acción no se puede deshacer."
        theme={currentTheme}
      />

      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={handleCloseFavoritesModal}
        messages={messages}
        favoriteMessageIds={favoriteMessageIds}
        onToggleFavorite={handleToggleFavorite}
        userName={userName}
        theme={currentTheme}
      />
      
      {deferredInstallPrompt && !isStandalone && currentTheme && (
        <InstallPWAButton onClick={handleInstallClick} theme={currentTheme} />
      )}

      <HelpGuideModal
        isOpen={isHelpGuideModalOpen}
        onClose={closeHelpGuideModal}
        theme={currentTheme || getDefaultAssistantTheme()} // Usar tema actual o por defecto
      />
    </>
  );
};

export default App;
