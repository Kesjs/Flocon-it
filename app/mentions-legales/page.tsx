import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MentionsLegales() {
  return (
    <div className="pt-28 min-h-screen bg-gray-50 px-4">
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-display font-bold text-textDark mb-8">
          Mentions Légales
        </h1>
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              1. Éditeur du site
            </h2>
            <div className="space-y-2">
              <p><strong>Flocon</strong></p>
              <p>Société par actions simplifiée (SAS) au capital de 10 000€</p>
              <p>SIREN : 897654321</p>
              <p>SIRET : 89765432100015</p>
              <p>TVA intracommunautaire : FR 45 897654321</p>
              <p>Siège social : 123 Avenue des Champs-Élysées, 75008 Paris, France</p>
              <p>Immatriculation : RCS Paris B 897 654 321</p>
              <p>Site internet : www.flocon.fr</p>
              <p>Email : contact@flocon-market.fr</p>
              <p><em>Boutique en ligne de cadeaux et accessoires</em></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              2. Directeur de la publication
            </h2>
            <div className="space-y-2">
              <p><strong>Direction de Flocon</strong></p>
              <p>Email : contact@flocon-market.fr</p>
              <p><em>Responsable éditorial du site www.flocon.fr</em></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              3. Hébergeur du site
            </h2>
            <div className="space-y-2">
              <p><strong>Vercel Inc.</strong></p>
              <p>340 S Lemon Ave #4133</p>
              <p>Walnut, CA 91789</p>
              <p>États-Unis</p>
              <p>Téléphone : +1 (650) 488-8398</p>
              <p>Site web : www.vercel.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              4. Propriété intellectuelle
            </h2>
            <p>
              L'ensemble du site est soumis à la législation française et internationale sur 
              le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction, 
              représentation et utilisation sont réservés pour tous les éléments 
              du site, incluant textes, articles, dessins, images, logos, icônes, etc.
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
              il suffit de nous contacter à l'adresse email : contact@flocon-market.fr.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              7. Litiges et Médiation
            </h2>
            <div className="space-y-2">
              <p><strong>Médiateur de la consommation :</strong></p>
              <p>Nom : CM2C - Médiation de la Consommation</p>
              <p>Adresse : 73 Boulevard de Clichy, 75009 Paris</p>
              <p>Site web : www.cm2c.net</p>
              <p>Email : mediation@cm2c.net</p>
              <p><em>En cas de litige, après tentative de résolution amiable avec notre service client, vous pouvez saisir gratuitement le médiateur ci-dessus.</em></p>
            </div>
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
