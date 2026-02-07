"use client";

import React, { Component, ReactNode } from "react";
import { AlertCircle, RefreshCw, CreditCard } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryCheckout extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      context: 'checkout',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
    };

    // Logging spécialisé pour le checkout
    if (process.env.NODE_ENV === 'development') {
      console.group('💳 ErrorBoundaryCheckout - Error Caught');
      console.error('Checkout Error:', error);
      console.error('Checkout Error Info:', errorInfo);
      console.error('Checkout Error Data:', errorData);
      console.groupEnd();
    }

    if (process.env.NODE_ENV === 'production') {
      this.logCheckoutError(errorData);
    }
  }

  logCheckoutError = async (errorData: any) => {
    try {
      await fetch('/api/errors/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...errorData, severity: 'critical', context: 'checkout' }),
      });
    } catch (e) {
      // Échec silencieux
    }
  };

  handleReset = () => {
    // Rediriger vers la page panier
    window.location.href = "/cart";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center border border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-display font-bold text-textDark mb-2">
              Erreur lors du paiement
            </h1>
            <p className="text-gray-600 mb-6">
              Une erreur est survenue lors du traitement de votre paiement. 
              Votre commande n'a pas été débitée.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Vos informations de paiement sont sécurisées.
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 bg-rose-custom text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retour au panier
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

export default ErrorBoundaryCheckout;
