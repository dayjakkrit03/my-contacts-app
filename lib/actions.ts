// v.1.1.5 =========================================================
// lib/actions.ts
'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid'; // Import nanoid

const prisma = new PrismaClient();

export interface Contact {
  id: number;
  uid?: string | null; // เพิ่มฟิลด์ UID
  first_name: string;
  last_name?: string | null;
  phone_number?: string | null;
  email?: string | null;
  company?: string | null;
  job_title?: string | null;
  notes?: string | null;
  profile_image_url?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

async function uploadImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) {
    return null;
  }
  try {
    const filename = `${Date.now()}-${file.name}`;
    const { url } = await put(filename, file, { access: 'public' });
    return url;
  } catch (error) {
    console.error('Failed to upload image to Vercel Blob:', error);
    return null;
  }
}

// 1. เพิ่ม Contact ใหม่
export async function createContact(formData: FormData) {
  // เพิ่มการหน่วงเวลา 1.5 วินาทีเพื่อให้เห็น UI loading
  await new Promise(res => setTimeout(res, 1500));

  const first_name = formData.get('first_name') as string;
  const last_name = formData.get('last_name') as string | null;
  const phone_number = formData.get('phone_number') as string | null;
  const email = formData.get('email') as string | null;
  const company = formData.get('company') as string | null;
  const job_title = formData.get('job_title') as string | null;
  const notes = formData.get('notes') as string | null;
  const imageFile = formData.get('profile_image') as File | null;

  if (!first_name) {
    return { error: 'First name is required.' };
  }

  let profile_image_url: string | null = null;
  if (imageFile) {
    profile_image_url = await uploadImage(imageFile);
  }

  try {
    await prisma.contacts.create({
      data: {
        uid: nanoid(), // ✅ สร้าง UID ใหม่เมื่อสร้าง Contact
        first_name: first_name,
        last_name: last_name,
        phone_number: phone_number,
        email: email,
        company: company,
        job_title: job_title,
        notes: notes,
        profile_image_url: profile_image_url,
      },
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to create contact:', error);
    return { error: 'Failed to create contact.' };
  }
}

// 2. อัปเดต Contact ที่มีอยู่
export async function updateContact(id: number, formData: FormData) {
  // เพิ่มการหน่วงเวลา 1.5 วินาทีเพื่อให้เห็น UI loading
  await new Promise(res => setTimeout(res, 1500));

  const first_name = formData.get('first_name') as string;
  const last_name = formData.get('last_name') as string | null;
  const phone_number = formData.get('phone_number') as string | null;
  const email = formData.get('email') as string | null;
  const company = formData.get('company') as string | null;
  const job_title = formData.get('job_title') as string | null;
  const notes = formData.get('notes') as string | null;
  const imageFile = formData.get('profile_image') as File | null;
  const currentImageUrl = formData.get('current_image_url') as string | null;
  const deleteImage = formData.get('delete_image') === 'on';

  if (!first_name) {
    return { error: 'First name is required.' };
  }

  let new_profile_image_url: string | null = currentImageUrl;

  if (deleteImage) {
      new_profile_image_url = null;
  } else if (imageFile && imageFile.size > 0) {
      new_profile_image_url = await uploadImage(imageFile);
  }

  try {
    await prisma.contacts.update({
      where: { id: id },
      data: {
        first_name: first_name,
        last_name: last_name,
        phone_number: phone_number,
        email: email,
        company: company,
        job_title: job_title,
        notes: notes,
        profile_image_url: new_profile_image_url,
      },
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
        console.error(`Failed to update contact with ID ${id}: ${error.message}`, error.stack);
    } else {
        console.error(`Failed to update contact with ID ${id}:`, error);
    }
    return { error: `Failed to update contact with ID ${id}.` };
  }
}

// 3. ลบ Contact
export async function deleteContact(id: number) {
  try {
    await prisma.contacts.delete({
      where: { id: id },
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete contact with ID ${id}:`, error);
    return { error: `Failed to delete contact with ID ${id}.` };
  }
}

// 4. ดึงข้อมูล Contact ทั้งหมด (สำหรับหน้าแสดงรายการ) - ✅ อัปเดตให้รองรับการค้นหา
export async function getContacts(query?: string): Promise<Contact[]> {
  try {
    const whereClause = query
      ? {
          OR: [
            { first_name: { contains: query, mode: 'insensitive' } },
            { last_name: { contains: query, mode: 'insensitive' } },
            { phone_number: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { company: { contains: query, mode: 'insensitive' } },
            { job_title: { contains: query, mode: 'insensitive' } },
            { notes: { contains: query, mode: 'insensitive' } },
          ],
        }
      : {};

    const contacts = await prisma.contacts.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
    });
    return contacts;
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return [];
  }
}

// 5. ดึงข้อมูล Contact เดี่ยว (สำหรับหน้าแก้ไข)
export async function getContactById(id: number): Promise<Contact | null> {
  try {
    // ✅ ดึงฟิลด์ UID มาด้วย
    const contact = await prisma.contacts.findUnique({
      where: { id: id },
    });
    return contact;
  } catch (error) {
    console.error(`Failed to fetch contact with ID ${id}:`, error);
    return null;
  }
}

// ฟังก์ชันสำหรับทดสอบการเชื่อมต่อ Database
export async function testDbConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`; 
    console.log('Database connection successful!');
    return { success: true, message: 'Database connection successful!' };
  } catch (error: unknown) {
    // console.error('Database connection failed:', error.message || error);
    console.error('Database connection failed:', error);
    let errorMessage: string;
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error); // แปลงเป็น string ถ้าไม่ใช่ Error object
    }

    return { 
      success: false, 
      message: `Database connection failed: ${errorMessage}` 
    };

  }
}