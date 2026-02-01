import { motion } from "framer-motion";
import { User, Mail, Calendar, Settings, Bell, Shield, CreditCard, MapPin, Star } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface ProfileSectionProps {
  user: SupabaseUser | null;
  onLogout: () => void;
}

export function ProfileSection({ user, onLogout }: ProfileSectionProps) {
  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'Date inconnue';

  const userInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: user?.email || 'Non renseigné',
      type: 'email'
    },
    {
      icon: Calendar,
      label: 'Membre depuis',
      value: memberSince,
      type: 'date'
    },
    {
      icon: User,
      label: 'ID Utilisateur',
      value: user?.id ? user.id.slice(0, 8) + '...' : 'Non disponible',
      type: 'id'
    }
  ];

  const preferences = [
    {
      icon: Bell,
      label: 'Notifications Email',
      description: 'Recevoir les confirmations de commande et les promotions',
      enabled: true
    },
    {
      icon: CreditCard,
      label: 'Sauvegarder les cartes',
      description: 'Enregistrer les cartes pour un paiement plus rapide',
      enabled: false
    },
    {
      icon: MapPin,
      label: 'Adresse par défaut',
      description: 'Utiliser l\'adresse principale pour les livraisons',
      enabled: true
    }
  ];

  const quickActions = [
    {
      icon: CreditCard,
      label: 'Moyens de paiement',
      description: 'Gérer vos cartes et méthodes de paiement',
      action: 'payment'
    },
    {
      icon: MapPin,
      label: 'Adresses de livraison',
      description: 'Gérer vos adresses de livraison',
      action: 'addresses'
    },
    {
      icon: Shield,
      label: 'Sécurité',
      description: 'Mot de passe et authentification',
      action: 'security'
    },
    {
      icon: Settings,
      label: 'Préférences',
      description: 'Personnaliser votre expérience',
      action: 'preferences'
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Mon Profil</h2>
        <p className="text-gray-600 mt-1">
          Gérez vos informations et préférences
        </p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-rose-custom to-purple-600 rounded-xl p-8 text-white mb-8"
      >
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-12 h-12" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">
              {(() => {
                const emailUsername = user?.email?.split('@')[0];
                return emailUsername 
                  ? emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1)
                  : 'Utilisateur';
              })()}
            </h3>
            <p className="text-white/90 mb-4">{user?.email}</p>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span className="font-medium">Client Fidèle</span>
                </div>
              </div>
              <div className="text-white/80 text-sm">
                Membre depuis {memberSince}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations Personnelles</h3>
          <div className="space-y-4">
            {userInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={info.label} className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{info.label}</p>
                    <p className="text-sm font-medium text-gray-900">{info.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Préférences</h3>
          <div className="space-y-4">
            {preferences.map((pref, index) => {
              const Icon = pref.icon;
              return (
                <div key={pref.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{pref.label}</p>
                      <p className="text-xs text-gray-600">{pref.description}</p>
                    </div>
                  </div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      pref.enabled ? 'bg-rose-custom' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        pref.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-white rounded-lg border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions Rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-3 bg-rose-custom/10 rounded-lg">
                  <Icon className="w-6 h-6 text-rose-custom" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{action.label}</p>
                  <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-red-900 mb-4">Zone de Danger</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-900">Supprimer le compte</p>
              <p className="text-sm text-red-700">Supprimez définitivement votre compte et toutes vos données</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
              Supprimer
            </button>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-red-200">
            <div>
              <p className="font-medium text-red-900">Déconnexion</p>
              <p className="text-sm text-red-700">Déconnectez-vous de votre compte</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
