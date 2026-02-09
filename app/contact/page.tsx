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
            Contattaci
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Il nostro team è a tua disposizione per rispondere a tutte le tue domande 
            e accompagnarti nella tua esperienza Flocon.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Carte Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-32">
              <h2 className="text-2xl font-display font-semibold text-textDark mb-6">
                Contatto diretto
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-custom/10 rounded-lg">
                    <Mail className="w-6 h-6 text-rose-custom" />
                  </div>
                  <div>
                    <p className="font-medium text-textDark">Email</p>
                    <p className="text-gray-600">contact@flocon.fr</p>
                    <p className="text-sm text-gray-500">Risposta entro 24h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-custom/10 rounded-lg">
                    <Phone className="w-6 h-6 text-rose-custom" />
                  </div>
                  <div>
                    <p className="font-medium text-textDark">Telefono</p>
                    <p className="text-gray-600">+39 01 23 45 67 89</p>
                    <p className="text-sm text-gray-500">Lun-Ven: 9h-18h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-custom/10 rounded-lg">
                    <MapPin className="w-6 h-6 text-rose-custom" />
                  </div>
                  <div>
                    <p className="font-medium text-textDark">Negozio</p>
                    <p className="text-gray-600">
                      123 Via della Moda<br />
                      00100 Roma, Italia
                    </p>
                    <p className="text-sm text-gray-500">Aperto tutti i giorni</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-custom/10 rounded-lg">
                    <Clock className="w-6 h-6 text-rose-custom" />
                  </div>
                  <div>
                    <p className="font-medium text-textDark">Orari</p>
                    <p className="text-gray-600">
                      Lunedì-Venerdì: 9h-19h<br />
                      Sabato: 10h-18h<br />
                      Domenica: 11h-17h
                    </p>
                  </div>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-textDark mb-4">Seguici</h3>
                <div className="flex gap-3">
                  <a href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-rose-custom hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-5.373 12-12 12 5.373 12 12 12zm0-1.44c-5.864 0-10.56-4.676-10.56-10.236 0-5.56 4.696-10.56 10.236 0 5.56 4.696 10.56 10.236 0 5.56-4.696 10.56-10.236z"/>
                      <path d="M12 16c-2.208 0-4-1.792-4-4s1.792-4 4-4 4 1.792 4 4-1.792 4-4 4-1.792-4-4z"/>
                    </svg>
                  </a>
                  <a href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-rose-custom hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.12 4.85.367a9.595 9.595 0 0 1 6.29 2.214c.366.698.562 1.5.56 2.302.439.741.679 1.626.679 2.929 0 1.303-.56 2.302-.679.74-.44 1.604-.24 2.302-.439a9.595 9.595 0 0 1 6.29-2.214c1.266-.247 2.646-.367 4.85-.367 6.627 0 12 5.373 12 12s-5.373 12-12 12c-2.204 0-3.584-.12-4.85-.367a9.595 9.595 0 0 1-6.29-2.214c-.366-.698-.562-1.5-.56-2.302 0-.741.679-1.626.679-2.929 0-1.303.56-2.302.679-.74.44-1.604.24-2.302.439a9.595 9.595 0 0 1-6.29 2.214c-1.266.247-2.646.367-4.85.367-6.627 0-12-5.373-12-12s5.373-12 12-12z"/>
                      <path d="M8.7 10.2c1.1 0 2-.9 2-2s-.9-2-2-2 .9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                      <path d="M15.3 10.2c1.1 0 2-.9 2-2s-.9-2-2-2 .9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                    </svg>
                  </a>
                  <a href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-rose-custom hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.727l-.248-.248a10 10 0 00-2.825-.727l-6.821 6.821a10 10 0 00-2.825-.727l-.248.248a10 10 0 00-2.825.727l6.821-6.821a10 10 0 002.825-.727l.248-.248a10 10 0 002.825.727l6.821 6.821a10 10 0 01-2.825.727l-.248-.248a10 10 0 00-2.825-.727l-6.821-6.821a10 10 0 00-2.825-.727l-.248.248a10 10 0 00-2.825.727l6.821 6.821a10 10 0 002.825.727l.248.248a10 10 0 012.825-.727l6.821-6.821a10 10 0 01-2.825-.727zM4.394 17.439l-2.424-2.424a1 1 0 00-1.415 1.414l2.424 2.424a1 1 0 001.415-1.414l-2.424-2.424a1 1 0 00-1.415 1.414zm14.142 0l2.424-2.424a1 1 0 011.415 1.415l-2.424 2.424a1 1 0 01-1.415-1.415l2.424-2.424a1 1 0 011.415 1.415z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-display font-semibold text-textDark mb-6">
                Invia un messaggio
              </h2>
              
              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <Send className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Messaggio inviato!
                  </h3>
                  <p className="text-green-700">
                    Ti risponderemo il prima possibile.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-textDark mb-2">
                        Nome completo *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none transition-colors"
                        placeholder="Mario Rossi"
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
                        placeholder="mario.rossi@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-textDark mb-2">
                      Oggetto *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none transition-colors"
                    >
                      <option value="">Scegli un argomento</option>
                      <option value="commande">Domanda su un ordine</option>
                      <option value="produit">Informazioni su un prodotto</option>
                      <option value="retour">Richiesta di reso</option>
                      <option value="partenariat">Partenariato</option>
                      <option value="altro">Altro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-textDark mb-2">
                      Messaggio *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none transition-colors resize-none"
                      placeholder="Descrivi la tua richiesta in dettaglio..."
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
                      Accetto che i miei dati siano trattati in conformità con la 
                      <Link href="/politique-confidentialite" className="text-rose-custom hover:underline ml-1">
                        politica sulla privacy
                      </Link>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-rose-custom text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Invia il messaggio
                  </button>
                </form>
              )}

              {/* Informations supplémentaires */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-textDark mb-4">Altri mezzi di contatto</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Servizio clienti</p>
                    <p className="text-gray-600">support@flocon.it</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Reclami</p>
                    <p className="text-gray-600">reclami@flocon.it</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Stampa</p>
                    <p className="text-gray-600">stampa@flocon.it</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Partenariati</p>
                    <p className="text-gray-600">partenariati@flocon.it</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
