import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CGV() {
  return (
    <div className="pt-28 min-h-screen bg-gray-50 px-4">
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-display font-bold text-textDark mb-8">
          Conditions Générales de Vente
        </h1>
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              1. Objet
            </h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles 
              entre la société Flocon, SAS au capital de 10 000€, et toute personne physique ou morale 
              achetant des produits sur le site internet www.flocon.fr.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              2. Produits
            </h2>
            <p>
              Les produits proposés à la vente sont ceux présents sur le site internet 
              www.flocon.fr dans la limite des stocks disponibles. Flocon s'engage à fournir 
              des informations les plus précises possibles sur les caractéristiques des produits. 
              Cependant, les photos des produits ne sont pas contractuelles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              3. Prix
            </h2>
            <p>
              Les prix sont indiqués en euros, toutes taxes comprises (TVA). Les frais de livraison 
              sont calculés en fonction du montant total de la commande et du mode de livraison choisi. 
              Flocon se réserve le droit de modifier les prix à tout moment, les produits étant facturés 
              sur la base des tarifs en vigueur au moment de la confirmation de la commande.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              4. Commande
            </h2>
            <p>
              Toute commande passée sur le site www.flocon.fr constitue la formation d'un contrat 
              de vente entre le client et Flocon. La confirmation de la commande intervient après 
              la confirmation du paiement par le client. Flocon se réserve le droit de refuser 
              toute commande pour des motifs légitimes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              5. Paiement
            </h2>
            <p>
              Le paiement s'effectue par carte de crédit via notre partenaire Stripe, sécurisé 
              selon le protocole SSL. Le débit sur la carte est effectué au moment de la confirmation 
              de la commande. En cas de refus de paiement par le centre d'autorisation bancaire, 
              la commande sera annulée.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              6. Livraison
            </h2>
            <p>
              Les produits sont expédiés à l'adresse indiquée lors de la commande. 
              Délai de livraison : 3-5 jours ouvrables pour la France métropolitaine, 
              7-14 jours pour l'international. 
              Frais de livraison calculés selon destination et poids. 
              En cas de retard supérieur à 30 jours, vous pouvez résoudre la vente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              7. Droit de rétractation
            </h2>
            <div className="space-y-3">
              <p><strong>Délai de rétractation :</strong> Conformément à la législation, vous disposez d'un délai de 14 jours calendaires à compter de la réception de votre commande pour exercer votre droit de rétractation sans avoir à justifier de motifs.</p>
              
              <p><strong>Modalités de retour :</strong></p>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>Notifier votre intention par email à contact@flocon-market.fr</li>
                <li>Renvoyer les produits dans leur état d'origine (emballage, étiquettes)</li>
                <li>Utiliser notre transporteur partenaire : Colissimo</li>
                <li>Frais de retour : 3,99€ (offerts pour toute commande supérieure à 50€)</li>
                <li>Délai de retour : 14 jours après notification</li>
              </ul>
              
              <p><strong>Remboursement :</strong> Effectué sous 14 jours après réception et vérification du retour, via le moyen de paiement initial.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              8. Garantie
            </h2>
            <p>
              Tous les produits bénéficient de la garantie légale de conformité de 2 ans. 
              En cas de non-conformité, le client peut échanger le produit ou obtenir un remboursement. 
              La garantie ne couvre pas les dommages résultant d'une utilisation inappropriée ou 
              d'une utilisation non conforme des produits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              9. Données personnelles
            </h2>
            <p>
              Les informations personnelles collectées lors de la commande sont traitées 
              conformément au Règlement Général sur la Protection des Données (RGPD). 
              Le client a un droit d'accès, de modification et de suppression de ses données.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              10. Service Client
            </h2>
            <div className="space-y-2">
              <p><strong>Contact Service Client :</strong></p>
              <p>Email : contact@flocon-market.fr</p>
              <p>Disponibilité : Du lundi au vendredi, 9h-18h</p>
              <p>Temps de réponse : Sous 24h ouvrées</p>
              <p><em>Pour toute question, réclamation ou demande d'information, notre service client est à votre disposition.</em></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              11. Litiges
            </h2>
            <p>
              Pour tout litige, le client peut contacter le service client à l'adresse 
              contact@flocon-market.fr. En l'absence d'accord amiable, le litige pourra être soumis 
              au médiateur de la consommation CM2C ou au tribunal compétent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              12. Propriété intellectuelle
            </h2>
            <p>
              Tous les éléments du site www.flocon.fr, incluant textes, images, 
              graphismes, logos et icônes, sont la propriété exclusive de Flocon et sont protégés 
              par le droit d'auteur. Toute reproduction, distribution ou modification de ces éléments 
              est strictement interdite sans autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              13. Force majeure
            </h2>
            <p>
              Flocon ne pourra être tenue responsable en cas d'inexécution ou de retard 
              dans l'exécution de ses obligations dû à un cas de force majeure, notamment 
              grève, panne, guerre, émeute, ou tout événement hors de son contrôle.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              14. Responsabilité du client
            </h2>
            <p>
              Le client s'engage à ne pas utiliser les produits à des fins illégles ou contraires à l'ordre public. Le client est responsable de l'exactitude des informations fournies lors de la commande.
            </p>
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
