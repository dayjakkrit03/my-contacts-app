// v.1.1.3 =================================================================================
// app/api/export-vcf/[id]/route.ts
import { NextResponse } from 'next/server';
import { getContactById, Contact } from '../../../../lib/actions';

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

        const vcardContent = await generateVcard(contact);

        const headers = new Headers();
        headers.append('Content-Type', 'text/vcard; charset=utf-8');
        const filename = encodeURIComponent(`${contact.first_name || 'contact'}.vcf`);
        headers.append('Content-Disposition', `attachment; filename*=UTF-8''${filename}`);

        return new Response(vcardContent, { headers });

    } catch (error) {
        console.error('Failed to generate VCF:', error);
        return NextResponse.json({ error: 'Failed to generate VCF' }, { status: 500 });
    }
}