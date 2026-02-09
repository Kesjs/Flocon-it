import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PolitiqueConfidentialite() {
  return (
    <div className="pt-28 min-h-screen bg-gray-50 px-4">
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-display font-bold text-textDark mb-8">
          Politique de Confidentialité
        </h1>
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              1. Introduction
            </h2>
            <p>
              Flocon s'engage à protéger la vie privée de ses utilisateurs. Cette politique 
              de confidentialité explique comment nous collectons, utilisons et protégeons 
              vos données personnelles conformément au Règlement Général sur la Protection 
              des Données (RGPD) du 27 avril 2016.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              2. Données collectées
            </h2>
            <div className="space-y-3">
              <p><strong>Données d'identification :</strong></p>
              <ul className="list-disc list-inside ml-6">
                <li>Nom, prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Adresse de livraison</li>
              </ul>
              
              <p><strong>Données de connexion :</strong></p>
              <ul className="list-disc list-inside ml-6">
                <li>Adresse IP</li>
                <li>Type de navigateur</li>
                <li>Données de navigation (cookies)</li>
              </ul>
              
              <p><strong>Données de commande :</strong></p>
              <ul className="list-disc list-inside ml-6">
                <li>Historique des commandes</li>
                <li>Préférences d'achat</li>
                <li>Moyens de paiement utilisés</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              3. Finalités du traitement
            </h2>
            <div className="space-y-3">
              <p><strong>Gestion des commandes :</strong></p>
              <p>Traitement et expédition des commandes, gestion des paiements</p>
              
              <p><strong>Service client :</strong></p>
              <p>Répondre à vos questions, gérer les réclamations et retours</p>
              
              <p><strong>Marketing :</strong></p>
              <p>Newsletter, offres promotionnelles, recommandations personnalisées</p>
              
              <p><strong>Amélioration du site :</strong></p>
              <p>Analyse des comportements pour optimiser l'expérience utilisateur</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              4. Base légale
            </h2>
            <p>
              Le traitement de vos données personnelles est fondé sur les bases légales 
              suivantes : le consentement, l'exécution du contrat, l'obligation légale, 
              l'intérêt légitime et les intérêts vitaux.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              5. Durée de conservation
            </h2>
            <div className="space-y-3">
              <p><strong>Données clients :</strong> 3 ans après la dernière commande</p>
              <p><strong>Données de navigation :</strong> 13 mois maximum</p>
              <p><strong>Données comptables :</strong> 10 ans (obligation légale)</p>
              <p><strong>Newsletter :</strong> Jusqu'à désabonnement</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              6. Partage des données et Sous-traitants
            </h2>
            <div className="space-y-3">
              <p><strong>Sous-traitants techniques :</strong></p>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li><strong>Vercel Inc.</strong> - Hébergement (États-Unis, clauses contractuelles type UE)</li>
                <li><strong>Stripe</strong> - Paiement sécurisé (PCI-DSS certifié)</li>
                <li><strong>Supabase</strong> - Base de données (hébergé UE)</li>
                <li><strong>Google Analytics</strong> - Analyse d'audience (anonymisé)</li>
                <li><strong>SendGrid</strong> - Emails transactionnels</li>
              </ul>
              
              <p><strong>Transferts hors UE :</strong></p>
              <p>Les transferts vers les États-Unis (Vercel) sont protégés par des Clauses Contractuelles Type approuvées par la Commission Européenne.</p>
              
              <p><strong>Autorités :</strong></p>
              <p>En cas de demande judiciaire ou obligation légale, nous pouvons être amenés à communiquer certaines données aux autorités compétentes.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              7. Sécurité des données
            </h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles 
              appropriées pour protéger vos données contre l'accès non autorisé, la modification, 
              la destruction ou la perte accidentelle. Les paiements sont sécurisés via 
              le protocole SSL et le cryptage des données.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              8. Vos droits RGPD
            </h2>
            <div className="space-y-3">
              <p><strong>Droit d'accès :</strong> Vous pouvez demander une copie de vos données</p>
              <p><strong>Droit de rectification :</strong> Corriger les informations inexactes</p>
              <p><strong>Droit de suppression :</strong> Effacer vos données personnelles</p>
              <p><strong>Droit de limitation :</strong> Limiter le traitement de vos données</p>
              <p><strong>Droit de portabilité :</strong> Transférer vos données vers un autre service</p>
              <p><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              9. Cookies
            </h2>
            <p>
              Notre site utilise des cookies nécessaires à son fonctionnement et des cookies 
              de mesure d'audience. Vous pouvez gérer vos préférences cookies via les 
              paramètres de votre navigateur. Les cookies nous permettent d'améliorer 
              votre expérience et d'analyser l'utilisation du site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              10. Contact DPD et Délégué Protection Données
            </h2>
            <div className="space-y-2">
              <p><strong>Délégué à la Protection des Données (DPD) :</strong></p>
              <p>Nom : Jean-Marc Dubois</p>
              <p>Email : dpo@flocon-market.fr</p>
              
              <p><strong>Service client :</strong></p>
              <p>Email : contact@flocon-market.fr</p>
              <p><em>Pour toute exercice de vos droits RGPD, contactez directement notre DPD.</em></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-textDark mb-4">
              11. Modifications
            </h2>
            <p>
              Flocon se réserve le droit de modifier cette politique de confidentialité à tout 
              moment. Les modifications seront publiées sur cette page et entreront en 
              vigueur immédiatement. Nous vous invitons à consulter régulièrement cette page 
              pour rester informé des éventuelles modifications.
            </p>
          </section>

          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              Date de dernière mise à jour : 20 janvier 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
