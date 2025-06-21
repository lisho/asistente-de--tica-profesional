
import React from 'react';
import { AssistantTheme } from '../assistants';

interface InstallPWAButtonProps {
  onClick: () => void;
  theme: AssistantTheme; // Theme prop is kept for potential future use or other non-color aspects
  isFixed?: boolean; 
}

export const InstallPWAButton: React.FC<InstallPWAButtonProps> = ({ onClick, theme, isFixed = true }) => {
  // Specific colors for the install button to make it "greyish green"
  const installButtonBg = 'bg-emerald-600';
  const installButtonText = 'text-white';
  const installButtonHoverBg = 'hover:bg-emerald-700';
  const installButtonFocusRing = 'focus:ring-emerald-500'; // Or focus:ring-emerald-600

  const baseClasses = `flex items-center px-4 py-3 rounded-lg shadow-xl transition-all duration-150 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2
                     ${installButtonBg} ${installButtonText} ${installButtonHoverBg} 
                     ${installButtonFocusRing}`;
  
  const fixedClasses = isFixed ? 'fixed bottom-5 right-5 z-50' : 'w-full';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${fixedClasses}`}
      title="Instalar aplicación en tu dispositivo"
      aria-label="Instalar esta aplicación en tu dispositivo"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      <span className="font-medium text-sm">Instalar App</span>
    </button>
  );
};
