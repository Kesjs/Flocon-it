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
    question: "Quali sono i tempi di consegna?",
    answer: "Consegnamo in 3-5 giorni lavorativi per l'Italia. Gli ordini effettuati prima delle 14h vengono spediti lo stesso giorno.",
    icon: Truck,
    category: "livraison"
  },
  {
    id: "2", 
    question: "Posso personalizzare il mio regalo?",
    answer: "Sì! Offriamo opzioni di personalizzazione incisione, confezione regalo e messaggi personalizzati. Contattaci per richieste speciali.",
    icon: Gift,
    category: "personnalisation"
  },
  {
    id: "3",
    question: "Qual è la vostra politica di reso?",
    answer: "Hai 30 giorni per restituire un articolo non utilizzato. I regali personalizzati possono essere restituiti solo in caso di difetto di fabbricazione.",
    icon: Shield,
    category: "retours"
  },
  {
    id: "4",
    question: "Quali metodi di pagamento accettate?",
    answer: "Accettiamo carte di credito, PayPal, Apple Pay e Google Pay. Tutti i pagamenti sono sicuri tramite Stripe.",
    icon: CreditCard,
    category: "paiement"
  },
  {
    id: "5",
    question: "Offrite buoni regalo?",
    answer: "Sì! I nostri buoni regalo sono disponibili da 20€ a 500€. Sono validi 1 anno su tutto il sito e possono essere utilizzati più volte.",
    icon: Gift,
    category: "cadeaux"
  },
  {
    id: "6",
    question: "Come seguire il mio ordine?",
    answer: "Riceverai un'email di conferma con un numero di tracking non appena spedito. Puoi seguire il tuo ordine in tempo reale sul nostro sito.",
    icon: Clock,
    category: "suivi"
  }
];

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("tous");

  const categories = [
    { id: "tous", name: "Tutte le domande", count: faqData.length },
    { id: "livraison", name: "Consegna", count: faqData.filter(item => item.category === "livraison").length },
    { id: "personnalisation", name: "Personalizzazione", count: faqData.filter(item => item.category === "personnalisation").length },
    { id: "retours", name: "Resi", count: faqData.filter(item => item.category === "retours").length },
    { id: "paiement", name: "Pagamento", count: faqData.filter(item => item.category === "paiement").length },
    { id: "cadeaux", name: "Buoni Regalo", count: faqData.filter(item => item.category === "cadeaux").length },
    { id: "suivi", name: "Tracciamento", count: faqData.filter(item => item.category === "suivi").length }
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
