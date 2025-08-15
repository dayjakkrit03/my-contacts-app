import Link from 'next/link';
import { getContacts, deleteContact, Contact } from '../lib/actions';
import ProfileImage from './components/ProfileImage';

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

      <ul className="space-y-4">
        {contacts.length === 0 ? (
          <p className="text-center text-gray-400 mt-8">No contacts found. Add some!</p>
        ) : (
          contacts.map((contact: Contact) => (
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
                <a 
                  href={`/api/export-vcf/${contact.id}`} 
                  download={`${contact.first_name || 'contact'}.vcf`}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-center"
                >
                  Export
                </a>
                <form action={async () => {
                  'use server';
                  await deleteContact(contact.id);
                }}>
                  <button type="submit" className="w-full px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}