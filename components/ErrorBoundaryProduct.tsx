"use client";

import React, { Component, ReactNode } from "react";
import { AlertCircle, RefreshCw, Package } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryProduct extends Component<Props, State> {
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
      context: 'products',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
    };

    // Logging spécialisé pour les produits
    if (process.env.NODE_ENV === 'development') {
      console.group('📦 ErrorBoundaryProduct - Error Caught');
      console.error('Product Error:', error);
      console.error('Product Error Info:', errorInfo);
      console.error('Product Error Data:', errorData);
      console.groupEnd();
    }

    if (process.env.NODE_ENV === 'production') {
      this.logProductError(errorData);
    }
  }

  logProductError = async (errorData: any) => {
    try {
      await fetch('/api/errors/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...errorData, severity: 'medium', context: 'products' }),
      });
    } catch (e) {
      // Échec silencieux
    }
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-textDark mb-2">
            Produit indisponible
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Ce produit ne peut pas être affiché actuellement.
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-1 mx-auto bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryProduct;
