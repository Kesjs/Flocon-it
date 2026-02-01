"use client";

import { Suspense, useState } from "react";
import BoutiqueContent from "./BoutiqueContent";
import BoutiqueOrganisee from "@/components/BoutiqueOrganisee";

export default function BoutiquePage() {
  const [viewMode, setViewMode] = useState<'classic' | 'organized'>('organized');

  return (
    <div>
      {/* Content */}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-lg">Chargement...</div></div>}>
        {viewMode === 'organized' ? (
          <BoutiqueOrganisee onViewModeChange={setViewMode} />
        ) : (
          <BoutiqueContent onViewModeChange={setViewMode} />
        )}
      </Suspense>
    </div>
  );
}
