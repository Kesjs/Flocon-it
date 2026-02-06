import { createClient } from '@supabase/supabase-js';
import { Order } from './order-storage';
import { EnhancedWorkflow, OrderWorkflow } from './enhanced-workflow';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface EnhancedStats {
  // Statistiques de base
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  
  // Statistiques par statut
  deliveredOrders: number;
  preparingOrders: number;
  pendingOrders: number;
  processingOrders: number;
  failedOrders: number;
  
  // Statistiques temporelles
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
  yearOrders: number;
  
  // Statistiques financières
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  yearRevenue: number;
  
  // Statistiques de workflow
  workflowCompletionRate: number;
  averageWorkflowTime: number;
  stepCompletionRates: Array<{
    stepId: string;
    stepName: string;
    completionRate: number;
    averageTime: number;
  }>;
  
  // Tendances
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
  
  // Préférences utilisateur
  favoriteProducts: Array<{
    productId: string;
    productName: string;
    orderCount: number;
    totalSpent: number;
  }>;
  
  orderFrequency: {
    averageDaysBetweenOrders: number;
    mostActiveDay: string;
    mostActiveMonth: string;
  };
}

export class EnhancedStatsManager {
  private userId: string;
  private userEmail: string;

  constructor(userId: string, userEmail: string) {
    this.userId = userId;
    this.userEmail = userEmail;
  }

  // Calculer toutes les statistiques enrichies
  async calculateAllStats(): Promise<EnhancedStats> {
    try {
      console.log('📊 Calcul des statistiques enrichies pour:', this.userEmail);
      
      // Récupérer les commandes et workflows
      const orders = await this.getUserOrders();
      const workflows = await this.getUserWorkflows();
      
      // Calculer les statistiques de base
      const baseStats = this.calculateBaseStats(orders);
      
      // Calculer les statistiques temporelles
      const temporalStats = this.calculateTemporalStats(orders);
      
      // Calculer les statistiques financières
      const financialStats = this.calculateFinancialStats(orders);
      
      // Calculer les statistiques de workflow
      const workflowStats = await this.calculateWorkflowStats(workflows);
      
      // Calculer les tendances
      const trends = await this.calculateTrends(orders);
      
      // Calculer les préférences utilisateur
      const preferences = this.calculateUserPreferences(orders);
      
      // Calculer la fréquence des commandes
      const frequency = this.calculateOrderFrequency(orders);
      
      return {
        ...baseStats,
        ...temporalStats,
        ...financialStats,
        ...workflowStats,
        ...trends,
        ...preferences,
        ...frequency
      };
      
    } catch (error) {
      console.error('❌ Erreur calcul statistiques enrichies:', error);
      return this.getDefaultStats();
    }
  }

