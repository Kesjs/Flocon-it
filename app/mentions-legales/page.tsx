import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MentionsLegales() {
  return (
    <div className="pt-28 min-h-screen bg-gray-50 px-4">
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-display font-bold text-textDark mb-8">
          Informazioni Legali
        </h1>
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              1. Editore del sito
            </h2>
            <div className="space-y-2">
              <p><strong>Flocon</strong></p>
              <p>Società per azioni semplificata (SAS) con capitale di 10 000€</p>
              <p>RCS Roma : 123 456 789</p>
              <p>SIRET : 123 456 789 00012</p>
              <p>Sede sociale : 123 Via della Moda, 00100 Roma, Italia</p>
              <p>Telefono : +39 (0)6 12 34 56 78</p>
              <p>Email : contact@flocon.it</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              2. Direttore della pubblicazione
            </h2>
            <div className="space-y-2">
              <p><strong>Jean Dupont</strong></p>
              <p>Presidente-Direttore Generale</p>
              <p>Email : jean.dupont@flocon.it</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              3. Hosting del sito
            </h2>
            <div className="space-y-2">
              <p><strong>Vercel Inc.</strong></p>
              <p>340 S Lemon Ave #4133</p>
              <p>Walnut, CA 91789</p>
              <p>Stati Uniti</p>
              <p>Telefono : +1 (650) 488-8398</p>
              <p>Sito web : www.vercel.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              4. Proprietà intellettuale
            </h2>
            <p>
              L'intero sito è soggetto alla legislazione francese e internazionale sul 
              diritto d'autore e la proprietà intellettuale. Tutti i diritti di riproduzione, 
              rappresentazione e utilizzo sono riservati per tutti gli elementi 
              del sito, inclusi testi, articoli, disegni, immagini, loghi, icone, ecc.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              5. Cookies
            </h2>
            <p>
              Le site www.flocon.fr utilise des cookies nécessaires à son bon fonctionnement 
              et des cookies de mesure d'audience. L'utilisateur a la possibilité de désactiver 
              ces cookies dans les paramètres de son navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              6. CNIL
            </h2>
            <p>
              Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée, 
              tout utilisateur dispose d'un droit d'accès, de rectification, de suppression 
              et d'opposition aux données personnelles le concernant. Pour exercer ce droit, 
              il suffit de nous contacter à l'adresse email : contact@flocon.fr.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              7. Litiges
            </h2>
            <p>
              En cas de litige, et après avoir tenté une résolution amiable, le client peut 
              saisir le médiateur de la consommation compétent ou le tribunal de commerce 
              de Paris.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              8. Crédits
            </h2>
            <div className="space-y-2">
              <p>• Technologies utilisées :</p>
              <p>• Framework : Next.js 14</p>
              <p>• Hébergement : Vercel</p>
              <p>• Paiement : Stripe</p>
              <p>• Images : Unsplash et photographes professionnels</p>
              <p>• Icônes : Lucide React</p>
            </div>
          </section>

          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              Date dernière mise à jour : 20 janvier 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
