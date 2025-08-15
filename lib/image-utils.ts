'use client';

import imageCompression from 'browser-image-compression';
import { toast } from 'react-hot-toast';

const MAX_ORIGINAL_SIZE_MB = 5; // อนุญาตขนาดไฟล์เริ่มต้นสูงสุด 5MB
const MAX_COMPRESSED_SIZE_MB = 0.8; // บีบอัดให้ขนาดไม่เกิน 0.8MB (เผื่อไว้สำหรับ 1MB limit)

export async function processImage(file: File): Promise<File | null> {
  // 1. ตรวจสอบขนาดไฟล์เริ่มต้น
  if (file.size > MAX_ORIGINAL_SIZE_MB * 1024 * 1024) {
    toast.error(`Image is too large. Please select a file smaller than ${MAX_ORIGINAL_SIZE_MB}MB.`);
    return null;
  }

  // 2. ตั้งค่าการบีบอัด
  const options = {
    maxSizeMB: MAX_COMPRESSED_SIZE_MB,
    maxWidthOrHeight: 1024, // ปรับขนาดให้ด้านที่ยาวที่สุดไม่เกิน 1024px
    useWebWorker: true,
    fileType: 'image/webp', // แปลงไฟล์เป็น .webp
    initialQuality: 0.8, // คุณภาพเริ่มต้น
  };

  try {
    // 3. ทำการบีบอัด
    const compressedFile = await imageCompression(file, options);
    console.log(`Image compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
    
    // สร้างชื่อไฟล์ใหม่ให้เป็น .webp
    const newFileName = `${file.name.split('.').slice(0, -1).join('.')}.webp`;
    return new File([compressedFile], newFileName, { type: 'image/webp' });

  } catch (error) {
    console.error('Image compression error:', error);
    toast.error('Could not process the image. Please try another one.');
    return null;
  }
}