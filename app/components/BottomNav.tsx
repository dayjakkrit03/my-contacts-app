'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gift, ScanLine, Package, User } from 'lucide-react';

const navItems = [
  { href: '/', label: 'หน้าหลัก', icon: Home },
  { href: '/privileges', label: 'สิทธิพิเศษ', icon: Gift },
  { href: '/scan', label: 'สแกน', icon: ScanLine },
  { href: '/packages', label: 'แพ็กเกจ', icon: Package },
  { href: '/profile', label: 'โปรไฟล์', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-gray-900 border-t border-gray-800">
      <div className="flex justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors duration-200 ${isActive ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}>
              <item.icon size={24} />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}