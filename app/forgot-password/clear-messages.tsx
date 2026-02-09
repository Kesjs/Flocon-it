// Messages clairs pour la gestion des emails non existants

export const EMAIL_MESSAGES = {
  // Message direct et clair
  USER_NOT_FOUND: {
    title: "Aucun compte trouvé",
    message: "Aucun compte n'est associé à cet email. Vérifiez l'adresse ou créez un nouveau compte.",
    action: "Créer un compte gratuitement",
    type: "error"
  },

  // Message amical et encourageant
  USER_NOT_FOUND_FRIENDLY: {
    title: "Pas encore inscrit ?",
    message: "Il semble que vous n'ayez pas encore de compte avec cette email. Rejoignez-nous en quelques secondes !",
    action: "S'inscrire maintenant",
    type: "info"
  },

  // Message professionnel
  USER_NOT_FOUND_PROFESSIONAL: {
    title: "Email non reconnu",
    message: "Cette adresse email n'est pas associée à un compte actif. Si vous pensez qu'il s'agit d'une erreur, contactez notre support.",
    action: "Créer un compte",
    type: "warning"
  },

  // Message avec options multiples
  USER_NOT_FOUND_OPTIONS: {
    title: "Que souhaitez-vous faire ?",
    message: "Aucun compte trouvé avec cette email. Vous pouvez :",
    options: [
      "📝 Créer un nouveau compte",
      "🔍 Vérifier une autre adresse email",
      "💬 Contacter le support si vous pensez qu'il s'agit d'une erreur"
    ],
    type: "info"
  },

  // Message minimaliste
  USER_NOT_FOUND_MINIMAL: {
    title: "Email inconnu",
    message: "Cet email n'existe pas dans notre base de données.",
    action: "S'inscrire",
    type: "error"
  }
};

// Messages de succès
export const SUCCESS_MESSAGES = {
  EMAIL_SENT: {
    title: "Email envoyé !",
    message: "Un email de réinitialisation a été envoyé à {email}. Veuillez vérifier votre boîte de réception.",
    submessage: "N'oubliez pas de vérifier vos dossiers Spam/Promotions.",
    type: "success"
  },

  EMAIL_SENT_SECURE: {
    title: "Instructions envoyées",
    message: "Si un compte existe avec l'adresse {email}, vous recevrez un email de réinitialisation dans quelques minutes.",
    submessage: "Consultez également vos dossiers Spam et Promotions.",
    type: "success"
  }
};
