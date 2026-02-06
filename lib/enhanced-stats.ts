import { Order } from './order-storage';

export interface EnhancedStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  orderFrequency: {
    averageDaysBetweenOrders: number;
    mostActiveDay: string;
    mostActiveMonth: string;
  };
  favoriteProducts: {
    productId: string;
    productName: string;
    orderCount: number;
    totalSpent: number;
  }[];
  orderGrowth: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  revenueGrowth: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  failedOrders: number;
}

export class EnhancedStatsManager {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async calculateEnhancedStats(orders: Order[]): Promise<EnhancedStats> {
    try {
      // Statistiques de base
      const baseStats = {
        totalOrders: orders.length,
        totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
        averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0,
        failedOrders: orders.filter(order => order.status === 'Rejetée').length
      };

      // Calculer la fréquence des commandes
      const frequency = this.calculateOrderFrequency(orders);
      
      // Calculer les produits favoris
      const favoriteProducts = this.calculateFavoriteProducts(orders);
      
      // Calculer la croissance
      const growth = this.calculateGrowth(orders);

      return {
        ...baseStats,
        ...frequency,
        favoriteProducts,
        orderGrowth: growth,
        revenueGrowth: growth
      };
      
    } catch (error) {
      console.error('❌ Erreur calcul statistiques enrichies:', error);
      return this.getDefaultStats();
    }
  }

  private calculateOrderFrequency(orders: Order[]) {
    if (orders.length < 2) {
      return {
        orderFrequency: {
          averageDaysBetweenOrders: 0,
          mostActiveDay: 'N/A',
          mostActiveMonth: 'N/A'
        }
      };
    }

    // Calculer les jours entre commandes
    const sortedDates = orders
      .map(o => new Date(o.date || new Date().toISOString()))
      .sort((a, b) => b.getTime() - a.getTime());

    const daysBetween = [];
    for (let i = 1; i < sortedDates.length; i++) {
      const days = Math.floor((sortedDates[i - 1].getTime() - sortedDates[i].getTime()) / (1000 * 60 * 60 * 24));
      daysBetween.push(days);
    }

    const averageDaysBetweenOrders = daysBetween.length > 0 
      ? daysBetween.reduce((sum, days) => sum + days, 0) / daysBetween.length 
      : 0;

    // Calculer le jour le plus actif
    const dayCounts = orders.reduce((acc, order) => {
      const day = new Date(order.date).toLocaleDateString('fr-FR', { weekday: 'long' });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostActiveDay = Object.entries(dayCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    // Calculer le mois le plus actif
    const monthCounts = orders.reduce((acc, order) => {
      const month = new Date(order.date).toLocaleDateString('fr-FR', { month: 'long' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostActiveMonth = Object.entries(monthCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    return {
      orderFrequency: {
        averageDaysBetweenOrders,
        mostActiveDay,
        mostActiveMonth
      }
    };
  }

  private calculateFavoriteProducts(orders: Order[]) {
    const productCounts = new Map<string, { count: number; totalSpent: number; name: string }>();

    orders.forEach(order => {
      order.products.forEach(product => {
        const existing = productCounts.get(product.id);
        if (existing) {
          existing.count += product.quantity;
          existing.totalSpent += product.price * product.quantity;
        } else {
          productCounts.set(product.id, {
            count: product.quantity,
            totalSpent: product.price * product.quantity,
            name: product.name
          });
        }
      });
    });

    return Array.from(productCounts.entries())
      .map(([productId, data]) => ({
        productId,
        productName: data.name,
        orderCount: data.count,
        totalSpent: data.totalSpent
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
  }

  private calculateGrowth(orders: Order[]) {
    // Simplifié - retourne 0 pour l'instant
    return {
      daily: 0,
      weekly: 0,
      monthly: 0
    };
  }

  private getDefaultStats(): EnhancedStats {
    return {
      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0,
      orderFrequency: { averageDaysBetweenOrders: 0, mostActiveDay: 'N/A', mostActiveMonth: 'N/A' },
      favoriteProducts: [],
      orderGrowth: { daily: 0, weekly: 0, monthly: 0 },
      revenueGrowth: { daily: 0, weekly: 0, monthly: 0 },
      failedOrders: 0
    };
  }
}
