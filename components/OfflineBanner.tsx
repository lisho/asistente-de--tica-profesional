
import React from 'react';
import { AssistantTheme } from '../assistants'; // Import AssistantTheme if you plan to use theme colors

interface OfflineBannerProps {
  theme: AssistantTheme; // Theme might be used for styling later, or can be removed if fixed style is preferred
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ theme }) => {
  // Using fixed warning colors for high visibility, theme can be used for subtle adjustments if needed.
  const bannerBgColor = 'bg-yellow-400'; // A noticeable warning color
  const bannerTextColor = 'text-yellow-800'; // Good contrast on yellow-400

  return (
    <div 
      className={`fixed top-0 left-0 right-0 ${bannerBgColor} ${bannerTextColor} p-3 text-center text-sm z-[60] shadow-md transition-all duration-300 ease-in-out`}
      role="status"
      aria-live="assertive"
    >
      <div className="flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
        </svg>
        <span>Estás desconectado. Las funciones de IA pueden no estar disponibles. Verifica tu conexión.</span>
      </div>
    </div>
  );
};
