'use client';

import GlobalLoader from '@/components/ui/GlobalLoader';
import { useSimpleLoading } from '@/components/SimpleLoadingProvider';

export default function GlobalLoaderWrapper() {
  const { isLoading, loadingText } = useSimpleLoading();
  
  return <GlobalLoader isLoading={isLoading} text={loadingText} />;
}
