// app/components/ProfileImage.tsx
'use client'; // กำหนดให้เป็น Client Component

import Image from 'next/image';
import { useState } from 'react';

interface ProfileImageProps {
  src: string | null | undefined;
  alt: string;
  firstName: string; // เพื่อใช้ในการสร้าง placeholder
}

export default function ProfileImage({ src, alt, firstName }: ProfileImageProps) {
  const [imageError, setImageError] = useState(false);

  // URL ของ placeholder image
  const placeholderUrl = `https://placehold.co/60x60/cccccc/000000?text=${firstName.charAt(0).toUpperCase()}`;

  // ถ้ามี src และไม่มี error หรือยังไม่เกิด error
  if (src && !imageError) {
    return (
      <Image
        src={src}
        alt={alt}
        width={60}
        height={60}
        style={{ borderRadius: '50%', objectFit: 'cover', aspectRatio: '1 / 1', flexShrink: 0 }}
        onError={() => setImageError(true)} // เมื่อเกิด error ในการโหลดรูปภาพ ให้ตั้งค่า state
      />
    );
  }

  // ถ้าไม่มี src หรือเกิด error ในการโหลดรูปภาพ ให้แสดง placeholder
  return (
    <div style={{ 
      width: '60px', 
      height: '60px', 
      borderRadius: '50%', 
      backgroundColor: '#ccc', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontSize: '24px', 
      color: '#fff', 
      flexShrink: 0,
      backgroundImage: `url(${placeholderUrl})`, // ใช้ placeholder image
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      aspectRatio: '1 / 1' // ✅ ตรงนี้สำคัญ
    }}>
      {/* ถ้า placeholder image โหลดไม่ได้จริงๆ หรือไม่ต้องการแสดงตัวอักษร ให้ลบบรรทัดนี้ */}
      {firstName.charAt(0).toUpperCase()} 
    </div>
  );
}
