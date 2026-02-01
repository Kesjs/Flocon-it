// Liste des pays européens et principaux pays pour le checkout

export interface Country {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
  currency?: string;
}

export const EUROPEAN_COUNTRIES: Country[] = [
  { code: 'FR', name: 'France', flag: '🇫🇷', phoneCode: '+33', currency: 'EUR' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪', phoneCode: '+32', currency: 'EUR' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', phoneCode: '+352', currency: 'EUR' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭', phoneCode: '+41', currency: 'CHF' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪', phoneCode: '+49', currency: 'EUR' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹', phoneCode: '+39', currency: 'EUR' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸', phoneCode: '+34', currency: 'EUR' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧', phoneCode: '+44', currency: 'GBP' },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱', phoneCode: '+31', currency: 'EUR' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', phoneCode: '+351', currency: 'EUR' },
  { code: 'AT', name: 'Autriche', flag: '🇦🇹', phoneCode: '+43', currency: 'EUR' },
  { code: 'IE', name: 'Irlande', flag: '🇮🇪', phoneCode: '+353', currency: 'EUR' },
  { code: 'DK', name: 'Danemark', flag: '🇩🇰', phoneCode: '+45', currency: 'DKK' },
  { code: 'NO', name: 'Norvège', flag: '🇳🇴', phoneCode: '+47', currency: 'NOK' },
  { code: 'SE', name: 'Suède', flag: '🇸🇪', phoneCode: '+46', currency: 'SEK' },
  { code: 'FI', name: 'Finlande', flag: '🇫🇮', phoneCode: '+358', currency: 'EUR' },
  { code: 'PL', name: 'Pologne', flag: '🇵🇱', phoneCode: '+48', currency: 'PLN' },
  { code: 'CZ', name: 'République Tchèque', flag: '🇨🇿', phoneCode: '+420', currency: 'CZK' },
  { code: 'GR', name: 'Grèce', flag: '🇬🇷', phoneCode: '+30', currency: 'EUR' },
  { code: 'HU', name: 'Hongrie', flag: '🇭🇺', phoneCode: '+36', currency: 'HUF' },
];

// Pays additionnels pour couverture mondiale
export const ADDITIONAL_COUNTRIES: Country[] = [
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', phoneCode: '+1', currency: 'USD' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', phoneCode: '+1', currency: 'CAD' },
  { code: 'AU', name: 'Australie', flag: '🇦🇺', phoneCode: '+61', currency: 'AUD' },
  { code: 'JP', name: 'Japon', flag: '🇯🇵', phoneCode: '+81', currency: 'JPY' },
  { code: 'CN', name: 'Chine', flag: '🇨🇳', phoneCode: '+86', currency: 'CNY' },
  { code: 'IN', name: 'Inde', flag: '🇮🇳', phoneCode: '+91', currency: 'INR' },
  { code: 'BR', name: 'Brésil', flag: '🇧🇷', phoneCode: '+55', currency: 'BRL' },
  { code: 'MX', name: 'Mexique', flag: '🇲🇽', phoneCode: '+52', currency: 'MXN' },
  { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦', phoneCode: '+27', currency: 'ZAR' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', phoneCode: '+212', currency: 'MAD' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳', phoneCode: '+216', currency: 'TND' },
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿', phoneCode: '+213', currency: 'DZD' },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯', phoneCode: '+229', currency: 'XOF' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', phoneCode: '+225', currency: 'XOF' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', phoneCode: '+221', currency: 'XOF' },
];

// Tous les pays disponibles
export const ALL_COUNTRIES = [...EUROPEAN_COUNTRIES, ...ADDITIONAL_COUNTRIES];

// Fonction pour filtrer les pays
export const filterCountries = (searchTerm: string): Country[] => {
  if (!searchTerm || searchTerm.length < 2) return [];
  
  return ALL_COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 20);
};

// Fonction pour obtenir un pays par son code
export const getCountryByCode = (code: string): Country | undefined => {
  return ALL_COUNTRIES.find(country => country.code === code);
};

// Fonction pour obtenir le préfixe téléphonique par pays
export const getPhonePrefixByCountry = (countryCode: string): string => {
  const country = getCountryByCode(countryCode);
  return country?.phoneCode || '+33';
};

// Pays par défaut (France)
export const DEFAULT_COUNTRY = EUROPEAN_COUNTRIES[0]; // France
