"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Search, Heart, Gift, Star, TrendingUp, Calendar, 
  Filter, Sparkles, Clock, ArrowRight, Layers, Award, ChevronDown 
} from "lucide-react";
import ChatbotModal from "@/components/ChatbotModal";
import { useProductDisplay } from "@/hooks/useProductDisplay";
import ProductCard from "@/components/ProductCard";

export default function OccasionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  const { sections } = useProductDisplay('occasions');
  
  const stats = useMemo(() => ({
    total: sections.reduce((acc: number, s: any) => acc + s.products.length, 0),
    avg: (sections.reduce((acc: number, s: any) => acc + (s.products.reduce((sum: number, p: any) => sum + p.rating, 0) / s.products.length), 0) / sections.length || 0).toFixed(1)
  }), [sections]);

  // Mapping des icônes pour les ancres et sections
  const occasionMeta = [
    { name: "Saint-Valentin", id: "saint-valentin", icon: Heart },
    { name: "Anniversaire", id: "anniversaire", icon: Gift },
    { name: "Noël", id: "noel", icon: Sparkles },
    { name: "Fête des Mères", id: "fete-meres", icon: Heart },
    { name: "Nouveau-né", id: "nouveau-ne", icon: Clock },
    { name: "Remerciement", id: "remerciement", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION - RETOUR DE TON IMAGE ET TON ROSE */}
      <section className="relative bg-gradient-to-br from-rose-50 via-white to-amber-50 pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-rose-custom/10 text-rose-custom px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
                <Calendar size={14} />
                Collection Moments 2026
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-6 leading-[1.1]">
                Le Cadeau <span className="text-rose-custom italic">Parfait</span> <br />
                pour chaque instant.
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                Explorez {stats.total} créations uniques conçues pour transformer vos émotions en souvenirs inoubliables.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/boutique" className="bg-rose-custom text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-rose-200 transition-all flex items-center gap-2">
                  Explorer les collections <ArrowRight size={18} />
                </Link>
                <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div>
                    <p className="text-xl font-black text-rose-custom">{stats.avg} ⭐</p>
                    <p className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold">Note clients</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="relative rounded-[2rem] shadow-2xl overflow-hidden transform rotate-2">
                <img
                  src="/handmade-heart-stack-gifts.webp"
                  alt="Cadeaux premium"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute top-6 right-6">
                  <div className="bg-rose-custom text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2">
                    <Sparkles size={18} /> {sections.length} Occasions
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NAVIGATION STICKY - EMPILAGE PAR CATÉGORIE */}
      <nav id="explore" className="sticky top-20 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
              {occasionMeta.map((cat) => (
                <a 
                  key={cat.id} 
                  href={`#${cat.id}`}
                  className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-rose-custom transition-colors whitespace-nowrap"
                >
                  <cat.icon size={16} />
                  {cat.name}
                </a>
              ))}
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Chercher un cadeau..."
                className="w-full bg-slate-100 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-rose-custom/20 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* SECTIONS PRODUITS - DESIGN ÉPURÉ ET RESPONSIVE */}
      <main className="max-w-7xl mx-auto px-6 py-20 space-y-32">
        {sections.map((section: any, idx: number) => {
          const meta = occasionMeta[idx] || { id: `section-${idx}`, icon: Gift };
          const filtered = section.products.filter((p: any) => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (filtered.length === 0 && searchTerm) return null;

          return (
            <section key={idx} id={meta.id} className="scroll-mt-40">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-l-4 border-rose-custom pl-6">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                    {section.title.replace(/❤️|🎂|🎄|💐|👶|🙏/g, '')}
                  </h2>
                  <p className="text-slate-500 text-lg">{section.subtitle}</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-2 text-rose-custom font-bold">
                  <span>{filtered.length} produits</span>
                  <ChevronDown size={20} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filtered.map((product: any, pIdx: number) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: pIdx * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* TENDANCES 2026 */}
      <section className="bg-slate-50 py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4 flex items-center justify-center gap-3">
              <TrendingUp className="text-rose-custom" /> Tendances de l'année
            </h2>
            <div className="h-1 w-20 bg-rose-custom mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Personnalisable', icon: Layers },
              { label: 'Éco-responsable', icon: Sparkles },
              { label: 'Artisanal', icon: Award },
              { label: 'Livraison Express', icon: Clock }
            ].map((trend, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:border-rose-custom transition-colors group">
                <div className="w-12 h-12 bg-rose-50 text-rose-custom rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <trend.icon size={24} />
                </div>
                <span className="font-bold text-slate-800">{trend.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 text-center border-t border-slate-100">
        <Link href="/" className="text-slate-400 hover:text-rose-custom font-bold transition-colors inline-flex items-center gap-2">
           ← Retour à l'accueil
        </Link>
      </footer>

      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
}