'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function TrackRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      router.replace(`/tracking?q=${encodeURIComponent(q)}`);
    } else {
      router.replace('/tracking');
    }
  }, [router, searchParams]);

  return null;
}

export default function TrackRedirectPage() {
  return (
    <Suspense fallback={null}>
      <TrackRedirectContent />
    </Suspense>
  );
}
