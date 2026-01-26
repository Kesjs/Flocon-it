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
    name: 'Plaid à manche',
    price: 27.99,
    oldPrice: 38.99,
    description: 'Un plaid incroyablement doux qui vous enveloppe de chaleur. Tissé en fibres premium avec une texture nuageuse qui invite à la détente absolue.',
    category: 'Hiver',
    subCategory: 'Plaids & Textures',
    rating: 4.8,
    reviewsCount: 234,
    images: [
      'https://www.leclapstore.com/wp-content/uploads/2020/06/0-b08eb4.jpeg',

    ],
    stock: 15,
    badge: 'Best-seller',
    ambiance: 'Cocooning'
  },
  {
    id: '2',
    slug: 'bougie-crepitement',
    name: 'WoodWick Ellipse bougie',
    price: 34.99,
    oldPrice: 44,
    description: 'Une bougie artisanale qui reproduit le son apaisant d\'un feu de cheminée. Parfum bois de cèdre et vanille.',
    category: 'Hiver',
    subCategory: 'Ambiance & Bougies',
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
    description: 'Chaussons doublés en laine mérinos ultra-douce. Semelle antidérapante et design élégant pour un confort maximal.',
    category: 'Hiver',
    subCategory: 'Confort & Chaleur',
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
    name: 'Miniland Bouteille thermos 500ml',
    price: 21.99,
    description: 'La bouteille thermos deluxe rose maintient la température des liquides, qu’ils soient froids ou chauds, jusqu’à 12 heures.',
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
    description: 'Couverture chauffante avec 9 niveaux de température. Timer automatique et tissu hypoallergénique.',
    category: 'Hiver',
    subCategory: 'Technologie & Confort',
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
    description: 'Tasse unique façonnée à la main. Céramique de haute qualité avec glaçure mate. Parfaite pour vos boissons chaudes.',
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
    description: 'Lampe reproduisant l\'effet visuel d\'une cheminée. LED économiques et télécommande incluse. Ambiance chaleureuse garantie.',
    category: 'Hiver',
    subCategory: 'Ambiance & Lumière',
    rating: 4.6,
    reviewsCount: 156,
    images: [
      'https://m.media-amazon.com/images/I/717qElrKoeL._AC_UF1000,1000_QL80_.jpg'
    ],
    stock: 12,
    badge: 'Ambiance magique',
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
    name: 'Coffret Infusions Hivernales',
    price: 39.99,
    description: '30 sachets de thés et infusions réconfortantes. Mélanges exclusifs : cannelle-orange, gingembre-citron, camomille-miel.',
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
    name: 'Coussin Chaleur Noix de Coco',
    price: 45.99,
    description: 'Coussin chauffant aux noix de coco bio. Soulage les tensions et procure une chaleur diffuse et durable. Lavable.',
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
    description: 'Gants en laine mérinos avec bouts des doigts tactiles. Chaleur extrême et compatibilité smartphone. Design unisexe.',
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
    subCategory: 'Ambiance & Bien-être',
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
    description: 'Un ensemble de deux tasses en porcelaine fine avec motif cœur subtil. Parfait pour partager un moment chaud avec votre moitié.',
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
    description: 'Un pendentif délicat en argent 925 forme de flocon de neige. Chaque pièce est unique et symbolise la pureté et l\'élégance.',
    category: 'Saint-Valentin',
    subCategory: 'Bijoux d\'Exception',
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
    name: 'Pack Soirée Amoureux',
    price: 129.99,
    description: 'Le pack complet pour une soirée romantique inoubliable : bougies parfumées, plaid doux, deux verres à vin et chocolats.',
    category: 'Saint-Valentin',
    subCategory: 'Expériences Romantiques',
    rating: 4.8,
    reviewsCount: 267,
    images: [
      'https://m.media-amazon.com/images/I/81awtKl6JiL.jpg',
    ],
    stock: 12,
    badge: 'Coup de cœur',
    ambiance: 'Romantique'
  },
  {
    id: '16',
    slug: 'bracelet-couple',
    name: 'Bracelets Couple Magnétiques',
    price: 79.99,
    description: 'Paire de bracelets en acier inoxydable avec aimants qui s\'attirent. Gravure personnalisable incluse. Symbole d\'union.',
    category: 'Saint-Valentin',
    subCategory: 'Bijoux Couple',
    rating: 4.6,
    reviewsCount: 189,
    images: [
      'https://img.fruugo.com/product/9/66/451672669_max.jpg'
    ],
    stock: 15,
    badge: 'Personnalisable',
    ambiance: 'Romantique'
  },
  {
    id: '17',
    slug: 'rose-éternelle',
    name: 'Rose Éternelle Dôme Verre',
    price: 80,
    oldPrice: 109.99,
    description: 'Rose naturelle stabilisée dans dôme en verre. Durée de vie 3-5 ans. Lumière LED intégrée. Message personnalisé possible.',
    category: 'Saint-Valentin',
    subCategory: 'Fleurs Symboliques',
    rating: 4.8,
    reviewsCount: 234,
    images: [
      'https://m.media-amazon.com/images/I/61vYxTN+w1L.jpg'
    ],
    stock: 18,
    badge: 'Amour éternel',
    ambiance: 'Romantique'
  },
  {
    id: '18',
    slug: 'parfum-couple',
    name: 'Coffret Parfums Couple',
    price: 130,
    description: 'Deux parfums créés pour s\'harmoniser. Notes femme : fleur blanche et vanille. Notes homme : bois de cèdre et musc.',
    category: 'Saint-Valentin',
    subCategory: 'Parfums & Senteurs',
    rating: 4.7,
    reviewsCount: 145,
    images: [
      'https://www.yslbeauty.fr/on/demandware.static/-/Sites-ysl-master-catalog/default/dw04909e50/pdp/HOLIDAY-2025/pdpsection-le-parfum-holiday-collector-desk.jpg'
    ],
    stock: 10,
    badge: 'Harmonie',
    ambiance: 'Romantique'
  },
  {
    id: '19',
    slug: 'dîner-lumière',
    name: 'Kit Dîner aux Chandelles',
    price: 99.99,
    description: 'Set complet pour dîner romantique : 2 bougies premium, serviettes en lin, couverts design et jeu de questions pour couples.',
    category: 'Saint-Valentin',
    subCategory: 'Expériences Romantiques',
    rating: 4.9,
    reviewsCount: 312,
    images: [
      'https://mongraindesucre.com/wp-content/uploads/2025/02/1738374093-diner-aux-chandelles-top-des-meilleures-recettes-pour-une-soiree-romantique-1024x585.jpg'
    ],
    stock: 20,
    badge: 'Moment magique',
    ambiance: 'Romantique'
  },
  {
    id: '20',
    slug: 'collier-message',
    name: 'Collier Secretum',
    price: 119.99,
    description: 'Collier en argent avec médaillon ouvrant contenant un mini message personnalisé. Gravure extérieure incluse.',
    category: 'Saint-Valentin',
    subCategory: 'Bijoux d\'Exception',
    rating: 4.8,
    reviewsCount: 167,
    images: [
      'https://www.maisondpm.fr/cdn/shop/files/collier-personnalisable-avec-message-cache-Photoroom.jpg?v=1724542295'
    ],
    stock: 6,
    badge: 'Secret d\'amour',
    ambiance: 'Romantique'
  },
  {
    id: '21',
    slug: 'massage-couple',
    name: 'Kit Massage Couple Luxe',
    price: 49.99,
    description: 'Set complet avec 3 huiles de massage bio, bougies parfumées et guide des techniques. Packaging élégant et recyclable.',
    category: 'Saint-Valentin',
    subCategory: 'Bien-être Couple',
    rating: 4.6,
    reviewsCount: 198,
    images: [
      'https://i.etsystatic.com/40337439/r/il/270617/7599337322/il_fullxfull.7599337322_2stz.jpg'
    ],
    stock: 25,
    badge: 'Détente',
    ambiance: 'Romantique'
  },
  {
    id: '22',
    slug: 'coffre-romantique',
    name: 'Coffre à Souvenirs Couple',
    price: 149.99,
    description: 'Coffre en bois précieux avec compartiments secrets. Inclus stylo plume et carnet pour écrire vos souvenirs.',
    category: 'Saint-Valentin',
    subCategory: 'Souvenirs & Mémoires',
    rating: 4.9,
    reviewsCount: 89,
    images: [
      'https://cadeau-couple.fr/wp-content/uploads/2024/09/Boitesouvenircouple_2_1.jpg'
    ],
    stock: 12,
    badge: 'Héritage',
    ambiance: 'Romantique'
  },
  {
    id: '23',
    slug: 'champagne-amour',
    name: 'Champagne Rosé Amour',
    price: 89.99,
    description: 'Champagne rosé prestige avec étiquette personnalisée. Accompagné de deux flûtes en cristal gravées. Millésime limité.',
    category: 'Saint-Valentin',
    subCategory: 'Gourmandises',
    rating: 4.7,
    reviewsCount: 234,
    images: [
      'https://www.brut-de-champ.com/wp-content/uploads/william_deutz.10.jpg'
    ],
    stock: 30,
    badge: 'Célébration',
    ambiance: 'Romantique'
  },
  {
    id: '24',
    slug: 'puzzle-cœur',
    name: 'Puzzle Photo Cœur 1000pcs',
    price: 34.99,
    description: 'Puzzle personnalisé avec votre photo en forme de cœur. 1000 pièces de qualité premium. Boîte cadeau design.',
    category: 'Saint-Valentin',
    subCategory: 'Jeux & Divertissement',
    rating: 4.5,
    reviewsCount: 156,
    images: [
      'https://m.media-amazon.com/images/I/71ZTg9+7AXL._AC_UF1000,1000_QL80_.jpg'
    ],
    stock: 35,
    badge: 'Personnalisé',
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
