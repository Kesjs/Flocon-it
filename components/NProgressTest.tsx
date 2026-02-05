"use client";

import { useNProgress } from "@/hooks/useNProgress";

export function NProgressTest() {
  const { start, done } = useNProgress();

  const testProgress = async () => {
    console.log('🧪 Test NProgress');
    start();
    
    // Simuler une opération de 2 secondes
    setTimeout(() => {
      done();
      console.log('✅ NProgress terminé');
    }, 2000);
  };

  return (
    <button
      onClick={testProgress}
      className="fixed bottom-4 right-4 bg-rose-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 hover:bg-rose-700 transition-colors"
    >
      Test NProgress (2s)
    </button>
  );
}
