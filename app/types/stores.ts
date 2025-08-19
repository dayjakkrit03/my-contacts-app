export type Store = {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  lineId: string;
  hours: string;
  position: { lat: number; lng: number };
};

// ประเภทข้อมูลสำหรับหมุดบนแผนที่ (ข้อมูลบางส่วน)
export type StoreMarker = Pick<Store, 'id' | 'name' | 'position'>;