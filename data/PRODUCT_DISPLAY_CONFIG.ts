export interface ProductDisplayRule {
  productIds?: string[];
  maxProducts?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'discount';
  sortOrder?: 'asc' | 'desc';
  filterBy?: {
    category?: string[];
    subCategory?: string[];
    tags?: string[];
    priceRange?: { min: number; max: number };
    inStock?: boolean;
    featured?: boolean;
  };
  showExploreButton?: boolean;
  exploreButtonText?: string;
  exploreButtonLink?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  enableRealTimeSearch?: boolean;
}

export interface PageConfig {
  sections: {
    title: string;
    subtitle?: string;
    rule: ProductDisplayRule;
    layout?: 'grid' | 'carousel' | 'featured';
    columns?: number;
  }[];
}

export interface ProductDisplayConfig {
  version: string;
  lastUpdated: string;
  global: {
    promotions: {
      enabled: boolean;
      discountThreshold: number;
      autoShow: boolean;
    };
    featured: {
      maxProducts: number;
      rotateDaily: boolean;
    };
    outOfStock: {
      hideProducts: boolean;
      showNotifyButton: boolean;
    };
  };
  pages: {
    accueil: PageConfig;
    boutique: PageConfig;
    promotions: PageConfig;
    personnalise: PageConfig;
    occasions: PageConfig;
    categories: {
      hiver: PageConfig;
      'saint-valentin': PageConfig;
      printemps: PageConfig;
      anniversaire: PageConfig;
      maison: PageConfig;
    };
    subcategories: {
      'hiver/couvertures-textures': PageConfig;
      'hiver/ambiance-bougies': PageConfig;
      'hiver/tasses-accessoires': PageConfig;
      'saint-valentin/bijoux-accessoires': PageConfig;
      'saint-valentin/parfums-beaute': PageConfig;
      'saint-valentin/experiences-activites': PageConfig;
      'printemps/plein-air-jardin': PageConfig;
      'printemps/pique-nique-loisirs': PageConfig;
      'printemps/plage-voyage': PageConfig;
      'anniversaire/femme': PageConfig;
      'anniversaire/homme': PageConfig;
      'anniversaire/enfant': PageConfig;
      'maison/salon': PageConfig;
      'maison/cuisine': PageConfig;
      'maison/chambre': PageConfig;
    };
  };
}

