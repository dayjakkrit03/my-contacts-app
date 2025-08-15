// v.1.1.1 ===========================================================================
// app/contactsviews/page.tsx
import Link from 'next/link';
import { getContacts } from '../../lib/actions';
import ContactList from '../components/ContactList';
import ExportAllButton from '../components/ExportAllButton';

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-100">My Contacts</h1>
      <div className="flex flex-col sm:flex-row gap-3">
        {/* <Link href="/contacts/new" className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add New Contact
        </Link> */}
        <ExportAllButton />
      </div>

      <ContactList contacts={contacts} />
    </div>
  );
}

// v.1.1.1 ===================================================================