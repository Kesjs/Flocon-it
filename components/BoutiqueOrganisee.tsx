"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/data/products";
import { products, getProductsByCategory, getProductsBySubCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { ChevronDown, ChevronRight, Star, Heart, Gift, Snowflake, Home, Sparkles, Grid, List } from "lucide-react";

// Interface pour les catégories organisées
interface CategorySection {
  category: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  subCategories: {
    name: string;
    products: Product[];
    count: number;
  }[];
  totalProducts: number;
}

export default function BoutiqueOrganisee({ onViewModeChange }: { onViewModeChange?: (mode: 'classic' | 'organized') => void }) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Hiver'])); // Hiver ouvert par défaut
  const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set());

  // Organiser les produits par catégories et sous-catégories
  const organizedCategories = useMemo(() => {
    const categories: CategorySection[] = [];
    
    // Extraire toutes les catégories uniques
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    
    uniqueCategories.forEach(category => {
      const categoryProducts = getProductsByCategory(category as any);
      
      // Grouper par sous-catégories
      const subCategoryGroups = categoryProducts.reduce((acc, product) => {
        if (!acc[product.subCategory]) {
          acc[product.subCategory] = [];
        }
        acc[product.subCategory].push(product);
        return acc;
      }, {} as Record<string, Product[]>);

      const categoryConfig = {
        'Hiver': {
          title: "L'Art du Cocooning",
          description: "Tout pour un hiver doux et confortable",
          icon: Snowflake
        },
        'Saint-Valentin': {
          title: "Flocons de Tendresse",
          description: "Cadeaux romantiques pour déclarer votre amour",
          icon: Heart
        },
        'Printemps': {
          title: "Renouveau Printanier",
          description: "Fraîcheur et légèreté pour le printemps",
          icon: Sparkles
        },
        'Anniversaire': {
          title: "Joyaux d'Anniversaire",
          description: "Cadeaux uniques pour célébrer chaque année",
          icon: Gift
        },
        'Maison': {
          title: "Harmonie Maison",
          description: "Objets qui transforment votre espace",
          icon: Home
        }
      };

      const config = categoryConfig[category as keyof typeof categoryConfig] || {
        title: category,
        description: "Découvrez notre sélection",
        icon: Gift
      };

      categories.push({
        category,
        title: config.title,
        description: config.description,
        icon: config.icon,
        subCategories: Object.entries(subCategoryGroups).map(([name, prods]) => ({
          name,
          products: prods,
          count: prods.length
        })).sort((a, b) => b.count - a.count), // Trier par nombre de produits
        totalProducts: categoryProducts.length
      });
    });

    return categories.sort((a, b) => b.totalProducts - a.totalProducts); // Trier par popularité
  }, []);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubCategory = (subCategoryKey: string) => {
    const newExpanded = new Set(expandedSubCategories);
    if (newExpanded.has(subCategoryKey)) {
      newExpanded.delete(subCategoryKey);
    } else {
      newExpanded.add(subCategoryKey);
    }
    setExpandedSubCategories(newExpanded);
  };

  const getSubCategoryKey = (category: string, subCategory: string) => `${category}-${subCategory}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/cadeau-saint-valentin-couple.webp"
            alt="Boutique Flocon - Toutes nos collections"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-textDark/80 via-textDark/60 to-transparent"></div>
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Toutes nos Collections
            </h1>
            <p className="text-xl text-white/90 mb-8">
              {products.length} produits organisés par catégories et sous-catégories pour trouver facilement votre bonheur
            </p>
            
            {/* Boutons de changement de vue */}
            {onViewModeChange && (
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg p-1">
                <button
                  onClick={() => onViewModeChange('organized')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors bg-white text-rose-custom shadow-sm"
                >
                  <Grid className="w-4 h-4" />
                  <span>Vue Organisée</span>
                </button>
                <button
                  onClick={() => onViewModeChange('classic')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors text-white/80 hover:text-white"
                >
                  <List className="w-4 h-4" />
                  <span>Vue Classique</span>
                </button>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4 mt-6">
              {organizedCategories.map((cat) => (
                <div key={cat.category} className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <cat.icon className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">{cat.totalProducts} {cat.title}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Produits", value: products.length, icon: Gift },
            { label: "Catégories", value: organizedCategories.length, icon: Sparkles },
            { label: "Sous-Catégories", value: organizedCategories.reduce((acc, cat) => acc + cat.subCategories.length, 0), icon: ChevronDown },
            { label: "Promotions", value: products.filter(p => p.oldPrice).length, icon: Star }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 text-center shadow-sm"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-rose-custom" />
              <div className="text-2xl font-bold text-textDark mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Categories Sections */}
        <div className="space-y-12">
          {organizedCategories.map((category, categoryIndex) => (
            <motion.section
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Category Header */}
              <div 
                className="bg-white border border-gray-200 p-6 md:p-8 cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => toggleCategory(category.category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                      <category.icon className="w-8 h-8 text-gray-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-textDark mb-2">
                        {category.title}
                      </h2>
                      <p className="text-gray-600 text-lg mb-3">{category.description}</p>
                      <div className="flex items-center space-x-4 text-gray-500">
                        <span className="text-sm font-medium">{category.totalProducts} produits</span>
                        <span className="text-sm">•</span>
                        <span className="text-sm">{category.subCategories.length} sous-catégories</span>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedCategories.has(category.category) ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400"
                  >
                    <ChevronDown className="w-6 h-6" />
                  </motion.div>
                </div>
              </div>

              {/* SubCategories */}
              <AnimatePresence>
                {expandedCategories.has(category.category) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 md:p-8 space-y-8">
                      {category.subCategories.map((subCategory, subIndex) => {
                        const subCategoryKey = getSubCategoryKey(category.category, subCategory.name);
                        const isExpanded = expandedSubCategories.has(subCategoryKey);
                        
                        return (
                          <div key={subCategory.name} className="border border-gray-200 rounded-xl overflow-hidden">
                            {/* SubCategory Header */}
                            <div
                              className="bg-gray-50 px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => toggleSubCategory(subCategoryKey)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-textDark">
                                    {subCategory.name}
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {subCategory.count} produit{subCategory.count > 1 ? 's' : ''}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {/* Show first 3 products as preview */}
                                  <div className="flex -space-x-2">
                                    {subCategory.products.slice(0, 3).map((product, idx) => (
                                      <div key={product.id} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                                        <img
                                          src={product.images[0]}
                                          alt={product.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ))}
                                    {subCategory.products.length > 3 && (
                                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                                        <span className="text-xs text-gray-600">+{subCategory.products.length - 3}</span>
                                      </div>
                                    )}
                                  </div>
                                  <motion.div
                                    animate={{ rotate: isExpanded ? 90 : 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                  </motion.div>
                                </div>
                              </div>
                            </div>

                            {/* Products Grid */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-6">
                                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                      {subCategory.products.map((product, productIndex) => (
                                        <motion.div
                                          key={product.id}
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ duration: 0.4, delay: productIndex * 0.05 }}
                                        >
                                          <ProductCard product={product} />
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
}
