export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          user_email: string
          total: number
          status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
          fst_status?: 'pending' | 'declared' | 'confirmed' | 'rejected'
          payment_declared_at?: string
          payment_confirmed_at?: string
          created_at: string
          updated_at: string
          shipping_address?: Json
          billing_address?: Json
          items?: Json
          stripe_payment_intent_id?: string
          stripe_checkout_session_id?: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Row']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
