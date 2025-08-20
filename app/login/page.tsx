'use client';

import { useLiff } from '../../hooks/useLiff';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import InstallPwaButton from '../components/InstallPwaButton';

export default function LoginPage() {
  const { login, loading, error } = useLiff();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <Loader2 className="animate-spin h-12 w-12 mb-4" />
        <p>Initializing...</p>
      </div>
    );
  }

  if (error) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <p className="text-red-400 text-center">Error: {error}</p>
        <p className="text-yellow-400 mt-2 text-center">Please make sure your LIFF ID is set correctly in the .env.local file and you are opening this in the LINE app.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <div className="text-center flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to Contacts</h1>
        <p className="text-gray-400 mb-8">Please log in to manage your contacts.</p>
        <button
          onClick={login}
          className="w-full max-w-xs flex items-center justify-center gap-3 px-4 py-3 bg-[#00B900] text-white font-bold rounded-lg hover:bg-[#00A300] transition-colors"
        >
          <Image src="https://img.icons8.com/color/48/line-me.png" alt="LINE logo" width={28} height={28} />
          Log in with LINE
        </button>
        <InstallPwaButton />
      </div>
    </div>
  );
}