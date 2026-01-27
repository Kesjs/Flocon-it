"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Product } from "../../data/products";
import { products, getProductsByCategory, getProductsBySubCategory, getProductsByAmbiance } from "../../data/products";
import ProductCard from "@/components/ProductCard";
import Filters from "@/components/Filters";
import { Grid, List, SlidersHorizontal, Search, Filter, X } from "lucide-react";

export default function BoutiquePage() {
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
    { id: 'tous', name: 'Tutti i prodotti', count: products.length },
    { id: 'Hiver', name: 'L\'Arte del Cocooning', count: getProductsByCategory('Hiver').length },
    { id: 'Saint-Valentin', name: 'Fiocchi di Tenerezza', count: getProductsByCategory('Saint-Valentin').length }
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-textDark to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Boutique Flocon
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Découvrez notre sélection unique de produits pour l'hiver et la Saint-Valentin.
              Créations artisanales qui réchauffent le cœur et l'âme.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <span className="text-sm text-gray-600">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              </span>
              
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
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
                <option value="name">Ordina per nome</option>
                <option value="price-asc">Prezzo crescente</option>
                <option value="price-desc">Prezzo decrescente</option>
                <option value="rating">Migliori valutazioni</option>
              </select>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 text-white rounded-lg" style={{ backgroundColor: 'var(--rose)' }}
              >
                <Filter className="w-4 h-4" />
                <span>Filtri</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Categories */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-textDark mb-4">Categorie</h3>
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
                <h3 className="text-lg font-medium text-textDark mb-2">Nessun prodotto trovato</h3>
                <p className="text-gray-600">Prova a modificare i tuoi filtri per vedere più risultati.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
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
                <h4 className="font-medium text-textDark mb-4">Categorie</h4>
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
    </div>
  );
}
