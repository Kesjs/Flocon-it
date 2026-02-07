"use client";

import React, { Component, ReactNode } from "react";
import { AlertCircle, RefreshCw, ShoppingBag } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryCart extends Component<Props, State> {
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
      context: 'cart',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
    };

    // Logging spécialisé pour le panier
    if (process.env.NODE_ENV === 'development') {
      console.group('🛒 ErrorBoundaryCart - Error Caught');
      console.error('Cart Error:', error);
      console.error('Cart Error Info:', errorInfo);
      console.error('Cart Error Data:', errorData);
      console.groupEnd();
    }

    if (process.env.NODE_ENV === 'production') {
      this.logCartError(errorData);
    }
  }

  logCartError = async (errorData: any) => {
    try {
      await fetch('/api/errors/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...errorData, severity: 'high', context: 'cart' }),
      });
    } catch (e) {
      // Échec silencieux
    }
  };

  handleReset = () => {
    // Vider le panier et recharger
    if (typeof window !== 'undefined') {
      localStorage.removeItem('flocon_cart');
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 text-center border border-red-200">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-textDark mb-2">
            Panier indisponible
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Une erreur est survenue avec votre panier. Vos articles sont sauvegardés.
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-1 bg-rose-custom text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Réessayer
            </button>
            <button
              onClick={() => (window.location.href = "/boutique")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Continuer shopping
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryCart;
