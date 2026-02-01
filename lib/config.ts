// Configuration des URLs par défaut pour l'application
export const APP_CONFIG = {
  // URLs de l'application
  getBaseUrl: (): string => {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
    
    if (envUrl && envUrl.trim() !== '') {
      try {
        // Valider que l'URL est correcte
        const url = new URL(envUrl);
        return url.origin;
      } catch (error) {
        console.warn('NEXT_PUBLIC_SITE_URL invalide:', envUrl);
      }
    }
    
    // Fallback selon l'environnement
    const isDevelopment = process.env.NODE_ENV === 'development';
    return isDevelopment ? 'http://localhost:3000' : 'https://flocon.example.com';
  },
  
  // URLs de redirection pour Stripe
  getStripeUrls: () => {
    const baseUrl = APP_CONFIG.getBaseUrl();
    
    return {
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
    };
  },
  
  // Validation d'URL
  isValidUrl: (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  },
  
  // Nettoyer et valider les URLs d'images pour Stripe
  validateImageUrl: (imageUrl: string): string | null => {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return null;
    }
    
    const trimmedUrl = imageUrl.trim();
    if (!trimmedUrl) {
      return null;
    }
    
    try {
      const url = new URL(trimmedUrl);
      
      // Stripe exige des URLs HTTPS en production, mais accepte HTTP en développement
      const isDevelopment = process.env.NODE_ENV === 'development';
      const isAllowedProtocol = url.protocol === 'https:' || (isDevelopment && url.protocol === 'http:');
      
      if (!isAllowedProtocol) {
        console.warn('Protocole d\'image non autorisé:', url.protocol);
        return null;
      }
      
      // Stripe exige des URLs absolues et valides
      if (!url.hostname) {
        console.warn('URL d\'image sans hostname:', trimmedUrl);
        return null;
      }
      
      // Stripe n'accepte pas les URLs locales ou relatives
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        console.warn('URL d\'image locale non autorisée pour Stripe:', trimmedUrl);
        return null;
      }
      
      return url.toString();
    } catch (error) {
      console.warn('URL d\'image invalide ignorée:', trimmedUrl);
      return null;
    }
  }
};
