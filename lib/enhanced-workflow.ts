import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timestamp?: string;
  metadata?: any;
}

export interface OrderWorkflow {
  orderId: string;
  userId: string;
  userEmail: string;
  steps: WorkflowStep[];
  currentStep: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export class EnhancedWorkflow {
  // Créer un workflow pour une nouvelle commande
  static async createOrderWorkflow(orderId: string, userId: string, userEmail: string): Promise<OrderWorkflow> {
    const workflow: OrderWorkflow = {
      orderId,
      userId,
      userEmail,
      steps: [
        {
          id: 'order_created',
          name: 'Commande créée',
          description: 'La commande a été enregistrée avec succès',
          status: 'completed',
          timestamp: new Date().toISOString()
        },
        {
          id: 'payment_pending',
          name: 'Paiement en attente',
          description: 'En attente de la validation du paiement',
          status: 'pending'
        },
        {
          id: 'payment_confirmed',
          name: 'Paiement confirmé',
          description: 'Le paiement a été validé par l\'administration',
          status: 'pending'
        },
        {
          id: 'preparation',
          name: 'En préparation',
          description: 'La commande est en cours de préparation',
          status: 'pending'
        },
        {
          id: 'shipped',
          name: 'Expédiée',
          description: 'La commande a été expédiée',
          status: 'pending'
        },
        {
          id: 'delivered',
          name: 'Livrée',
          description: 'La commande a été livrée avec succès',
          status: 'pending'
        }
      ],
      currentStep: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Sauvegarder dans Supabase
    const { data, error } = await supabase
      .from('order_workflows')
      .insert(workflow)
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur création workflow:', error);
      throw error;
    }

    console.log('✅ Workflow créé pour commande:', orderId);
    return data as OrderWorkflow;
  }

  // Mettre à jour une étape du workflow
  static async updateWorkflowStep(
    orderId: string, 
    stepId: string, 
    status: WorkflowStep['status'],
    metadata?: any
  ): Promise<OrderWorkflow | null> {
    try {
      // Récupérer le workflow actuel
      const { data: workflow, error: fetchError } = await supabase
        .from('order_workflows')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (fetchError) {
        console.error('❌ Erreur récupération workflow:', fetchError);
        return null;
      }

      if (!workflow) {
        console.error('❌ Workflow non trouvé pour commande:', orderId);
        return null;
      }

      // Mettre à jour l'étape
      const updatedWorkflow = { ...workflow } as OrderWorkflow;
      const stepIndex = updatedWorkflow.steps.findIndex(step => step.id === stepId);
      
      if (stepIndex === -1) {
        console.error('❌ Étape non trouvée:', stepId);
        return null;
      }

      updatedWorkflow.steps[stepIndex] = {
        ...updatedWorkflow.steps[stepIndex],
        status,
        timestamp: new Date().toISOString(),
        metadata: metadata || updatedWorkflow.steps[stepIndex].metadata
      };

      // Mettre à jour l'étape actuelle si nécessaire
      if (status === 'completed' && stepIndex >= updatedWorkflow.currentStep) {
        updatedWorkflow.currentStep = stepIndex + 1;
      }

      // Vérifier si le workflow est terminé
      const completedSteps = updatedWorkflow.steps.filter(step => step.status === 'completed');
      updatedWorkflow.isCompleted = completedSteps.length === updatedWorkflow.steps.length;
      
      updatedWorkflow.updatedAt = new Date().toISOString();

      // Sauvegarder les modifications
      const { data: updatedData, error: updateError } = await supabase
        .from('order_workflows')
        .update(updatedWorkflow)
        .eq('order_id', orderId)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Erreur mise à jour workflow:', updateError);
        return null;
      }

      console.log(`✅ Étape ${stepId} mise à jour pour commande ${orderId}`);
      return updatedData as OrderWorkflow;

    } catch (error) {
      console.error('❌ Erreur mise à jour workflow:', error);
      return null;
    }
  }

  // Récupérer le workflow d'une commande
  static async getOrderWorkflow(orderId: string): Promise<OrderWorkflow | null> {
    try {
      const { data, error } = await supabase
        .from('order_workflows')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (error) {
        console.error('❌ Erreur récupération workflow:', error);
        return null;
      }

      return data as OrderWorkflow;
    } catch (error) {
      console.error('❌ Erreur récupération workflow:', error);
      return null;
    }
  }

