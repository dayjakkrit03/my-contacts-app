// v.1.1.3 ==============================================================================
// app/contacts/edit/[id]/page.tsx
'use client'; // ต้องเป็น Client Component เพื่อใช้ useState, alert

import { getContactById, updateContact, Contact } from '../../../../lib/actions';
import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react'; // ✅ นำเข้า use hook
import Image from 'next/image'; // ใช้ next/image เพื่อ optimize รูปภาพ

export default function EditContactPage({ params }: { params: Promise<{ id: string }> }) { // ✅ กำหนด type ของ params เป็น Promise
  const { id } = use(params); // ✅ ใช้ use() เพื่อ unwrap Promise
  const contactId = parseInt(id); // ✅ ใช้ id ที่ unwrap แล้ว

  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deleteImage, setDeleteImage] = useState<boolean>(false); // State สำหรับลบรูปภาพ

  useEffect(() => {
    async function fetchContact() {
      const fetchedContact = await getContactById(contactId);
      setContact(fetchedContact);
    }
    fetchContact();
  }, [contactId]);

  if (!contact) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading contact or contact not found...</p>;
  }

  const handleUpdateContact = async (formData: FormData) => {
    setIsSubmitting(true);
    setStatusMessage(null);

    // เพิ่มข้อมูลรูปภาพปัจจุบันและสถานะการลบรูปภาพลงใน FormData
    formData.append('current_image_url', contact.profile_image_url || '');
    if (deleteImage) {
        formData.append('delete_image', 'on');
    }

    const result = await updateContact(contactId, formData);
    if (result.success) {
      setStatusMessage('Contact updated successfully!');
      router.push('/');
      router.refresh();
    } else {
      setStatusMessage(`Error: ${result.error}`);
      console.error(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h1>Edit Contact</h1>
      {statusMessage && (
        <p style={{ color: statusMessage.includes('Error') ? 'red' : 'green', marginBottom: '15px' }}>
          {statusMessage}
        </p>
      )}
      <form action={handleUpdateContact} style={{ display: 'grid', gap: '15px' }}>
        <input type="hidden" name="id" value={contact.id} />
        <label>
          First Name:
          <input type="text" name="first_name" defaultValue={contact.first_name} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </label>
        <label>
          Last Name:
          <input type="text" name="last_name" defaultValue={contact.last_name || ''} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </label>
        <label>
          Phone Number:
          <input type="text" name="phone_number" defaultValue={contact.phone_number || ''} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </label>
        <label>
          Email:
          <input type="email" name="email" defaultValue={contact.email || ''} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </label>
        <label>
          Company:
          <input type="text" name="company" defaultValue={contact.company || ''} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </label>
        <label>
          Job Title:
          <input type="text" name="job_title" defaultValue={contact.job_title || ''} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </label>
        <label>
          Notes:
          <textarea name="notes" rows={4} defaultValue={contact.notes || ''} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}></textarea>
        </label>

        {/* ส่วนสำหรับจัดการรูปภาพโปรไฟล์ */}
        <label>
          Profile Image:
          {contact.profile_image_url && !deleteImage ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <Image
                  src={contact.profile_image_url}
                  alt="Profile"
                  width={80}
                  height={80}
                  style={{
                    borderRadius: '50%',
                    objectFit: 'cover',
                    aspectRatio: '1 / 1'
                  }}
                />
              <button
                type="button"
                onClick={() => setDeleteImage(true)}
                style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
              >
                Delete Current Image
              </button>
            </div>
          ) : (
            <input type="file" name="profile_image" accept="image/*" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
          )}
          {deleteImage && (
            <p style={{ color: 'orange', marginTop: '5px' }}>
              Image will be deleted. Upload new image or uncheck to keep.
              <button type="button" onClick={() => setDeleteImage(false)} style={{ marginLeft: '10px', padding: '3px 8px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                Undo Delete
              </button>
            </p>
          )}
        </label>
        <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
          {isSubmitting ? 'Updating...' : 'Update Contact'}
        </button>
      </form>
    </div>
  );
}