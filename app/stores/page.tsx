'use client';

import { useState } from 'react';
import StoreMap from '@/app/components/StoreMap';
import StoreInfoCard from '@/app/components/StoreInfoCard';
import type { Store, StoreMarker } from '@/app/types/stores';

const mockStores: Store[] = [
  {
    id: 1,
    name: 'ร้านกาแฟ คนตื่นเช้า',
    address: '123 ถนนสุขุมวิท, คลองเตย, กรุงเทพฯ 10110',
    phone: '081-234-5678',
    email: 'contact@earlybird.coffee',
    lineId: '@earlybird',
    hours: 'เปิด 07:00 - 17:00',
    position: { lat: 13.729, lng: 100.581 },
  },
  {
    id: 2,
    name: 'หนังสือมือสอง By The Book',
    address: '45/6 ถนนพระราม 4, ปทุมวัน, กรุงเทพฯ 10330',
    phone: '02-987-6543',
    email: 'info@bythebook.th',
    lineId: '@bythebook',
    hours: 'เปิด 10:00 - 20:00',
    position: { lat: 13.731, lng: 100.529 },
  },
  {
    id: 3,
    name: 'จักรยาน Fix It Fast',
    address: '789 ซอยอารีย์, พญาไท, กรุงเทพฯ 10400',
    phone: '099-111-2222',
    email: 'service@fixitfast.bike',
    lineId: '@fixitfast',
    hours: 'เปิด 09:00 - 18:00 (ปิดวันจันทร์)',
    position: { lat: 13.780, lng: 100.543 },
  },
  {
    id: 4,
    name: 'สวนผักออร์แกนิก Green Thumb',
    address: '101 หมู่ 5, บางกระเจ้า, พระประแดง, สมุทรปราการ 10130',
    phone: '065-555-4444',
    email: 'farm@greenthumb.co.th',
    lineId: '@greenthumbfarm',
    hours: 'เปิด 08:00 - 16:00 (เฉพาะ ส-อา)',
    position: { lat: 13.684, lng: 100.572 },
  },
];

export default function StoresPage() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const handleMarkerClick = (storeMarker: StoreMarker) => {
    const fullStoreInfo = mockStores.find(s => s.id === storeMarker.id);
    if (fullStoreInfo) {
      setSelectedStore(fullStoreInfo);
    }
  };

  const handleCloseCard = () => {
    setSelectedStore(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📍 ค้นหาร้านค้าไกล้คุณ</h1>
      <StoreMap stores={mockStores} onMarkerClick={handleMarkerClick} />
      {selectedStore && (
        <StoreInfoCard store={selectedStore} onClose={handleCloseCard} />
      )}
    </div>
  );
}