
import React from 'react';
import { AssistantTheme } from '../assistants';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  theme: AssistantTheme;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
  theme
}) => {
  if (!isOpen) return null;

  // Use a generic danger color for confirm, or theme's accent if not destructive
  const confirmBg = 'bg-red-500';
  const confirmHoverBg = 'hover:bg-red-600';
  const confirmRing = 'focus:ring-red-500';


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmationModalTitle"
      aria-describedby="confirmationModalMessage"
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 md:p-8 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirmationModalTitle" className="text-xl font-bold text-slate-800 mb-4">{title}</h2>
        <p id="confirmationModalMessage" className="text-slate-600 mb-6 text-sm">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 ${confirmBg} text-white rounded-md ${confirmHoverBg} transition-colors focus:outline-none focus:ring-2 ${confirmRing} focus:ring-offset-2`}
          >
            {confirmButtonText}
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
      `}</style>
    </div>
  );
};