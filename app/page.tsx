import Link from 'next/link';
import { getContacts, deleteContact, Contact } from '../lib/actions';
import ProfileImage from './components/ProfileImage';

export default async function HomePage() {
  const contacts = await getContacts();

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1>My Contacts</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Link href="/contacts/new" style={{ padding: '8px 15px', backgroundColor: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Add New Contact
        </Link>
        <a 
          href="/api/export-all-vcf" 
          download="all_contacts.vcf"
          style={{ padding: '8px 15px', backgroundColor: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: '5px' }}
        >
          Export All Contacts
        </a>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
        {contacts.length === 0 ? (
          <p>No contacts found. Add some!</p>
        ) : (
          contacts.map((contact: Contact) => (
            <li key={contact.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <ProfileImage 
                src={contact.profile_image_url} 
                alt={contact.first_name || 'Profile Image'} 
                firstName={contact.first_name} 
              />
              <div style={{ flexGrow: 1 }}>
                <h3>{contact.first_name} {contact.last_name}</h3>
                {contact.phone_number && (
                  <p style={{ margin: '0' }}>
                    Phone: <a href={`tel:${contact.phone_number}`} style={{ color: '#0070f3', textDecoration: 'underline' }}>{contact.phone_number}</a>
                  </p>
                )}
                {contact.email && (
                  <p style={{ margin: '0' }}>
                    Email: <a href={`mailto:${contact.email}`} style={{ color: '#0070f3', textDecoration: 'underline' }}>{contact.email}</a>
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                <Link href={`/contacts/edit/${contact.id}`} style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: 'white', textDecoration: 'none', borderRadius: '3px' }}>
                  Edit
                </Link>
                <a 
                  href={`/api/export-vcf/${contact.id}`} 
                  download={`${contact.first_name || 'contact'}.vcf`}
                  style={{ padding: '5px 10px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '3px' }}
                >
                  Export VCF
                </a>
                <form action={async () => {
                  'use server';
                  await deleteContact(contact.id);
                }}>
                  <button type="submit" style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
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