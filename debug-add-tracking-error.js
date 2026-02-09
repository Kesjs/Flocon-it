// Script de diagnostic pour l'erreur d'ajout de numéro de suivi

const testAddTracking = async (orderId, trackingNumber) => {
  console.log('🔍 Test de la fonction add-tracking...');
  console.log('Order ID:', orderId);
  console.log('Tracking Number:', trackingNumber);
  
  try {
    // Simuler la requête exactement comme le fait le dashboard
    const response = await fetch('http://localhost:3002/api/admin/add-tracking', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_token') || 'test-token'}`
      },
      body: JSON.stringify({ orderId, trackingNumber })
    });
    
    const result = await response.json();
    
    console.log('📤 Réponse API:');
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    console.log('Body:', result);
    
    if (response.ok && result.success) {
      console.log('✅ Succès : Numéro de suivi ajouté');
    } else {
      console.log('❌ Erreur :', result.error);
      
      // Analyser les causes possibles
      console.log('\n🔍 Causes possibles :');
      
      if (response.status === 401) {
        console.log('❌ Token admin invalide ou expiré');
        console.log('💡 Solution : Reconnectez-vous à l\'admin');
      }
      
      if (response.status === 404) {
        console.log('❌ Commande non trouvée dans la base');
        console.log('💡 Solution : Vérifiez que la commande existe bien');
      }
      
      if (response.status === 500) {
        console.log('❌ Erreur serveur (base de données)');
        console.log('💡 Solution : Vérifiez les logs serveur');
      }
      
      if (result.error && result.error.includes('tracking_number')) {
        console.log('❌ Erreur de colonne tracking_number');
        console.log('💡 Solution : Vérifiez que la colonne existe dans la table orders');
      }
    }
    
  } catch (error) {
    console.error('💥 Erreur réseau:', error);
  }
};

// Test avec des données de test
console.log('🧪 Test avec données de test...');
testAddTracking('CMD-123456789', '6A123456789');

// Instructions pour l'utilisateur
console.log('\n📋 Instructions pour diagnostiquer :');
console.log('1. Ouvrez les outils de développement du navigateur (F12)');
console.log('2. Allez dans l\'admin dashboard');
console.log('3. Essayez d\'ajouter un numéro de suivi à une commande');
console.log('4. Regardez la console pour les erreurs détaillées');
console.log('5. Vérifiez l\'onglet Network pour voir la requête API');
console.log('\n🔧 Solutions communes :');
console.log('- Reconnectez-vous à l\'admin si token expiré');
console.log('- Vérifiez que la commande existe bien dans Supabase');
console.log('- Vérifiez les permissions sur la table orders');
console.log('- Vérifiez que la colonne tracking_number existe');
