"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Product } from "../../data/products";
import { products, getProductsByCategory, getProductsBySubCategory, getProductsByAmbiance } from "../../data/products";
import ProductCard from "@/components/ProductCard";
import Filters from "@/components/Filters";
import { Grid, List, SlidersHorizontal, Search, Filter, X, Heart, Snowflake, Gift, Star, Sparkles, ArrowRight, MessageCircle } from "lucide-react";

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
                    className={viewMode === 'grid' ? 'h-full' : ''}
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
      
      {/* Section Occasions Premium - Design 2026 */}
      <section id="occasions" className="py-20 bg-gradient-to-br from-slate-50 via-rose-50 to-pink-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23EC4899' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Guide Cadeaux 2026
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Idées Cadeaux par<br />
              <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                Moment Spécial
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez notre sélection experte pour chaque occasion. Des cadeaux qui touchent le cœur et marquent les esprits.
            </p>
          </div>
          
          {/* Cards Grid Premium */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { 
                icon: Heart, 
                title: 'Saint-Valentin', 
                subtitle: 'Amour & Tendresse',
                description: 'Cadeaux romantiques pour déclarer votre flamme',
                link: '/boutique?category=Saint-Valentin', 
                color: 'from-rose-400 via-pink-500 to-rose-600',
                badge: 'Top 2026',
                stats: '150+ idées'
              },
              { 
                icon: Snowflake, 
                title: 'Hiver', 
                subtitle: 'Confort & Chaleur',
                description: 'Le cocooning parfait pour les longues soirées',
                link: '/boutique?category=Hiver', 
                color: 'from-blue-400 via-indigo-500 to-blue-600',
                badge: 'Bestseller',
                stats: '200+ produits'
              },
              { 
                icon: Gift, 
                title: 'Anniversaire', 
                subtitle: 'Célébration & Joie',
                description: 'Surprenez avec des cadeaux uniques',
                link: '/occasions', 
                color: 'from-purple-400 via-violet-500 to-purple-600',
                badge: 'Nouveau',
                stats: '300+ options'
              },
              { 
                icon: Star, 
                title: 'Remerciements', 
                subtitle: 'Gratitude & Reconnaissance',
                description: 'Exprimez votre appreciation avec style',
                link: '/occasions', 
                color: 'from-amber-400 via-orange-500 to-amber-600',
                badge: 'Premium',
                stats: '100+ cadeaux'
              }
            ].map((occasion, index) => (
              <a
                key={index}
                href={occasion.link}
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${occasion.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-white text-xs font-bold text-gray-800 rounded-full shadow-md border border-gray-100">
                    {occasion.badge}
                  </span>
                </div>
                
                {/* Content */}
                <div className="p-8 relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${occasion.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <occasion.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Text */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                    {occasion.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 mb-3">
                    {occasion.subtitle}
                  </p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {occasion.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      {occasion.stats}
                    </span>
                    <div className="flex items-center text-rose-600 group-hover:text-rose-700 transition-colors">
                      <span className="text-sm font-medium mr-2">Explorer</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
                
                {/* Hover Effect Border */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${occasion.color} p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}>
                  <div className="w-full h-full bg-white rounded-3xl" />
                </div>
              </a>
            ))}
          </div>
          
          {/* CTA Section */}
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 bg-white rounded-3xl shadow-lg border border-gray-100">
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Besoin d\'aide pour choisir ?
                </h3>
                <p className="text-sm text-gray-600">
                  Notre expert vous guide gratuitement
                </p>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Consulter un expert
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
