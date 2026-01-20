import React from 'react';
import { AssistantTheme } from '../assistants';

interface WelcomeInstructionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    theme: AssistantTheme;
}

export const WelcomeInstructionsModal: React.FC<WelcomeInstructionsModalProps> = ({ isOpen, onClose, theme }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="welcome-modal-title"
                aria-modal="true"
            >
                {/* Header fijo con botón de cierre */}
                <div className={`${theme.primaryBg} ${theme.primaryText} p-6 rounded-t-xl sticky top-0 z-10 flex items-start justify-between`}>
                    <div className="flex-1 pr-4">
                        <h2 id="welcome-modal-title" className="text-2xl font-bold mb-2">
                            👋 Bienvenido/a a tu Asistente de Ética Profesional
                        </h2>
                        <p className="text-sm opacity-90">Antes de empezar, lee estas indicaciones importantes</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 hover:bg-black hover:bg-opacity-10 rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                        aria-label="Cerrar instrucciones"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido scrollable */}
                <div className="overflow-y-auto p-6 space-y-4 text-slate-700">
                    {/* Sección principal */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <h3 className="font-bold text-blue-900 mb-2 flex items-center">
                            <span className="text-2xl mr-2">🤔</span>
                            ¿Qué es este asistente?
                        </h3>
                        <p className="text-sm text-blue-800">
                            Este es un <strong>asistente para la reflexión ética</strong> en el Trabajo Social.
                            <strong> No te dará recetas ni soluciones cerradas</strong>, sino que te acompañará en un proceso de
                            deliberación fundamentada para que <strong>tú</strong> tomes decisiones responsables.
                        </p>
                    </div>

                    {/* Iteraciones */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg flex items-center">
                            <span className="text-xl mr-2">🔄</span>
                            Profundiza con varias iteraciones
                        </h3>
                        <p className="text-sm">
                            La reflexión ética es un proceso. <strong>No esperes obtener toda la información en una sola pregunta.</strong>
                            Haz preguntas de seguimiento, pide aclaraciones y profundiza gradualmente en los temas que te interesen.
                        </p>
                    </div>

                    {/* Lenguaje natural */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg flex items-center">
                            <span className="text-xl mr-2">💬</span>
                            Habla con naturalidad
                        </h3>
                        <p className="text-sm">
                            No necesitas usar un lenguaje técnico o formal. <strong>Escribe como si estuvieras hablando con un colega experto/a.</strong>
                            Puedes decir cosas como:
                        </p>
                        <ul className="text-sm space-y-1 ml-6 text-slate-600">
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>"¿Podrías profundizar más en ese punto?"</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>"Resume esto en pocas líneas"</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>"Amplía la información sobre..."</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>"Dame un ejemplo práctico"</span>
                            </li>
                        </ul>
                    </div>

                    {/* Control de la conversación */}
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                        <h3 className="font-bold text-amber-900 mb-2 flex items-center">
                            <span className="text-2xl mr-2">🎯</span>
                            Tú tienes el control
                        </h3>
                        <p className="text-sm text-amber-800">
                            Si la respuesta es muy larga, pide un <strong>resumen</strong>.
                            Si es muy breve, solicita que se <strong>amplíe</strong>.
                            Si algo no está claro, pide que se <strong>explique de otra forma</strong>.
                        </p>
                    </div>

                    {/* Feedback en testeo */}
                    <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                        <h3 className="font-bold text-purple-900 mb-2 flex items-center">
                            <span className="text-2xl mr-2">🧪</span>
                            Fase de Testeo - Tu opinión importa
                        </h3>
                        <p className="text-sm text-purple-800 mb-3">
                            Estamos en fase beta. Si encuentras errores, respuestas poco útiles o tienes sugerencias,
                            <strong> envíanos tu feedback haciendo clic en el icono de mensaje/comentario
                                que está junto al nombre del asistente</strong> en la parte superior de la pantalla.
                        </p>
                        <div className="flex items-center justify-center bg-purple-100 p-3 rounded gap-2">
                            <span className="text-xs text-purple-700 font-medium">
                                👉 Busca este icono junto al nombre:
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-purple-700">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Recordatorios finales */}
                    <div className="border-t pt-4 space-y-2">
                        <h3 className="font-semibold text-sm text-slate-600">Recuerda:</h3>
                        <ul className="text-xs space-y-1 text-slate-600">
                            <li className="flex items-start">
                                <span className="mr-2 text-green-600">✓</span>
                                <span>Este asistente está aquí para <strong>acompañar tu reflexión</strong>, no para decidir por ti</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-green-600">✓</span>
                                <span>Es normal necesitar <strong>varias preguntas</strong> para explorar un tema a fondo</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-green-600">✓</span>
                                <span>Puedes pedirle que <strong>ajuste el nivel de detalle</strong> a tu necesidad</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-green-600">✓</span>
                                <span>Usa <strong>lenguaje natural y directo</strong></span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-b-xl flex justify-end border-t">
                    <button
                        onClick={onClose}
                        className={`${theme.accentBg} ${theme.accentText} ${theme.accentHoverBg} px-6 py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 ${theme.accentBg.replace('bg-', 'focus:ring-')} focus:ring-offset-2`}
                    >
                        Entendido, ¡comencemos! 🚀
                    </button>
                </div>
            </div>
        </div>
    );
};
