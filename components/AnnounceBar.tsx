"use client";

import { motion } from "framer-motion";
import { Truck, Gift } from "lucide-react";

export default function AnnounceBar() {
  const messages = [
    { icon: Truck, text: "Livraison gratuite à partir de 50€ d'achat" },
    { icon: Gift, text: "Emballage cadeau Saint-Valentin gratuit !" },
  ];

  const fullMessage = messages
    .map((msg) => {
      const Icon = msg.icon;
      return `${msg.text}`;
    })
    .join(" | ");

  return (
    <div className="fixed top-0 left-0 right-0 z-50 text-white py-2 overflow-hidden relative" style={{ backgroundColor: 'var(--rose)' }}>
      <div className="flex items-center gap-2 whitespace-nowrap">
        <motion.div
          className="flex items-center gap-8"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              {messages.map((msg, idx) => {
                const Icon = msg.icon;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">{msg.text}</span>
                    {idx < messages.length - 1 && (
                      <span className="mx-2">|</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
