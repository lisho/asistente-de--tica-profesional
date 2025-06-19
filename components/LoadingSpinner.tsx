
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-2">
      <div className="w-3 h-3 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s] mr-1"></div>
      <div className="w-3 h-3 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s] mr-1"></div>
      <div className="w-3 h-3 bg-slate-500 rounded-full animate-bounce"></div>
    </div>
  );
};
