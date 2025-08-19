'use client';

// Import CSS ของ Leaflet เพื่อให้แผนที่แสดงผลถูกต้อง
import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { StoreMarker } from '@/app/types/stores';
import L from 'leaflet';

// --- ส่วนแก้ไขปัญหาไอคอนของ Marker ไม่แสดง ---
// ปัญหานี้เกิดขึ้นบ่อยเมื่อใช้ Leaflet กับเครื่องมืออย่าง Next.js
// โค้ดส่วนนี้เป็นการกำหนดค่าไอคอนเริ่มต้นให้ถูกต้อง
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;
// --- จบส่วนแก้ไขปัญหาไอคอน ---

interface StoreMapProps {
  stores: StoreMarker[];
  onMarkerClick: (store: StoreMarker) => void;
}

export default function StoreMap({ stores, onMarkerClick }: StoreMapProps) {
  // กำหนดจุดศูนย์กลางของแผนที่ (ถ้ามีร้านค้า ให้ใช้ร้านแรกเป็นจุดกลาง)
  const mapCenter: [number, number] = stores.length > 0 
    ? [stores[0].position.lat, stores[0].position.lng] 
    : [13.7563, 100.5018]; // ค่าเริ่มต้น: กรุงเทพมหานคร

  return (
    <div className="relative w-full h-[calc(100vh-150px)] rounded-lg overflow-hidden">
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
        className="z-0" // กำหนด z-index เพื่อให้แสดงผลอยู่หลังสุด
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stores.map((store) => (
          <Marker
            key={store.id}
            position={[store.position.lat, store.position.lng]}
            eventHandlers={{
              click: () => {
                onMarkerClick(store);
              },
            }}
          >
            <Popup>
              {store.name}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}