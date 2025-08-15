'use client';

import { useLiff } from '../../hooks/useLiff';
import LoginPage from '../login/page';
import { Loader2 } from 'lucide-react';

export default function LiffProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading, error } = useLiff();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <Loader2 className="animate-spin h-12 w-12 mb-4" />
        <p>Loading Application...</p>
      </div>
    );
  }

  if (error) {
    // LoginPage will display a more specific error
    return <LoginPage />;
  }

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return <>{children}</>;
}