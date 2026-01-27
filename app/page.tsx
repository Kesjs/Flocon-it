"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { products, getProductsByCategory } from "../data/products";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const hiverProducts = getProductsByCategory('Hiver');
  const valentinProducts = getProductsByCategory('Saint-Valentin');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
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
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-end md:items-end justify-between h-full pb-8 md:pb-16">
          
          {/* Texte et Bouton à GAUCHE */}
          <div className="text-left text-white max-w-2xl mb-auto md:mb-0">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-display font-bold mb-6"
            >
              L'Art d'aimer en douceur
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-16 font-light"
            >
              Plus qu'un cadeau, une promesse de tendresse pour célébrer vos instants précieux.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-8"
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

          {/* Chatbot Logo à DROITE (Plus bas et plus à droite) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="hidden md:flex flex-col items-center gap-3 group cursor-pointer absolute bottom-16 right-12"
          >
            <div className="relative w-20 h-20 rounded-full border-4 border-white/20 p-1 bg-white/10 backdrop-blur-sm transition-transform group-hover:scale-110">
               <img
                src="https://img.freepik.com/vecteurs-premium/pet-love-logo-coeur-symbole-chat-au-design-plat-couleur-rose_8586-1132.jpg?semt=ais_hybrid&w=740&q=80"
                alt="Chatbot Flocon"
                className="rounded-full object-cover w-full h-full"
              />
              <span className="absolute top-1 right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
            </div>
            <span className="text-white text-xs font-bold uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full backdrop-blur-md">
              Besoin d'aide ?
            </span>
          </motion.div>
        </div>
      </section>

      {/* Moments Cadeaux Section */}
      <section className="py-16 bg-gradient-to-br from-rose-custom-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-rose-custom from-rose-custom-600 to-pink-700 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg w-full max-w-md mx-auto lg:max-w-none"
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden group cursor-pointer w-full max-w-md mx-auto lg:max-w-none"
              style={{ height: '400px' }}
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

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden group cursor-pointer w-full max-w-md mx-auto lg:max-w-none"
              style={{ height: '400px' }}
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

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-textDark mb-4">
                Saisir l'instant, offrir l'inoubliable
              </h2>
            </div>

            <div className="relative">
              <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4" id="moments-carousel">
                {[
                  { emoji: "💝", title: "Saint-Valentin", description: "L'amour mérite d'être célébré", color: "from-rose-custom-100 to-pink-100" },
                  { emoji: "🎂", title: "Anniversaire", description: "Une année de plus à fêter", color: "from-purple-100 to-indigo-100" },
                  { emoji: "🎄", title: "Noël", description: "La magie du partage", color: "from-red-100 to-green-100" },
                  { emoji: "💐", title: "Fête des Mères", description: "Pour elle, avec amour", color: "from-pink-100 to-rose-custom-100" }
                ].map((moment, index) => (
                  <div key={index} className={`flex-shrink-0 w-64 p-6 rounded-2xl bg-gradient-to-br ${moment.color} hover:shadow-lg transition-all cursor-pointer`}>
                    <div className="text-4xl mb-4 text-center">{moment.emoji}</div>
                    <h3 className="font-semibold text-textDark mb-2 text-center">{moment.title}</h3>
                    <p className="text-gray-600 text-sm text-center">{moment.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div id="collection-hiver" className="mb-16">
            <h2 className="text-4xl font-display font-bold text-textDark mb-12 text-center">L'Art du Cocooning</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {hiverProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
          <div id="collection-valentin">
            <h2 className="text-4xl font-display font-bold text-textDark mb-12 text-center">Flocons de Tendresse</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {valentinProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

{/* Témoignages */}

<section className="py-16 bg-gray-50">

<div className="max-w-7xl mx-auto px-4">

<motion.div

initial={{ opacity: 0, y: 20 }}

whileInView={{ opacity: 1, y: 0 }}

viewport={{ once: true }}

className="text-center mb-12"

>

<h2 className="text-4xl font-display font-bold text-textDark mt-2 mb-4">

Ce que disent nos clients

</h2>

<p className="text-gray-600 max-w-2xl mx-auto">

Découvrez les avis de nos clients satisfaits

</p>

</motion.div>



<div className="grid grid-cols-1 md:grid-cols-3 gap-8">

{[

{

name: "Sophie Martin",

location: "Paris",

rating: 5,

text: "Le plaid 'Nuage' est incroyablement doux ! Je m'enveloppe à l'intérieur chaque soir. La qualité est exceptionnelle et le design est magnifique. Un vrai nid de douceur !",

image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",

},

{

name: "Thomas Dubois",

location: "Lyon",

rating: 5,

text: "J'ai offert le bijou 'Fiocco' à ma compagne pour la Saint-Valentin. Elle a beaucoup aimé ! L'emballage était magnifique et le bijou est d'une beauté rare. Service impeccable !",

image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",

},

{

name: "Marie Leclerc",

location: "Marseille",

rating: 5,

text: "La bougie 'Crepitio' crée une atmosphère magique ! Le parfum de bois de cèdre est subtil et relaxant. Parfait pour nos soirées cocooning. Je recommande vivement !",

image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",

},

].map((testimonial, index) => (

<motion.div

key={index}

initial={{ opacity: 0, y: 20 }}

whileInView={{ opacity: 1, y: 0 }}

viewport={{ once: true }}

transition={{ duration: 0.5, delay: index * 0.1 }}

className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"

>

<div className="flex items-center gap-1 mb-4">

{[...Array(5)].map((_, i) => (

<Star

key={i}

className="w-4 h-4 fill-yellow-400 text-yellow-400"

/>

))}

</div>

<p className="text-gray-700 mb-6 italic leading-relaxed">

"{testimonial.text}"

</p>

<div className="flex items-center gap-4">

<Image

src={testimonial.image}

alt={testimonial.name}

width={50}

height={50}

className="rounded-full object-cover"

/>

<div>

<p className="font-semibold text-textDark">{testimonial.name}</p>

<p className="text-sm text-gray-500">{testimonial.location}</p>

</div>

</div>

</motion.div>

))}

</div>

</div>

</section>

</div>

);

}