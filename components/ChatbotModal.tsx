"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Bot, Heart, Gift, ShoppingBag } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function ChatbotModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Bonjour ! Je suis Flocon 🐱 Votre assistant personnel pour trouver le cadeau parfait. Comment puis-je vous aider aujourd'hui ?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickReplies = [
    { text: "Idées cadeaux Saint-Valentin 💕", icon: Heart },
    { text: "Cadeaux personnalisés 🎁", icon: Gift },
    { text: "Voir la boutique 🛍️", icon: ShoppingBag }
  ];

  const botResponses = {
    "saint-valentin": "Pour la Saint-Valentin, je vous recommande :\n\n💕 Bijoux personnalisés avec gravure\n🌹 Bouquets de roses rouges\n🍫 Boîtes de chocolats artisanaux\n🕯 Bougies parfumées romantiques\n\nSouhaitez-vous que je vous montre nos meilleures ventes ?",
    "personnalisés": "Nos cadeaux personnalisés incluent :\n\n📝 Messages gravés sur bijoux\n🖼️ Photos sur cadres décoratifs\n🎨 Créations artistiques uniques\n📦 Coffrets sur mesure\n\nQuel type de personnalisation vous intéresse ?",
    "boutique": "Notre boutique est organisée par catégories :\n\n❄️ Collection Hiver - Pour se réchauffer\n💕 Collection Saint-Valentin - Pour l'amour\n🎁 Editions Limitées - Exclusivités\n\nVoulez-vous visiter une collection spécifique ?",
    "default": "Je comprends ! Permettez-moi de vous aider plus précisément. Vous cherchez :\n\n🎯 Pour quelle occasion ?\n💰 Quelle fourchette de prix ?\n👤 Pour qui (homme, femme, couple) ?\n\nDites-m'en plus et je trouverai le cadeau parfait !"
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simuler une réponse du bot
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let response = botResponses.default;

      if (lowerText.includes("saint") || lowerText.includes("valentin") || lowerText.includes("amour")) {
        response = botResponses["saint-valentin"];
      } else if (lowerText.includes("personnalis") || lowerText.includes("unique")) {
        response = botResponses["personnalisés"];
      } else if (lowerText.includes("boutiqu") || lowerText.includes("voir") || lowerText.includes("achet")) {
        response = botResponses["boutique"];
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  return (
    <>
      {/* Modal du chatbot */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-0 right-4 w-[90%] md:w-96 h-[600px] bg-white rounded-t-2xl md:rounded-2xl shadow-2xl z-50 flex flex-col mx-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b" style={{ backgroundColor: 'var(--rose)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Flocon</h3>
                    <p className="text-xs text-white/80">Votre assistant cadeau</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-rose-custom text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Indicateur d'écriture */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 p-3 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Quick Replies */}
              {messages.length === 1 && (
                <div className="px-4 py-2 border-t">
                  <p className="text-xs text-gray-500 mb-2">Suggestions rapides :</p>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply, index) => {
                      const Icon = reply.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => handleQuickReply(reply.text)}
                          className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
                        >
                          <Icon className="w-3 h-3" />
                          <span>{reply.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Tapez votre message..."
                    className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-rose-custom"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-full transition-colors"
                    style={{ backgroundColor: 'var(--rose)' }}
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
