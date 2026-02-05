"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Gift, Truck, Shield, CreditCard, Clock, HelpCircle } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon?: React.ComponentType<any>;
  category?: string;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "Quels sont les délais de livraison ?",
    answer: "Nous livrons en 3-5 jours ouvrables pour la France métropolitaine. Les commandes passées avant 14h sont expédiées le jour même.",
    icon: Truck,
    category: "livraison"
  },
  {
    id: "2", 
    question: "Puis-je personnaliser mon cadeau ?",
    answer: "Oui ! Nous proposons des options de personnalisation gravure, emballage cadeau et messages personnalisés. Contactez-nous pour les demandes spéciales.",
    icon: Gift,
    category: "personnalisation"
  },
  {
    id: "3",
    question: "Quelle est votre politique de retour ?",
    answer: "Vous avez 30 jours pour retourner un article non utilisé. Les cadeaux personnalisés ne peuvent être retournés que s'il y a un défaut de fabrication.",
    icon: Shield,
    category: "retours"
  },
  {
    id: "4",
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: "Nous acceptons les virements sécurisés Flocon Secure Transfer. Tous les paiements sont instantanés et sans frais.",
    icon: CreditCard,
    category: "paiement"
  },
  {
    id: "5",
    question: "Proposez-vous des cartes cadeaux ?",
    answer: "Oui ! Nos cartes cadeaux sont disponibles de 20€ à 500€. Elles sont valables 1 an sur tout le site et peuvent être utilisées en plusieurs fois.",
    icon: Gift,
    category: "cadeaux"
  },
  {
    id: "6",
    question: "Comment suivre ma commande ?",
    answer: "Vous recevrez un email de confirmation avec un numéro de suivi dès l'expédition. Vous pouvez suivre votre commande en temps réel sur notre site.",
    icon: Clock,
    category: "suivi"
  }
];

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("tous");

  const categories = [
    { id: "tous", name: "Toutes les questions", count: faqData.length },
    { id: "livraison", name: "Livraison", count: faqData.filter(item => item.category === "livraison").length },
    { id: "personnalisation", name: "Personnalisation", count: faqData.filter(item => item.category === "personnalisation").length },
    { id: "retours", name: "Retours", count: faqData.filter(item => item.category === "retours").length },
    { id: "paiement", name: "Paiement", count: faqData.filter(item => item.category === "paiement").length },
    { id: "cadeaux", name: "Cartes Cadeaux", count: faqData.filter(item => item.category === "cadeaux").length },
    { id: "suivi", name: "Suivi", count: faqData.filter(item => item.category === "suivi").length }
  ];

  const filteredFAQ = selectedCategory === "tous" 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-custom/10 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-rose-custom" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-textDark mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur nos produits et services
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-rose-custom text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQ.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {item.icon && (
                    <div className="flex-shrink-0 w-10 h-10 bg-rose-custom/10 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-rose-custom" />
                    </div>
                  )}
                  <span className="font-medium text-textDark">{item.question}</span>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {openItems.includes(item.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {openItems.includes(item.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center p-6 bg-gradient-to-r from-rose-custom/10 to-pink-50 rounded-2xl">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-textDark mb-2">
                Vous ne trouvez pas votre réponse ?
              </h3>
              <p className="text-gray-600 mb-4">
                Notre service client est là pour vous aider
              </p>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-rose-custom text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Contacter le Support
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
