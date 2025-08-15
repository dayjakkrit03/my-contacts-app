// v.1.1.2 =================================================================
// app/api/export-all-vcf/route.ts
import { NextResponse } from 'next/server';
import { getContacts, Contact } from '../../../lib/actions'; // Import getContacts และ Contact interface

// ฟังก์ชันสำหรับสร้างเนื้อหา vCard (VCF) จากข้อมูล Contact
// ใช้ฟังก์ชันเดิมจาก api/export-vcf/[id]/route.ts ที่รองรับ UID แล้ว
function generateVcard(contact: Contact): string {
    let vcard = 'BEGIN:VCARD\n';
    vcard += 'VERSION:3.0\n'; // vCard Version 3.0

    const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.trim();
    if (fullName) {
        vcard += `FN:${fullName}\n`;
    }

    vcard += `N:${contact.last_name || ''};${contact.first_name || ''};;;\n`;

    if (contact.phone_number) {
        vcard += `TEL:${contact.phone_number}\n`;
    }

    if (contact.email) {
        vcard += `EMAIL:${contact.email}\n`;
    }

    if (contact.company) {
        vcard += `ORG:${contact.company}\n`;
    }

    if (contact.job_title) {
        vcard += `TITLE:${contact.job_title}\n`;
    }

    if (contact.notes) {
        const escapedNotes = contact.notes.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
        vcard += `NOTE:${escapedNotes}\n`;
    }

    if (contact.profile_image_url) {
        vcard += `PHOTO;VALUE=URI:${contact.profile_image_url}\n`;
    }

    // *** เพิ่ม UID Property ***
    if (contact.uid) {
        vcard += `UID:${contact.uid}\n`;
    }

    vcard += 'END:VCARD\n';
    return vcard;
}

export async function GET() {
    try {
        const contacts = await getContacts(); // ดึง Contact ทั้งหมด

        if (!contacts || contacts.length === 0) {
            return NextResponse.json({ error: 'No contacts found to export' }, { status: 404 });
        }

        const allVcardsContent = contacts.map(contact => generateVcard(contact)).join('\n');

        const headers = new Headers();
        headers.append('Content-Type', 'text/vcard; charset=utf-8');
        headers.append('Content-Disposition', `attachment; filename="all_contacts.vcf"`);

        return new Response(allVcardsContent, { headers });

    } catch (error) {
        console.error('Failed to generate VCF for all contacts:', error);
        return NextResponse.json({ error: 'Failed to generate VCF for all contacts' }, { status: 500 });
    }
}

// v.1.1.2 =================================================================

// app/api/export-all-vcf/route.ts
// import { NextResponse } from 'next/server';
// import { getContacts, Contact } from '../../../lib/actions'; // Import getContacts และ Contact interface

// // ฟังก์ชันสำหรับสร้างเนื้อหา vCard (VCF) จากข้อมูล Contact
// // ใช้ฟังก์ชันเดิมจาก api/export-vcf/[id]/route.ts
// function generateVcard(contact: Contact): string {
//     let vcard = 'BEGIN:VCARD\n';
//     vcard += 'VERSION:3.0\n'; // vCard Version 3.0

//     const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.trim();
//     if (fullName) {
//         vcard += `FN:${fullName}\n`;
//     }

//     vcard += `N:${contact.last_name || ''};${contact.first_name || ''};;;\n`;

//     if (contact.phone_number) {
//         vcard += `TEL:${contact.phone_number}\n`;
//     }

//     if (contact.email) {
//         vcard += `EMAIL:${contact.email}\n`;
//     }

//     if (contact.company) {
//         vcard += `ORG:${contact.company}\n`;
//     }

//     if (contact.job_title) {
//         vcard += `TITLE:${contact.job_title}\n`;
//     }

//     if (contact.notes) {
//         const escapedNotes = contact.notes.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
//         vcard += `NOTE:${escapedNotes}\n`;
//     }

//     if (contact.profile_image_url) {
//         vcard += `PHOTO;VALUE=URI:${contact.profile_image_url}\n`;
//     }

//     vcard += 'END:VCARD\n';
//     return vcard;
// }

// export async function GET() {
//     try {
//         const contacts = await getContacts(); // ดึง Contact ทั้งหมด

//         if (!contacts || contacts.length === 0) {
//             return NextResponse.json({ error: 'No contacts found to export' }, { status: 404 });
//         }

//         // รวม vCard ของทุก Contact เข้าด้วยกัน
//         const allVcardsContent = contacts.map(contact => generateVcard(contact)).join('\n');

//         // ตั้งค่า Headers สำหรับการดาวน์โหลดไฟล์ .vcf
//         const headers = new Headers();
//         headers.append('Content-Type', 'text/vcard; charset=utf-8');
//         headers.append('Content-Disposition', `attachment; filename="all_contacts.vcf"`);

//         return new Response(allVcardsContent, { headers });

//     } catch (error) {
//         console.error('Failed to generate VCF for all contacts:', error);
//         return NextResponse.json({ error: 'Failed to generate VCF for all contacts' }, { status: 500 });
//     }
// }
