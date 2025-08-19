'use client';

import { useLiff } from '@/hooks/useLiff';
import Image from 'next/image';
import { Loader2, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfilePage() {
  const { profile, loading, isLoggedIn, login, logout } = useLiff();

  // แสดงสถานะกำลังโหลด
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4 h-full">
        <Loader2 className="w-12 h-12 animate-spin text-gray-500" />
        <p className="mt-4 text-gray-400">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  // แสดงปุ่มให้ล็อกอิน หากยังไม่ได้ล็อกอิน
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4 h-full">
        <p className="mb-4 text-gray-400">กรุณาเข้าสู่ระบบเพื่อดูโปรไฟล์</p>
        <Button
          onClick={login}
          className="bg-[#06C755] hover:bg-[#05b34c] text-white"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Login with LINE
        </Button>
      </div>
    );
  }

  // แสดงข้อมูลโปรไฟล์
  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 animate-in fade-in duration-500">
      <Card className="w-full max-w-md mx-auto border-gray-700 bg-gray-800/50 text-white shadow-lg backdrop-blur-sm">
        <CardHeader className="items-center text-center">
          {profile?.pictureUrl && (
            <Avatar className="w-28 h-28 border-4 border-gray-600">
              <AvatarImage src={profile.pictureUrl} alt="Profile Picture" />
              <AvatarFallback className="bg-gray-700 text-gray-300 text-4xl">
                {profile?.displayName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <CardTitle className="text-2xl mt-4">{profile?.displayName}</CardTitle>
          {profile?.statusMessage && (
            <CardDescription className="text-gray-400 mt-1 px-4">
              {profile.statusMessage}
            </Description>
          )}
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-6">
          <div className="bg-gray-900/70 p-3 rounded-lg">
            <label className="text-xs text-gray-400 uppercase">User ID</label>
            <p className="font-mono text-sm break-all mt-1">{profile?.userId}</p>
          </div>
          <Button onClick={logout} variant="destructive" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            ออกจากระบบ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}