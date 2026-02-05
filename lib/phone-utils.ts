// Utilitaires pour la saisie et validation des numéros de téléphone français

export const formatPhoneNumber = (value: string, countryCode: string = 'FR'): string => {
  // Supprimer tous les caractères non numériques
  const cleaned = value.replace(/\D/g, '');
  
  // Formats par pays
  switch (countryCode) {
    case 'FR':
    case 'MA':
    case 'CI':
    case 'TN':
    case 'DZ':
      // Format français : XX XX XX XX XX (limité à 10 chiffres)
      const limitedFR = cleaned.slice(0, 10);
      if (limitedFR.length <= 2) return limitedFR;
      if (limitedFR.length <= 4) return `${limitedFR.slice(0, 2)} ${limitedFR.slice(2)}`;
      if (limitedFR.length <= 6) return `${limitedFR.slice(0, 2)} ${limitedFR.slice(2, 4)} ${limitedFR.slice(4)}`;
      if (limitedFR.length <= 8) return `${limitedFR.slice(0, 2)} ${limitedFR.slice(2, 4)} ${limitedFR.slice(4, 6)} ${limitedFR.slice(6)}`;
      return `${limitedFR.slice(0, 2)} ${limitedFR.slice(2, 4)} ${limitedFR.slice(4, 6)} ${limitedFR.slice(6, 8)} ${limitedFR.slice(8)}`;
    
    case 'US':
    case 'CA':
      // Format américain : (XXX) XXX-XXXX
      const limitedUS = cleaned.slice(0, 10);
      if (limitedUS.length <= 3) return limitedUS;
      if (limitedUS.length <= 6) return `(${limitedUS.slice(0, 3)}) ${limitedUS.slice(3)}`;
      return `(${limitedUS.slice(0, 3)}) ${limitedUS.slice(3, 6)}-${limitedUS.slice(6)}`;
    
    case 'GB':
      // Format britannique : XXXXX XXXXXX ou XXXX XXXXXX
      const limitedGB = cleaned.slice(0, 11);
      if (limitedGB.length <= 5) return limitedGB;
      return `${limitedGB.slice(0, 5)} ${limitedGB.slice(5)}`;
    
    case 'DE':
      // Format allemand : XXX XXXXXXX ou XXXX XXXXXXX
      const limitedDE = cleaned.slice(0, 11);
      if (limitedDE.length <= 3) return limitedDE;
      if (limitedDE.length <= 7) return `${limitedDE.slice(0, 3)} ${limitedDE.slice(3)}`;
      return `${limitedDE.slice(0, 4)} ${limitedDE.slice(4)}`;
    
    case 'CH':
      // Format suisse : XXX XXX XX XX
      const limitedCH = cleaned.slice(0, 9);
      if (limitedCH.length <= 3) return limitedCH;
      if (limitedCH.length <= 6) return `${limitedCH.slice(0, 3)} ${limitedCH.slice(3)}`;
      if (limitedCH.length <= 8) return `${limitedCH.slice(0, 3)} ${limitedCH.slice(3, 6)} ${limitedCH.slice(6)}`;
      return `${limitedCH.slice(0, 3)} ${limitedCH.slice(3, 6)} ${limitedCH.slice(6, 8)} ${limitedCH.slice(8)}`;
    
    case 'LU':
      // Format luxembourgeois : XXX XXX XXX
      const limitedLU = cleaned.slice(0, 9);
      if (limitedLU.length <= 3) return limitedLU;
      if (limitedLU.length <= 6) return `${limitedLU.slice(0, 3)} ${limitedLU.slice(3)}`;
      return `${limitedLU.slice(0, 3)} ${limitedLU.slice(3, 6)} ${limitedLU.slice(6)}`;
    
    case 'IT':
      // Format italien : XX XXXX XXXX
      const limitedIT = cleaned.slice(0, 10);
      if (limitedIT.length <= 2) return limitedIT;
      if (limitedIT.length <= 6) return `${limitedIT.slice(0, 2)} ${limitedIT.slice(2)}`;
      return `${limitedIT.slice(0, 2)} ${limitedIT.slice(2, 6)} ${limitedIT.slice(6)}`;
    
    case 'ES':
      // Format espagnol : XXX XXX XXX
      const limitedES = cleaned.slice(0, 9);
      if (limitedES.length <= 3) return limitedES;
      if (limitedES.length <= 6) return `${limitedES.slice(0, 3)} ${limitedES.slice(3)}`;
      return `${limitedES.slice(0, 3)} ${limitedES.slice(3, 6)} ${limitedES.slice(6)}`;
    
    case 'BE':
      // Format belge : XXX XX XX XX
      const limitedBE = cleaned.slice(0, 9);
      if (limitedBE.length <= 3) return limitedBE;
      if (limitedBE.length <= 5) return `${limitedBE.slice(0, 3)} ${limitedBE.slice(3)}`;
      if (limitedBE.length <= 7) return `${limitedBE.slice(0, 3)} ${limitedBE.slice(3, 5)} ${limitedBE.slice(5)}`;
      return `${limitedBE.slice(0, 3)} ${limitedBE.slice(3, 5)} ${limitedBE.slice(5, 7)} ${limitedBE.slice(7)}`;
    
    default:
      // Format par défaut (français)
      const limitedDefault = cleaned.slice(0, 10);
      if (limitedDefault.length <= 2) return limitedDefault;
      if (limitedDefault.length <= 4) return `${limitedDefault.slice(0, 2)} ${limitedDefault.slice(2)}`;
      if (limitedDefault.length <= 6) return `${limitedDefault.slice(0, 2)} ${limitedDefault.slice(2, 4)} ${limitedDefault.slice(4)}`;
      if (limitedDefault.length <= 8) return `${limitedDefault.slice(0, 2)} ${limitedDefault.slice(2, 4)} ${limitedDefault.slice(4, 6)} ${limitedDefault.slice(6)}`;
      return `${limitedDefault.slice(0, 2)} ${limitedDefault.slice(2, 4)} ${limitedDefault.slice(4, 6)} ${limitedDefault.slice(6, 8)} ${limitedDefault.slice(8)}`;
  }
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

export const getPhoneExample = (countryCode: string = 'FR'): string => {
  const examples: Record<string, string> = {
    'FR': "06 12 34 56 78",
    'BE': "04 12 34 56 78", 
    'CH': "079 123 45 67",
    'LU': "621 123 456",
    'DE': "030 12345678",
    'IT': "06 1234 5678",
    'ES': "612 34 56 78",
    'GB': "07700 900123",
    'US': "(555) 123-4567",
    'CA': "(416) 123-4567",
    'MA': "06 12 34 56 78",
    'TN': "98 123 456",
    'DZ': "055 12 34 56",
    'CI': "07 12 34 56 78"
  };
  
  return examples[countryCode] || "06 12 34 56 78";
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
