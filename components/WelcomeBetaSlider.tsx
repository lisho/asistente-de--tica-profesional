import React, { useState } from 'react';
import { ASSISTANT_REGISTRY, AssistantKey } from '../assistants';
import { HOW_TO_USE_SECTIONS, BUTTON_LEGEND_ITEMS } from '../constants/modalContent';

interface WelcomeBetaSliderProps {
    isOpen: boolean;
    onClose: () => void;
    appVersion?: string;
    appName?: string;
}

export const WelcomeBetaSlider: React.FC<WelcomeBetaSliderProps> = ({
    isOpen,
    onClose,
    appVersion = 'Beta',
    appName = 'Asistente de Ética Profesional',
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    if (!isOpen) return null;

    const eulogio = ASSISTANT_REGISTRY[AssistantKey.EULOGIO];
    const pepi = ASSISTANT_REGISTRY[AssistantKey.PEPI];

    const renderInstructions = () => (
        <div className="space-y-4">
            <div className="space-y-4">
                {HOW_TO_USE_SECTIONS.map((section, index) => (
                    <div key={`htu-${index}`} className="bg-white/40 p-3 sm:p-4 rounded-xl border border-blue-50">
                        <h4 className="font-bold text-slate-800 text-sm mb-1">{section.heading}</h4>
                        {section.text && <p className="text-sm text-slate-700 whitespace-pre-wrap">{section.text}</p>}
                        {section.points && (
                            <ul className="list-disc list-inside space-y-2 pl-1 sm:pl-2 text-slate-700">
                                {section.points.map((point, pIndex) => (
                                    <li key={`htu-point-${index}-${pIndex}`} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ 
                                        __html: point.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                     .replace("(ver 'Leyenda de Botones' más abajo)", "(ver 'Leyenda de Botones' en la siguiente diapositiva)") 
                                    }}></li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
            <p className="text-xs sm:text-sm font-medium text-blue-800/80 text-center italic mt-4 px-2">
                * Recuerda que siempre puedes volver a consultar esta guía en la página de inicio o desde el menú de información del asistente activo (botón "i" en la parte superior).
            </p>
        </div>
    );

    const renderIcon = (iconKey?: string, fallbackEmoji?: string) => {
        const iconClass = "w-6 h-6 text-slate-700";
        
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
                return <span className="text-xl" aria-hidden="true">{fallbackEmoji}</span>;
        }
    };

    const renderLegend = () => (
        <div className="space-y-4">
            <div className="space-y-2 sm:space-y-3">
                {BUTTON_LEGEND_ITEMS.map((item: any, index: number) => (
                    <div key={`legend-${index}`} className="flex items-start gap-3 p-3 bg-white/50 rounded-lg border border-emerald-50">
                        <span className="flex-shrink-0 mt-0.5" aria-hidden="true">
                            {renderIcon(item.iconKey, item.icon)}
                        </span>
                        <div>
                            <p className="font-bold text-slate-800 text-sm leading-tight mb-1">{item.name} <span className="font-normal text-xs text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded-full ml-1 inline-block mt-1 sm:mt-0">{item.location}</span></p>
                            <p className="text-xs text-slate-600 mt-1 sm:mt-0 leading-relaxed">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-xs sm:text-sm font-medium text-emerald-800/80 text-center italic mt-4 px-2">
                * Estos son los controles principales. Podrás revisarlos siempre que quieras desde la guía en la página de inicio o desde el menú de información del asistente activo.
            </p>
        </div>
    );


    const renderRecomendaciones = () => (
        <div className="space-y-4">
            <div className="space-y-3">
                
                <div className="bg-white/50 p-3 sm:p-4 rounded-lg border border-purple-100 shadow-sm">
                    <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center"><span className="text-lg mr-2">🤔</span> ¿De qué va esta aplicación?</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">Este es un <strong>asistente para la reflexión ética</strong> en el Trabajo Social. <strong>No te dará recetas ni soluciones cerradas</strong>, sino que te acompañará en un proceso de deliberación fundamentada para que <strong>tú</strong> tomes decisiones responsables.</p>
                </div>

                <div className="bg-white/50 p-3 sm:p-4 rounded-lg border border-purple-100 shadow-sm">
                    <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center"><span className="text-lg mr-2">🔄</span> Profundiza e Itera</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">La reflexión ética es un proceso. <strong>No esperes obtener toda la información en una sola pregunta.</strong> Haz preguntas de seguimiento, pide aclaraciones y profundiza gradualmente.</p>
                </div>

                <div className="bg-white/50 p-3 sm:p-4 rounded-lg border border-purple-100 shadow-sm">
                    <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center"><span className="text-lg mr-2">💬</span> Habla con naturalidad</h4>
                    <p className="text-sm text-slate-700 mb-2 leading-relaxed">Escribe como si estuvieras hablando con un colega experto/a. Puedes decir cosas como:</p>
                    <ul className="list-disc list-inside text-sm text-slate-600 pl-1 sm:pl-2 space-y-1">
                        <li>"¿Podrías profundizar más en ese punto?"</li>
                        <li>"Dame un ejemplo práctico"</li>
                        <li>"Resume esto en pocas líneas"</li>
                    </ul>
                </div>

                <div className="bg-white/50 p-3 sm:p-4 rounded-lg border border-purple-100 shadow-sm">
                    <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center"><span className="text-lg mr-2">🎯</span> Tú tienes el control</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">Si la respuesta es muy larga, pide un <strong>resumen</strong>. Si es muy breve, solicita que se <strong>amplíe</strong>. Si algo no está claro, pide que se <strong>explique de otra forma</strong>.</p>
                </div>
                
            </div>
            
            <p className="text-xs sm:text-sm font-medium text-purple-800/80 text-center italic mt-4 px-2">
                * Estas recomendaciones y la guía técnica están siempre disponibles en la barra lateral de la sala de chat.
            </p>
        </div>
    );


    const slides = [
        {
            avatar: eulogio.avatarUrl,
            speaker: eulogio.name,
            speakerColor: 'text-slate-700',
            bubbleBg: 'bg-slate-200',
            bubbleText: 'text-slate-800',
            title: '¡Bienvenido/a a la fase beta!',
            content: (
                <div className="space-y-4">
                    <p>¡Muchas Gracias por participar en el testeo de la versión beta de la aplicación <strong>Deontolog-IA</strong>! Tu opinión es imprescindible para afinar esta herramienta.</p>
                    <div className="bg-slate-300/50 p-4 rounded-xl border border-slate-300">
                        <p className="font-semibold text-sm mb-3 flex items-center">
                            <span className="text-xl mr-2">🎯</span> Las tareas del testeo serán:
                        </p>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start">
                                <span className="mr-2">1️⃣</span>
                                <span><strong>Continúa</strong> para leer las instrucciones.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">2️⃣</span>
                                <span><strong>Prueba la aplicación</strong> planteando a los asistentes preguntas, dilemas y retos. Úsala para hacerte con ella, probar las funcionalidades disponibles y formarte una opinión antes de enviar la valoración.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">3️⃣</span>
                                <div>
                                    <span>Para finalizar, <strong>responde al cuestionario</strong> de valoración.</span>
                                    <div className="flex items-center text-slate-600 font-medium text-xs sm:text-sm mt-3 bg-white/60 p-3 rounded-lg border border-slate-200 shadow-sm">
                                        <span className="flex-1">👉 Podrás acceder luego desde el botón de feedback de la cabecera del chatbot:</span>
                                        <div className="ml-3 bg-white p-2 rounded-xl shadow-md border-2 border-purple-100 transform hover:scale-105 transition-transform flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 sm:w-10 sm:h-10 text-purple-700">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            ),
            badge: `Versión ${appVersion}`,
            badgeColor: 'bg-slate-600 text-white',
            gradient: 'from-slate-400 via-slate-300 to-slate-200'
        },
        {
            avatar: pepi.avatarUrl,
            speaker: pepi.name,
            speakerColor: 'text-rose-800',
            bubbleBg: 'bg-rose-50',
            bubbleText: 'text-rose-900',
            title: 'Código Deontológico 2026',
            content: <p>Querido/a, para este testeo los asistentes <strong>usaremos el Código Deontológico de 2026 como si estuviera plenamente en vigor</strong>. Esto nos permitirá validar juntos/as el nuevo texto sobre casos prácticos. 💛</p>,
            badge: 'Importante',
            badgeColor: 'bg-amber-500 text-white',
            gradient: 'from-rose-400 via-amber-300 to-rose-200'
        },
        {
            avatar: eulogio.avatarUrl,
            speaker: eulogio.name,
            speakerColor: 'text-purple-800',
            bubbleBg: 'bg-purple-50',
            bubbleText: 'text-purple-900',
            title: 'Recomendaciones de uso',
            content: renderRecomendaciones(),
            badge: 'Información 1 de 3',
            badgeColor: 'bg-purple-600 text-white',
            gradient: 'from-purple-400 via-fuchsia-300 to-purple-200'
        },
        {
            avatar: pepi.avatarUrl,
            speaker: pepi.name,
            speakerColor: 'text-blue-800',
            bubbleBg: 'bg-blue-50',
            bubbleText: 'text-blue-900',
            title: 'Instrucciones',
            content: renderInstructions(),
            badge: 'Información 2 de 3',
            badgeColor: 'bg-blue-600 text-white',
            gradient: 'from-blue-400 via-indigo-300 to-blue-200'
        },
        {
            avatar: eulogio.avatarUrl,
            speaker: eulogio.name,
            speakerColor: 'text-emerald-800',
            bubbleBg: 'bg-emerald-50',
            bubbleText: 'text-emerald-900',
            title: 'Leyenda de botones',
            content: renderLegend(),
            badge: 'Información 3 de 3',
            badgeColor: 'bg-emerald-600 text-white',
            gradient: 'from-emerald-400 via-teal-300 to-emerald-200'
        },
    ];

    const slide = slides[currentSlide];

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            setCurrentSlide(0);
            onClose();
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const goToSlide = (idx: number) => {
        setCurrentSlide(idx);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-2 sm:p-4 md:p-8">
            {/* Glass Card */}
            <div
                className="relative w-full max-w-3xl bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden flex flex-col transition-all duration-500 animate-scale-in"
                style={{ maxHeight: '92vh' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative top gradient bar */}
                <div className={`h-2 w-full bg-gradient-to-r ${slide.gradient} transition-all duration-700 ease-in-out flex-shrink-0`} />

                {/* Slide Content */}
                <div key={currentSlide} className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar animate-slide-in-right">
                    {/* Proyecto Header for first slide only */}
                    {currentSlide === 0 && (
                        <div className="flex flex-col items-center justify-center p-6 mb-8 bg-slate-100/50 rounded-3xl border border-slate-200 shadow-sm transition-all animate-in fade-in slide-in-from-top duration-500">
                            <img 
                                src="/gemini.webp" 
                                alt="Logo Proyecto Deontolog-IA" 
                                className="w-20 h-20 md:w-24 md:h-24 rounded-full mb-4 border-4 border-white shadow-xl object-cover transform transition hover:scale-110"
                            />
                            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter text-center">
                                Proyecto Deontolog-IA
                            </h1>
                            <div className="h-1 w-16 bg-slate-400/30 rounded-full mt-4" />
                        </div>
                    )}

                    {/* Badge */}
                    <div className="flex justify-between items-center mb-6">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${slide.badgeColor} transition-colors duration-500`}>
                            {slide.badge}
                        </span>
                        <span className="text-xs text-slate-500 font-mono font-bold bg-slate-100 px-2 py-1 rounded">
                            {currentSlide + 1} / {slides.length}
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-6 leading-tight transition-all duration-500">
                        {slide.title}
                    </h2>

                    {/* Chat Bubble container for specific styling if it's just text vs long content */}
                    <div className="flex flex-col sm:flex-row items-start sm:gap-3 mb-6 transition-all duration-500 w-full">
                        {/* Mobile Header (Avatar + Name) */}
                        <div className="flex items-center gap-2 mb-2 sm:hidden px-1">
                            <img
                                src={slide.avatar}
                                alt={`Avatar de ${slide.speaker}`}
                                className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover"
                            />
                            <p className={`text-sm font-bold ${slide.speakerColor}`}>
                                {slide.speaker}
                            </p>
                        </div>

                        {/* Desktop Avatar */}
                        <img
                            src={slide.avatar}
                            alt={`Avatar de ${slide.speaker}`}
                            className="hidden sm:block w-12 h-12 rounded-full border-2 border-white shadow-md flex-shrink-0 object-cover mt-1"
                        />

                        {/* Bubble */}
                        <div className="flex-1 w-full">
                            {/* Desktop Name */}
                            <p className={`hidden sm:block text-xs font-bold mb-1 ml-1 ${slide.speakerColor}`}>
                                {slide.speaker}
                            </p>
                            <div className={`${slide.bubbleBg} ${slide.bubbleText} rounded-2xl rounded-tl-xl sm:rounded-tl-sm p-4 sm:p-5 text-sm md:text-base leading-relaxed shadow-sm w-full`}>
                                {slide.content}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Dots & Footer Navigation */}
                <div className="flex-shrink-0 border-t border-slate-200/60 bg-white/70 backdrop-blur-md p-4 flex flex-col gap-4">
                    {/* Dots */}
                    <div className="flex items-center justify-center gap-2">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goToSlide(idx)}
                                aria-label={`Ir a diapositiva ${idx + 1}`}
                                className={`rounded-full transition-all duration-300 ${
                                    idx === currentSlide
                                        ? 'w-8 h-2.5 bg-slate-600'
                                        : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-between gap-3">
                        {currentSlide > 0 ? (
                            <button
                                onClick={prevSlide}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                ← Atrás
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                Omitir todo
                            </button>
                        )}

                        <button
                            onClick={nextSlide}
                            className="px-8 py-3 rounded-xl text-sm font-bold bg-slate-800 text-white hover:bg-black shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 ml-auto"
                        >
                            {currentSlide === slides.length - 1 ? '¡Comenzar a usar la App! 🚀' : 'Siguiente →'}
                        </button>
                    </div>
                </div>
            </div>
            {/* Custom scrollbar styles specific to the glassmorphism modal */}
            <style>
                {`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background-color: rgba(148, 163, 184, 0.4); /* slate-400 with opacity */
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background-color: rgba(100, 116, 139, 0.6); /* slate-500 with opacity */
                }
                `}
            </style>
        </div>
    );
};
