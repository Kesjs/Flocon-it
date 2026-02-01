// Villes principales par pays pour le checkout international

export interface WorldCity {
  name: string;
  country: string;
  countryCode: string;
}

// Villes par pays
export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  // France
  'FR': [
    'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier',
    'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon',
    'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Villeurbanne', 'Le Mans', 'Aix-en-Provence',
    'Clermont-Ferrand', 'Brest', 'Limoges', 'Tours', 'Amiens', 'Perpignan', 'Metz',
    'Besançon', 'Orléans', 'Mulhouse', 'Rouen', 'Caen', 'Saint-Denis', 'Boulogne-Billancourt',
    'Nancy', 'Argenteuil', 'Saint-Paul', 'Montreuil', 'Roubaix', 'Tourcoing', 'Nanterre',
    'Avignon', 'Créteil', 'Dunkerque', 'Versailles', 'Courbevoie', 'Asnières-sur-Seine',
    'Colombes', 'Aulnay-sous-Bois', 'Rueil-Malmaison', 'Champigny-sur-Marne', 'Béziers',
    'La Rochelle', 'Saint-Quentin', 'Calais', 'Antibes', 'Cannes', 'Annecy', 'Compiègne',
    'Bourges', 'Chelles', 'Drancy', 'Mantes-la-Jolie', 'Pau', 'Cergy', 'Vitrolles',
    'Levallois-Perret', 'Issy-les-Moulineaux', 'Saint-Priest', 'La Roche-sur-Yon',
    'Cherbourg-en-Cotentin', 'Hyères', 'Sarcelles', 'Clichy', 'Pessac', 'Brive-la-Gaillarde',
    'Colmar', 'Ajaccio', 'Martigues', 'Belfort', 'Alès', 'Vénissieux', 'Chambéry',
    'Saint-Maur-des-Fossés', 'Cannes', 'Vincennes', 'Saint-Herblain', 'Évry-Courcouronnes',
    'Thonon-les-Bains', 'Narbonne', 'Mérignac', 'Saint-Brieuc', 'La Seyne-sur-Mer',
    'Angoulême', 'Douai', 'Frejus', 'Pontoise', 'Carpentras', 'Moulins', 'Istres',
    'Montauban', 'Lorient', 'Coutances', 'Gap', 'Alfortville', 'Saint-Cloud', 'Beziers'
  ],
  
  // Belgique
  'BE': [
    'Bruxelles', 'Anvers', 'Gand', 'Liège', 'Charleroi', 'Bruges', 'Namur', 'Louvain',
    'Mons', 'Alost', 'Courtrai', 'Hasselt', 'Seraing', 'Malines', 'Ostende', 'Tournai',
    'Genk', 'Saint-Nicolas', 'Rochefort', 'Lierre', 'Huy', 'Verviers', 'Mouscron',
    'Dendermonde', 'Tirlemont', 'Tongres', 'Eupen', 'Loo', 'Maaseik', 'Châtelet'
  ],
  
  // Suisse
  'CH': [
    'Zurich', 'Genève', 'Bâle', 'Berne', 'Lausanne', 'Winterthour', 'Lucerne', 'Saint-Gall',
    'Lugano', 'Bienne', 'Thoune', 'Köniz', 'La Chaux-de-Fonds', 'Fribourg', 'Schaffhouse',
    'Vernier', 'Sion', 'Neuchâtel', 'Uster', 'Dübendorf', 'Rüti', 'Renens', 'Wettingen',
    'Dietikon', 'Kreuzlingen', 'Adliswil', 'Lancy', 'Prilly', 'Ostermundigen', 'Montreux',
    'Wallisellen', 'Zoug', 'Emmen', 'Affoltern am Albis', 'Meyrin', 'Baar', 'Köniz'
  ],
  
  // Allemagne
  'DE': [
    'Berlin', 'Hambourg', 'Munich', 'Cologne', 'Francfort-sur-le-Main', 'Stuttgart', 'Düsseldorf',
    'Dortmund', 'Essen', 'Leipzig', 'Brême', 'Dresde', 'Hanovre', 'Nuremberg', 'Duisbourg',
    'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Mannheim', 'Karlsruhe', 'Augsbourg',
    'Wiesbaden', 'Mönchengladbach', 'Gelsenkirchen', 'Aix-la-Chapelle', 'Chemnitz', 'Krefeld',
    'Kiel', 'Magdebourg', 'Fribourg-en-Brisgau', 'Crefeld', 'Lübeck', 'Oberhausen', 'Erfurt',
    'Mayence', 'Rostock', 'Kassel', 'Sarrebruck', 'Mülheim an der Ruhr', 'Potsdam', 'Ludwigsbourg',
    'Leverkusen', 'Oldenbourg', 'Solingen', 'Paderborn', 'Ingolstadt', 'Ulm', 'Heilbronn',
    'Wolfsbourg', 'Göttingen', 'Pforzheim', 'Reutlingen', 'Bremerhaven', 'Koblenz', 'Trier',
    'Erlangen', 'Recklinghausen', 'Bergisch Gladbach', 'Iserlohn', 'Trèves', 'Jena', 'Iéna'
  ],
  
  // Italie
  'IT': [
    'Rome', 'Milan', 'Naples', 'Turin', 'Palerme', 'Gênes', 'Bologne', 'Florence',
    'Bari', 'Catane', 'Venise', 'Vérone', 'Messine', 'Padoue', 'Trieste', 'Gênes',
    'Trente', 'Brescia', 'Prato', 'Reggio de Calabre', 'Modène', 'Pérouse', 'Livourne',
    'Ravenne', 'Cagliari', 'Foggia', 'Salerno', 'Syracuse', 'Pise', 'Vicence',
    'Tarente', 'Bergame', 'Forlì', 'Trévise', 'Vénissieux', 'Latina', 'Rimini',
    'Cesena', 'Catanzaro', 'Sassari', 'Lecce', 'Grosseto', 'Monza', 'Andria', 'Sienne'
  ],
  
  // Espagne
  'ES': [
    'Madrid', 'Barcelone', 'Valence', 'Séville', 'Bilbao', 'Malaga', 'Murcie', 'Palma',
    'Las Palmas de Gran Canaria', 'Saragosse', 'Alicante', 'Cordoue', 'Valladolid', 'Vigo',
    'Gijón', 'L\'Hospitalet de Llobregat', 'La Corogne', 'Granada', 'Vitoria-Gasteiz',
    'Elche', 'Santa Cruz de Tenerife', 'Oviedo', 'Badalona', 'Cartagène', 'Móstoles',
    'Santander', 'Almería', 'San Sebastián', 'Donostia', 'Albacete', 'Getafe', 'Sabadell',
    'Jerez de la Frontera', 'Pampelune', 'Fuenlabrada', 'Alcorcón', 'Terrassa', 'Burgos',
    'Alcalá de Henares', 'Salamanque', 'León', 'Logroño', 'Sant Cugat del Vallès', 'Mataro',
    'Dénia', 'Alcobendas', 'Cornellà de Llobregat', 'Badajoz', 'Lugo', 'Villeneuve-la-Garenne'
  ],
  
  // Royaume-Uni
  'GB': [
    'Londres', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield',
    'Bristol', 'Manchester', 'Leicester', 'Coventry', 'Hull', 'Newcastle upon Tyne',
    'Nottingham', 'Stoke-on-Trent', 'Southampton', 'Reading', 'Derby', 'Portsmouth',
    'Bournemouth', 'Brighton and Hove', 'Oxford', 'Plymouth', 'York', 'Lancaster',
    'Norwich', 'Cambridge', 'Exeter', 'Chelmsford', 'Gloucester', 'Lincoln', 'Wolverhampton',
    'Preston', 'Cardiff', 'Swansea', 'Newport', 'Stoke-on-Trent', 'Warrington', 'Sunderland',
    'Milton Keynes', 'Northampton', 'Ipswich', 'Peterborough', 'Slough', 'Luton', 'Southend-on-Sea'
  ],
  
  // États-Unis
  'US': [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio',
    'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus',
    'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington', 'Boston',
    'El Paso', 'Nashville', 'Detroit', 'Oklahoma City', 'Portland', 'Las Vegas', 'Memphis',
    'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento',
    'Kansas City', 'Mesa', 'Atlanta', 'Omaha', 'Colorado Springs', 'Raleigh', 'Miami', 'Oakland',
    'Minneapolis', 'Tampa', 'Tulsa', 'Arlington', 'New Orleans', 'Wichita', 'Cleveland'
  ],
  
  // Canada
  'CA': [
    'Toronto', 'Montréal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg',
    'Québec', 'Hamilton', 'Kitchener', 'London', 'Victoria', 'Halifax', 'Oshawa', 'Windsor',
    'Saskatoon', 'Regina', 'Sherbrooke', 'St. John\'s', 'Barrie', 'Kelowna', 'Abbotsford',
    'Kingston', 'Sudbury', 'Saguenay', 'Trois-Rivières', 'Guelph', 'Moncton', 'Brantford',
    'Saint John', 'Thunder Bay', 'Lethbridge', 'Nanaimo', 'Red Deer', 'Kamloops', 'Chilliwack'
  ]
};

// Fonction pour obtenir les villes d'un pays
export const getCitiesByCountry = (countryCode: string): string[] => {
  return CITIES_BY_COUNTRY[countryCode] || [];
};

// Fonction pour filtrer les villes par pays et terme de recherche
export const filterCitiesByCountry = (countryCode: string, searchTerm: string): string[] => {
  const cities = getCitiesByCountry(countryCode);
  
  if (!searchTerm || searchTerm.length < 2) return [];
  
  return cities.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 20);
};

// Fonction pour obtenir toutes les villes (fallback)
export const getAllCities = (): WorldCity[] => {
  const allCities: WorldCity[] = [];
  
  Object.entries(CITIES_BY_COUNTRY).forEach(([countryCode, cities]) => {
    cities.forEach(city => {
      allCities.push({
        name: city,
        country: countryCode,
        countryCode
      });
    });
  });
  
  return allCities;
};
