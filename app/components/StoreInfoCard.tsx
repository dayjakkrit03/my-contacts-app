'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, MapPin, Phone, Mail, MessageSquare, Clock } from 'lucide-react';

type Store = {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  lineId: string;
  hours: string;
  position: { top: string; left: string };
};

interface StoreInfoCardProps {
  store: Store;
  onClose: () => void;
}

export default function StoreInfoCard({ store, onClose }: StoreInfoCardProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm relative">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
        <CardHeader>
          <CardTitle>{store.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0" />
            <span>{store.address}</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
            <span>{store.phone}</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
            <span>{store.email}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-3 flex-shrink-0" />
            <span>{store.lineId}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-3 flex-shrink-0" />
            <span>{store.hours}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}