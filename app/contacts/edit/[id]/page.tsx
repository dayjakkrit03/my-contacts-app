// v.1.1.4 ==============================================================================
// app/contacts/edit/[id]/page.tsx
'use client';

import { getContactById, updateContact, Contact } from '../../../../lib/actions';
import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { processImage } from '../../../../lib/image-utils';

export default function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const contactId = parseInt(id);

  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deleteImage, setDeleteImage] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Effect for cleaning up blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    async function fetchContact() {
      try {
        const fetchedContact = await getContactById(contactId);
        setContact(fetchedContact);
        if (fetchedContact) {
          setImagePreview(fetchedContact.profile_image_url ?? null);
        }
      } catch (error) {
        console.error("Failed to fetch contact:", error);
        toast.error("Could not load contact details.");
        router.push('/');
      }
    }
    fetchContact();
  }, [contactId, router]);

  if (!contact) {
    return <p className="text-center text-gray-400 mt-12">Loading contact...</p>;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Clean up previous blob URL if it exists
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      // Create a new blob URL for the preview
      setImagePreview(URL.createObjectURL(file));
      setDeleteImage(false); // If user selects a new image, cancel deletion
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    formData.append('current_image_url', contact.profile_image_url || '');
    if (deleteImage) {
        formData.append('delete_image', 'on');
    }

    if (imageFile) {
      const processedFile = await processImage(imageFile);
      if (processedFile) {
        formData.set('profile_image', processedFile, processedFile.name);
      } else {
        setIsSubmitting(false);
        return;
      }
    }

    const result = await updateContact(contactId, formData);
    if (result.success) {
      toast.success('Contact updated successfully!');
      router.push('/');
      router.refresh();
    } else {
      toast.error(`Error: ${result.error || 'An unknown error occurred.'}`);
      console.error(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Contact</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="id" value={contact.id} />
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
          <input id="first_name" type="text" name="first_name" defaultValue={contact.first_name} required className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
          <input id="last_name" type="text" name="last_name" defaultValue={contact.last_name || ''} className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
          <input id="phone_number" type="text" name="phone_number" defaultValue={contact.phone_number || ''} className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input id="email" type="email" name="email" defaultValue={contact.email || ''} className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">Company</label>
          <input id="company" type="text" name="company" defaultValue={contact.company || ''} className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="job_title" className="block text-sm font-medium text-gray-300 mb-1">Job Title</label>
          <input id="job_title" type="text" name="job_title" defaultValue={contact.job_title || ''} className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
          <textarea id="notes" name="notes" rows={4} defaultValue={contact.notes || ''} className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Profile Image</label>
          {imagePreview && !deleteImage ? (
            <div className="flex items-center gap-4 mt-2">
                <Image
                  src={imagePreview}
                  alt="Profile Preview"
                  width={80}
                  height={80}
                  className="rounded-full object-cover aspect-square"
                />
              <button
                type="button"
                onClick={() => {
                  setDeleteImage(true);
                  setImagePreview(null);
                }}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Image
              </button>
            </div>
          ) : (
            <input id="profile_image" type="file" name="profile_image" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
          )}
          {deleteImage && contact.profile_image_url && (
            <div className="mt-2 text-sm text-yellow-400 flex items-center gap-4">
              <p>Image will be deleted on update.</p>
              <button type="button" onClick={() => {
                setDeleteImage(false);
                setImagePreview(contact.profile_image_url ?? null);
                setImageFile(null);
              }} className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                Undo
              </button>
            </div>
          )}
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Updating...
            </>
          ) : (
            'Update Contact'
          )}
        </button>
      </form>
    </div>
  );
}
// v.1.1.4 ==============================================================================