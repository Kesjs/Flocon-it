"use client";

import React, { Component, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Logging structuré pour le debugging en production
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
    };

    // En environnement de développement, afficher dans la console
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 ErrorBoundary - Error Caught');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Full Error Data:', errorData);
      console.groupEnd();
    }

    // En production, envoyer vers un service de monitoring (ex: Sentry, LogRocket)
    if (process.env.NODE_ENV === 'production') {
      // Option 1: Envoyer vers une API endpoint personnalisée
      this.logErrorToService(errorData);
      
      // Option 2: Stocker localement pour analyse future
      this.storeErrorLocally(errorData);
    }
  }

  logErrorToService = async (errorData: any) => {
    try {
      // Envoyer vers votre endpoint de logging
      await fetch('/api/errors/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      });
    } catch (e) {
      // Échec silencieux pour éviter les erreurs en cascade
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to log error to service:', e);
      }
    }
  };

  storeErrorLocally = (errorData: any) => {
    try {
      // Stocker les erreurs dans localStorage pour analyse
      const storedErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      storedErrors.push(errorData);
      
      // Garder seulement les 50 dernières erreurs
      const recentErrors = storedErrors.slice(-50);
      localStorage.setItem('app_errors', JSON.stringify(recentErrors));
    } catch (e) {
      // Échec silencieux
    }
  };

  handleReset = () => {
    // Forcer un rechargement complet pour nettoyer l'état
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-display font-bold text-textDark mb-2">
              Oups ! Une erreur est survenue
            </h1>
            <p className="text-gray-600 mb-6">
              {this.state.error?.message || "Une erreur inattendue s'est produite."}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 bg-textDark text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Réessayer
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
