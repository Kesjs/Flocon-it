// Script pour mettre à jour l'adresse d'une commande spécifique
const orderId = 'CMD-1770331693574';

const shippingAddress = {
  full_name: 'Jean Dupont',
  address_line1: '123 Rue de la Paix',
  city: 'Paris',
  postal_code: '75001',
  country: 'FR',
  phone: '+33 6 12 34 56 78'
};

const customerName = 'Jean Dupont';
const customerPhone = '+33 6 12 34 56 78';

fetch(`http://localhost:3000/api/orders/${orderId}/update-address`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    shippingAddress,
    customerName,
    customerPhone
  }),
})
.then(response => response.json())
.then(data => {
  console.log('✅ Réponse du serveur:', data);
  if (data.success) {
    console.log('🎉 Adresse mise à jour avec succès !');
    console.log('📦 Commande:', data.order.id);
    console.log('🏠 Adresse:', data.order.shipping_address);
    console.log('👤 Client:', data.order.customer_name);
  } else {
    console.error('❌ Erreur:', data.error);
  }
})
.catch(error => {
  console.error('💥 Erreur lors de la mise à jour:', error);
});
