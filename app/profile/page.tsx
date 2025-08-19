'use client';

import { useLiff } from '../../hooks/useLiff';
import Image from 'next/image';
import { Loader2, LogIn } from 'lucide-react';

export default function ProfilePage() {
  const { profile, loading, isLoggedIn, login } = useLiff();

  // แสดงสถานะกำลังโหลด
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4 h-full">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // แสดงปุ่มให้ล็อกอิน หากยังไม่ได้ล็อกอิน
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4 h-full">
        <p className="mb-4 text-gray-400">กรุณาเข้าสู่ระบบเพื่อดูโปรไฟล์</p>
        <button
          onClick={login}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <LogIn size={18} />
          <span>Login with LINE</span>
        </button>
      </div>
    );
  }

  // แสดงข้อมูลโปรไฟล์
  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4 text-center animate-in fade-in duration-500">
      {profile?.pictureUrl && (
        <Image
          src={profile.pictureUrl}
          alt="LINE Profile Picture"
          width={128}
          height={128}
          className="rounded-full border-4 border-gray-700 object-cover shadow-lg"
          priority
        />
      )}
      
      <h1 className="text-2xl font-bold text-white mt-4">
        {profile?.displayName}
      </h1>
      
      <div className="bg-gray-800 px-4 py-2 rounded-lg w-full max-w-xs">
        <p className="text-xs text-gray-400 uppercase tracking-wider">User ID</p>
        <p className="text-sm text-gray-200 font-mono break-all mt-1">
          {profile?.userId}
        </p>
      </div>
    </div>
  );
}