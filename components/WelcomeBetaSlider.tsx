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

    const renderLegend = () => (
        <div className="space-y-4">
            <div className="space-y-2 sm:space-y-3">
                {BUTTON_LEGEND_ITEMS.map((item, index) => (
                    <div key={`legend-${index}`} className="flex items-start gap-3 p-3 bg-white/50 rounded-lg border border-emerald-50">
                        <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">{item.icon}</span>
                        <div>
                            <p className="font-bold text-slate-800 text-sm leading-tight mb-1">{item.name} <span className="font-normal text-xs text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded-full ml-1 inline-block mt-1 sm:mt-0">{item.location}</span></p>
                            <p className="text-xs text-slate-600 mt-1 sm:mt-0 leading-relaxed">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-xs sm:text-sm font-medium text-emerald-800/80 text-center italic mt-4 px-2">
                * Estos son los controles principales. Podrás revisarlos siempre que quieras desde el menú del chat.
            </p>
        </div>
    );


    const renderRecomendaciones = () => (
        <div className="space-y-4">
            <div className="space-y-3">
                
                <div className="bg-white/50 p-3 sm:p-4 rounded-lg border border-purple-100 shadow-sm">
                    <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center"><span className="text-lg mr-2">🤔</span> ¿Qué es este asistente?</h4>
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
                * Estas recomendaciones y la guía técnica están siempre disponibles en la página de inicio y en la información del asistente activo.
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
            title: '¡Bienvenido/a a la fase Beta!',
            content: (
                <div className="space-y-3">
                    <p>Gracias por participar en el testeo de <strong>{appName}</strong>. Tu colaboración es imprescindible para afinar esta herramienta.</p>
                    <div className="bg-slate-300/50 p-3 rounded-lg border border-slate-300">
                        <p className="font-semibold text-sm mb-2 flex items-center">
                            <span className="text-lg mr-2">🧪</span> Tu opinión importa
                        </p>
                        <p className="text-sm">
                            Haciendo clic en el <strong>icono de mensaje</strong> que está junto al nombre del asistente accederás al formulario con el que podrás enviar tu valoración de la aplicación, además de reportar errores, opiniones o sugerencias. <strong>Por favor, rellénalo después de usar la herramienta.</strong>
                        </p>
                        <div className="flex items-center mt-2 text-slate-700 font-medium text-sm">
                            👉 Busca este icono:
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 ml-1 text-purple-700 bg-white rounded-md shadow-sm p-0.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"></path>
                            </svg>
                        </div>
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
            content: <p>Querido/a, para este testeo los asistentes <strong>usaremos el Código Deontológico de 2026 como si estuviera plenamente en vigor</strong>. Esto nos permite validar juntos/as las nuevas normativas éticas en casos prácticos. 💛</p>,
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
            title: 'Instrucciones Importantes',
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
            title: 'Leyenda de Botones',
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
                className="relative w-full max-w-3xl bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden flex flex-col transition-all duration-500"
                style={{ maxHeight: '92vh' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative top gradient bar */}
                <div className={`h-2 w-full bg-gradient-to-r ${slide.gradient} transition-all duration-700 ease-in-out flex-shrink-0`} />

                {/* Slide Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
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