export const PRODUCT_DISPLAY_CONFIG: ProductDisplayConfig = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  global: {
    promotions: {
      enabled: true,
      discountThreshold: 10,
      autoShow: true
    },
    featured: {
      maxProducts: 8,
      rotateDaily: false
    },
    outOfStock: {
      hideProducts: false,
      showNotifyButton: true
    }
  },
  pages: {
    accueil: {
      sections: [
        {
          title: ' L\'Art du Cocooning - Hiver',
          subtitle: 'Chaleur et confort pour les journées fraîches',
          rule: {
            filterBy: { category: ['Hiver'] },
            maxProducts: 12,
            sortBy: 'rating',
            sortOrder: 'desc'
          },
          layout: 'grid',
          columns: 4
        },
        {
          title: ' Flocons de Tendresse - Saint-Valentin',
          subtitle: 'Déclarez votre amour avec élégance',
          rule: {
            filterBy: { category: ['Saint-Valentin'] },
            maxProducts: 12,
            sortBy: 'rating',
            sortOrder: 'desc'
          },
          layout: 'grid',
          columns: 4
        },
      ]
    },
    boutique: {
      sections: [
        {
          title: ' Tous nos Produits',
          subtitle: 'Explorez notre catalogue complet avec filtres par catégories et recherche en temps réel',
          rule: {
            maxProducts: 61,
            sortBy: 'name',
            sortOrder: 'asc',
            showFilters: true,
            showSearch: true,
            enableRealTimeSearch: true
          },
          layout: 'grid',
          columns: 4
        }
      ]
    },
    promotions: {
      sections: [
        {
          title: ' Super Promotions',
          subtitle: 'Jusqu\'à -50% sur des produits sélectionnés',
          rule: {
            filterBy: { 
              tags: ['promo'],
              inStock: true 
            },
            maxProducts: 50,
            sortBy: 'price',
            sortOrder: 'asc'
          },
          layout: 'grid',
          columns: 4
        }
      ]
    },
    personnalise: {
      sections: [
        {
          title: ' Produits Personnalisables',
          subtitle: 'Des cadeaux uniques et personnels',
          rule: {
            filterBy: { 
              tags: ['personnalisable'],
              inStock: true 
            },
            maxProducts: 12,
            sortBy: 'rating',
            sortOrder: 'desc'
          },
          layout: 'grid',
          columns: 4
        }
      ]
    },
    occasions: {
      sections: [
        {
          title: '❤️ Saint-Valentin',
          subtitle: 'Déclarez votre amour avec élégance',
          rule: {
            filterBy: { 
              tags: ['saint-valentin'],
              inStock: true 
            },
            maxProducts: 8,
            sortBy: 'rating',
            sortOrder: 'desc'
          },
          layout: 'grid',
          columns: 4
        },
        {
          title: '🎂 Anniversaire',
          subtitle: 'Célébrez chaque année en beauté',
          rule: {
            filterBy: { 
              tags: ['anniversaire'],
              inStock: true 
            },
            maxProducts: 8,
            sortBy: 'rating',
            sortOrder: 'desc'
          },
          layout: 'grid',
          columns: 4
        },
        {
          title: '🎄 Noël',
          subtitle: 'La magie de Noël dans chaque cadeau',
          rule: {
            filterBy: { 
              tags: ['noel'],
              inStock: true 
            },
            maxProducts: 8,
            sortBy: 'rating',
            sortOrder: 'desc'
          },
          layout: 'grid',
          columns: 4
        },
        {
          title: '💐 Fête des Mères',
          subtitle: 'Hommage à celles qui nous ont tout donné',
          rule: {
            filterBy: { 
              tags: ['fete-meres'],
              inStock: true 
            },
            maxProducts: 8,
            sortBy: 'rating',
            sortOrder: 'desc'
          },
          layout: 'grid',
          columns: 4
        },
        {
          title: '👶 Nouveau-né',
          subtitle: 'Bienvenue dans ce monde avec douceur',
          rule: {
            filterBy: { 
              tags: ['nouveau-ne'],
              inStock: true 
            },
            maxProducts: 8,
            sortBy: 'rating',
            sortOrder: 'desc'
          },
          layout: 'grid',
          columns: 4
        },
        {
          title: '🙏 Remerciement',
          subtitle: 'Exprimez votre gratitude avec style',
          rule: {
            filterBy: { 
              tags: ['remerciement'],
              inStock: true 
            },
            maxProducts: 8,
            sortBy: 'rating',
            sortOrder: 'desc'
          },
          layout: 'grid',
          columns: 4
        }
      ]
    },
    categories: {
      hiver: {
        sections: [
          {
            title: ' Collection Hiver',
            subtitle: '12 produits pour la saison froide',
            rule: {
              filterBy: { category: ['Hiver'] },
              maxProducts: 12,
              sortBy: 'name',
              sortOrder: 'asc'
            },
            layout: 'grid',
            columns: 4
          }
        ]
      },
      'saint-valentin': {
        sections: [
          {
            title: ' Saint-Valentin',
            subtitle: '12 déclarations d\'amour',
            rule: {
              filterBy: { category: ['Saint-Valentin'] },
              maxProducts: 12,
              sortBy: 'name',
              sortOrder: 'asc'
            },
            layout: 'grid',
            columns: 4
          }
        ]
      },
      printemps: {
        sections: [
          {
            title: ' Printemps/Été',
            subtitle: '12 produits pour le beau temps',
            rule: {
              filterBy: { category: ['Printemps'] },
              maxProducts: 12,
              sortBy: 'name',
              sortOrder: 'asc'
            },
            layout: 'grid',
            columns: 4
          }
        ]
      },
      anniversaire: {
        sections: [
          {
            title: ' Anniversaire',
            subtitle: '12 idées cadeaux parfaits',
            rule: {
              filterBy: { category: ['Anniversaire'] },
              maxProducts: 12,
              sortBy: 'name',
              sortOrder: 'asc'
            },
            layout: 'grid',
            columns: 4
          }
        ]
      },
      maison: {
        sections: [
          {
            title: ' Maison & Décoration',
            subtitle: '12 pièces pour un intérieur stylé',
            rule: {
              filterBy: { category: ['Maison'] },
              maxProducts: 12,
              sortBy: 'name',
              sortOrder: 'asc'
            },
            layout: 'grid',
            columns: 4
          }
        ]
      }
    },
    subcategories: {
      'hiver/couvertures-textures': {
        sections: [
          {
            title: '🛋️ Couvertures & Textures',
            subtitle: 'Douceur et chaleur',
            rule: {
              filterBy: { subCategory: ['Plaids & Textures'] },
              maxProducts: 6,
              sortBy: 'rating',
              sortOrder: 'desc'
            },
            layout: 'grid',
            columns: 3
          }
        ]
      },
      'hiver/ambiance-bougies': {
        sections: [
          {
            title: 'Ambiance & Bougies',
            subtitle: 'Créez une atmosphère chaleureuse',
            rule: {
              filterBy: { subCategory: ['Salon'] },
              maxProducts: 4,
              sortBy: 'rating',
              sortOrder: 'desc'
            },
            layout: 'grid',
            columns: 2
          }
        ]
      },
      'hiver/tasses-accessoires': {
        sections: [
          {
            title: '☕Tasses & Accessoires',
            subtitle: 'Le confort dans votre tasse',
            rule: {
              filterBy: { subCategory: ['Salon'] },
              maxProducts: 2,
              sortBy: 'rating',
              sortOrder: 'desc'
            },
            layout: 'grid',
            columns: 2
          }
        ]
      },
      'saint-valentin/bijoux-accessoires': {
        sections: [
          {
            title: ' Bijoux & Accessoires',
            subtitle: 'Élégance et romance',
            rule: {
              filterBy: { subCategory: ['Femme'] },
              maxProducts: 4,
              sortBy: 'rating',
              sortOrder: 'desc'
            },
            layout: 'grid',
            columns: 2
          }
        ]
      },
      'saint-valentin/parfums-beaute': {
        sections: [
          {
            title: ' Parfums & Beauté',
            subtitle: 'Séduction et raffinement',
            rule: {
              filterBy: { subCategory: ['Femme'] },
              maxProducts: 3,
              sortBy: 'rating',
              sortOrder: 'desc'
            },
            layout: 'grid',
            columns: 3
          }
        ]
      },
      'saint-valentin/experiences-activites': {
        sections: [
          {
            title: ' Expériences & Activités',
            subtitle: 'Moments inoubliables à deux',
            rule: {
              filterBy: { subCategory: ['Esperienze & Attività'] },
              maxProducts: 5,
              sortBy: 'rating',
              sortOrder: 'desc'
            },
            layout: 'grid',
            columns: 3
          }
        ]
      },
      'printemps/plein-air-jardin': {
        sections: [
          {
            title: ' Plein Air & Jardin',
            subtitle: 'Profitez de l\'extérieur',
            rule: {
              filterBy: { subCategory: ['Plein air & Jardin'] },
              maxProducts: 4,
              sortBy: 'rating',
              sortOrder: 'desc'
            },
            layout: 'grid',
            columns: 2
          }
        ]
      },
      'printemps/pique-nique-loisirs': {
        sections: [
          {
            title: ' Pique-nique & Loisirs',
            subtitle: 'Détente et plaisir',
            rule: {
              filterBy: { subCategory: ['Pique-nique & Loisirs'] },
              maxProducts: 4,
              sortBy: 'rating',
              sortOrder: 'desc'
            },
            layout: 'grid',
            columns: 2
          }
        ]
      },
      'printemps/plage-voyage': {
        sections: [
          {
            title: ' Plage & Voyage',
            subtitle: 'Évasion et aventure',
            rule: {
              filterBy: { subCategory: ['Plage & Voyage'] },
              maxProducts: 4,
              sortBy: 'rating',
              sortOrder: 'desc'
            },
            layout: 'grid',
            columns: 2
          }
        ]
      },
      'anniversaire/femme': {
        sections: [
          {
            title: ' Cadeaux Femme',
            subtitle: 'Élégance au féminin',
            rule: {
              filterBy: { subCategory: ['Femme'] },
              maxProducts: 4,
              sortBy: 'rating',
              sortOrder: 'desc'
            },
            layout: 'grid',
            columns: 2
          }
        ]
      },
      'anniversaire/homme': {
        sections: [
          {
            title: '🎩 Cadeaux Homme',
            subtitle: 'Style et technologie',
            rule: {
              filterBy: { subCategory: ['Homme'] },
              maxProducts: 4,
              sortBy: 'rating',
              sortOrder: 'desc'
            },
            layout: 'grid',
            columns: 2
          }
        ]
      },
      'anniversaire/enfant': {
        sections: [
          {
            title: ' Cadeaux Enfant',
            subtitle: 'Joie et éveil',
            rule: {
              filterBy: { subCategory: ['Enfant'] },
              maxProducts: 4,
              sortBy: 'rating',
              sortOrder: 'desc'
            },
            layout: 'grid',
            columns: 2
          }
        ]
      },
      'maison/salon': {
        sections: [
          {
            title: ' Salon',
            subtitle: 'Cœur de la maison',
            rule: {
              filterBy: { subCategory: ['Salon'] },
              maxProducts: 5,
              sortBy: 'rating',
              sortOrder: 'desc'
            },
            layout: 'grid',
            columns: 3
          }
        ]
      },
      'maison/cuisine': {
        sections: [
          {
            title: ' Cuisine',
            subtitle: 'Art culinaire et design',
            rule: {
              filterBy: { subCategory: ['Cuisine'] },
              maxProducts: 4,
              sortBy: 'rating',
              sortOrder: 'desc'
            },
            layout: 'grid',
            columns: 2
          }
        ]
      },
      'maison/chambre': {
        sections: [
          {
            title: ' Chambre',
            subtitle: 'Douceur et intimité',
            rule: {
              filterBy: { subCategory: ['Chambre'] },
              maxProducts: 3,
              sortBy: 'rating',
              sortOrder: 'desc'
            },
            layout: 'grid',
            columns: 3
          }
        ]
      }
    }
  }
};
