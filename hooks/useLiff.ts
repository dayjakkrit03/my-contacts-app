'use client';

import { useState, useEffect } from 'react';
import type { Liff } from '@line/liff';

interface LiffUserProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export function useLiff() {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [profile, setProfile] = useState<LiffUserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        const liff = (await import('@line/liff')).default;
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
        
        setLiffObject(liff);

        if (liff.isLoggedIn()) {
          setIsLoggedIn(true);
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
        } else {
          setIsLoggedIn(false);
        }
      } catch (e: any) {
        console.error('LIFF Initialization failed', e);
        setError(`LIFF Initialization failed: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    initializeLiff();
  }, []);

  const login = async () => {
    if (liffObject) {
      liffObject.login();
    }
  };

  const logout = () => {
    if (liffObject) {
      liffObject.logout();
      window.location.reload();
    }
  };

  return { liffObject, profile, isLoggedIn, error, loading, login, logout };
}