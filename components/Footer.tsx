import { Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-textDark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-display font-bold mb-4">
              Newsletter
            </h3>
            <p className="text-gray-300 mb-4">
              Recevez nos dernières nouveautés et offres exclusives
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="w-64 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-rose-custom rounded-lg hover:bg-opacity-90 transition-colors font-medium"
              >
                S'inscrire
              </button>
            </form>
          </div>

          {/* Liens légaux */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cgv" className="text-gray-300 hover:text-white transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-gray-300 hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-gray-300 hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Contact</h3>
            <a 
              href="mailto:contact@flocon-market.fr" 
              className="text-gray-300 mb-2 hover:text-white transition-colors inline-block"
            >
              contact@flocon-market.fr
            </a>
            <p className="text-sm text-gray-400">
              Service client 100% français
            </p>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2026 Flocon. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
