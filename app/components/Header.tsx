import { Search, Bell, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
      <Link href="/profile" className="flex items-center gap-2">
        <UserCircle size={28} className="text-gray-400" />
        <h1 className="text-lg font-semibold">สวัสดี</h1>
      </Link>
      <div className="flex items-center gap-4">
        <Search size={24} className="text-gray-400" />
        <Bell size={24} className="text-gray-400" />
        <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
          N
        </div>
      </div>
    </header>
  );
}