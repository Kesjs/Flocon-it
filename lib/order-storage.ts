import { Product } from '@/data/products';

export interface Order {
  id: string;
  userId: string;
  date: string; // Format ISO string
  status: "Livré" | "En cours" | "En préparation" | "En attente" | "Rejetée";
  total: number;
  items: number;
  trackingNumber?: string; // Numéro de suivi du colis
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  favoriteCategory: string;
  memberSince: string;
  loyaltyPoints: number;
  nextReward: string;
}

// Clés localStorage
const ORDERS_KEY = 'flocon_orders';
const STATS_KEY = 'flocon_user_stats';

export class OrderStorage {
  // Récupérer toutes les commandes d'un utilisateur
  static getUserOrders(userId: string): Order[] {
    if (typeof window === 'undefined') return [];
    
    const orders = localStorage.getItem(ORDERS_KEY);
    const allOrders: Order[] = orders ? JSON.parse(orders) : [];
    return allOrders.filter(order => order.userId === userId);
  }

  // Ajouter une nouvelle commande
  static addOrder(order: Omit<Order, 'id' | 'date'>): Order {
    if (typeof window === 'undefined') return {} as Order;

    const newOrder: Order = {
      ...order,
      id: `CMD-${Date.now()}`,
      date: new Date().toISOString() // Format ISO standard
    };

    const existingOrders = localStorage.getItem(ORDERS_KEY);
    const orders: Order[] = existingOrders ? JSON.parse(existingOrders) : [];
    orders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    // Mettre à jour les stats
    this.updateUserStats(order.userId, newOrder);

    return newOrder;
  }

  // Nettoyer les commandes en double
  static removeDuplicateOrders(userId: string): number {
    if (typeof window === 'undefined') return 0;
    
    const orders = localStorage.getItem(ORDERS_KEY);
    const allOrders: Order[] = orders ? JSON.parse(orders) : [];
    const userOrders = allOrders.filter(order => order.userId === userId);
    
    // Grouper les commandes par total et nombre d'articles
    const orderGroups = new Map<string, Order[]>();
    
    userOrders.forEach(order => {
      const key = `${order.total}-${order.items}`;
      if (!orderGroups.has(key)) {
        orderGroups.set(key, []);
      }
      orderGroups.get(key)!.push(order);
    });
    
    let duplicatesRemoved = 0;
    
    // Pour chaque groupe, garder seulement la commande la plus récente
    orderGroups.forEach((groupOrders, key) => {
      if (groupOrders.length > 1) {
        // Trier par date (plus récent en premier)
        groupOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        // Garder la première (plus récente) et supprimer les autres
        const toKeep = groupOrders[0];
        const toRemove = groupOrders.slice(1);
        
        console.log(`🧹 Nettoyage groupe ${key}: garde ${toKeep.id}, supprime ${toRemove.map(o => o.id).join(', ')}`);
        
        // Supprimer les doublons du storage
        const updatedOrders = allOrders.filter(order => 
          !toRemove.some(removeOrder => removeOrder.id === order.id)
        );
        
        localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
        duplicatesRemoved += toRemove.length;
      }
    });
    
    return duplicatesRemoved;
  }

  // Mettre à jour le statut d'une commande
  static updateOrderStatus(orderId: string, status: Order['status']): boolean {
    if (typeof window === 'undefined') return false;

    const orders = localStorage.getItem(ORDERS_KEY);
    const allOrders: Order[] = orders ? JSON.parse(orders) : [];
    
    const orderIndex = allOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return false;

    allOrders[orderIndex].status = status;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
    return true;
  }

  // Calculer les stats utilisateur
  static getUserStats(userId: string): UserStats {
    if (typeof window === 'undefined') {
      return {
        totalOrders: 0,
        totalSpent: 0,
        favoriteCategory: 'Saint-Valentin',
        memberSince: 'Décembre 2025',
        loyaltyPoints: 0,
        nextReward: '-50€ sur prochaine commande (500 points)'
      };
    }

    const orders = this.getUserOrders(userId);
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const loyaltyPoints = Math.floor(totalSpent / 10); // 1 point par 10€

    // Catégorie la plus commandée
    const categoryCount: { [key: string]: number } = {};
    orders.forEach(order => {
      order.products.forEach(product => {
        // Vous pouvez stocker la catégorie dans le produit lors de la commande
        const category = 'Saint-Valentin'; // Default
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
    });
    
    const favoriteCategory = Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b, 'Saint-Valentin'
    );

    return {
      totalOrders,
      totalSpent,
      favoriteCategory,
      memberSince: 'Décembre 2025',
      loyaltyPoints,
      nextReward: loyaltyPoints >= 500 ? 'Réduction de -50€ disponible !' : `-50€ sur prochaine commande (${500 - loyaltyPoints} points)`
    };
  }

  // Mettre à jour les stats après nouvelle commande
  private static updateUserStats(userId: string, newOrder: Order): void {
    const stats = this.getUserStats(userId);
    localStorage.setItem(`${STATS_KEY}_${userId}`, JSON.stringify(stats));
  }

  // Créer une commande depuis le panier
  static createOrderFromCart(
    userId: string, 
    cartItems: any[], 
    shippingAddress: any
  ): Order {
    const products = cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.images[0]
    }));

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const items = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return this.addOrder({
      userId,
      status: 'En attente',
      total,
      items,
      products,
      shippingAddress
    });
  }
}
