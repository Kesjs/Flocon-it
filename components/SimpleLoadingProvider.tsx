'use client';

import { useState, createContext, useContext, ReactNode } from 'react';

interface SimpleLoadingContextType {
  isLoading: boolean;
  loadingText: string;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
}

const SimpleLoadingContext = createContext<SimpleLoadingContextType | undefined>(undefined);

export function SimpleLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Chargement...');

  const showLoading = (text = 'Chargement...') => {
    setLoadingText(text);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  return (
    <SimpleLoadingContext.Provider value={{ isLoading, loadingText, showLoading, hideLoading }}>
      {children}
    </SimpleLoadingContext.Provider>
  );
}

export function useSimpleLoading() {
  const context = useContext(SimpleLoadingContext);
  if (context === undefined) {
    throw new Error('useSimpleLoading must be used within a SimpleLoadingProvider');
  }
  return context;
}
