'use client';

import { Search, Bell, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useLiff } from '../../hooks/useLiff';

export default function Header() {
  const { profile, logout } = useLiff();

  // Refactor conditional rendering into a variable for clarity
  const profileDisplay = profile?.pictureUrl ? (
    <Image
      src={profile.pictureUrl}
      alt={profile.displayName || 'User profile picture'}
      width={36}
      height={36}
      className="rounded-full"
    />
  ) : (
    <div className="w-9 h-9 bg-gray-700 rounded-full" />
  );

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
      <div className="flex items-center gap-3">
        {profileDisplay}
        <div>
          <p className="text-sm text-gray-400">Welcome back,</p>
          <h1 className="font-semibold text-white">{profile?.displayName}</h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Search size={24} className="text-gray-400" />
        <Bell size={24} className="text-gray-400" />
        <button onClick={logout} title="Logout" className="text-gray-400 hover:text-white transition-colors">
          <LogOut size={24} />
        </button>
      </div>
    </header>
  );
}