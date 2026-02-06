"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Product } from "../../data/products";
import { products, getProductsByCategory, getProductsBySubCategory, getProductsByAmbiance } from "../../data/products";
import ProductCard from "@/components/ProductCard";
import Filters from "@/components/Filters";
import { Grid, List, SlidersHorizontal, Search, Filter, X, Heart, Snowflake, Gift, Star } from "lucide-react";

export default function BoutiqueContent({ onViewModeChange }: { onViewModeChange?: (mode: 'classic' | 'organized') => void }) {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'rating'>('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('tous');
  const [filters, setFilters] = useState({
    category: [] as string[],
    priceRange: [0, 200] as [number, number],
    ambiance: [] as string[]
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Categories for sidebar
  const categories = [
    { id: 'tous', name: 'Tous les produits', count: products.length },
    { id: 'Hiver', name: 'L\'Art du Cocooning', count: getProductsByCategory('Hiver').length },
    { id: 'Saint-Valentin', name: 'Fleurs de Tendresse', count: getProductsByCategory('Saint-Valentin').length }
  ];

  // Get initial filters from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    
    if (category || subcategory) {
      let filteredProducts = products;
      
      if (category) {
        filteredProducts = getProductsByCategory(category as 'Hiver' | 'Saint-Valentin');
        setSelectedCategory(category);
      }
      
      if (subcategory) {
        filteredProducts = getProductsBySubCategory(subcategory);
      }
      
      // Extract unique categories and ambiances from filtered products
      const categories = [...new Set(filteredProducts.map(p => p.category))];
      const ambiances = [...new Set(filteredProducts.map(p => p.ambiance))];
      
      setFilters({
        category: categories,
        priceRange: [0, 200],
        ambiance: ambiances
      });
    }
  }, [searchParams]);

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by selected category
    if (selectedCategory !== 'tous') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (filters.category.length > 0) {
      result = result.filter(product => filters.category.includes(product.category));
    }

    // Filter by price range
    result = result.filter(product => 
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1]
    );

    // Filter by ambiance
    if (filters.ambiance.length > 0) {
      result = result.filter(product => filters.ambiance.includes(product.ambiance));
    }

    // Sort products
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [filters, sortBy, searchTerm, selectedCategory]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'tous') {
      setFilters(prev => ({ ...prev, category: [] }));
    } else {
      setFilters(prev => ({ ...prev, category: [categoryId] }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Amélioré et Responsive */}
      <section className="relative h-[50vh] md:h-[70vh] flex items-center overflow-hidden min-h-[400px] will-change-transform pt-32 sm:pt-36" style={{ transform: 'translateZ(0)' }}>
        <div className="absolute inset-0">
          <img
            src="/cadeau-saint-valentin-couple.webp"
            alt="Boutique Flocon - Cadeaux d'exception pour Saint-Valentin"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-textDark/90 via-textDark/70 to-transparent"></div>
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl md:max-w-3xl text-center"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 md:mb-6 leading-tight">
              Boutique Flocon
            </h1>
            
            {/* Boutons de changement de vue */}
            {onViewModeChange && (
              <div className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg p-1">
                <button
                  onClick={() => onViewModeChange('classic')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors bg-white text-rose-custom shadow-sm"
                >
                  <List className="w-4 h-4" />
                  <span>Vue Classique</span>
                </button>
                <button
                  onClick={() => onViewModeChange('organized')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors text-white/80 hover:text-white"
                >
                  <Grid className="w-4 h-4" />
                  <span>Vue Organisée</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Navigation Bar - Améliorée */}
      <nav id="produits" className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-rose-custom rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-textDark">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                </span>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-rose-custom' : 'text-gray-600 hover:text-textDark'
                  }`}
                  title="Vue grille"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-rose-custom' : 'text-gray-600 hover:text-textDark'
                  }`}
                  title="Vue liste"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose w-64"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose"
              >
                <option value="name">Trier par nom</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="rating">Meilleures évaluations</option>
              </select>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 text-white rounded-lg" style={{ backgroundColor: 'var(--rose)' }}
              >
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-24">
        <div className="flex gap-8">
          {/* Sidebar - Categories */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-textDark mb-4">Catégories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'text-white'
                        : 'hover:bg-gray-100 text-textDark'
                    }`}
                    style={{ backgroundColor: selectedCategory === category.id ? 'var(--rose)' : 'transparent' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.name}</span>
                      <span className={`text-sm ${
                        selectedCategory === category.id ? 'text-white' : 'text-gray-500'
                      }`}>
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <Filters onFiltersChange={setFilters} />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-textDark mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-600">Essayez de modifier vos filtres pour voir plus de résultats.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard 
                      product={product}
                      className={viewMode === 'list' ? 'flex flex-row' : ''}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="bg-white h-full w-80 overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-textDark">Filtri</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-medium text-textDark mb-4">Catégories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        handleCategorySelect(category.id);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-rose-custom text-white'
                          : 'hover:bg-gray-100 text-textDark'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        <span className={`text-sm ${
                          selectedCategory === category.id ? 'text-white' : 'text-gray-500'
                        }`}>
                          {category.count}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <Filters onFiltersChange={setFilters} />
            </div>
          </div>
        </div>
      )}
      
      {/* Section Occasions Rapides */}
      <section id="occasions" className="py-16 bg-gradient-to-br from-rose-custom-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-textDark mb-4">
              Idées Cadeaux par Occasion
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trouvez le cadeau parfait pour chaque moment spécial
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Heart, title: 'Saint-Valentin', link: '/boutique?category=Saint-Valentin', color: 'from-pink-400 to-rose-500' },
              { icon: Snowflake, title: 'Hiver', link: '/boutique?category=Hiver', color: 'from-blue-400 to-indigo-500' },
              { icon: Gift, title: 'Anniversaire', link: '/occasions', color: 'from-purple-400 to-pink-500' },
              { icon: Star, title: 'Remerciements', link: '/occasions', color: 'from-amber-400 to-orange-500' }
            ].map((occasion, index) => (
              <a
                key={index}
                href={occasion.link}
                className={`relative overflow-hidden rounded-xl md:rounded-2xl p-4 md:p-6 text-white bg-gradient-to-br ${occasion.color} hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
              >
                <occasion.icon className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-3" />
                <h3 className="font-semibold text-sm md:text-lg mb-2">{occasion.title}</h3>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