  // Mettre à jour automatiquement le statut basé sur FST
  static async updateFromFstStatus(orderId: string, fstStatus: string): Promise<void> {
    try {
      let stepId: string;
      let status: WorkflowStep['status'];

      switch (fstStatus) {
        case 'pending':
          stepId = 'payment_pending';
          status = 'pending';
          break;
        case 'declared':
          stepId = 'payment_pending';
          status = 'in_progress';
          await this.updateWorkflowStep(orderId, stepId, status, {
            fst_status: fstStatus,
            message: 'Paiement déclaré, en attente de validation'
          });
          stepId = 'payment_confirmed';
          status = 'pending';
          break;
        case 'confirmed':
          stepId = 'payment_confirmed';
          status = 'completed';
          await this.updateWorkflowStep(orderId, stepId, status, {
            fst_status: fstStatus,
            message: 'Paiement confirmé par l\'administration'
          });
          
          // Passer automatiquement à l'étape de préparation
          stepId = 'preparation';
          status = 'in_progress';
          break;
        case 'rejected':
          stepId = 'payment_pending';
          status = 'failed';
          await this.updateWorkflowStep(orderId, stepId, status, {
            fst_status: fstStatus,
            message: 'Paiement rejeté par l\'administration'
          });
          return;
        default:
          return;
      }

      await this.updateWorkflowStep(orderId, stepId, status, {
        fst_status: fstStatus,
        message: `Statut FST mis à jour: ${fstStatus}`
      });

    } catch (error) {
      console.error('❌ Erreur mise à jour depuis FST:', error);
    }
  }

  // Obtenir toutes les commandes avec leur workflow
  static async getOrdersWithWorkflows(userEmail: string): Promise<Array<{order: any, workflow: OrderWorkflow | null}>> {
    try {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('❌ Erreur récupération commandes:', ordersError);
        return [];
      }

      const result = [];
      
      for (const order of orders || []) {
        const workflow = await this.getOrderWorkflow(order.id);
        result.push({ order, workflow });
      }

      return result;
    } catch (error) {
      console.error('❌ Erreur récupération commandes avec workflows:', error);
      return [];
    }
  }

  // Calculer les statistiques de workflow
  static async getWorkflowStats(userEmail?: string): Promise<{
    totalOrders: number;
    completedOrders: number;
    inProgressOrders: number;
    failedOrders: number;
    averageCompletionTime: number;
    stepStats: Array<{stepId: string, stepName: string, completedCount: number, averageTime: number}>;
  }> {
    try {
      let query = supabase.from('order_workflows').select('*');
      
      if (userEmail) {
        query = query.eq('user_email', userEmail);
      }

      const { data: workflows, error } = await query;

      if (error) {
        console.error('❌ Erreur récupération workflows:', error);
        return {
          totalOrders: 0,
          completedOrders: 0,
          inProgressOrders: 0,
          failedOrders: 0,
          averageCompletionTime: 0,
          stepStats: []
        };
      }

      const totalOrders = workflows?.length || 0;
      const completedOrders = workflows?.filter(w => w.is_completed).length || 0;
      const inProgressOrders = workflows?.filter(w => !w.is_completed && w.current_step > 0).length || 0;
      const failedOrders = workflows?.filter(w => w.steps.some((s: WorkflowStep) => s.status === 'failed')).length || 0;

      // Calculer les statistiques par étape
      const stepStats: Array<{stepId: string, stepName: string, completedCount: number, averageTime: number}> = [];
      
      // ... calculs détaillés par étape

      return {
        totalOrders,
        completedOrders,
        inProgressOrders,
        failedOrders,
        averageCompletionTime: 0, // À calculer
        stepStats
      };

    } catch (error) {
      console.error('❌ Erreur calcul statistiques workflow:', error);
      return {
        totalOrders: 0,
        completedOrders: 0,
        inProgressOrders: 0,
        failedOrders: 0,
        averageCompletionTime: 0,
        stepStats: []
      };
    }
  }
}
