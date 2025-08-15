// v.1.1.2 ==============================================================
// app/contacts/new/page.tsx
'use client'; // ต้องเป็น Client Component เพื่อใช้ useState, alert

import { createContact } from '../../../lib/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewContactPage() {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCreateContact = async (formData: FormData) => {
    setIsSubmitting(true);
    setStatusMessage(null);

    const result = await createContact(formData);
    if (result.success) {
      setStatusMessage('Contact created successfully!');
      router.push('/'); // Redirect กลับไปหน้ารายการหลังจากเพิ่มสำเร็จ
      router.refresh(); // บังคับให้หน้า Contacts list โหลดข้อมูลใหม่
    } else {
      setStatusMessage(`Error: ${result.error}`);
      console.error(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h1>Add New Contact</h1>
      {statusMessage && (
        <p style={{ color: statusMessage.includes('Error') ? 'red' : 'green', marginBottom: '15px' }}>
          {statusMessage}
        </p>
      )}
      <form action={handleCreateContact} style={{ display: 'grid', gap: '15px' }}>
        <label>
          First Name:
          <input type="text" name="first_name" required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </label>
        <label>
          Last Name:
          <input type="text" name="last_name" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </label>
        <label>
          Phone Number:
          <input type="text" name="phone_number" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </label>
        <label>
          Email:
          <input type="email" name="email" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </label>
        <label>
          Company:
          <input type="text" name="company" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </label>
        <label>
          Job Title:
          <input type="text" name="job_title" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </label>
        <label>
          Notes:
          <textarea name="notes" rows={4} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}></textarea>
        </label>
        {/* *** เพิ่ม Input สำหรับอัปโหลดรูปภาพ *** */}
        <label>
          Profile Image:
          <input type="file" name="profile_image" accept="image/*" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </label>
        {/* *** สิ้นสุดการเพิ่ม Input รูปภาพ *** */}
        <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
          {isSubmitting ? 'Creating...' : 'Create Contact'}
        </button>
      </form>
    </div>
  );
}
// v.1.1.2 ==============================================================