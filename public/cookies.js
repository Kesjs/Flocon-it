// Google Analytics Configuration
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// Initialisation avec consentement par défaut refusé
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'granted',
  'personalization_storage': 'denied',
  'security_storage': 'granted'
});

// Configuration Google Analytics
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID', {
  'anonymize_ip': true,
  'cookie_flags': 'SameSite=None;Secure'
});

// Fonction pour mettre à jour le consentement
window.updateCookieConsent = function(preferences) {
  gtag('consent', 'update', {
    'ad_storage': preferences.marketing ? 'granted' : 'denied',
    'ad_user_data': preferences.marketing ? 'granted' : 'denied',
    'ad_personalization': preferences.marketing ? 'granted' : 'denied',
    'analytics_storage': preferences.analytics ? 'granted' : 'denied',
    'functionality_storage': 'granted',
    'personalization_storage': preferences.functional ? 'granted' : 'denied',
    'security_storage': 'granted'
  });
};
