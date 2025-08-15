// v.1.1.2 =================================================================================
// app/api/export-vcf/[id]/route.ts
import { NextResponse } from 'next/server';
import { getContactById } from '../../../../lib/actions'; // ตรวจสอบ path ให้ถูกต้อง

// ฟังก์ชันสำหรับสร้างเนื้อหา vCard (VCF) จากข้อมูล Contact
function generateVcard(contact: {
    first_name: string;
    last_name?: string | null;
    phone_number?: string | null;
    email?: string | null;
    company?: string | null;
    job_title?: string | null;
    notes?: string | null;
    profile_image_url?: string | null;
    uid?: string | null; // ✅ เพิ่ม UID ใน Contact type
}): string {
    let vcard = 'BEGIN:VCARD\n';
    vcard += 'VERSION:3.0\n'; // vCard Version 3.0

    // FN (Formatted Name)
    const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.trim();
    if (fullName) {
        vcard += `FN:${fullName}\n`;
    }

    // N (Name Components: Last Name;First Name;Middle Name;Prefixes;Suffixes)
    // สำหรับ vCard 3.0, N component เป็น Lastname;Firstname;Middlename;Prefix;Suffix
    vcard += `N:${contact.last_name || ''};${contact.first_name || ''};;;\n`;

    // TEL (Telephone Number)
    if (contact.phone_number) {
        vcard += `TEL:${contact.phone_number}\n`;
    }

    // EMAIL
    if (contact.email) {
        vcard += `EMAIL:${contact.email}\n`;
    }

    // ORG (Organization/Company)
    if (contact.company) {
        vcard += `ORG:${contact.company}\n`;
    }

    // TITLE (Job Title)
    if (contact.job_title) {
        vcard += `TITLE:${contact.job_title}\n`;
    }

    // NOTE (Notes)
    if (contact.notes) {
        // vCard text properties should escape commas, semicolons, and newlines
        const escapedNotes = contact.notes.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
        vcard += `NOTE:${escapedNotes}\n`;
    }

    // PHOTO (Profile Image URL) - vCard 3.0 supports PHOTO with URL
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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const contactId = parseInt(id);

    if (isNaN(contactId)) {
        return NextResponse.json({ error: 'Invalid contact ID' }, { status: 400 });
    }

    try {
        const contact = await getContactById(contactId);

        if (!contact) {
            return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
        }

        const vcardContent = generateVcard(contact);

        // ตั้งค่า Headers สำหรับการดาวน์โหลดไฟล์ .vcf
        const headers = new Headers();
        headers.append('Content-Type', 'text/vcard; charset=utf-8');
        // ใช้ encodeURIComponent สำหรับ filename เพื่อจัดการอักขระพิเศษ
        const filename = encodeURIComponent(`${contact.first_name || 'contact'}.vcf`);
        headers.append('Content-Disposition', `attachment; filename*=UTF-8''${filename}`); // ใช้ RFC 5987 encoding

        return new Response(vcardContent, { headers });

    } catch (error) {
        console.error('Failed to generate VCF:', error);
        return NextResponse.json({ error: 'Failed to generate VCF' }, { status: 500 });
    }
}

// v.1.1.2 =================================================================================

// app/api/export-vcf/[id]/route.ts
// import { NextResponse } from 'next/server';
// import { getContactById } from '../../../../lib/actions'; // ตรวจสอบ path ให้ถูกต้อง

// // ฟังก์ชันสำหรับสร้างเนื้อหา vCard (VCF) จากข้อมูล Contact
// function generateVcard(contact: {
//     first_name: string;
//     last_name?: string | null;
//     phone_number?: string | null;
//     email?: string | null;
//     company?: string | null;
//     job_title?: string | null;
//     notes?: string | null;
//     profile_image_url?: string | null;
// }): string {
//     let vcard = 'BEGIN:VCARD\n';
//     vcard += 'VERSION:3.0\n'; // vCard Version 3.0

//     // FN (Formatted Name)
//     const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.trim();
//     if (fullName) {
//         vcard += `FN:${fullName}\n`;
//     }

//     // N (Name Components: Last Name;First Name;Middle Name;Prefixes;Suffixes)
//     // สำหรับ vCard 3.0, N component เป็น Lastname;Firstname;Middlename;Prefix;Suffix
//     vcard += `N:${contact.last_name || ''};${contact.first_name || ''};;;\n`;

//     // TEL (Telephone Number)
//     if (contact.phone_number) {
//         vcard += `TEL:${contact.phone_number}\n`;
//     }

//     // EMAIL
//     if (contact.email) {
//         vcard += `EMAIL:${contact.email}\n`;
//     }

//     // ORG (Organization/Company)
//     if (contact.company) {
//         vcard += `ORG:${contact.company}\n`;
//     }

//     // TITLE (Job Title)
//     if (contact.job_title) {
//         vcard += `TITLE:${contact.job_title}\n`;
//     }

//     // NOTE (Notes)
//     if (contact.notes) {
//         // vCard text properties should escape commas, semicolons, and newlines
//         const escapedNotes = contact.notes.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
//         vcard += `NOTE:${escapedNotes}\n`;
//     }

//     // PHOTO (Profile Image URL) - vCard 3.0 supports PHOTO with URL
//     if (contact.profile_image_url) {
//         vcard += `PHOTO;VALUE=URI:${contact.profile_image_url}\n`;
//     }

//     vcard += 'END:VCARD\n';
//     return vcard;
// }

// export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) { // ✅ เปลี่ยน type ของ params เป็น Promise
//     const { id } = await params; // ✅ await params ก่อนเข้าถึง id
//     const contactId = parseInt(id);

//     if (isNaN(contactId)) {
//         return NextResponse.json({ error: 'Invalid contact ID' }, { status: 400 });
//     }

//     try {
//         const contact = await getContactById(contactId);

//         if (!contact) {
//             return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
//         }

//         const vcardContent = generateVcard(contact);

//         // ตั้งค่า Headers สำหรับการดาวน์โหลดไฟล์ .vcf
//         const headers = new Headers();
//         headers.append('Content-Type', 'text/vcard; charset=utf-8');
//         // ✅ ใช้ encodeURIComponent สำหรับ filename เพื่อจัดการอักขระพิเศษ
//         const filename = encodeURIComponent(`${contact.first_name || 'contact'}.vcf`);
//         headers.append('Content-Disposition', `attachment; filename*=UTF-8''${filename}`); // ใช้ RFC 5987 encoding

//         return new Response(vcardContent, { headers });

//     } catch (error) {
//         console.error('Failed to generate VCF:', error);
//         return NextResponse.json({ error: 'Failed to generate VCF' }, { status: 500 });
//     }
// }
