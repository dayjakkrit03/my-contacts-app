// v.1.1.5 =========================================================
// lib/actions.ts
'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
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

// 4. ดึงข้อมูล Contact ทั้งหมด (สำหรับหน้าแสดงรายการ)
export async function getContacts(): Promise<Contact[]> {
  try {
    // ✅ ดึงฟิลด์ UID มาด้วย
    const contacts = await prisma.contacts.findMany({
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

// v.1.1.5 =========================================================

// v.1.1.4 =========================================================
// lib/actions.ts
// 'use server';

// import { PrismaClient } from '@prisma/client';
// import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';
// import { put } from '@vercel/blob'; // Import Vercel Blob SDK

// const prisma = new PrismaClient();

// export interface Contact {
//   id: number;
//   first_name: string;
//   last_name?: string | null;
//   phone_number?: string | null;
//   email?: string | null;
//   company?: string | null;
//   job_title?: string | null;
//   notes?: string | null;
//   profile_image_url?: string | null; // เพิ่มฟิลด์รูปภาพ
//   created_at?: Date | null;
//   updated_at?: Date | null;
// }

// // ฟังก์ชันสำหรับอัปโหลดรูปภาพไปยัง Vercel Blob Storage
// async function uploadImage(file: File): Promise<string | null> {
//   if (!file || file.size === 0) {
//     return null;
//   }
//   try {
//     // กำหนดชื่อไฟล์ให้ไม่ซ้ำกัน (เช่น ใช้ timestamp + ชื่อไฟล์เดิม)
//     const filename = `${Date.now()}-${file.name}`;
//     const { url } = await put(filename, file, { access: 'public' }); // อัปโหลดไฟล์แบบ public
//     return url;
//   } catch (error) {
//     console.error('Failed to upload image to Vercel Blob:', error);
//     return null;
//   }
// }

// // 1. เพิ่ม Contact ใหม่
// export async function createContact(formData: FormData) {
//   const first_name = formData.get('first_name') as string;
//   const last_name = formData.get('last_name') as string | null;
//   const phone_number = formData.get('phone_number') as string | null;
//   const email = formData.get('email') as string | null;
//   const company = formData.get('company') as string | null;
//   const job_title = formData.get('job_title') as string | null;
//   const notes = formData.get('notes') as string | null;
//   const imageFile = formData.get('profile_image') as File | null; // รับไฟล์รูปภาพ

//   if (!first_name) {
//     return { error: 'First name is required.' };
//   }

//   let profile_image_url: string | null = null;
//   if (imageFile) {
//     profile_image_url = await uploadImage(imageFile);
//   }

//   try {
//     await prisma.contacts.create({
//       data: {
//         first_name: first_name,
//         last_name: last_name,
//         phone_number: phone_number,
//         email: email,
//         company: company,
//         job_title: job_title,
//         notes: notes,
//         profile_image_url: profile_image_url, // บันทึก URL รูปภาพ
//       },
//     });
//     revalidatePath('/contacts');
//     return { success: true };
//   } catch (error) {
//     console.error('Failed to create contact:', error);
//     return { error: 'Failed to create contact.' };
//   }
// }

// // 2. อัปเดต Contact ที่มีอยู่
// export async function updateContact(id: number, formData: FormData) {
//   const first_name = formData.get('first_name') as string;
//   const last_name = formData.get('last_name') as string | null;
//   const phone_number = formData.get('phone_number') as string | null;
//   const email = formData.get('email') as string | null;
//   const company = formData.get('company') as string | null;
//   const job_title = formData.get('job_title') as string | null;
//   const notes = formData.get('notes') as string | null;
//   const imageFile = formData.get('profile_image') as File | null; // รับไฟล์รูปภาพ
//   const currentImageUrl = formData.get('current_image_url') as string | null; // รับ URL รูปภาพปัจจุบัน (ถ้ามี)
//   const deleteImage = formData.get('delete_image') === 'on'; // ตรวจสอบว่าต้องการลบรูปภาพหรือไม่

//   if (!first_name) {
//     return { error: 'First name is required.' };
//   }

//   let new_profile_image_url: string | null = currentImageUrl; // เริ่มต้นด้วย URL ปัจจุบัน

//   if (deleteImage) {
//       new_profile_image_url = null; // ถ้าเลือกให้ลบ ก็ตั้งเป็น null
//   } else if (imageFile && imageFile.size > 0) {
//       new_profile_image_url = await uploadImage(imageFile); // ถ้ามีไฟล์ใหม่ ก็อัปโหลด
//   }

//   try {
//     await prisma.contacts.update({
//       where: { id: id },
//       data: {
//         first_name: first_name,
//         last_name: last_name,
//         phone_number: phone_number,
//         email: email,
//         company: company,
//         job_title: job_title,
//         notes: notes,
//         profile_image_url: new_profile_image_url, // อัปเดต URL รูปภาพ
//       },
//     });
//     revalidatePath('/contacts');
//     return { success: true };
//   } catch (error) {
//     if (error instanceof Error) {
//         console.error(`Failed to update contact with ID ${id}: ${error.message}`, error.stack);
//     } else {
//         console.error(`Failed to update contact with ID ${id}:`, error);
//     }
//     return { error: `Failed to update contact with ID ${id}.` };
//   }
// }

// // 3. ลบ Contact
// export async function deleteContact(id: number) {
//   try {
//     await prisma.contacts.delete({
//       where: { id: id },
//     });
//     revalidatePath('/contacts');
//     return { success: true };
//   } catch (error) {
//     console.error(`Failed to delete contact with ID ${id}:`, error);
//     return { error: `Failed to delete contact with ID ${id}.` };
//   }
// }

// // 4. ดึงข้อมูล Contact ทั้งหมด (สำหรับหน้าแสดงรายการ)
// export async function getContacts(): Promise<Contact[]> {
//   try {
//     // Prisma Client จะคืนค่าเป็น Type ที่ถูกต้องตาม Model โดยอัตโนมัติ (snake_case)
//     const contacts = await prisma.contacts.findMany({
//       orderBy: { created_at: 'desc' }, // ใช้ snake_case ใน orderBy
//     });
//     // ไม่ต้องมีการแปลงชื่อ field แล้ว เพราะ interface Contact ก็ใช้ snake_case แล้ว
//     return contacts;
//   } catch (error) {
//     console.error('Failed to fetch contacts:', error);
//     return [];
//   }
// }

// // 5. ดึงข้อมูล Contact เดี่ยว (สำหรับหน้าแก้ไข)
// export async function getContactById(id: number): Promise<Contact | null> {
//   try {
//     const contact = await prisma.contacts.findUnique({
//       where: { id: id },
//     });
//     // ไม่ต้องมีการแปลงชื่อ field แล้ว
//     return contact;
//   } catch (error) {
//     console.error(`Failed to fetch contact with ID ${id}:`, error);
//     return null;
//   }
// }

// // ฟังก์ชันสำหรับทดสอบการเชื่อมต่อ Database
// export async function testDbConnection() {
//   try {
//     await prisma.$queryRaw`SELECT 1`; 
//     console.log('Database connection successful!');
//     return { success: true, message: 'Database connection successful!' };
//   } catch (error: any) {
//     console.error('Database connection failed:', error.message || error);
//     return { success: false, message: `Database connection failed: ${error.message || error}` };
//   } finally {
//     // ใน Serverless environment, Prisma Client จะจัดการ connection pooling ให้เอง
//     // ไม่จำเป็นต้องเรียก prisma.$disconnect() ในแต่ละ request
//     // แต่ถ้าต้องการปิด connection หลังจาก testDbConnection() เสร็จสิ้น
//     // await prisma.$disconnect(); 
//   }
// }

// v.1.1.4 =========================================================

// v.1.1.3 =========================================================
// lib/actions.ts
// 'use server';

// import { PrismaClient } from '@prisma/client'; // Import PrismaClient
// import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';

// // สร้าง Prisma Client instance
// const prisma = new PrismaClient();

// // Interface สำหรับ Contact (ปรับปรุงให้ตรงกับชื่อ field ใน schema.prisma ใหม่)
// export interface Contact {
//   id: number;
//   first_name: string;
//   last_name?: string | null;
//   phone_number?: string | null;
//   email?: string | null;
//   company?: string | null;
//   job_title?: string | null;
//   notes?: string | null;
//   created_at?: Date | null; // created_at และ updated_at อาจเป็น null ได้ตาม schema.prisma ใหม่
//   updated_at?: Date | null;
// }

// // 1. เพิ่ม Contact ใหม่
// export async function createContact(formData: FormData) {
//   const first_name = formData.get('first_name') as string;
//   const last_name = formData.get('last_name') as string | null;
//   const phone_number = formData.get('phone_number') as string | null;
//   const email = formData.get('email') as string | null;
//   const company = formData.get('company') as string | null;
//   const job_title = formData.get('job_title') as string | null;
//   const notes = formData.get('notes') as string | null;

//   if (!first_name) {
//     return { error: 'First name is required.' };
//   }

//   try {
//     await prisma.contacts.create({
//       data: {
//         first_name: first_name,
//         last_name: last_name,
//         phone_number: phone_number,
//         email: email,
//         company: company,
//         job_title: job_title,
//         notes: notes,
//       },
//     });
//     revalidatePath('/contacts');
//     return { success: true };
//   } catch (error) {
//     console.error('Failed to create contact:', error);
//     return { error: 'Failed to create contact.' };
//   }
// }

// // 2. อัปเดต Contact ที่มีอยู่
// export async function updateContact(id: number, formData: FormData) {
//   const first_name = formData.get('first_name') as string;
//   const last_name = formData.get('last_name') as string | null;
//   const phone_number = formData.get('phone_number') as string | null;
//   const email = formData.get('email') as string | null;
//   const company = formData.get('company') as string | null;
//   const job_title = formData.get('job_title') as string | null;
//   const notes = formData.get('notes') as string | null;

//   if (!first_name) {
//     return { error: 'First name is required.' };
//   }

//   try {
//     await prisma.contacts.update({
//       where: { id: id },
//       data: {
//         first_name: first_name,
//         last_name: last_name,
//         phone_number: phone_number,
//         email: email,
//         company: company,
//         job_title: job_title,
//         notes: notes,
//       },
//     });
//     revalidatePath('/contacts');
//     return { success: true };
//   } catch (error) {
//     if (error instanceof Error) {
//         console.error(`Failed to update contact with ID ${id}: ${error.message}`, error.stack);
//     } else {
//         console.error(`Failed to update contact with ID ${id}:`, error);
//     }
//     return { error: `Failed to update contact with ID ${id}.` };
//   }
// }

// // 3. ลบ Contact
// export async function deleteContact(id: number) {
//   try {
//     await prisma.contacts.delete({
//       where: { id: id },
//     });
//     revalidatePath('/contacts');
//     return { success: true };
//   } catch (error) {
//     console.error(`Failed to delete contact with ID ${id}:`, error);
//     return { error: `Failed to delete contact with ID ${id}.` };
//   }
// }

// // 4. ดึงข้อมูล Contact ทั้งหมด (สำหรับหน้าแสดงรายการ)
// export async function getContacts(): Promise<Contact[]> {
//   try {
//     const contacts = await prisma.contacts.findMany({
//       orderBy: { created_at: 'desc' },
//     });
//     return contacts;
//   } catch (error) {
//     console.error('Failed to fetch contacts:', error);
//     return [];
//   }
// }

// // 5. ดึงข้อมูล Contact เดี่ยว (สำหรับหน้าแก้ไข)
// export async function getContactById(id: number): Promise<Contact | null> {
//   try {
//     const contact = await prisma.contacts.findUnique({
//       where: { id: id },
//     });
//     return contact;
//   } catch (error) {
//     console.error(`Failed to fetch contact with ID ${id}:`, error);
//     return null;
//   }
// }

// // ฟังก์ชันสำหรับทดสอบการเชื่อมต่อ Database
// export async function testDbConnection() {
//   try {
//     await prisma.$queryRaw`SELECT 1`; 
//     console.log('Database connection successful!');
//     return { success: true, message: 'Database connection successful!' };
//   } catch (error: any) {
//     console.error('Database connection failed:', error.message || error);
//     return { success: false, message: `Database connection failed: ${error.message || error}` };
//   }
// }

// v.1.1.3 =========================================================

// v.1.1.2 =========================================================
// lib/actions.ts
// 'use server'; // Directive เพื่อระบุว่าเป็น Server Action

// import { neon } from '@neondatabase/serverless';
// import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';

// // ตั้งค่าการเชื่อมต่อ Database โดยใช้ Environment Variable
// const sql = neon(process.env.DATABASE_URL!); // ใช้ '!' เพื่อบอก TypeScript ว่ารับประกันว่ามีค่า

// // Interface สำหรับ Contact (สำหรับ Type Safety)
// export interface Contact {
//   id: number;
//   first_name: string;
//   last_name?: string; // Optional field
//   phone_number?: string;
//   email?: string;
//   company?: string;
//   job_title?: string;
//   notes?: string;
//   created_at: Date;
//   updated_at: Date;
// }

// // 1. เพิ่ม Contact ใหม่
// export async function createContact(formData: FormData) {
//   const first_name = formData.get('first_name') as string;
//   const last_name = formData.get('last_name') as string | null;
//   const phone_number = formData.get('phone_number') as string | null;
//   const email = formData.get('email') as string | null;
//   const company = formData.get('company') as string | null;
//   const job_title = formData.get('job_title') as string | null;
//   const notes = formData.get('notes') as string | null;

//   if (!first_name) {
//     // Basic validation
//     return { error: 'First name is required.' };
//   }

//   try {
//     await sql`
//       INSERT INTO contacts (first_name, last_name, phone_number, email, company, job_title, notes)
//       VALUES (${first_name}, ${last_name}, ${phone_number}, ${email}, ${company}, ${job_title}, ${notes})
//     `;
//     revalidatePath('/contacts'); // revalidate เพื่อให้ข้อมูลในหน้า '/contacts' อัปเดต
//     // redirect('/contacts'); // Optional: redirect ไปหน้า contacts list หลังจากเพิ่มเสร็จ
//     return { success: true };
//   } catch (error) {
//     console.error('Failed to create contact:', error);
//     return { error: 'Failed to create contact.' };
//   }
// }

// // 2. อัปเดต Contact ที่มีอยู่
// export async function updateContact(id: number, formData: FormData) {
//   const first_name = formData.get('first_name') as string;
//   const last_name = formData.get('last_name') as string | null;
//   const phone_number = formData.get('phone_number') as string | null;
//   const email = formData.get('email') as string | null;
//   const company = formData.get('company') as string | null;
//   const job_title = formData.get('job_title') as string | null;
//   const notes = formData.get('notes') as string | null;

//   if (!first_name) {
//     return { error: 'First name is required.' };
//   }

//   try {
//     await sql`
//       UPDATE contacts
//       SET 
//         first_name = ${first_name},
//         last_name = ${last_name},
//         phone_number = ${phone_number},
//         email = ${email},
//         company = ${company},
//         job_title = ${job_title},
//         notes = ${notes}
//       WHERE id = ${id}
//     `;
//     revalidatePath('/contacts'); // revalidate เพื่อให้ข้อมูลในหน้า '/contacts' อัปเดต
//     // redirect('/contacts'); // Optional: redirect ไปหน้า contacts list
//     return { success: true };
//   } catch (error) {
//     console.error(`Failed to update contact with ID ${id}:`, error);
//     return { error: `Failed to update contact with ID ${id}.` };
//   }
// }

// // 3. ลบ Contact
// export async function deleteContact(id: number) {
//   try {
//     await sql`DELETE FROM contacts WHERE id = ${id}`;
//     revalidatePath('/contacts'); // revalidate เพื่อให้ข้อมูลในหน้า '/contacts' อัปเดต
//     return { success: true };
//   } catch (error) {
//     console.error(`Failed to delete contact with ID ${id}:`, error);
//     return { error: `Failed to delete contact with ID ${id}.` };
//   }
// }

// // 4. ดึงข้อมูล Contact ทั้งหมด (สำหรับหน้าแสดงรายการ)
// export async function getContacts(): Promise<Contact[]> {
//   try {
//     // *** แก้ไข: ลบ <Contact[]> และ cast ผลลัพธ์เป็น Contact[] ***
//     const contacts = await sql`SELECT * FROM contacts ORDER BY created_at DESC` as Contact[];
//     return contacts;
//   } catch (error) {
//     console.error('Failed to fetch contacts:', error);
//     // คุณอาจจะเลือก throw error หรือ return empty array ขึ้นอยู่กับการจัดการ error ใน Frontend
//     return [];
//   }
// }

// // 5. ดึงข้อมูล Contact เดี่ยว (สำหรับหน้าแก้ไข)
// export async function getContactById(id: number): Promise<Contact | null> {
//   try {
//     // *** แก้ไข: ลบ <Contact[]> และ cast ผลลัพธ์เป็น Contact[] เพื่อเข้าถึง [0] เป็น Contact ***
//     const contacts = await sql`SELECT * FROM contacts WHERE id = ${id}` as Contact[];
//     return contacts.length > 0 ? contacts[0] : null;
//   } catch (error) {
//     console.error(`Failed to fetch contact with ID ${id}:`, error);
//     return null;
//   }
// }