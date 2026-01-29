"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, Heart, Cake, TreePine, Flower2, ChevronRight, ChevronLeft, ChevronRight as ArrowRight, Gift, Truck } from "lucide-react";
import { useProductDisplay } from "@/hooks/useProductDisplay";
import { ProductSection } from "@/components/ProductSection";
import ChatbotModal from "@/components/ChatbotModal";
import { useScrollOptimization } from "@/hooks/useScrollOptimization";
import FAQSection from "@/components/FAQSection";
import PromoSection from "@/components/PromoSection";

export default function HomePage() {
  const { sections } = useProductDisplay('accueil');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [currentMomentIndex, setCurrentMomentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldReduceMotion] = useState(false);
  const { scrollY } = useScrollOptimization();

  // Détecter si on est côté client et mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Gérer le scroll vers les ancres
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        requestAnimationFrame(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
    }
  }, []);

  return (
    <div className="min-h-screen scroll-smooth">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-screen flex items-center overflow-hidden min-h-[500px] md:min-h-screen will-change-transform" style={{ transform: 'translateZ(0)' }}>
        <div className="absolute inset-0">
          {/* Desktop Image */}
          <div className="hidden md:block absolute inset-0">
            <img
              src="/My-project-1-57.webp"
              alt="Hero background desktop - Cadeau Saint-Valentin pour Flocon"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          
          {/* Mobile Image */}
          <div className="md:hidden absolute inset-0">
            <img
              src="/My-project-1-57.webp"
              alt="Hero background mobile - Cadeau Saint-Valentin pour Flocon"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/40 via-black/50 to-black/30"></div>
        </div>
        
        {/* Grille de contenu Hero */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-center md:items-end md:justify-between h-full pb-8 md:pb-16 min-h-[500px] md:min-h-full pt-20 md:pt-0">
          
          {/* Texte et Bouton - CENTRE sur mobile, GAUCHE sur desktop */}
          <div className="text-center text-white max-w-2xl mb-8 md:mb-0 md:text-left md:mt-auto px-4 md:px-0">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-3xl md:text-5xl lg:text-7xl font-display font-bold mb-4 md:mb-6 leading-tight will-change-transform"
              style={{ transform: 'translateZ(0)' }}
            >
              L'amour se mérite. <br />Votre cadeau aussi.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-base md:text-xl lg:text-2xl mb-6 md:mb-16 font-light leading-relaxed will-change-transform"
              style={{ transform: 'translateZ(0)' }}
            >
              Ne lui offrez pas juste un objet,<br className="md:hidden" />offrez-lui le souvenir d'une attention inoubliable.
            </motion.p>

            {/* Bouton uniquement sur mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="md:hidden flex justify-center"
            >
              <motion.a
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(219, 39, 119, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                href="#onboarding-valentin"
                className="text-white px-8 py-3 rounded-sm font-semibold transition-all uppercase tracking-[0.2em] text-sm"
                style={{ 
                  backgroundColor: 'var(--rose)',
                  boxShadow: '0 4px 15px rgba(219, 39, 119, 0.2)' 
                }}
              >
                Découvrir
              </motion.a>
            </motion.div>

            {/* Bouton uniquement sur desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden md:flex items-center gap-8"
            >
              <motion.a
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(219, 39, 119, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                href="#onboarding-valentin"
                className="text-white px-10 py-4 rounded-sm font-semibold transition-all uppercase tracking-[0.2em] text-sm"
                style={{ 
                  backgroundColor: 'var(--rose)',
                  boxShadow: '0 4px 15px rgba(219, 39, 119, 0.2)' 
                }}
              >
                Découvrir
              </motion.a>
            </motion.div>
          </div>

          {/* Chatbot Logo - UNIQUEMENT sur desktop */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            onClick={() => setIsChatbotOpen(true)}
            className="hidden md:flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative w-20 h-20 rounded-full border-4 border-white/20 p-1 bg-white/10 backdrop-blur-sm transition-transform group-hover:scale-110">
               <img
                src="https://img.freepik.com/vecteurs-premium/pet-love-logo-coeur-symbole-chat-au-design-plat-couleur-rose_8586-1132.jpg?semt=ais_hybrid&w=740&q=80"
                alt="Chatbot Flocon"
                className="rounded-full object-cover w-full h-full"
              />
            </div>
          </motion.div>

          {/* Bouton flottant chatbot MOBILE - repositionné */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsChatbotOpen(true)}
            className="md:hidden fixed bottom-8 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-30 overflow-hidden"
            style={{ backgroundColor: 'var(--rose)' }}
          >
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <img
                src="https://img.freepik.com/vecteurs-premium/pet-love-logo-coeur-symbole-chat-au-design-plat-couleur-rose_8586-1132.jpg?semt=ais_hybrid&w=740&q=80"
                alt="Chatbot Flocon"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.button>
        </div>
      </section>

     {/* Moments Cadeaux Section */}
<section className="py-16 bg-gradient-to-br from-rose-custom-50 to-pink-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 mb-16">
      {/* Premier cadre - Visible seulement sur desktop et tablette */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="hidden lg:flex bg-rose-custom from-rose-custom-600 to-pink-700 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg w-full"
        style={{ height: 'auto', minHeight: '400px' }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
        <div className="relative z-10 text-left h-full flex flex-col justify-center">
          <motion.h3
            className="text-2xl md:text-3xl font-black mb-4 md:mb-6 drop-shadow-lg"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Parce que chaque moment mérite d'être célébré
          </motion.h3>
          <p className="text-base md:text-lg font-light leading-relaxed mb-3">
            Un cadeau n'est jamais qu'un simple objet.
          </p>
          <p className="text-sm md:text-base font-medium leading-relaxed">
            C'est un sourire, une émotion, un souvenir qui restera gravé dans les cœurs.
          </p>
        </div>
      </motion.div>

      {/* Deuxième cadre - Visible partout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-2xl overflow-hidden group cursor-pointer w-full"
        style={{ height: '400px' }}
      >
        <div className="relative w-full h-full">
          <img
            src="/afro-man-holding-big-heart.webp"
            alt="Personne offrant un cadeau"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="absolute bottom-6 left-6 right-6 text-white text-center">
          <h4 className="text-lg md:text-xl font-semibold mb-2">La joie de donner</h4>
        </div>
      </motion.div>

      {/* Troisième cadre - Visible partout */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative rounded-2xl overflow-hidden group cursor-pointer w-full"
        style={{ height: '400px' }}
      >
        <div className="relative w-full h-full">
          <img
            src="/ludique-femme-noire-souriante-tenant-rose-blanche-boite-cadeau-forme-coeur-isole-rouge_97712-3167.webp"
            alt="Personne recevant un cadeau"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="absolute bottom-6 left-6 right-6 text-white text-center">
          <h4 className="text-lg md:text-xl font-semibold mb-2">Le bonheur de recevoir</h4>
        </div>
      </motion.div>
    </div>

    <div className="bg-white rounded-3xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-textDark mb-4">
          Saisir l'instant, offrir l'inoubliable
        </h2>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-all duration-500 ease-out gap-4"
            style={{ transform: `translateX(-${currentMomentIndex * (isMobile ? 100 : 25)}%)` }}
          >
            {/* 8 cartes au total dans une seule ligne */}
            {[
              { icon: Heart, title: "Saint-Valentin pour Lui", color: "text-rose-500" },
              { icon: Heart, title: "Saint-Valentin pour Elle", color: "text-pink-500" },
              { icon: Cake, title: "Anniversaire", color: "text-purple-500" },
              { icon: Flower2, title: "Nouveau Né", color: "text-blue-500" },
              { icon: TreePine, title: "Noël", color: "text-green-600" },
              { icon: Flower2, title: "Fête des Mères", color: "text-pink-500" },
              { icon: Heart, title: "Remerciement", color: "text-amber-500" },
              { icon: Gift, title: "Cadeau Surprise", color: "text-indigo-500" }
            ].map((moment, index) => (
              <div key={index} className="w-full md:w-1/4 flex-shrink-0 p-6 rounded-3xl bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
                    <moment.icon className={`w-8 h-8 ${moment.color}`} />
                  </div>
                  <h3 className="font-semibold text-textDark mb-2 text-lg">{moment.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Flèches simplifiées */}
        <button
          onClick={() => setCurrentMomentIndex(prev => Math.max(0, prev - 1))}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-3 rounded-full bg-white shadow-lg transition-all duration-300 ${currentMomentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
          disabled={currentMomentIndex === 0}
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <button
          onClick={() => setCurrentMomentIndex(prev => Math.min(isMobile ? 7 : 4, prev + 1))}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-3 rounded-full bg-white shadow-lg transition-all duration-300 ${currentMomentIndex === (isMobile ? 7 : 4) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
          disabled={currentMomentIndex === (isMobile ? 7 : 4)}
        >
          <ArrowRight className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* Bouton Explorer centré en dehors des cartes */}
      <div className="flex justify-center mt-8">
        <Link href="/occasions" className="bg-rose-custom text-white px-8 py-3 font-medium transition-colors duration-200 hover:bg-opacity-90">
          Explorer tous les moments
        </Link>
      </div>
    </div>
  </div>
</section>

      {/* Collections Section - Nouveau système de configuration */}
      {sections.map((section: any, index: number) => (
        <ProductSection
          key={section.title}
          title={section.title}
          subtitle={section.subtitle}
          products={section.products}
          layout={section.layout}
          columns={section.columns}
          className={index > 0 ? 'border-t' : ''}
        />
      ))}

      {/* Section Onboarding - Feuille bicolore */}
<section className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
    
    {/* La Feuille Unique - Invisiblement séparée par la couleur */}
    <div className="w-full flex flex-col md:flex-row items-stretch rounded-sm overflow-hidden shadow-sm border border-gray-100">
      
      {/* Partie Gauche - Image (Fond neutre/blanc) */}
      <div className="w-full md:w-1/2 bg-white">
        <img
          src="/modern-young-woman-with-wavy-hair-dark-trendy-outfit-winking-showing-peace-sign-smiling-holding-red-gift-box-pink-wall.jpg"
          alt="L'expérience Flocon"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Partie Droite - Texte avec Fond Rose */}
      <div className="w-full md:w-1/2  p-12 md:p-20 flex flex-col justify-center">
        <h2 className="text-3xl md:text-4xl font-bold text-rose-900 mb-8 leading-tight">
          Transformez vos Souvenirs en Cadeaux Uniques
        </h2>
        
        <p className="text-rose-950 text-lg md:text-xl leading-relaxed mb-6">
          Ajoutez vos photos, vos messages et créez des présents qui marquent les esprits. 
          Chaque détail compte pour rendre votre cadeau inoubliable.
        </p>
        
        <p className="text-rose-900/80 text-base md:text-lg leading-relaxed">
          L'art de la personnalisation Flocon : simple, élégant et profondément personnel.
        </p>
      </div>
    </div>

    {/* Bouton - Externe et visible */}
    <div className="mt-12">
      <a
        href="/boutique/personnalise"
        className="inline-flex items-center px-8 py-3 bg-rose-custom text-white text-lg font-bold rounded-sm hover:bg-rose-700 transition-all duration-300 shadow-xl"
      >
        Commencer à Personnaliser
        <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>

  </div>
</section>

{/* Témoignages */}
<section className="py-16 bg-[#F9F7F2]">
  <div className="max-w-7xl mx-auto px-4">
    
    {/* Section Preuve Sociale Simplifiée */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-display font-black text-textDark mb-4">
          Faites que les gens se sentent spéciaux
        </h2>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          Découvrez comment nos créations transforment les moments ordinaires en souvenirs extraordinaires.
        </p>
      </div>
    </motion.div>

    {/* Section Preuve Sociale - Bento Grid */}
    <div className="grid lg:grid-cols-3 gap-8">
      
      {/* Colonne de gauche - Réputation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-1"
      >
        <div className="bg-white rounded-lg p-8 h-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-rose-custom text-rose-custom"
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-textDark">4,5</span>
            <span className="text-gray-500">sur 5</span>
          </div>
          
          <h3 className="text-2xl font-display font-bold text-textDark mb-4">
            Plus de 10 millions de moments spéciaux
          </h3>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Rejoignez les milliers de clients qui ont fait confiance à Flocon pour célébrer leurs plus beaux moments.
          </p>
          
          <Link href="#" className="text-rose-custom hover:text-rose-custom/80 font-medium transition-colors inline-flex items-center gap-1">
            Lire plus de commentaires
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* Grille de témoignages - Droite */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-2"
      >
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              name: "Sophie",
              rating: 5,
              text: "Le plaid 'Nuage' est incroyablement doux ! Je m'enveloppe à l'intérieur chaque soir.",
            },
            {
              name: "Thomas",
              rating: 5,
              text: "J'ai offert le bijou 'Fiocco' à ma compagne. Elle a beaucoup aimé ! Service impeccable !",
            },
            {
              name: "Marie",
              rating: 5,
              text: "La bougie 'Crepitio' crée une atmosphère magique ! Parfait pour nos soirées cocooning.",
            },
            {
              name: "Lucas",
              rating: 5,
              text: "Excellente qualité et livraison rapide. Les cadeaux Flocon sont toujours parfaits !",
            },
            {
              name: "Emma",
              rating: 5,
              text: "J'adore le design élégant et la attention aux détails. C'est devenu ma boutique référence !",
            },
            {
              name: "Nicolas",
              rating: 5,
              text: "Service client exceptionnel et produits magnifiques. Je recommande vivement !",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-rose-custom text-rose-custom"
                  />
                ))}
              </div>
              <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                "{testimonial.text}"
              </p>
              <p className="font-medium text-textDark">{testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
</section>

      {/* Promo Section */}
      <PromoSection />

      {/* FAQ Section */}
      <FAQSection />

      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
}