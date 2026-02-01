// Schémas de validation pour les inputs côté serveur

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

export interface CheckoutRequest {
  cartItems: CartItem[];
  customerEmail: string;
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
}

// Validation email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 255;
}

// Validation nom complet
export function isValidName(name: string): boolean {
  return typeof name === 'string' && 
         name.trim().length >= 2 && 
         name.trim().length <= 100 &&
         /^[a-zA-Z\s\-'\u00C0-\u017F]+$/.test(name.trim());
}

// Validation adresse
export function isValidAddress(address: string): boolean {
  return typeof address === 'string' && 
         address.trim().length >= 5 && 
         address.trim().length <= 200 &&
         /^[0-9a-zA-Z\s\-'\.,\u00C0-\u017F]+$/.test(address.trim());
}

// Validation ville
export function isValidCity(city: string): boolean {
  return typeof city === 'string' && 
         city.trim().length >= 2 && 
         city.trim().length <= 100 &&
         /^[a-zA-Z\s\-'\u00C0-\u017F]+$/.test(city.trim());
}

// Validation code postal France
export function isValidPostalCode(postalCode: string): boolean {
  return typeof postalCode === 'string' && 
         /^[0-9]{5}$/.test(postalCode.trim());
}

// Validation téléphone international
export function isValidPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/[\s\.\-]/g, '');
  return typeof phone === 'string' && 
         (/^(\+33|0)[1-9][0-9]{8}$/.test(cleanPhone) || 
          /^\+?[1-9][0-9]{7,14}$/.test(cleanPhone));
}

// Validation téléphone avec message d'erreur personnalisé
export function validatePhoneWithMessage(phone: string, countryCode: string = 'FR'): { isValid: boolean; message: string } {
  const cleanPhone = phone.replace(/[\s\.\-]/g, '');
  
  // Formats internationaux acceptés
  const internationalRegex = /^\+?[1-9][0-9]{7,14}$/;
  
  // Format spécifique France
  const franceRegex = /^(\+33|0)[1-9][0-9]{8}$/;
  
  if (!phone || phone.trim().length === 0) {
    return {
      isValid: false,
      message: 'Le numéro de téléphone est requis'
    };
  }
  
  if (!internationalRegex.test(cleanPhone) && !franceRegex.test(cleanPhone)) {
    // Message d'erreur adapté selon le pays
    const countryMessages: Record<string, string> = {
      'FR': 'Numéro invalide : format français requis (ex: +33 6 12 34 56 78)',
      'BE': 'Numéro invalide : format belge requis (ex: +32 470 12 34 56)',
      'CH': 'Numéro invalide : format suisse requis (ex: +41 79 123 45 67)',
      'LU': 'Numéro invalide : format luxembourgeois requis (ex: +352 621 123 456)',
      'DE': 'Numéro invalide : format allemand requis (ex: +49 30 12345678)',
      'IT': 'Numéro invalide : format italien requis (ex: +39 06 12345678)',
      'ES': 'Numéro invalide : format espagnol requis (ex: +34 91 123 45 67)',
      'GB': 'Numéro invalide : format britannique requis (ex: +44 20 7123 4567)',
      'US': 'Numéro invalide : format américain requis (ex: +1 555 123 4567)',
      'CA': 'Numéro invalide : format canadien requis (ex: +1 416 123 4567)'
    };
    
    const defaultMessage = 'Numéro invalide : format international requis (ex: +33 6 12 34 56 78)';
    const message = countryMessages[countryCode] || defaultMessage;
    
    return {
      isValid: false,
      message
    };
  }
  
  return {
    isValid: true,
    message: 'Numéro valide'
  };
}

// Validation adresse de livraison complète
export function validateShippingAddress(address: any): boolean {
  return (
    address &&
    typeof address === 'object' &&
    isValidName(address.name) &&
    isValidAddress(address.address) &&
    isValidCity(address.city) &&
    isValidPostalCode(address.postalCode) &&
    isValidPhone(address.phone)
  );
}

// Validation des items du panier
export function validateCartItem(item: any): item is CartItem {
  return (
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    item.id.length > 0 && item.id.length <= 100 &&
    typeof item.name === 'string' &&
    item.name.length > 0 && item.name.length <= 200 &&
    typeof item.price === 'number' &&
    item.price > 0 && item.price <= 10000 &&
    typeof item.quantity === 'number' &&
    item.quantity > 0 && item.quantity <= 100 &&
    (item.image === undefined || (typeof item.image === 'string' && item.image.length <= 500)) &&
    (item.description === undefined || (typeof item.description === 'string' && item.description.length <= 1000))
  );
}

// Validation complète de la requête checkout
export function validateCheckoutRequest(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Requête invalide');
    return { isValid: false, errors };
  }

  // Validation email
  if (!data.customerEmail || !isValidEmail(data.customerEmail)) {
    errors.push('Email invalide : format attendu exemple@domaine.com');
  }

  // Validation adresse de livraison si présente
  if (data.shippingAddress) {
    if (!validateShippingAddress(data.shippingAddress)) {
      const addr = data.shippingAddress;
      if (!isValidName(addr.name)) {
        errors.push('Nom complet invalide : 2-100 caractères, lettres uniquement');
      }
      if (!isValidAddress(addr.address)) {
        errors.push('Adresse invalide : 5-200 caractères requis');
      }
      if (!isValidCity(addr.city)) {
        errors.push('Ville invalide : 2-100 caractères, lettres uniquement');
      }
      if (!isValidPostalCode(addr.postalCode)) {
        errors.push('Code postal invalide : 5 chiffres requis (ex: 75001)');
      }
      if (!isValidPhone(addr.phone)) {
        errors.push('Téléphone invalide : format français requis (ex: +33 6 12 34 56 78)');
      }
    }
  }

  // Validation cartItems
  if (!Array.isArray(data.cartItems) || data.cartItems.length === 0) {
    errors.push('Panier vide ou invalide');
  } else if (data.cartItems.length > 50) {
    errors.push('Trop d\'articles dans le panier');
  } else {
    data.cartItems.forEach((item: any, index: number) => {
      if (!validateCartItem(item)) {
        errors.push(`Article ${index + 1} invalide : vérifiez les informations du produit`);
      }
    });
  }

  // Validation du montant total
  if (Array.isArray(data.cartItems)) {
    const total = data.cartItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
    if (total > 50000) { // 500€ maximum
      errors.push('Montant total trop élevé : maximum 500€ par commande');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Nettoyage des inputs pour prévenir XSS
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Supprimer les chevrons
    .trim()
    .substring(0, 1000); // Limiter la longueur
}

// Validation des IDs de produits
export function isValidProductId(id: string): boolean {
  return typeof id === 'string' && 
         id.length > 0 && 
         id.length <= 100 && 
         /^[a-zA-Z0-9_-]+$/.test(id);
}

// Validation des montants
export function isValidAmount(amount: number): boolean {
  return typeof amount === 'number' && 
         amount > 0 && 
         amount <= 10000 && 
         Number.isFinite(amount) &&
         Number((amount).toFixed(2)) === amount; // 2 décimales max
}
