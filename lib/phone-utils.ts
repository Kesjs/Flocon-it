// Utilitaires pour la saisie et validation des numéros de téléphone français

export const formatPhoneNumber = (value: string): string => {
  // Supprimer tous les caractères non numériques
  const cleaned = value.replace(/\D/g, '');
  
  // Limiter à 10 chiffres pour la France
  const limited = cleaned.slice(0, 10);
  
  // Formater le numéro français : XX XX XX XX XX
  if (limited.length <= 2) {
    return limited;
  }
  
  if (limited.length <= 4) {
    return `${limited.slice(0, 2)} ${limited.slice(2)}`;
  }
  
  if (limited.length <= 6) {
    return `${limited.slice(0, 2)} ${limited.slice(2, 4)} ${limited.slice(4)}`;
  }
  
  if (limited.length <= 8) {
    return `${limited.slice(0, 2)} ${limited.slice(2, 4)} ${limited.slice(4, 6)} ${limited.slice(6)}`;
  }
  
  return `${limited.slice(0, 2)} ${limited.slice(2, 4)} ${limited.slice(4, 6)} ${limited.slice(6, 8)} ${limited.slice(8)}`;
};

export const validateFrenchPhoneNumber = (phone: string): boolean => {
  // Supprimer tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, '');
  
  // Vérifier que c'est un numéro français (10 chiffres commençant par 06, 07, ou 01-09)
  const frenchPhoneRegex = /^(0[1-9])(\d{2}){4}$/;
  return frenchPhoneRegex.test(cleaned);
};

export const getPhoneType = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('06') || cleaned.startsWith('07')) {
    return 'mobile';
  } else if (cleaned.startsWith('01') || cleaned.startsWith('02') || 
             cleaned.startsWith('03') || cleaned.startsWith('04') || 
             cleaned.startsWith('05')) {
    return 'fixe';
  }
  
  return 'inconnu';
};

export const getPhoneExample = (): string => {
  return "06 12 34 56 78";
};

// Préfixes internationaux courants pour la France
export const INTERNATIONAL_PREFIXES = [
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+33', name: 'France (DOM)', flag: '🇫🇷' },
  { code: '+32', name: 'Belgique', flag: '🇧🇪' },
  { code: '+41', name: 'Suisse', flag: '🇨🇭' },
  { code: '+352', name: 'Luxembourg', flag: '🇱🇺' },
  { code: '+376', name: 'Andorre', flag: '🇦🇩' },
  { code: '+377', name: 'Monaco', flag: '🇲🇨' },
];

export const formatInternationalPhone = (prefix: string, number: string): string => {
  const cleaned = number.replace(/\D/g, '');
  
  // Pour la France, supprimer le 0 initial et ajouter le préfixe
  if (prefix === '+33' && cleaned.startsWith('0')) {
    const withoutZero = cleaned.slice(1);
    return `${prefix} ${formatPhoneNumber(withoutZero)}`;
  }
  
  return `${prefix} ${cleaned}`;
};
