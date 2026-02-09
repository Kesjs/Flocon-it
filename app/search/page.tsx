"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Product, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Search, Filter, X, ArrowLeft, ShoppingBag, Sparkles, Command } from "lucide-react";
import Link from "next/link";

const SearchPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.subCategory.toLowerCase().includes(term) ||
      product.ambiance.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    filteredProducts.forEach(product => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
    return grouped;
  }, [filteredProducts]);

  const updateUrl = (term: string) => {
    const params = new URLSearchParams(window.location.search);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* BARRE DE RECHERCHE FLOATING */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-custom transition-colors" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                updateUrl(e.target.value);
              }}
              placeholder="Rechercher une émotion, un cadeau, une ambiance..."
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-12 text-lg focus:ring-2 focus:ring-rose-custom/20 transition-all font-medium"
              autoFocus
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {searchTerm ? (
                   <button onClick={() => {setSearchTerm(''); updateUrl('');}} className="p-1 hover:bg-gray-200 rounded-md">
                    <X size={18} className="text-gray-400" />
                   </button>
                ) : (
                    <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-400">
                        <Command size={10} /> K
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!searchTerm ? (
            /* ÉTAT INITIAL : SUGGESTIONS */
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center"
            >
              <div className="inline-flex p-6 rounded-full bg-rose-50 text-rose-custom mb-6">
                <Sparkles size={40} />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Que cherchez-vous aujourd'hui ?</h2>
              <p className="text-gray-500 mb-10 max-w-md mx-auto">Explorez nos collections par mots-clés populaires</p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {['Bougies', 'Coffrets', 'Saint-Valentin', 'Nouveautés', 'Artisanat'].map((tag) => (
                  <button 
                    key={tag}
                    onClick={() => {setSearchTerm(tag); updateUrl(tag);}}
                    className="px-6 py-3 rounded-xl border border-gray-100 hover:border-rose-custom hover:text-rose-custom font-bold transition-all text-sm"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            /* AUCUN RÉSULTAT */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <div className="text-gray-200 mb-6 flex justify-center">
                <ShoppingBag size={80} strokeWidth={1} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun flocon trouvé</h3>
              <p className="text-gray-500 mb-8">Nous n'avons pas trouvé de résultats pour "{searchTerm}"</p>
              <Link
                href="/boutique"
                className="inline-flex items-center px-8 py-4 bg-rose-custom text-white font-black rounded-xl hover:scale-105 transition-transform"
              >
                <Filter size={18} className="mr-2" />
                Parcourir tout le catalogue
              </Link>
            </motion.div>
          ) : (
            /* RÉSULTATS PAR CATÉGORIES */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-20"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
                  {filteredProducts.length} Résultat{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                </h2>
              </div>

              {Object.entries(productsByCategory).map(([category, items]) => (
                <section key={category}>
                  <div className="flex items-center gap-4 mb-8">
                    <h3 className="text-2xl font-black text-gray-900 whitespace-nowrap">
                        {category === 'Hiver' ? "L'Art du Cocooning" : category}
                    </h3>
                    <div className="h-[1px] w-full bg-gray-100"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {items.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </div>
                </section>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const SearchPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex p-6 rounded-full bg-rose-50 text-rose-custom mb-4">
            <Search size={40} />
          </div>
          <p className="text-gray-500">Chargement de la recherche...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
};

export default SearchPage;
