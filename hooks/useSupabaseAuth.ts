import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Utiliser l'instance Supabase existante pour la cohérence
    const supabaseClient = supabase;
    
    if (!supabaseClient) {
      console.log('❌ Supabase client non initialisé');
      setIsLoading(false);
      return;
    }
    
    const getAuth = async () => {
      try {
        console.log('🔍 Vérification auth Supabase avec instance existante...');
        
        // Utiliser getUser() au lieu de getSession() - plus fiable
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        console.log('👤 User result (getUser):', user);
        console.log('❌ User error (getUser):', userError);

        if (user) {
          setUser(user);
          console.log('✅ Utilisateur trouvé via getUser');
          setIsLoading(false);
          return user;
        }

        // Fallback localStorage
        const fallbackToken = getSupabaseTokenFromStorage();
        if (fallbackToken) {
          console.log('📦 Token trouvé dans localStorage');
          // Valider le token
          const { data: { user: validatedUser }, error: validateError } = await supabaseClient.auth.getUser(fallbackToken);
          if (validatedUser) {
            setUser(validatedUser);
            console.log('✅ Utilisateur validé via localStorage');
            setIsLoading(false);
            return validatedUser;
          }
        }

        console.log('❌ Aucune méthode d\'auth trouvée');
        setUser(null);
        setSession(null);
        setIsLoading(false);
        return null;

      } catch (error) {
        console.error('💥 Erreur getAuth:', error);
        setUser(null);
        setSession(null);
        setIsLoading(false);
        return null;
      }
    };

    getAuth();

    // Écouter les changements d'auth
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      console.log('🔄 Auth state change:', _event, session?.user?.email);
      setUser(session?.user || null);
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();

  }, []);

  const getSupabaseTokenFromStorage = (): string | null => {
    try {
      // Ancienne méthode
      const oldToken = localStorage.getItem('supabase.auth.token');
      if (oldToken) {
        console.log('📦 Token trouvé (ancienne méthode)');
        return oldToken;
      }

      // Nouvelle méthode
      const supabaseAuth = localStorage.getItem('supabase.auth');
      if (supabaseAuth) {
        const parsed = JSON.parse(supabaseAuth);
        console.log('📦 Token trouvé (nouvelle méthode)');
        return parsed.currentSession?.access_token || null;
      }

      return null;
    } catch (error) {
      console.error('Erreur lecture localStorage:', error);
      return null;
    }
  };

  return { user, session, isLoading };
};
