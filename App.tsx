
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { LoadingSpinner } from './components/LoadingSpinner';
import { WelcomePage } from './components/WelcomePage';
import { Message, Sender, GeminiChatHistoryItem, AppMetadata, BeforeInstallPromptEvent, Conversation } from './types';
import { getAssistantResponseStream } from './services/geminiService';
import { AboutModal } from './components/AboutModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { FavoritesModal } from './components/FavoritesModal';
import { InstallPWAButton } from './components/InstallPWAButton';
import { OfflineBanner } from './components/OfflineBanner';
import { HelpGuideModal } from './components/HelpGuideModal';
import { Sidebar } from './components/Sidebar'; 
import { jsPDF } from 'jspdf';
import { ASSISTANT_REGISTRY, AssistantKey, AssistantTheme, getDefaultAssistantKey, getDefaultAssistantTheme } from './assistants';
import FloatingButton from "./components/FloatingButton";

const MIN_FONT_SIZE_LEVEL = -2; 
const MAX_FONT_SIZE_LEVEL = 2;  
const DEFAULT_FONT_SIZE_LEVEL = 0; 

const App: React.FC = () => {
  const [appMetadata, setAppMetadata] = useState<AppMetadata | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedAssistantKey, setSelectedAssistantKey] = useState<AssistantKey | null>(null);
  const [currentTheme, setCurrentTheme] = useState<AssistantTheme>(getDefaultAssistantTheme());

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]); 

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); 
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [showClearConfirmationModal, setShowClearConfirmationModal] = useState(false);
  const [showDeleteConversationModal, setShowDeleteConversationModal] = useState<string | null>(null); 
  const [favoriteMessageIds, setFavoriteMessageIds] = useState<string[]>([]);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);

  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(DEFAULT_FONT_SIZE_LEVEL);
  const [isHelpGuideModalOpen, setIsHelpGuideModalOpen] = useState(false);

  const formatConversationTitle = (date: Date): string => {
    return `Conversación ${date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const createNewConversationObject = (uName: string, assistantKey: AssistantKey, theme: AssistantTheme, id?: string): Conversation => {
    const newId = id || `conv_${Date.now()}`;
    return {
      id: newId,
      userName: uName,
      assistantKey: assistantKey,
      title: formatConversationTitle(new Date()),
      messages: [{
        id: `initial-${newId}`,
        text: theme.initialGreeting(uName),
        sender: Sender.AI,
        timestamp: new Date(),
        avatar: theme.avatarUrl,
      }],
      timestamp: new Date(),
    };
  };
  
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
    const storedFavorites = localStorage.getItem('favoriteMessageIds');
    const storedFontSizeLevel = localStorage.getItem('fontSizeLevel');

    if (storedFavorites) {
      try {
        const parsedFavorites = JSON.parse(storedFavorites);
        if (Array.isArray(parsedFavorites)) setFavoriteMessageIds(parsedFavorites);
      } catch (error) { 
        console.error("Error parsing favorites:", error);
        localStorage.removeItem('favoriteMessageIds');
      }
    }
    if (storedFontSizeLevel) {
      const level = parseInt(storedFontSizeLevel, 10);
      if (!isNaN(level) && level >= MIN_FONT_SIZE_LEVEL && level <= MAX_FONT_SIZE_LEVEL) {
        setFontSizeLevel(level);
      } else {
        localStorage.removeItem('fontSizeLevel');
      }
    }
    
    // Ensure currentTheme is set to a default if no user/assistant is loaded.
    // This is primarily for components like HelpGuideModal shown from WelcomePage.
    if (!selectedAssistantKey || !ASSISTANT_REGISTRY[selectedAssistantKey]) {
      setCurrentTheme(getDefaultAssistantTheme());
    }

  }, []);


  useEffect(() => {
    if (userName && selectedAssistantKey && conversations.length > 0) {
      localStorage.setItem(`conversations_${userName}_${selectedAssistantKey}`, JSON.stringify(conversations));
    }
  }, [conversations, userName, selectedAssistantKey]);

  useEffect(() => {
    if (userName && selectedAssistantKey && currentConversationId) {
      localStorage.setItem(`currentConversationId_${userName}_${selectedAssistantKey}`, currentConversationId);
    }
  }, [currentConversationId, userName, selectedAssistantKey]);


  useEffect(() => { localStorage.setItem('fontSizeLevel', fontSizeLevel.toString()); }, [fontSizeLevel]);
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => { e.preventDefault(); setDeferredInstallPrompt(e as BeforeInstallPromptEvent); };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);
  useEffect(() => {
    const handleAppInstalled = () => { setDeferredInstallPrompt(null); };
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => window.removeEventListener('appinstalled', handleAppInstalled);
  }, []);
  useEffect(() => { setIsStandalone(window.matchMedia('(display-mode: standalone)').matches); }, []);
  
  const scrollToBottom = () => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { if (messages.length > 0) scrollToBottom(); }, [messages]);

  const handleUserIdentified = useCallback((name: string, assistantKey: AssistantKey) => {
    if (name.trim() && assistantKey && ASSISTANT_REGISTRY[assistantKey]) {
      const trimmedName = name.trim();
      const theme = ASSISTANT_REGISTRY[assistantKey];

      setUserName(trimmedName);
      setSelectedAssistantKey(assistantKey);
      setCurrentTheme(theme); 
      localStorage.setItem('userName', trimmedName);
      localStorage.setItem('selectedAssistantKey', assistantKey);

      const storedConversationsJSON = localStorage.getItem(`conversations_${trimmedName}_${assistantKey}`);
      let loadedConversations: Conversation[] = [];
      if (storedConversationsJSON) {
        try {
          loadedConversations = JSON.parse(storedConversationsJSON).map((conv: any) => ({
            ...conv,
            timestamp: new Date(conv.timestamp),
            messages: conv.messages.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) }))
          }));
        } catch (e) { console.error("Error parsing conversations for new user:", e); }
      }

      if (loadedConversations.length === 0) {
        const initialConv = createNewConversationObject(trimmedName, assistantKey, theme);
        loadedConversations.push(initialConv);
      }
      setConversations(loadedConversations);

      const storedCurrentConversationId = localStorage.getItem(`currentConversationId_${trimmedName}_${assistantKey}`);
      const activeConv = loadedConversations.find(c => c.id === storedCurrentConversationId) || loadedConversations[loadedConversations.length - 1];

      if (activeConv) {
        setCurrentConversationId(activeConv.id);
        setMessages(activeConv.messages);
      } else { 
        const newConv = createNewConversationObject(trimmedName, assistantKey, theme);
        setConversations([newConv]);
        setCurrentConversationId(newConv.id);
        setMessages(newConv.messages);
      }
    }
  }, []);


  const handleSendMessage = useCallback(async (userMessageText: string) => {
    if (!userMessageText.trim() || !userName || !selectedAssistantKey || !currentConversationId) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: Sender.USER,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setConversations(prevConvs => prevConvs.map(conv => 
      conv.id === currentConversationId 
        ? { ...conv, messages: [...conv.messages, newUserMessage], timestamp: new Date() }
        : conv
    ));

    if (!isOnline) {
      const offlineAIMsg: Message = {
          id: `ai-offline-${Date.now()}`,
          text: "Parece que estás desconectado. No puedo procesar tu mensaje ahora mismo. Por favor, revisa tu conexión a internet.",
          sender: Sender.AI,
          timestamp: new Date(),
          avatar: currentTheme.avatarUrl,
      };
      setMessages(prev => [...prev, offlineAIMsg]);
      setConversations(prevConvs => prevConvs.map(conv => 
        conv.id === currentConversationId 
          ? { ...conv, messages: [...conv.messages, offlineAIMsg], timestamp: new Date() }
          : conv
      ));
      return;
    }

    setIsLoading(true);
    const currentConversation = conversations.find(c => c.id === currentConversationId);
    const historyForGemini: GeminiChatHistoryItem[] = (currentConversation?.messages || [])
      .filter(msg => msg.id !== newUserMessage.id) 
      .map(msg => ({
        role: msg.sender === Sender.USER ? 'user' : 'model',
        parts: [{ text: msg.text }],
    }));
    
    const aiMessageId = `ai-${Date.now()}`;
    const placeholderAiMessage: Message = {
      id: aiMessageId, text: '', sender: Sender.AI, timestamp: new Date(), avatar: currentTheme.avatarUrl
    };

    setMessages(prev => [...prev, placeholderAiMessage]);
    setConversations(prevConvs => prevConvs.map(conv => 
      conv.id === currentConversationId 
        ? { ...conv, messages: [...conv.messages, placeholderAiMessage], timestamp: new Date() }
        : conv
    ));

    let accumulatedResponse = "";
    try {
      const geminiHistory = [...historyForGemini, { role: 'user' as 'user', parts: [{ text: userMessageText }] }];
      for await (const chunk of getAssistantResponseStream(userMessageText, geminiHistory, currentTheme.systemInstruction)) {
        accumulatedResponse += chunk;
        setMessages(prevMsgs => prevMsgs.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: accumulatedResponse } : msg
        ));
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      accumulatedResponse = "Lo siento, he encontrado un error al procesar tu solicitud. Por favor, inténtalo de nuevo.";
      setMessages(prevMsgs => prevMsgs.map(msg =>
          msg.id === aiMessageId ? { ...msg, text: accumulatedResponse } : msg
      ));
    } finally {
      setIsLoading(false);
      setConversations(prevConvs => prevConvs.map(conv => {
        if (conv.id === currentConversationId) {
          const updatedMessages = conv.messages.map(msg => 
            msg.id === aiMessageId ? { ...msg, text: accumulatedResponse } : msg
          );
          return { ...conv, messages: updatedMessages, timestamp: new Date() };
        }
        return conv;
      }));
    }
  }, [conversations, currentConversationId, userName, selectedAssistantKey, currentTheme, isOnline]);

  const handleNewConversation = useCallback(() => {
    if (!userName || !selectedAssistantKey) return;
    const newConv = createNewConversationObject(userName, selectedAssistantKey, currentTheme);
    setConversations(prev => [newConv, ...prev]); 
    setCurrentConversationId(newConv.id);
    setMessages(newConv.messages);
    if (window.innerWidth < 768) setIsSidebarOpen(false); 
  }, [userName, selectedAssistantKey, currentTheme]);

  const handleLoadConversation = useCallback((conversationId: string) => {
    const conversationToLoad = conversations.find(c => c.id === conversationId);
    if (conversationToLoad) {
      setCurrentConversationId(conversationId);
      setMessages(conversationToLoad.messages);
      if (window.innerWidth < 768) setIsSidebarOpen(false); 
    }
  }, [conversations]);
  
  const handleRequestDeleteConversation = (conversationId: string) => {
    setShowDeleteConversationModal(conversationId);
  };

  const handleConfirmDeleteConversation = () => {
    if (!showDeleteConversationModal || !userName || !selectedAssistantKey) return;
    const conversationIdToDelete = showDeleteConversationModal;

    setConversations(prev => prev.filter(c => c.id !== conversationIdToDelete));
    
    if (currentConversationId === conversationIdToDelete) {
      const remainingConversations = conversations.filter(c => c.id !== conversationIdToDelete);
      if (remainingConversations.length > 0) {
        const latestConversation = [...remainingConversations].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
        setCurrentConversationId(latestConversation.id);
        setMessages(latestConversation.messages);
      } else {
        const newConv = createNewConversationObject(userName, selectedAssistantKey, currentTheme);
        setConversations([newConv]);
        setCurrentConversationId(newConv.id);
        setMessages(newConv.messages);
      }
    }
    setShowDeleteConversationModal(null);
  };

  const handleRequestClearChat = () => setShowClearConfirmationModal(true);

  const handleConfirmClearChat = () => { 
    if (!currentConversationId || !userName || !selectedAssistantKey) return;
    const newMessages: Message[] = [{
        id: `initial-cleared-${currentConversationId}`,
        text: currentTheme.initialGreeting(userName),
        sender: Sender.AI,
        timestamp: new Date(),
        avatar: currentTheme.avatarUrl,
    }];
    setMessages(newMessages);
    setConversations(prevConvs => prevConvs.map(conv =>
      conv.id === currentConversationId
        ? { ...conv, messages: newMessages, title: formatConversationTitle(new Date()), timestamp: new Date() } 
        : conv
    ));
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
    // currentTheme will reset to default via useEffect or when WelcomePage shows
    setCurrentConversationId(null); 
    setMessages([]); 
  };

  const handleDownloadChatPdf = () => {
    if (!appMetadata || !userName || !selectedAssistantKey || !currentConversationId || messages.length === 0) {
      alert("No hay mensajes para descargar o la aplicación no está completamente cargada.");
      return;
    }
    const currentConversation = conversations.find(c => c.id === currentConversationId);
    if (!currentConversation) return;

    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const MARGIN = 30, TOP_MARGIN_INITIAL = 40, TOP_MARGIN_NEW_PAGE = 30, BOTTOM_MARGIN = 30;
      const MAX_LINE_WIDTH = pageWidth - MARGIN * 2;
      const FONT_SIZE_TITLE = 16, FONT_SIZE_SUBTITLE = 12, FONT_SIZE_TIMESTAMP = 8, FONT_SIZE_TEXT = 10;
      const LINE_HEIGHT_TIMESTAMP = FONT_SIZE_TIMESTAMP * 1.2, LINE_HEIGHT_TEXT = FONT_SIZE_TEXT * 1.2;
      const PADDING_AFTER_TITLE = 5, PADDING_AFTER_SUBTITLE = 15, PADDING_AFTER_TIMESTAMP = 4, PADDING_BETWEEN_MESSAGES = 10;
      let y = TOP_MARGIN_INITIAL;

      doc.setFontSize(FONT_SIZE_TITLE);
      doc.text(currentTheme.name, pageWidth / 2, y, { align: 'center' });
      y += FONT_SIZE_TITLE + PADDING_AFTER_TITLE;
      doc.setFontSize(FONT_SIZE_SUBTITLE);
      doc.text(`Conversación con ${userName} (${currentConversation.title})`, pageWidth / 2, y, { align: 'center'});
      y += FONT_SIZE_SUBTITLE + PADDING_AFTER_SUBTITLE;

      currentConversation.messages.forEach((msg) => {
        const senderPrefix = msg.sender === Sender.USER ? `${userName}:` : `${currentTheme.name}:`;
        let pdfText = msg.text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1 ($2)');
        const messageContent = `${senderPrefix} ${pdfText}`;
        doc.setFontSize(FONT_SIZE_TEXT);
        const textLines = doc.splitTextToSize(messageContent, MAX_LINE_WIDTH);
        const textBlockHeight = textLines.length * LINE_HEIGHT_TEXT;
        const timestampBlockHeight = LINE_HEIGHT_TIMESTAMP;
        const totalMessageHeight = timestampBlockHeight + PADDING_AFTER_TIMESTAMP + textBlockHeight;

        if (y + totalMessageHeight > pageHeight - BOTTOM_MARGIN) { doc.addPage(); y = TOP_MARGIN_NEW_PAGE; }
        doc.setFontSize(FONT_SIZE_TIMESTAMP); doc.setTextColor(128, 128, 128); doc.text(msg.timestamp.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }), MARGIN, y);
        y += timestampBlockHeight + PADDING_AFTER_TIMESTAMP; doc.setTextColor(0, 0, 0);
        if (y + textBlockHeight > pageHeight - BOTTOM_MARGIN) { doc.addPage(); y = TOP_MARGIN_NEW_PAGE; }
        doc.setFontSize(FONT_SIZE_TEXT); doc.text(textLines, MARGIN, y);
        y += textBlockHeight + PADDING_BETWEEN_MESSAGES;
      });
      doc.save(`chat_${selectedAssistantKey}_${currentConversation.id.substring(0,8)}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) { console.error("Error generating PDF:", error); alert("Ocurrió un error al generar el PDF."); }
  };

  const handleInstallClick = async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt(); 
    const { outcome } = await deferredInstallPrompt.userChoice;
    setDeferredInstallPrompt(null); 
  };

  const handleIncreaseFontSize = () => setFontSizeLevel(prev => Math.min(prev + 1, MAX_FONT_SIZE_LEVEL));
  const handleDecreaseFontSize = () => setFontSizeLevel(prev => Math.max(prev - 1, MIN_FONT_SIZE_LEVEL));
  const getFontSizeClass = (level: number): string => {
    if (level <= -2) return 'chat-font-xs'; if (level === -1) return 'chat-font-sm'; 
    if (level === 0) return 'chat-font-md'; if (level === 1) return 'chat-font-lg'; 
    if (level >= 2) return 'chat-font-xl'; return 'chat-font-md';
  };

  const openHelpGuideModal = () => setIsHelpGuideModalOpen(true);
  const closeHelpGuideModal = () => setIsHelpGuideModalOpen(false);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  if (!appMetadata) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-100 p-6">
        <LoadingSpinner /><p className="text-slate-700 mt-4">Cargando configuración...</p>
      </div>
    );
  }

  if (!userName || !selectedAssistantKey || !ASSISTANT_REGISTRY[selectedAssistantKey] || !currentConversationId) {
    const themeForModals = currentTheme || getDefaultAssistantTheme();
    return (
    <>
      <WelcomePage
        onUserIdentified={handleUserIdentified}
        initialAppMetadata={{name: appMetadata.name, description: appMetadata.description}}
        onOpenHelpGuideModal={openHelpGuideModal}
      />
       <HelpGuideModal isOpen={isHelpGuideModalOpen} onClose={closeHelpGuideModal} theme={themeForModals} />
       {deferredInstallPrompt && !isStandalone && (
        <InstallPWAButton onClick={handleInstallClick} theme={themeForModals} isFixed={true}/>
      )}
    </>
    );
  }
  
  const currentFullConversation = conversations.find(c => c.id === currentConversationId);

  return (
    <>
      {!isOnline && <OfflineBanner theme={currentTheme} />}
      <div className={`flex h-screen overflow-hidden ${getFontSizeClass(fontSizeLevel)}`}>
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
          theme={currentTheme}
          appMetadataName={appMetadata.name}
          conversations={conversations.filter(c => c.userName === userName && c.assistantKey === selectedAssistantKey)
                                      .sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime())}
          currentConversationId={currentConversationId}
          onNewConversation={handleNewConversation}
          onLoadConversation={handleLoadConversation}
          onDeleteConversation={handleRequestDeleteConversation}
          userName={userName}
          deferredInstallPrompt={deferredInstallPrompt}
          isStandalone={isStandalone}
          onInstallClick={handleInstallClick}
        />

        <div className={`flex-1 flex flex-col bg-white shadow-2xl overflow-hidden max-w-full
                         transition-all duration-300 ease-in-out
                         ${isSidebarOpen ? 'md:ml-72' : 'ml-0'}`}>
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
            onOpenHelpGuideModal={openHelpGuideModal}
            onToggleSidebar={toggleSidebar} 
            isSidebarPresent={true} 
          />
          <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50">
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
      </div>

      <AboutModal isOpen={isAboutModalOpen} onClose={closeAboutModal} content={currentTheme.aboutContent} theme={currentTheme} onOpenHelpGuideModal={openHelpGuideModal} />
      <ConfirmationModal
        isOpen={showClearConfirmationModal}
        onClose={handleCancelClearChat}
        onConfirm={handleConfirmClearChat}
        title="Confirmar Limpieza del Chat Actual"
        message="¿Estás seguro de que quieres borrar todos los mensajes de esta conversación? Esta acción no se puede deshacer y reiniciará la conversación actual."
        theme={currentTheme}
      />
       <ConfirmationModal
        isOpen={!!showDeleteConversationModal}
        onClose={() => setShowDeleteConversationModal(null)}
        onConfirm={handleConfirmDeleteConversation}
        title="Confirmar Eliminación de Conversación"
        message={`¿Estás seguro de que quieres eliminar permanentemente la conversación "${conversations.find(c=>c.id===showDeleteConversationModal)?.title || ''}"? Esta acción no se puede deshacer.`}
        theme={currentTheme}
        confirmButtonText="Eliminar"
      />
      <FavoritesModal isOpen={isFavoritesModalOpen} onClose={handleCloseFavoritesModal} messages={currentFullConversation?.messages || []} favoriteMessageIds={favoriteMessageIds} onToggleFavorite={handleToggleFavorite} userName={userName} theme={currentTheme}/>
      <HelpGuideModal isOpen={isHelpGuideModalOpen} onClose={closeHelpGuideModal} theme={currentTheme || getDefaultAssistantTheme()} />
      <FloatingButton />
    </>
  );
};

export default App;