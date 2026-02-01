// Gestion de la redirection après connexion/inscription
export interface RedirectIntent {
  type: 'checkout' | 'dashboard' | 'profile';
  timestamp: number;
  data?: any;
}

export class RedirectManager {
  private static readonly STORAGE_KEY = 'redirect_intent';
  private static readonly EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes

  // Sauvegarder l'intention de redirection
  static setIntent(intent: RedirectIntent): void {
    try {
      const data = {
        ...intent,
        timestamp: Date.now()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Impossible de sauvegarder l\'intention de redirection:', error);
    }
  }

  // Récupérer et nettoyer l'intention de redirection
  static getIntent(): RedirectIntent | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const intent: RedirectIntent = JSON.parse(stored);
      
      // Vérifier si l'intention n'est pas expirée
      if (Date.now() - intent.timestamp > this.EXPIRY_TIME) {
        this.clearIntent();
        return null;
      }

      return intent;
    } catch (error) {
      console.warn('Erreur lors de la récupération de l\'intention:', error);
      this.clearIntent();
      return null;
    }
  }

  // Nettoyer l'intention de redirection
  static clearIntent(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Impossible de nettoyer l\'intention de redirection:', error);
    }
  }

  // Sauvegarder l'intention de checkout
  static setCheckoutIntent(data?: { email?: string; shippingAddress?: any }): void {
    this.setIntent({
      type: 'checkout',
      timestamp: Date.now(),
      data
    });
  }

  // Vérifier s'il y a une intention de checkout en attente
  static hasCheckoutIntent(): boolean {
    const intent = this.getIntent();
    return intent?.type === 'checkout';
  }
}
