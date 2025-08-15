// v.1.1.3 =================================================================
// app/api/export-all-vcf/route.ts
import { NextResponse } from 'next/server';
import { getContacts, Contact } from '../../../lib/actions';

async function generateVcard(contact: Contact): Promise<string> {
    let vcard = 'BEGIN:VCARD\n';
    vcard += 'VERSION:3.0\n';

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
    if (contact.uid) {
        vcard += `UID:${contact.uid}\n`;
    }

    // ✅ *** กระบวนการฝังรูปภาพ (แก้ไข) ***
    if (contact.profile_image_url) {
        try {
            const imageResponse = await fetch(contact.profile_image_url);
            if (imageResponse.ok) {
                const imageBuffer = await imageResponse.arrayBuffer();
                const imageBase64 = Buffer.from(imageBuffer).toString('base64');

                // ✅ บังคับใช้ TYPE=JPEG เพื่อความเข้ากันได้สูงสุด
                vcard += `PHOTO;ENCODING=b64;TYPE=JPEG:${imageBase64}\n`;
            }
        } catch (e) {
            console.error(`Failed to fetch or encode image for contact ${contact.id}:`, e);
        }
    }

    vcard += 'END:VCARD\n';
    return vcard;
}

export async function GET() {
    try {
        const contacts = await getContacts();

        if (!contacts || contacts.length === 0) {
            return NextResponse.json({ error: 'No contacts found to export' }, { status: 404 });
        }

        const vcardPromises = contacts.map(contact => generateVcard(contact));
        const vcardContents = await Promise.all(vcardPromises);
        const allVcardsContent = vcardContents.join('\n');

        const headers = new Headers();
        headers.append('Content-Type', 'text/vcard; charset=utf-8');
        headers.append('Content-Disposition', `attachment; filename="all_contacts.vcf"`);

        return new Response(allVcardsContent, { headers });

    } catch (error) {
        console.error('Failed to generate VCF for all contacts:', error);
        return NextResponse.json({ error: 'Failed to generate VCF for all contacts' }, { status: 500 });
    }
}