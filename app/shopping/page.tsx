'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ShoppingPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full bg-gray-900">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin h-12 w-12 text-white" />
          <p className="text-white text-lg">Loading Interlink Shop...</p>
        </div>
      )}
      <iframe
        src="https://thai-shop-builder.vercel.app/"
        title="Shopping"
        className={`w-full h-full border-0 ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}