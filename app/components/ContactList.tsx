'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { Loader2, Download, X } from 'lucide-react';
import { Contact, deleteContact } from '../../lib/actions';
import ProfileImage from './ProfileImage';

interface ContactListProps {
  contacts: Contact[];
}

export default function ContactList({ contacts }: ContactListProps) {
  const router = useRouter();
  const [isExportingId, setIsExportingId] = useState<number | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('');

  const handleExportClick = async (contact: Contact) => {
    setIsExportingId(contact.id);
    try {
      const response = await fetch(`/api/export-vcf/${contact.id}`);
      if (!response.ok) {
        throw new Error('Failed to export contact.');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      setDownloadUrl(url);
      setDownloadFilename(`${contact.first_name || 'contact'}.vcf`);
      setModalOpen(true);

    } catch (error) {
      console.error(error);
      toast.error('Could not export contact.');
    } finally {
      setIsExportingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    setIsDeletingId(id);
    // A simple confirmation dialog
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(id);
        toast.success('Contact deleted successfully');
        router.refresh(); // Refresh the page to show the updated list
      } catch (error) {
        toast.error('Failed to delete contact.');
        console.error(error);
      }
    }
    setIsDeletingId(null);
  };

  const closeModal = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl); // Clean up the blob URL
    }
    setModalOpen(false);
    setDownloadUrl(null);
    setDownloadFilename('');
  };

  return (
    <>
      <ul className="space-y-4">
        {contacts.length === 0 ? (
          <p className="text-center text-gray-400 mt-8">No contacts found. Add some!</p>
        ) : (
          contacts.map((contact) => (
            <li key={contact.id} className="bg-zinc-800 p-4 rounded-lg flex items-start gap-4">
              <ProfileImage 
                src={contact.profile_image_url} 
                alt={contact.first_name || 'Profile Image'} 
                firstName={contact.first_name} 
              />
              <div className="flex-grow overflow-hidden">
                <h3 className="font-semibold text-lg text-white truncate">{contact.first_name} {contact.last_name}</h3>
                {contact.phone_number && (
                  <p className="text-sm text-gray-300 truncate">
                    Phone: <a href={`tel:${contact.phone_number}`} className="text-blue-400 hover:underline">{contact.phone_number}</a>
                  </p>
                )}
                {contact.email && (
                  <p className="text-sm text-gray-300 truncate">
                    Email: <a href={`mailto:${contact.email}`} className="text-blue-400 hover:underline">{contact.email}</a>
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Link href={`/contacts/edit/${contact.id}`} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-center">
                  Edit
                </Link>
                <button
                  onClick={() => handleExportClick(contact)}
                  disabled={isExportingId === contact.id}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-center flex items-center justify-center gap-1 disabled:bg-gray-500"
                >
                  {isExportingId === contact.id ? <Loader2 size={16} className="animate-spin" /> : 'Export'}
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  disabled={isDeletingId === contact.id}
                  className="w-full px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-1 disabled:bg-red-800"
                >
                  {isDeletingId === contact.id ? <Loader2 size={16} className="animate-spin" /> : 'Delete'}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {modalOpen && downloadUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-800 rounded-lg p-6 w-full max-w-sm text-center shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-2">Export Ready</h3>
            <p className="text-gray-300 mb-6">Your contact file is ready to be saved.</p>
            <a
              href={downloadUrl}
              download={downloadFilename}
              onClick={() => setTimeout(closeModal, 500)} // Close modal shortly after click
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-bold"
            >
              <Download size={20} />
              Save to Device
            </a>
            <button
              onClick={closeModal}
              className="w-full mt-3 px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}