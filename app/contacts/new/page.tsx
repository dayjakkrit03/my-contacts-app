// v.1.1.2 ==============================================================
// app/contacts/new/page.tsx
'use client';

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
      router.push('/');
      router.refresh();
    } else {
      setStatusMessage(`Error: ${result.error}`);
      console.error(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Contact</h1>
      {statusMessage && (
        <p className={`mb-4 text-sm ${statusMessage.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
          {statusMessage}
        </p>
      )}
      <form action={handleCreateContact} className="space-y-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
          <input id="first_name" type="text" name="first_name" required className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
          <input id="last_name" type="text" name="last_name" className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
          <input id="phone_number" type="text" name="phone_number" className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input id="email" type="email" name="email" className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">Company</label>
          <input id="company" type="text" name="company" className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="job_title" className="block text-sm font-medium text-gray-300 mb-1">Job Title</label>
          <input id="job_title" type="text" name="job_title" className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
          <textarea id="notes" name="notes" rows={4} className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div>
          <label htmlFor="profile_image" className="block text-sm font-medium text-gray-300 mb-1">Profile Image</label>
          <input id="profile_image" type="file" name="profile_image" accept="image/*" className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
          {isSubmitting ? 'Creating...' : 'Create Contact'}
        </button>
      </form>
    </div>
  );
}
// v.1.1.2 ==============================================================