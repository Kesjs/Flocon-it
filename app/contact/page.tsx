"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler l'envoi du formulaire
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="pt-28 min-h-screen bg-gray-50 px-4">
      <div className="max-w-6xl mx-auto py-12">
        <div className="max-w-6xl mx-auto py-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-textDark mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions 
            sur nos cadeaux et accessoires. Service client 100% français basé en ligne.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Carte Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-32">
              <h2 className="text-2xl font-display font-semibold text-textDark mb-6">
                Contact direct
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-custom/10 rounded-lg">
                    <Mail className="w-6 h-6 text-rose-custom" />
                  </div>
                  <div>
                    <p className="font-medium text-textDark">Email principal</p>
                    <p className="text-gray-600">contact@flocon-market.fr</p>
                    <p className="text-sm text-gray-500">Réponse sous 24h ouvrées</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-custom/10 rounded-lg">
                    <Phone className="w-6 h-6 text-rose-custom" />
                  </div>
                  <div>
                    <p className="font-medium text-textDark">Service client</p>
                    <p className="text-gray-600">Disponible par email prioritairement</p>
                    <p className="text-sm text-gray-500">Lun-Ven: 9h-18h (réponse email)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-custom/10 rounded-lg">
                    <MapPin className="w-6 h-6 text-rose-custom" />
                  </div>
                  <div>
                    <p className="font-medium text-textDark">Boutique en ligne</p>
                    <p className="text-gray-600">
                      www.flocon.fr<br />
                      Livraison en France et à l'international
                    </p>
                    <p className="text-sm text-gray-500">Ouvert 24/7 en ligne</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-custom/10 rounded-lg">
                    <Clock className="w-6 h-6 text-rose-custom" />
                  </div>
                  <div>
                    <p className="font-medium text-textDark">Disponibilité</p>
                    <p className="text-gray-600">
                      Service client: Lun-Ven: 9h-18h<br />
                      Commandes en ligne: 24/7
                    </p>
                    <p className="text-sm text-gray-500">Réponse garantie sous 24h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-display font-semibold text-textDark mb-6">
                Envoyer un message
              </h2>
              
              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <Send className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Message envoyé !
                  </h3>
                  <p className="text-green-700">
                    Nous vous répondrons dès que possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-textDark mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none transition-colors"
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-textDark mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none transition-colors"
                        placeholder="jean.dupont@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-textDark mb-2">
                      Sujet *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none transition-colors"
                    >
                      <option value="">Choisissez un sujet</option>
                      <option value="commande">Question sur une commande</option>
                      <option value="produit">Informations sur un produit</option>
                      <option value="retour">Demande de retour</option>
                      <option value="partenariat">Partenariat</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-textDark mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none transition-colors resize-none"
                      placeholder="Décrivez votre demande en détail..."
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="consent"
                      required
                      className="mt-1 w-4 h-4 text-rose-custom focus:ring-rose border-gray-300 rounded"
                    />
                    <label htmlFor="consent" className="text-sm text-gray-600">
                      J'accepte que mes données soient traitées en conformité avec la 
                      <Link href="/politique-confidentialite" className="text-rose-custom hover:underline ml-1">
                        politique de confidentialité
                      </Link>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-rose-custom text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Envoyer le message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
