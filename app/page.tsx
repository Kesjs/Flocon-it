"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Cake, TreePine, Flower2, ChevronRight, ChevronLeft, ChevronRight as ArrowRight, Gift } from "lucide-react";
import { products, getProductsByCategory } from "../data/products";
import ProductCard from "@/components/ProductCard";
import ChatbotModal from "@/components/ChatbotModal";

export default function HomePage() {
  const hiverProducts = getProductsByCategory('Hiver');
  const valentinProducts = getProductsByCategory('Saint-Valentin');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [currentMomentIndex, setCurrentMomentIndex] = useState(0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen md:h-screen flex items-center overflow-hidden min-h-[600px] md:min-h-screen">
        <div className="absolute inset-0">
          {/* Desktop Image */}
          <div className="hidden md:block absolute inset-0">
            <Image
              src="/Podarok-na-8-marta.webp"
              alt="Hero background desktop - Cadeau Saint-Valentin pour Flocon"
              fill
              className="object-cover"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority={true}
              quality={90}
              sizes="100vw"
            />
          </div>
          
          {/* Mobile Image */}
          <div className="md:hidden absolute inset-0">
            <Image
              src="/Podarok-na-8-marta.webp"
              alt="Hero background mobile - Cadeau Saint-Valentin pour Flocon"
              fill
              className="object-cover"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority={true}
              quality={95}
              sizes="100vw"
            />
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 z-10 bg-black/40"></div>
        </div>
        
        {/* Grille de contenu Hero */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-center md:items-end md:justify-between h-full pb-8 md:pb-16 min-h-[500px] md:min-h-full">
          
          {/* Texte et Bouton - CENTRE sur mobile, GAUCHE sur desktop */}
          <div className="text-center text-white max-w-2xl mb-8 md:mb-0 md:text-left md:mt-auto">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-4 md:mb-6"
            >
              L'Art d'aimer en douceur
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-16 font-light"
            >
              Plus qu'un cadeau, une promesse de tendresse pour célébrer vos instants précieux.
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
                className="text-white px-8 py-3 rounded-full font-semibold transition-all uppercase tracking-[0.2em] text-sm"
                style={{ 
                  backgroundColor: 'var(--rose)',
                  boxShadow: '0 4px 15px rgba(219, 39, 119, 0.2)' 
                }}
              >
                Découvrir l'Exclusivité Valentin
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
                className="text-white px-10 py-4 rounded-full font-semibold transition-all uppercase tracking-[0.2em] text-sm"
                style={{ 
                  backgroundColor: 'var(--rose)',
                  boxShadow: '0 4px 15px rgba(219, 39, 119, 0.2)' 
                }}
              >
                Découvrir l'Exclusivité Valentin
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
        style={{ height: 'auto', minHeight: '400px' }}
      >
        <Image
          src="/afro-man-holding-big-heart.jpg"
          alt="Personne offrant un cadeau"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
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
        style={{ height: 'auto', minHeight: '400px' }}
      >
        <Image
          src="/ludique-femme-noire-souriante-tenant-rose-blanche-boite-cadeau-forme-coeur-isole-rouge_97712-3167.jpg"
          alt="Personne recevant un cadeau"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
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
            style={{ transform: `translateX(-${currentMomentIndex * 25}%)` }}
          >
            {/* 8 cartes au total dans une seule ligne */}
            {[
              { icon: Heart, title: "Saint-Valentin pour Lui", description: "L'amour mérite d'être célébré", color: "text-rose-500" },
              { icon: Heart, title: "Saint-Valentin pour Elle", description: "La romance en délicatesse", color: "text-pink-500" },
              { icon: Cake, title: "Anniversaire", description: "Une année de plus à fêter", color: "text-purple-500" },
              { icon: Flower2, title: "Nouveau Né", description: "Bienvenue dans la vie", color: "text-blue-500" },
              { icon: TreePine, title: "Noël", description: "La magie du partage", color: "text-green-600" },
              { icon: Flower2, title: "Fête des Mères", description: "Pour elle, avec amour", color: "text-pink-500" },
              { icon: Heart, title: "Remerciement", description: "Dire merci avec le cœur", color: "text-amber-500" },
              { icon: Gift, title: "Cadeau Surprise", description: "L'émotion de l'inattendu", color: "text-indigo-500" }
            ].map((moment, index) => (
              <div key={index} className="w-1/4 flex-shrink-0 p-6 rounded-3xl bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
                    <moment.icon className={`w-8 h-8 ${moment.color}`} />
                  </div>
                  <h3 className="font-semibold text-textDark mb-2 text-lg">{moment.title}</h3>
                  <p className="text-gray-600 text-sm">{moment.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Flèches animées */}
        <motion.button
          onClick={() => setCurrentMomentIndex(prev => Math.max(0, prev - 1))}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 ${currentMomentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
          disabled={currentMomentIndex === 0}
          whileHover={{ scale: currentMomentIndex === 0 ? 1 : 1.1 }}
          whileTap={{ scale: currentMomentIndex === 0 ? 1 : 0.95 }}
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </motion.button>
        <motion.button
          onClick={() => setCurrentMomentIndex(prev => Math.min(4, prev + 1))}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 ${currentMomentIndex === 4 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
          disabled={currentMomentIndex === 4}
          whileHover={{ scale: currentMomentIndex === 4 ? 1 : 1.1 }}
          whileTap={{ scale: currentMomentIndex === 4 ? 1 : 0.95 }}
        >
          <ArrowRight className="w-6 h-6 text-gray-800" />
        </motion.button>
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

      {/* Collections Section */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div id="collection-hiver" className="mb-16">
            <h2 className="text-4xl font-display font-bold text-textDark mb-12 text-center">L'Art du Cocooning</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {hiverProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
          <div id="collection-valentin">
            <h2 className="text-4xl font-display font-bold text-textDark mb-12 text-center">Flocons de Tendresse</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {valentinProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

{/* Témoignages */}
<section className="py-16 bg-[#F9F7F2]">
  <div className="max-w-7xl mx-auto px-4">
    
    {/* Header Émotionnel - Layout Split */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="grid lg:grid-cols-2 gap-8 items-center rounded-lg overflow-hidden">
        {/* Gauche - Image Lifestyle */}
        <div className="relative h-96 lg:h-auto">
          <Image
            src="https://img.freepik.com/photos-gratuite/femme-tenant-cadeau-emballage-rose_23-2149396999.jpg"
            alt="Deux personnes partageant un moment de joie"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Droite - Contenu sur fond Rose */}
        <div className="bg-gradient-to-br from-rose-custom-100 to-pink-200 p-8 lg:p-12">
          <h2 className="text-3xl lg:text-4xl font-display font-black text-textDark mb-6">
            Faites que les gens se sentent spéciaux
          </h2>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            Chaque cadeau raconte une histoire unique. Découvrez comment nos créations transforment les moments ordinaires en souvenirs extraordinaires.
          </p>
          <Link href="#" className="inline-flex items-center text-rose-custom hover:text-rose-custom/80 font-medium transition-colors">
            En savoir plus →
          </Link>
        </div>
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

      {/* Section Promotionnelle */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-display font-bold text-textDark mb-4">
              Toujours exceptionnels, toujours personnels
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Promo
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
            {/* Utilisation des vrais produits en promotion */}
            {products
              .filter(product => product.oldPrice && product.oldPrice > product.price)
              .slice(0, 4)
              .map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
          </div>

          {/* Bouton Explorer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center"
          >
            <Link href="/boutique/promotions" className="bg-rose-custom text-white px-8 py-3 font-medium hover:bg-opacity-90 transition-colors duration-200">
            Trouvez votre préféré
          </Link>
          </motion.div>
        </div>
      </section>

      {/* Section FAQ */}
      <section className="py-16 bg-[#F5F2ED]">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-display font-bold text-textDark mb-4">
              Les meilleurs cadeaux personnalisés
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Make people feel special !
            </p>
          </motion.div>

          <div className="space-y-6">
            {/* Question 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-textDark mb-4">
                Vous cherchez un cadeau personnalisé ?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Un cadeau unique avec une belle photo ou un joli texte fera toujours plaisir. C'est un beau cadeau pour surprendre quelqu'un le jour de son anniversaire, pour un cadeau de naissance ou pour souhaiter à quelqu'un un bon rétablissement. Pe-être voulez-vous remercier quelqu'un qui vous a rendu service ou juste faire comprendre à un proche à quel point il est important pour vous en lui offrant un joli cadeau.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Nous devrions tous réfléchir plus souvent à ce que quelqu'un représente pour nous et à quel point nous l'apprécions, mais surtout le lui faire savoir ! En offrant un cadeau, vous pouvez diffuser un peu de bonheur autour de vous.
              </p>
            </motion.div>

            {/* Question 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-textDark mb-4">
                L'Art de Donner chez Flocon
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Chez Flocon, nous appelons cela "The Art of Giving" ou l'Art de Donner. Sur Flocon, vous trouverez des centaines de cadeaux que vous pouvez personnaliser vous-même. Vous pouvez télécharger votre propre photo, ajouter un ou plusieurs prénoms ou encore votre texte sur le cadeau.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Et avec autant de cadeaux, il doit y avoir un cadeau spécialement pour vous ! Vous cherchez des cadeaux qui peuvent passer par la boîte aux lettres ? Nous avons de superbes cadeaux qui peuvent être livrés directement dans la boîte aux lettres.
              </p>
            </motion.div>

            {/* Question 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-textDark mb-4">
                Comment transformer un cadeau en un cadeau personnel ?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Notre objectif chez Flocon est que chaque cadeau soit une source de joie pour votre proche. Nous voyons le cadeau comme un symbole de gratitude, créant un lien privilégié entre celui qui offre et celui qui reçoit.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Pour nous, un présent doit aller au-delà de la simple célébration : il doit être conçu et créé spécialement pour son destinataire. La personnalisation n'est pas seulement notre métier, c'est notre passion.
              </p>
            </motion.div>

            {/* Question 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-textDark mb-4">
                Pourquoi choisir l'unique ?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Parce qu'un cadeau personnalisé ne ressemble à aucun autre. C'est parce que vous créez vous-même le cadeau, vous le rendez spécial avec vos photos et votre texte. Des souvenirs de vacances, des photos de votre famille ou un message spécial qui vous tient à cœur.
              </p>
            </motion.div>

            {/* Question 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-textDark mb-4">
                Comment faire un objet personnalisé ?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Personnaliser est très simple ! Différents types de cadeaux ont différentes méthodes de personnalisation, des cadeaux avec gravure, à l'impression avec photo ou logo, à la broderie ; nous utilisons les méthodes qui conviennent le mieux au cadeau pour une qualité toujours au top.
              </p>
            </motion.div>
          </div>

          {/* Bouton d'appel à l'action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link href="/boutique/personnalise" className="bg-rose-custom text-white px-8 py-3 font-medium hover:bg-opacity-90 transition-colors duration-200">
              Découvrir nos cadeaux personnalisés
            </Link>
          </motion.div>
        </div>
      </section>

      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
}