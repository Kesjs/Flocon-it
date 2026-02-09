import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-textDark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Newsletter */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-display font-bold mb-4">
              Newsletter
            </h3>
            <p className="text-gray-300 mb-4">
              Ricevi le nostre ultime novità e offerte esclusive
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="La tua email"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-rose-custom rounded-lg hover:bg-opacity-90 transition-colors font-medium"
              >
                Iscriviti
              </button>
            </form>
          </div>

          {/* Liens légaux */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Informazioni</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cgv" className="text-gray-300 hover:text-white transition-colors">
                  Termini e Condizioni
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-gray-300 hover:text-white transition-colors">
                  Note legali
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-gray-300 hover:text-white transition-colors">
                  Politica sulla privacy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Seguici</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2026 Flocon. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}
