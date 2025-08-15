import Link from 'next/link';
import { getContacts } from '../lib/actions';
import ContactList from './components/ContactList';
import ExportAllButton from './components/ExportAllButton';
import { Search } from 'lucide-react';

// Define a dedicated type for the page's props
type HomePageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const queryParam = searchParams?.q;
  const query = (Array.isArray(queryParam) ? queryParam[0] : queryParam) || '';
  const contacts = await getContacts(query);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-100">
        {query ? `Results for "${query}"` : 'My Contacts'}
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
          {query && (
            <p className="text-sm">
              Try a different search term or{' '}
              <Link href="/" className="text-blue-400 hover:underline">
                clear the search
              </Link>
              .
            </p>
          )}
        </div>
      )}
    </div>
  );
}