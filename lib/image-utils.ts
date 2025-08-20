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
    initialQuality: 0.8, // คุณภาพเริ่มต้น
    // ไม่บังคับแปลงเป็น webp แล้ว เพื่อความเข้ากันได้ของอุปกรณ์
  };

  try {
    // 3. ทำการบีบอัด
    console.log(`Compressing image: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    const compressedFile = await imageCompression(file, options);
    console.log(`Image compressed successfully to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
    
    // คืนค่าไฟล์ที่บีบอัดแล้วโดยตรง ไลบรารีจะจัดการชนิดและชื่อไฟล์ให้ถูกต้อง
    return compressedFile;

  } catch (error) {
    console.error('Image compression error:', error);
    toast.error('Could not process the image. Please try another one.');
    return null;
  }
}