import { CartItem } from '@/context/CartContext';
import { OrderStorage } from './order-storage';
import { useAuth } from '@/context/AuthContext';
import { validateShippingAddress } from './validation';

interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export class CheckoutService {
  // Créer une commande depuis le panier
  static createOrderFromCart(
    userId: string,
    cartItems: CartItem[],
    shippingAddress: ShippingAddress
  ) {
    if (cartItems.length === 0) {
      throw new Error('Le panier est vide');
    }

    // Validation stricte de l'adresse de livraison
    if (!validateShippingAddress(shippingAddress)) {
      throw new Error('Adresse de livraison invalide');
    }

    // Convertir les items du panier en format commande
    const orderProducts = cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));

    // Calculer le total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const items = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Créer la commande
    const order = OrderStorage.addOrder({
      userId,
      status: 'En attente',
      total,
      items,
      products: orderProducts,
      shippingAddress
    });

    return order;
  }

  // Simuler un paiement et valider la commande
  static async processPayment(
    userId: string,
    cartItems: CartItem[],
    shippingAddress: ShippingAddress,
    paymentMethod: 'card' | 'paypal' = 'card'
  ) {
    try {
      console.log('🔄 Début processPayment:', { userId, itemsCount: cartItems.length });
      
      // Validation stricte de l'adresse avant traitement
      if (!validateShippingAddress(shippingAddress)) {
        throw new Error('Adresse de livraison invalide : vérifiez tous les champs');
      }
      
      // Simuler l'appel API de paiement
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simuler 2s de traitement

      // Créer la commande après paiement réussi
      const order = this.createOrderFromCart(userId, cartItems, shippingAddress);
      console.log('📦 Commande créée:', order.id);
      
      // Mettre à jour le statut en "Livré" (pour le mode test)
      OrderStorage.updateOrderStatus(order.id, 'Livré');
      console.log('✅ Statut mis à jour: Livré');

      return {
        success: true,
        orderId: order.id,
        message: 'Paiement réussi ! Votre commande est en préparation.'
      };
    } catch (error) {
      console.error('❌ Erreur processPayment:', error);
      return {
        success: false,
        orderId: null,
        message: error instanceof Error ? error.message : 'Erreur lors du paiement'
      };
    }
  }

  // Hook pour utiliser le service de checkout
  static useCheckout() {
    const { user } = useAuth();
    
    const checkout = async (
      cartItems: CartItem[],
      shippingAddress: ShippingAddress,
      paymentMethod: 'card' | 'paypal' = 'card'
    ) => {
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      return this.processPayment(user.id, cartItems, shippingAddress, paymentMethod);
    };

    return { checkout };
  }
}
