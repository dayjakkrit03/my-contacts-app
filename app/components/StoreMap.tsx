'use client';

import { MapPin } from 'lucide-react';
import type { StoreMarker } from '@/app/types/stores';

interface StoreMapProps {
  stores: StoreMarker[];
  onMarkerClick: (store: StoreMarker) => void;
}

export default function StoreMap({ stores, onMarkerClick }: StoreMapProps) {
  return (
    <div className="relative w-full h-[calc(100vh-150px)] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
      {/* This is a mock map background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
      
      {stores.map((store) => (
        <button
          key={store.id}
          className="absolute transform -translate-x-1/2 -translate-y-full"
          style={{ top: store.position.top, left: store.position.left }}
          onClick={() => onMarkerClick(store)}
          aria-label={`Go to ${store.name}`}
        >
          <MapPin className="h-8 w-8 text-red-500 fill-red-500 hover:scale-110 transition-transform" />
        </button>
      ))}
    </div>
  );
}