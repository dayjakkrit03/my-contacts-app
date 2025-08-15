import Link from 'next/link';
import { getContacts } from '../lib/actions';
import ContactList from './components/ContactList';

export default async function HomePage() {
  const contacts = await getContacts();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-100">My Contacts</h1>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/contacts/new" className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add New Contact
        </Link>
        <a 
          href="/api/export-all-vcf" 
          download="all_contacts.vcf"
          className="flex-1 text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Export All Contacts
        </a>
      </div>

      <ContactList contacts={contacts} />
    </div>
  );
}