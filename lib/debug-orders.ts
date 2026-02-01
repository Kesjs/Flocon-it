// Outils de debug pour les commandes

export function debugOrders(userId: string) {
  console.log('🔍 DEBUG ORDERS - Début analyse');
  
  // Vérifier localStorage
  const allOrdersStr = localStorage.getItem('flocon_orders');
  console.log('📦 localStorage flocon_orders:', allOrdersStr ? 'présent' : 'vide');
  
  if (allOrdersStr) {
    try {
      const allOrders = JSON.parse(allOrdersStr);
      console.log('📊 Total commandes dans localStorage:', allOrders.length);
      
      const userOrders = allOrders.filter((order: any) => order.userId === userId);
      console.log('👤 Commandes utilisateur:', userOrders.length);
      
      userOrders.forEach((order: any, index: number) => {
        console.log(`📋 Commande ${index + 1}:`, {
          id: order.id,
          status: order.status,
          date: order.date,
          total: order.total,
          items: order.items,
          address: order.shippingAddress?.address,
          city: order.shippingAddress?.city,
          phone: order.shippingAddress?.phone
        });
      });
      
      // Vérifier les commandes en attente
      const pendingOrders = userOrders.filter((order: any) => 
        order.status === 'En préparation' || 
        (order.shippingAddress && order.shippingAddress.address && order.shippingAddress.address.includes('En attente'))
      );
      
      console.log('⏳ Commandes en attente:', pendingOrders.length);
      pendingOrders.forEach((order: any, index: number) => {
        console.log(`⏳ En attente ${index + 1}:`, {
          id: order.id,
          address: order.shippingAddress?.address,
          status: order.status
        });
      });
      
    } catch (error) {
      console.error('❌ Erreur parsing localStorage:', error);
    }
  }
  
  // Vérifier les données du formulaire
  const formData = localStorage.getItem('checkout-shipping-address');
  console.log('📝 checkout-shipping-address:', formData ? 'présent' : 'vide');
  
  if (formData) {
    try {
      const formAddress = JSON.parse(formData);
      console.log('📝 Données formulaire:', formAddress);
    } catch (error) {
      console.error('❌ Erreur parsing formulaire:', error);
    }
  }
  
  console.log('🔍 DEBUG ORDERS - Fin analyse');
}

// Fonction pour créer une commande de test
export function createTestOrder(userId: string) {
  console.log('🧪 Création commande de test pour:', userId);
  
  try {
    const testOrder = {
      id: `TEST-${Date.now()}`,
      userId: userId,
      date: new Date().toISOString(),
      status: 'En préparation' as const,
      total: 99.99,
      items: 2,
      products: [
        {
          id: 'test-1',
          name: 'Produit Test 1',
          price: 49.99,
          quantity: 1,
          image: '/logof.jpg'
        },
        {
          id: 'test-2', 
          name: 'Produit Test 2',
          price: 50.00,
          quantity: 1,
          image: '/logof.jpg'
        }
      ],
      shippingAddress: {
        name: 'Test User',
        address: 'En attente de confirmation webhook',
        city: 'En attente de confirmation webhook',
        postalCode: '00000',
        phone: 'En attente de confirmation webhook'
      }
    };
    
    const allOrders = JSON.parse(localStorage.getItem('flocon_orders') || '[]');
    allOrders.push(testOrder);
    localStorage.setItem('flocon_orders', JSON.stringify(allOrders));
    
    console.log('✅ Commande de test créée:', testOrder.id);
    return testOrder;
  } catch (error) {
    console.error('❌ Erreur création commande test:', error);
    return null;
  }
}
