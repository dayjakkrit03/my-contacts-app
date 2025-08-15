// app/test-db/page.tsx
'use client'; // ต้องเป็น Client Component เพื่อใช้ useState และ onClick

import { useState } from 'react';
import { testDbConnection } from '../../lib/actions'; // ตรวจสอบ path ให้ถูกต้องตามโครงสร้างของคุณ

export default function TestDbPage() {
  const [status, setStatus] = useState<string>('Click the button to test connection.');
  const [loading, setLoading] = useState<boolean>(false);

  const handleTestConnection = async () => {
    setLoading(true);
    setStatus('Testing connection...');
    const result = await testDbConnection(); // เรียก Server Action
    setStatus(result.message);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', textAlign: 'center' }}>
      <h1>Database Connection Test</h1>
      <button
        onClick={handleTestConnection}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {loading ? 'Testing...' : 'Test Database Connection'}
      </button>
      <p style={{ marginTop: '20px', fontSize: '1.1em', color: status.includes('failed') ? 'red' : 'green' }}>
        {status}
      </p>
      <p style={{ marginTop: '20px', fontSize: '0.9em', color: '#555' }}>
        โปรดตรวจสอบ Console ของ Terminal ที่รัน `npm run dev` สำหรับรายละเอียด Error เพิ่มเติม
      </p>
    </div>
  );
}
