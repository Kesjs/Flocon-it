// Script de test pour le bouton Suivi
console.log('🧪 Test du bouton Suivi - Début du diagnostic');

// Test 1: Vérifier si le serveur est en cours d'exécution
const testServerConnection = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/admin/auth', {
      method: 'GET',
      credentials: 'include'
    });
    
    console.log('📡 Test connexion serveur:', response.status);
    
    if (response.status === 401) {
      console.log('✅ Serveur répond (non authentifié - normal)');
      return true;
    } else {
      const data = await response.json();
      console.log('📊 Réponse serveur:', data);
      return true;
    }
  } catch (error) {
    console.error('❌ Serveur inaccessible:', error);
    return false;
  }
};

// Test 2: Vérifier les cookies
const testCookies = () => {
  console.log('🍪 Vérification des cookies:');
  console.log('Document cookies:', document.cookie);
  
  const adminCookie = document.cookie.split(';').find(cookie => 
    cookie.trim().startsWith('admin_session=')
  );
  
  if (adminCookie) {
    console.log('✅ Cookie admin_session trouvé');
    return true;
  } else {
    console.log('❌ Cookie admin_session non trouvé');
    return false;
  }
};

// Test 3: Simulation d'un appel add-tracking
const testAddTracking = async () => {
  console.log('📦 Test appel add-tracking...');
  
  // Récupérer le cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };
  
  const sessionToken = getCookie('admin_session');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (sessionToken) {
    headers['x-admin-session'] = sessionToken;
    console.log('🔑 Token trouvé dans le cookie');
  } else {
    console.log('⚠️ Aucun token trouvé');
  }
  
  try {
    const response = await fetch('/api/admin/add-tracking', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ 
        orderId: 'TEST-123', 
        trackingNumber: 'TEST-TRACKING-123' 
      })
    });
    
    console.log('📤 Status réponse:', response.status);
    const result = await response.json();
    console.log('📊 Corps réponse:', result);
    
    if (response.status === 401) {
      console.log('❌ Erreur d\'authentification - normal si non connecté');
    } else if (response.ok) {
      console.log('✅ Appel API réussi');
    } else {
      console.log('⚠️ Erreur API:', result.error);
    }
    
  } catch (error) {
    console.error('💥 Erreur réseau:', error);
  }
};

// Exécuter tous les tests
const runAllTests = async () => {
  console.log('🚀 Lancement des tests de diagnostic...');
  
  const serverOk = await testServerConnection();
  if (!serverOk) {
    console.log('❌ Serveur inaccessible - vérifiez que npm run dev est en cours');
    return;
  }
  
  const cookiesOk = testCookies();
  if (!cookiesOk) {
    console.log('❌ Cookies non trouvés - connectez-vous à l\'admin d\'abord');
    return;
  }
  
  await testAddTracking();
  
  console.log('✅ Tests terminés');
};

// Instructions
console.log('📋 Instructions:');
console.log('1. Démarrez le serveur: npm run dev');
console.log('2. Connectez-vous à l\'admin: http://localhost:3000/admin/login');
console.log('3. Revenez ici et exécutez: runAllTests()');
console.log('4. Ou testez directement le bouton Suivi dans l\'admin');

// Exporter pour utilisation manuelle
window.testSuiviButton = {
  runAllTests,
  testServerConnection,
  testCookies,
  testAddTracking
};
