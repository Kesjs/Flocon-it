"use client";

import NProgress from 'nprogress';
import { useCallback } from 'react';

// Hook pour contrôler NProgress manuellement
export function useNProgress() {
  const start = useCallback(() => {
    NProgress.start();
  }, []);

  const done = useCallback(() => {
    NProgress.done();
  }, []);

  const configure = useCallback((options: any) => {
    NProgress.configure(options);
  }, []);

  return { start, done, configure };
}
