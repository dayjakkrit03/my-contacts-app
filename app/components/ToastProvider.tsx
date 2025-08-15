'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          border: '1px solid #4a4a4a',
          padding: '16px',
          color: '#ffffff',
          backgroundColor: '#1f1f1f',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#22c55e', // green-500
            secondary: 'white',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444', // red-500
            secondary: 'white',
          },
        },
      }}
    />
  );
}