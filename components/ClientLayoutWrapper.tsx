"use client";

import { usePageLoader } from "@/hooks/usePageLoader";
import PageLoader from "@/components/PageLoader";
import { useState, useEffect } from "react";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const { isLoading } = usePageLoader();
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  useEffect(() => {
    // Réduire le temps de chargement initial à 1 seconde pour éviter le timeout
    const timer = setTimeout(() => {
      setShowInitialLoader(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const shouldShowLoader = isLoading || showInitialLoader;

  return (
    <>
      <PageLoader isLoading={shouldShowLoader} />
      {!shouldShowLoader && children}
    </>
  );
}
