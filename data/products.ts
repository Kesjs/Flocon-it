export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  category: 'Hiver' | 'Saint-Valentin';
  subCategory: string;
  rating: number;
  reviewsCount: number;
  images: string[];
  stock: number;
  badge?: string;
  ambiance: 'Cocooning' | 'Romantique';
}

export const products: Product[] = [
  // Produits Hiver (12 produits)
  {
    id: '1',
    slug: 'plaid-manche',
    name: 'Plaid Manche',
    price: 27.99,
    oldPrice: 38.99,
    description: 'Une couverture incroyablement douce qui vous enveloppe de chaleur. Tissée en fibres premium avec une texture nuageuse qui invite au relax absolu.',
    category: 'Hiver',
    subCategory: 'Coperte & Texture',
    rating: 4.8,
    reviewsCount: 234,
    images: [
      'https://www.leclapstore.com/wp-content/uploads/2020/06/0-b08eb4.jpeg',

    ],
    stock: 15,
    badge: 'Bestseller',
    ambiance: 'Cocooning'
  },
  {
    id: '2',
    slug: 'bougie-crepitement',
    name: 'Bougie Crépitement',
    price: 34.99,
    oldPrice: 44,
    description: 'Une bougie artisanale qui reproduit le son relaxant d\'un cheminée. Parfum de bois de cèdre et vanille.',
    category: 'Hiver',
    subCategory: 'Atmosfera & Candele',
    rating: 4.6,
    reviewsCount: 189,
    images: [
      'https://m.media-amazon.com/images/I/81WCvlPi2TL.jpg'
    ],
    stock: 28,
    badge: 'Nouveauté',
    ambiance: 'Cocooning'
  },
  {
    id: '6',
    slug: 'chaussons-laine',
    name: 'Chaussons Laine Merinos',
    price: 39.99,
    description: 'Chaussons doublés en laine merinos ultra-douce. Semelle antidérapante et design élégant pour un confort maximum.',
    category: 'Hiver',
    subCategory: 'Comfort & Calore',
    rating: 4.7,
    reviewsCount: 145,
    images: [
      'https://alpesdusud.ch/wp-content/uploads/2021/10/4-9.webp',
      'https://alpesdusud.ch/wp-content/uploads/2021/10/2-11.webp'
    ],
    stock: 35,
    badge: 'Confort garanti',
    ambiance: 'Cocooning'
  },
  {
    id: '7',
    slug: 'thermos-luxe',
    name: 'Thermos Luxe',
    price: 21.99,
    description: 'Le thermos deluxe rose maintient la température des liquides, froids ou chauds, jusqu\'à 12 heures.',
    category: 'Hiver',
    subCategory: 'Accessoires',
    rating: 4.5,
    reviewsCount: 98,
    images: [
      'https://babyfive.ma/wp-content/uploads/2023/10/Bouteille-thermos-deluxe-rose-avec-effet-chrome-500ml-Miniland-1.jpg',
      'https://www.goldengames.ma/wp-content/uploads/2023/05/5005089260_1_4-800x800.webp'
    ],
    stock: 22,
    badge: 'Qualité premium',
    ambiance: 'Cocooning'
  },
  {
    id: '8',
    slug: 'couverture-électrique',
    name: 'Couverture Électrique Intelligente',
    price: 89,
    oldPrice: 109.99,
    description: 'Couverture chauffante avec 9 niveaux de température. Minuterie automatique et tissu hypoallergénique.',
    category: 'Hiver',
    subCategory: 'Tecnologia & Comfort',
    rating: 4.9,
    reviewsCount: 267,
    images: [
      'https://m.media-amazon.com/images/I/71f7uHAiL+L._AC_UF1000,1000_QL80_.jpg',
      'https://m.media-amazon.com/images/I/71zb9kVJUOL._AC_SL1500_.jpg'
    ],
    stock: 18,
    badge: 'Innovation',
    ambiance: 'Cocooning'
  },
  {
    id: '9',
    slug: 'tasse-ceramique',
    name: 'Tasse Céramique Artisanale',
    price: 24.99,
    description: 'Tasse unique modelée à la main. Céramique de haute qualité avec émail mat. Parfaite pour vos boissons chaudes.',
    category: 'Hiver',
    subCategory: 'Accessoires',
    rating: 4.4,
    reviewsCount: 89,
    images: [
      'https://cdn.shopify.com/s/files/1/0516/3171/8560/products/tassestricoloresn_b_4.jpg?v=1659114955'
    ],
    stock: 45,
    badge: 'Artisanal',
    ambiance: 'Cocooning'
  },
  {
    id: '10',
    slug: 'lampe-cheminee',
    name: 'Lampe Cheminée LED',
    price: 89,
    description: 'Lampe qui reproduit l\'effet visuel d\'une cheminée. LED basse consommation et télécommande incluse. Atmosphère chaude garantie.',
    category: 'Hiver',
    subCategory: 'Atmosphère & Lumière',
    rating: 4.6,
    reviewsCount: 156,
    images: [
      'https://m.media-amazon.com/images/I/717qElrKoeL._AC_UF1000,1000_QL80_.jpg'
    ],
    stock: 12,
    badge: 'Atmosphère magique',
    ambiance: 'Cocooning'
  },
  {
    id: '11',
    slug: 'bonnet-cachemire',
    name: 'Bonnet Aspen Homme-Cachemire',
    price: 102.99,
    oldPrice: 130,
    description: 'Bonnet en cachemire 100% de Mongolie. Douceur inégalée et thermorégulation naturelle. Élégance intemporelle.',
    category: 'Hiver',
    subCategory: 'Mode & Accessoires',
    rating: 4.8,
    reviewsCount: 78,
    images: [
      'https://media.maisoncashmere.com/a48304ef-7d4e-4a4c-9823-719ec3f82e09/maisoncashmere.com/cdn/shop/files/mens-aspen-cashmere-hat-U463-20-0008-U.webp?v=1754401839&width=1024',
      'https://media.maisoncashmere.com/a48304ef-7d4e-4a4c-9823-719ec3f82e09/maisoncashmere.com/cdn/shop/files/mens-aspen-cashmere-hat-U463-20-0008-5823.webp?v=1754401840&width=1024',
      '/images/products/bonnet-cachemire-3.jpg'
    ],
    stock: 8,
    badge: 'Luxe',
    ambiance: 'Cocooning'
  },
  {
    id: '12',
    slug: 'infusion-hivernale',
    name: 'Boîte Infusions Hivernales',
    price: 39.99,
    description: '30 sachets de thés et infusions réconfortants. Mélanges exclusifs : cannelle-orange, gingembre-citron, camomille-miel.',
    category: 'Hiver',
    subCategory: 'Gourmandises',
    rating: 4.7,
    reviewsCount: 234,
    images: [
      'https://cdn.shopify.com/s/files/1/0830/2346/2742/files/kit-the-arrange-549166.jpg?v=1728050535'
    ],
    stock: 55,
    badge: 'Bio',
    ambiance: 'Cocooning'
  },
  {
    id: '13',
    slug: 'coussin-chaleur',
    name: 'Coussin Chaleur Coco',
    price: 45.99,
    description: 'Coussin chauffant avec noix de coco bio. Soulage les tensions et procure une chaleur diffuse et durable. Lavable.',
    category: 'Hiver',
    subCategory: 'Bien-être',
    rating: 4.5,
    reviewsCount: 167,
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqaEsJW4WOnRp3HBHkh5EjkfBJtGENySgzbA&s'
    ],
    stock: 30,
    badge: 'Thérapie',
    ambiance: 'Cocooning'
  },
  {
    id: '14',
    slug: 'gants-tactiles',
    name: 'Gants Laine Tactiles',
    price: 34.99,
    description: 'Gants en laine merinos avec bouts des doigts tactiles. Chaleur extrême et compatibilité smartphone. Unisexe.',
    category: 'Hiver',
    subCategory: 'Mode & Accessoires',
    rating: 4.3,
    reviewsCount: 123,
    images: [
      'https://lespetitsimprimes.com/cdn/shop/products/gant-tactile-femme-gant-tactile-homme-gants-femme-tactile-4.jpg?v=1672427974'
    ],
    stock: 40,
    badge: 'Pratique',
    ambiance: 'Cocooning'
  },
  {
    id: '15',
    slug: 'diffuseur-humidite',
    name: 'Diffuseur Humidité Bois',
    price: 69.99,
    description: 'Diffuseur d\'huiles essentielles avec humidificateur. Design en bois naturel. LED colorées et programmation horaire.',
    category: 'Hiver',
    subCategory: 'Atmosphère & Bien-être',
    rating: 4.6,
    reviewsCount: 198,
    images: [
      'https://www.cdiscount.com/pdt2/6/4/1/1/700x700/aaarc22641/rw/diffuseur-darmes-.jpg'
    ],
    stock: 25,
    badge: 'Aromathérapie',
    ambiance: 'Cocooning'
  },
  
  // Produits Saint-Valentin (12 produits)
  {
    id: '3',
    slug: 'duo-de-tasses',
    name: 'Duo de Tasses Cœur',
    price: 49.99,
    description: 'Un set de deux tasses en porcelaine fine avec motif cœur délicat. Parfait pour partager un moment chaud avec votre moitié.',
    category: 'Saint-Valentin',
    subCategory: 'Coffrets Duo',
    rating: 4.9,
    reviewsCount: 156,
    images: [
      'https://mycrazystuff.com/14544-width_1000/coffret-duo-mugs-toi-et-moi.jpg'
    ],
    stock: 22,
    badge: 'Cadeau parfait',
    ambiance: 'Romantique'
  },
  {
    id: '4',
    slug: 'bijou-flocon',
    name: 'Bijou Flocon',
    price: 149.99,
    oldPrice: 199.99,
    description: 'Un pendentif délicat en argent 925 en forme de flocon de neige. Chaque pièce est unique et symbolise pureté et élégance.',
    category: 'Saint-Valentin',
    subCategory: 'Bijoux Exceptionnels',
    rating: 4.7,
    reviewsCount: 98,
    images: [
      'https://www.emmafashionstyle.fr/img_s1/74984/boutique/img_5429.jpg',
      
    ],
    stock: 8,
    badge: 'Édition limitée',
    ambiance: 'Romantique'
  },
  {
    id: '5',
    slug: 'pack-amoureux',
    name: 'Pack Soirée Amour',
    price: 129.99,
    description: 'Le pack complet pour une soirée romantique inoubliable : bougies parfumées, couverture douce, deux flûtes à vin et chocolats.',
    category: 'Saint-Valentin',
    subCategory: 'Expériences Romantiques',
    rating: 4.8,
    reviewsCount: 267,
    images: [
      'https://m.media-amazon.com/images/I/81awtKl6JiL.jpg'
    ],
    stock: 12,
    badge: 'Coup de cœur',
    ambiance: 'Romantique'
  },
  {
    id: '16',
    slug: 'bracelet-couple',
    name: 'Bracciali Coppia Magnetici',
    price: 79.99,
    description: 'Coppia di bracciali in acciaio inossidabile con magneti che si attraggono. Incisione personalizzabile inclusa. Simbolo di unione.',
    category: 'Saint-Valentin',
    subCategory: 'Gioielli Coppia',
    rating: 4.6,
    reviewsCount: 189,
    images: [
      'https://img.fruugo.com/product/9/66/451672669_max.jpg'
    ],
    stock: 15,
    badge: 'Personalizzabile',
    ambiance: 'Romantique'
  },
  {
    id: '17',
    slug: 'rose-éternelle',
    name: 'Rosa Eterna Cupola Vetro',
    price: 80,
    oldPrice: 109.99,
    description: 'Rosa naturale stabilizzata in cupola di vetro. Durata 3-5 anni. LED integrato. Messaggio personalizzato possibile.',
    category: 'Saint-Valentin',
    subCategory: 'Fiori Simbolici',
    rating: 4.8,
    reviewsCount: 234,
    images: [
      'https://m.media-amazon.com/images/I/61vYxTN+w1L.jpg'
    ],
    stock: 18,
    badge: 'Amore eterno',
    ambiance: 'Romantique'
  },
  {
    id: '18',
    slug: 'parfum-couple',
    name: 'Cofanetto Profumi Coppia',
    price: 130,
    description: 'Due profumi creati per armonizzarsi. Note donna: fiore bianco e vaniglia. Note uomo: legno di cedro e muschio.',
    category: 'Saint-Valentin',
    subCategory: 'Profumi & Fragranze',
    rating: 4.7,
    reviewsCount: 145,
    images: [
      'https://www.yslbeauty.fr/on/demandware.static/-/Sites-ysl-master-catalog/default/dw04909e50/pdp/HOLIDAY-2025/pdpsection-le-parfum-holiday-collector-desk.jpg'
    ],
    stock: 10,
    badge: 'Armonia',
    ambiance: 'Romantique'
  },
  {
    id: '19',
    slug: 'dîner-lumière',
    name: 'Kit Cena a Candele',
    price: 99.99,
    description: 'Set completo per cena romantica: 2 candele premium, tovaglie in lino, posate design e gioco di domande per coppie.',
    category: 'Saint-Valentin',
    subCategory: 'Esperienze Romantiche',
    rating: 4.9,
    reviewsCount: 312,
    images: [
      'https://mongraindesucre.com/wp-content/uploads/2025/02/1738374093-diner-aux-chandelles-top-des-meilleures-recettes-pour-une-soiree-romantique-1024x585.jpg'
    ],
    stock: 20,
    badge: 'Momento magico',
    ambiance: 'Romantique'
  },
  {
    id: '20',
    slug: 'collier-message',
    name: 'Collana Secretum',
    price: 119.99,
    description: 'Collana in argento con medaglione apribile contenente un mini messaggio personalizzato. Incisione esterna inclusa.',
    category: 'Saint-Valentin',
    subCategory: 'Gioielli Eccezionali',
    rating: 4.8,
    reviewsCount: 167,
    images: [
      'https://www.maisondpm.fr/cdn/shop/files/collier-personnalisable-avec-message-cache-Photoroom.jpg?v=1724542295'
    ],
    stock: 6,
    badge: 'Segreto d\'amore',
    ambiance: 'Romantique'
  },
  {
    id: '21',
    slug: 'massage-couple',
    name: 'Kit Massaggio Coppia Lusso',
    price: 49.99,
    description: 'Set completo con 3 oli massaggio bio, candele profumate e guida delle tecniche. Packaging elegante e riciclabile.',
    category: 'Saint-Valentin',
    subCategory: 'Benessere Coppia',
    rating: 4.6,
    reviewsCount: 198,
    images: [
      'https://i.etsystatic.com/40337439/r/il/270617/7599337322/il_fullxfull.7599337322_2stz.jpg'
    ],
    stock: 25,
    badge: 'Relax',
    ambiance: 'Romantique'
  },
  {
    id: '22',
    slug: 'coffre-romantique',
    name: 'Baule Ricordi Coppia',
    price: 149.99,
    description: 'Baule in legno pregiato con scompartimenti segreti. Include penna stilografica e taccuino per scrivere i vostri ricordi.',
    category: 'Saint-Valentin',
    subCategory: 'Ricordi & Memorie',
    rating: 4.9,
    reviewsCount: 89,
    images: [
      'https://cadeau-couple.fr/wp-content/uploads/2024/09/Boitesouvenircouple_2_1.jpg'
    ],
    stock: 12,
    badge: 'Eredità',
    ambiance: 'Romantique'
  },
  {
    id: '23',
    slug: 'champagne-amour',
    name: 'Champagne Rosé Amore',
    price: 89.99,
    description: 'Champagne rosé prestige con etichetta personalizzata. Accompagnato da due flûte in cristallo incise. Edizione limitata.',
    category: 'Saint-Valentin',
    subCategory: 'Gourmandises',
    rating: 4.7,
    reviewsCount: 234,
    images: [
      'https://www.brut-de-champ.com/wp-content/uploads/william_deutz.10.jpg'
    ],
    stock: 30,
    badge: 'Celebrazione',
    ambiance: 'Romantique'
  },
  {
    id: '24',
    slug: 'puzzle-cœur',
    name: 'Puzzle Foto Cuore 1000pz',
    price: 34.99,
    description: 'Puzzle personalizzato con la tua foto a forma di cuore. 1000 pezzi di qualità premium. Scatola regalo design.',
    category: 'Saint-Valentin',
    subCategory: 'Giochi & Intrattenimento',
    rating: 4.5,
    reviewsCount: 156,
    images: [
      'https://m.media-amazon.com/images/I/71ZTg9+7AXL._AC_UF1000,1000_QL80_.jpg'
    ],
    stock: 35,
    badge: 'Personalizzato',
    ambiance: 'Romantique'
  }
];

// Helper functions
export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

export const getProductsByCategory = (category: 'Hiver' | 'Saint-Valentin'): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductsBySubCategory = (subCategory: string): Product[] => {
  return products.filter(product => product.subCategory === subCategory);
};

export const getSubCategories = (): string[] => {
  return [...new Set(products.map(product => product.subCategory))];
};

export const getProductsByAmbiance = (ambiance: 'Cocooning' | 'Romantique'): Product[] => {
  return products.filter(product => product.ambiance === ambiance);
};
