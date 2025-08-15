import Link from 'next/link';
import { getContacts } from '../lib/actions';
import ContactList from './components/ContactList';
import ExportAllButton from './components/ExportAllButton';
import { Search } from 'lucide-react';

export default async function HomePage() {
  const contacts = await getContacts();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-100">
        My Contacts
      </h1>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/contacts/new" className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add New Contact
        </Link>
        <ExportAllButton />
      </div>

      {contacts.length > 0 ? (
        <ContactList contacts={contacts} />
      ) : (
        <div className="text-center text-gray-400 py-10 flex flex-col items-center gap-4">
          <Search size={48} className="text-gray-600" />
          <p className="text-lg font-semibold">No contacts found</p>
          <p className="text-sm">
            Get started by adding a new contact.
          </p>
        </div>
      )}
    </div>
  );
}