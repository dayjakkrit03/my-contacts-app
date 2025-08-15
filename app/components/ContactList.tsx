'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { Loader2, Download, Trash2 } from 'lucide-react';
import { Contact, deleteContact } from '../../lib/actions';
import ProfileImage from './ProfileImage';

interface ContactListProps {
  contacts: Contact[];
}

export default function ContactList({ contacts }: ContactListProps) {
  const router = useRouter();
  const [isExportingId, setIsExportingId] = useState<number | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  
  // State for Export Modal
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('');

  // State for Delete Confirmation Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

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
      setExportModalOpen(true);

    } catch (error) {
      console.error(error);
      toast.error('Could not export contact.');
    } finally {
      setIsExportingId(null);
    }
  };

  const openDeleteModal = (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setContactToDelete(null);
  };

  const confirmDelete = async () => {
    if (!contactToDelete) return;

    setIsDeletingId(contactToDelete.id);
    try {
      await deleteContact(contactToDelete.id);
      toast.success('Contact deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete contact.');
      console.error(error);
    } finally {
      setIsDeletingId(null);
      closeDeleteModal();
    }
  };

  const closeExportModal = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setExportModalOpen(false);
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
                  onClick={() => openDeleteModal(contact)}
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

      {/* Export Modal */}
      {exportModalOpen && downloadUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-800 rounded-lg p-6 w-full max-w-sm text-center shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-2">Export Ready</h3>
            <p className="text-gray-300 mb-6">Your contact file is ready to be saved.</p>
            <a
              href={downloadUrl}
              download={downloadFilename}
              onClick={() => setTimeout(closeExportModal, 500)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-bold"
            >
              <Download size={20} />
              Save to Device
            </a>
            <button
              onClick={closeExportModal}
              className="w-full mt-3 px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && contactToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-800 rounded-lg p-8 w-full max-w-md text-center shadow-xl">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-200 mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the contact for <span className="font-medium text-white">{contactToDelete.first_name} {contactToDelete.last_name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeletingId === contactToDelete.id}
                className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-800 flex items-center justify-center gap-2 font-medium"
              >
                {isDeletingId === contactToDelete.id ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}