'use client';

import { Search, Bell, LogOut, X } from 'lucide-react';
import Image from 'next/image';
import { useLiff } from '../../hooks/useLiff';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Header() {
  const { profile, logout } = useLiff();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Trim the query to avoid empty searches
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/?q=${encodeURIComponent(trimmedQuery)}`);
    } else {
      // If the search is empty, go back to the homepage without query params
      router.push('/');
    }
    setIsSearchOpen(false); // Close search bar after submitting
  };

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
    <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800 min-h-[73px]">
      {isSearchOpen ? (
        <form onSubmit={handleSearchSubmit} className="flex items-center w-full gap-2 animate-in fade-in duration-300">
          <Search size={22} className="text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, email..."
            className="w-full px-2 py-1 text-white bg-transparent focus:outline-none"
            autoFocus
          />
          <button type="button" onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </form>
      ) : (
        <>
          <div className="flex items-center gap-3 animate-in fade-in duration-300">
            {profileDisplay}
            <div>
              <p className="text-sm text-gray-400">Welcome back,</p>
              <h1 className="font-semibold text-white">{profile?.displayName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4 animate-in fade-in duration-300">
            <button onClick={() => setIsSearchOpen(true)} className="text-gray-400 hover:text-white transition-colors">
              <Search size={24} />
            </button>
            <Bell size={24} className="text-gray-400" />
            <button onClick={logout} title="Logout" className="text-gray-400 hover:text-white transition-colors">
              <LogOut size={24} />
            </button>
          </div>
        </>
      )}
    </header>
  );
}