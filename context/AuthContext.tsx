"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isRedirecting: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  checkEmailExists: (email: string) => Promise<{ exists: boolean; error: AuthError | null }>;
  confirmEmail: (accessToken: string, refreshToken: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase client not available, auth features disabled');
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('📱 Initial session:', session?.user?.email || 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signUp = async (email: string, password: string, metadata?: any) => {
    const supabase = createClient();
    if (!supabase) {
      return { error: { message: 'Service d\'authentification non disponible' } as AuthError };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const supabase = createClient();
    if (!supabase) {
      return { error: { message: 'Service d\'authentification non disponible' } as AuthError };
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error) {
      // Vérifier si un callbackUrl est présent dans les paramètres d'URL
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get('callbackUrl');
      
      if (callbackUrl) {
        setIsRedirecting(true);
        setTimeout(() => {
          router.push(callbackUrl);
          setIsRedirecting(false);
        }, 800); // Délai pour montrer le feedback
      } else {
        router.refresh();
      }
    } else {
      router.refresh();
    }
    
    return { error };
  };

  const signOut = async () => {
    const supabase = createClient();
    if (!supabase) {
      return;
    }
    await supabase.auth.signOut();
    router.refresh();
  };

  const resetPassword = async (email: string) => {
    const supabase = createClient();
    if (!supabase) {
      return { error: { message: 'Service d\'authentification non disponible' } as AuthError };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const checkEmailExists = async (email: string) => {
    const supabase = createClient();
    if (!supabase) {
      return { exists: false, error: { message: 'Service d\'authentification non disponible' } as AuthError };
    }
    try {
      // Utiliser signIn pour vérifier si l'email existe
      // Si l'email existe, on obtiendra une erreur de mot de passe incorrect
      // Si l'email n'existe pas, on obtiendra une erreur "Invalid login credentials"
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-password-for-check-only',
      });
      
      // Si l'erreur contient "Invalid login credentials", l'email n'existe pas
      if (error?.message?.includes('Invalid login credentials')) {
        return { exists: false, error: null };
      }
      
      // Si l'erreur contient "Invalid password", l'email existe mais le mot de passe est faux
      if (error?.message?.includes('Invalid password')) {
        return { exists: true, error: null };
      }
      
      // Autre cas, on retourne l'erreur
      return { exists: false, error };
    } catch (err) {
      return { exists: false, error: err as AuthError };
    }
  };

  const confirmEmail = async (accessToken: string, refreshToken: string) => {
    const supabase = createClient();
    if (!supabase) {
      return { error: { message: 'Service d\'authentification non disponible' } as AuthError };
    }
    
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    
    if (!error) {
      router.refresh();
    }
    
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    isRedirecting,
    signUp,
    signIn,
    signOut,
    resetPassword,
    checkEmailExists,
    confirmEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