  // Récupérer les commandes utilisateur
  private async getUserOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_email', this.userEmail)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur récupération commandes:', error);
        return [];
      }

      return data?.map(order => ({
        id: order.id,
        userId: this.userId,
        date: order.created_at || new Date().toISOString(),
        status: this.mapFstStatusToClientStatus(order.fst_status),
        total: order.total,
        items: order.items,
        products: order.products || [],
        shippingAddress: order.shippingAddress || {
          name: 'Client',
          address: 'Adresse à compléter',
          city: 'Ville',
          postalCode: '00000',
          phone: 'Téléphone'
        }
      })) || [];

    } catch (error) {
      console.error('❌ Erreur getUserOrders:', error);
      return [];
    }
  }

  // Récupérer les workflows utilisateur
  private async getUserWorkflows(): Promise<OrderWorkflow[]> {
    try {
      const { data, error } = await supabase
        .from('order_workflows')
        .select('*')
        .eq('user_email', this.userEmail)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur récupération workflows:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Erreur getUserWorkflows:', error);
      return [];
    }
  }

  // Calculer les statistiques de base
  private calculateBaseStats(orders: Order[]) {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    const deliveredOrders = orders.filter(o => o.status === 'Livré').length;
    const preparingOrders = orders.filter(o => o.status === 'En préparation').length;
    const pendingOrders = orders.filter(o => o.status === 'En attente').length;
    const processingOrders = orders.filter(o => o.status === 'En cours').length;
    const rejectedOrders = orders.filter(o => o.status === 'Rejetée').length;

    return {
      totalOrders,
      totalSpent,
      averageOrderValue,
      deliveredOrders,
      preparingOrders,
      pendingOrders,
      processingOrders,
      failedOrders: rejectedOrders
    };
  }

  // Calculer les statistiques temporelles
  private calculateTemporalStats(orders: Order[]) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    const todayOrders = orders.filter(o => new Date(o.date) >= today).length;
    const weekOrders = orders.filter(o => new Date(o.date) >= weekAgo).length;
    const monthOrders = orders.filter(o => new Date(o.date) >= monthAgo).length;
    const yearOrders = orders.filter(o => new Date(o.date) >= yearAgo).length;

    const todayRevenue = orders
      .filter(o => new Date(o.date) >= today)
      .reduce((sum, o) => sum + o.total, 0);
    
    const weekRevenue = orders
      .filter(o => new Date(o.date) >= weekAgo)
      .reduce((sum, o) => sum + o.total, 0);
    
    const monthRevenue = orders
      .filter(o => new Date(o.date) >= monthAgo)
      .reduce((sum, o) => sum + o.total, 0);
    
    const yearRevenue = orders
      .filter(o => new Date(o.date) >= yearAgo)
      .reduce((sum, o) => sum + o.total, 0);

    return {
      todayOrders,
      weekOrders,
      monthOrders,
      yearOrders,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      yearRevenue
    };
  }

  // Calculer les statistiques financières
  private calculateFinancialStats(orders: Order[]) {
    // Déjà calculées dans calculateTemporalStats
    return {};
  }

  // Calculer les statistiques de workflow
  private async calculateWorkflowStats(workflows: OrderWorkflow[]) {
    if (workflows.length === 0) {
      return {
        workflowCompletionRate: 0,
        averageWorkflowTime: 0,
        stepCompletionRates: []
      };
    }

    const completedWorkflows = workflows.filter(w => w.isCompleted);
    const workflowCompletionRate = (completedWorkflows.length / workflows.length) * 100;

    // Calculer le temps moyen de complétion
    const completionTimes = completedWorkflows.map(w => {
      const created = new Date(w.createdAt).getTime();
      const lastStep = w.steps.find(s => s.status === 'completed' && s.timestamp);
      if (!lastStep) return 0;
      return new Date(lastStep.timestamp).getTime() - created;
    }).filter(t => t > 0);

    const averageWorkflowTime = completionTimes.length > 0 
      ? completionTimes.reduce((sum, t) => sum + t, 0) / completionTimes.length 
      : 0;

    // Calculer les taux de complétion par étape
    const stepStats = [
      { stepId: 'order_created', stepName: 'Commande créée' },
      { stepId: 'payment_pending', stepName: 'Paiement en attente' },
      { stepId: 'payment_confirmed', stepName: 'Paiement confirmé' },
      { stepId: 'preparation', stepName: 'En préparation' },
      { stepId: 'shipped', stepName: 'Expédiée' },
      { stepId: 'delivered', stepName: 'Livrée' }
    ].map(step => {
      const stepInWorkflows = workflows.map(w => w.steps.find(s => s.id === step.stepId)).filter(Boolean);
      const completedSteps = stepInWorkflows.filter(s => s!.status === 'completed');
      const completionRate = stepInWorkflows.length > 0 ? (completedSteps.length / stepInWorkflows.length) * 100 : 0;
      
      return {
        stepId: step.stepId,
        stepName: step.stepName,
        completionRate,
        averageTime: 0 // À calculer avec les timestamps
      };
    });

    return {
      workflowCompletionRate,
      averageWorkflowTime,
      stepCompletionRates: stepStats
    };
  }

  // Calculer les tendances
  private async calculateTrends(orders: Order[]) {
    // Calcul des tendances basé sur les périodes précédentes
    const now = new Date();
    const thisMonth = orders.filter(o => {
      const orderDate = new Date(o.date);
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    });

    const lastMonth = orders.filter(o => {
      const orderDate = new Date(o.date);
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
      return orderDate.getMonth() === lastMonthDate.getMonth() && orderDate.getFullYear() === lastMonthDate.getFullYear();
    });

    const thisMonthRevenue = thisMonth.reduce((sum, o) => sum + o.total, 0);
    const lastMonthRevenue = lastMonth.reduce((sum, o) => sum + o.total, 0);

    const monthlyGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    return {
      orderGrowth: {
        daily: 0, // À calculer avec comparaison jour J-1
        weekly: 0, // À calculer avec comparaison semaine S-1
        monthly: lastMonth.length > 0 ? ((thisMonth.length - lastMonth.length) / lastMonth.length) * 100 : 0
      },
      revenueGrowth: {
        daily: 0,
        weekly: 0,
        monthly: monthlyGrowth
      }
    };
  }

  // Calculer les préférences utilisateur
  private calculateUserPreferences(orders: Order[]) {
    const productMap = new Map<string, { name: string; count: number; total: number }>();

    orders.forEach(order => {
      order.products.forEach(product => {
        const existing = productMap.get(product.id) || { name: product.name, count: 0, total: 0 };
        existing.count += product.quantity;
        existing.total += product.price * product.quantity;
        productMap.set(product.id, existing);
      });
    });

    const favoriteProducts = Array.from(productMap.entries())
      .map(([productId, data]) => ({
        productId,
        productName: data.name,
        orderCount: data.count,
        totalSpent: data.total
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    return { favoriteProducts };
  }

  // Calculer la fréquence des commandes
  private calculateOrderFrequency(orders: Order[]) {
    if (orders.length < 2) {
      return {
        averageDaysBetweenOrders: 0,
        mostActiveDay: 'N/A',
        mostActiveMonth: 'N/A'
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

    const averageDaysBetweenOrders = daysBetween.reduce((sum, days) => sum + days, 0) / daysBetween.length;

    // Calculer le jour le plus actif
    const dayCounts = new Map<string, number>();
    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    
    orders.forEach(order => {
      const orderDate = new Date(order.date || new Date().toISOString());
      const dayName = dayNames[orderDate.getDay()];
      dayCounts.set(dayName, (dayCounts.get(dayName) || 0) + 1);
    });

    const mostActiveDay = Array.from(dayCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Calculer le mois le plus actif
    const monthCounts = new Map<string, number>();
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    
    orders.forEach(order => {
      const orderDate = new Date(order.date || new Date().toISOString());
      const monthName = monthNames[orderDate.getMonth()];
      monthCounts.set(monthName, (monthCounts.get(monthName) || 0) + 1);
    });

    const mostActiveMonth = Array.from(monthCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
      averageDaysBetweenOrders,
      mostActiveDay,
      mostActiveMonth
    };
  }

  // Mapper le statut FST vers le statut client
  private mapFstStatusToClientStatus(fstStatus?: string): Order['status'] {
    switch (fstStatus) {
      case 'confirmed':
        return 'Livré';
      case 'declared':
        return 'En préparation';
      case 'processing':
        return 'En cours';
      case 'rejected':
        return 'Rejetée';
      default:
        return 'En attente';
    }
  }

  // Obtenir les statistiques par défaut
  private getDefaultStats(): EnhancedStats {
    return {
      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0,
      deliveredOrders: 0,
      preparingOrders: 0,
      pendingOrders: 0,
      processingOrders: 0,
      failedOrders: 0,
      todayOrders: 0,
      weekOrders: 0,
      monthOrders: 0,
      yearOrders: 0,
      todayRevenue: 0,
      weekRevenue: 0,
      monthRevenue: 0,
      yearRevenue: 0,
      workflowCompletionRate: 0,
      averageWorkflowTime: 0,
      stepCompletionRates: [],
      orderGrowth: { daily: 0, weekly: 0, monthly: 0 },
      revenueGrowth: { daily: 0, weekly: 0, monthly: 0 },
      favoriteProducts: [],
      orderFrequency: { averageDaysBetweenOrders: 0, mostActiveDay: 'N/A', mostActiveMonth: 'N/A' }
    };
  }
}
