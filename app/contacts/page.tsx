// v.1.1.5 =========================================================================
// app/contacts/page.tsx
import Link from 'next/link';
import { getContacts, deleteContact, Contact } from '../../lib/actions';
import ProfileImage from '../components/ProfileImage';

export default async function ContactsPage() {
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
                {/* เพิ่มลิงก์สำหรับเบอร์โทรศัพท์ */}
                {contact.phone_number && (
                  <p style={{ margin: '0' }}>
                    Phone: <a href={`tel:${contact.phone_number}`} style={{ color: '#0070f3', textDecoration: 'underline' }}>{contact.phone_number}</a>
                  </p>
                )}
                {/* เพิ่มลิงก์สำหรับอีเมล */}
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

// v.1.1.5 ==========================================================================

// v.1.1.4 ==========================================================================
// app/contacts/page.tsx
// import Link from 'next/link';
// import { getContacts, deleteContact, Contact } from '../../lib/actions';
// import ProfileImage from '../components/ProfileImage';

// export default async function ContactsPage() {
//   const contacts = await getContacts();

//   return (
//     <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
//       <h1>My Contacts</h1>
//       <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
//         <Link href="/contacts/new" style={{ padding: '8px 15px', backgroundColor: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
//           Add New Contact
//         </Link>
//         {/* *** เพิ่มปุ่ม Export All Contacts *** */}
//         <a 
//           href="/api/export-all-vcf" // ชี้ไปที่ API Route ใหม่
//           download="all_contacts.vcf"
//           style={{ padding: '8px 15px', backgroundColor: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: '5px' }}
//         >
//           Export All Contacts
//         </a>
//         {/* *** สิ้นสุดปุ่ม Export All Contacts *** */}
//       </div>

//       <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
//         {contacts.length === 0 ? (
//           <p>No contacts found. Add some!</p>
//         ) : (
//           contacts.map((contact: Contact) => (
//             <li key={contact.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
//               <ProfileImage 
//                 src={contact.profile_image_url} 
//                 alt={contact.first_name || 'Profile Image'} 
//                 firstName={contact.first_name} 
//               />
//               <div style={{ flexGrow: 1 }}>
//                 <h3>{contact.first_name} {contact.last_name}</h3>
//                 {contact.phone_number && <p style={{ margin: '0' }}>Phone: {contact.phone_number}</p>}
//                 {contact.email && <p style={{ margin: '0' }}>Email: {contact.email}</p>}
//               </div>
//               <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
//                 <Link href={`/contacts/edit/${contact.id}`} style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: 'white', textDecoration: 'none', borderRadius: '3px' }}>
//                   Edit
//                 </Link>
//                 <a 
//                   href={`/api/export-vcf/${contact.id}`} 
//                   download={`${contact.first_name || 'contact'}.vcf`}
//                   style={{ padding: '5px 10px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '3px' }}
//                 >
//                   Export VCF
//                 </a>
//                 <form action={async () => {
//                   'use server';
//                   await deleteContact(contact.id);
//                 }}>
//                   <button type="submit" style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
//                     Delete
//                   </button>
//                 </form>
//               </div>
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   );
// }

// v.1.1.4 ==========================================================================

// v.1.1.3 ==========================================================================
// app/contacts/page.tsx
// import Link from 'next/link';
// import { getContacts, deleteContact, Contact } from '../../lib/actions';
// // import Image from 'next/image'; // ไม่ต้องใช้ next/image โดยตรงแล้ว
// import ProfileImage from '../components/ProfileImage'; // Import Client Component ใหม่

// export default async function ContactsPage() {
//   const contacts = await getContacts();

//   return (
//     <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
//       <h1>My Contacts</h1>
//       <Link href="/contacts/new" style={{ padding: '8px 15px', backgroundColor: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
//         Add New Contact
//       </Link>

//       <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
//         {contacts.length === 0 ? (
//           <p>No contacts found. Add some!</p>
//         ) : (
//           contacts.map((contact: Contact) => (
//             <li key={contact.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
//               {/* *** ใช้ ProfileImage Client Component แทน *** */}
//               <ProfileImage 
//                 src={contact.profile_image_url} 
//                 alt={contact.first_name || 'Profile Image'} 
//                 firstName={contact.first_name} 
//               />
//               {/* *** สิ้นสุดส่วนรูปภาพ *** */}
//               <div style={{ flexGrow: 1 }}>
//                 <h3>{contact.first_name} {contact.last_name}</h3>
//                 {contact.phone_number && <p style={{ margin: '0' }}>Phone: {contact.phone_number}</p>}
//                 {contact.email && <p style={{ margin: '0' }}>Email: {contact.email}</p>}
//               </div>
//               <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
//                 <Link href={`/contacts/edit/${contact.id}`} style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: 'white', textDecoration: 'none', borderRadius: '3px' }}>
//                   Edit
//                 </Link>
//                 <form action={async () => {
//                   'use server';
//                   await deleteContact(contact.id);
//                 }}>
//                   <button type="submit" style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
//                     Delete
//                   </button>
//                 </form>
//               </div>
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   );
// }

// v.1.1.3 ==========================================================================

// v.1.1.2 ==========================================================================
// app/contacts/page.tsx
// import Link from 'next/link';
// import { getContacts, deleteContact, Contact } from '../../lib/actions';
// import Image from 'next/image'; // Import next/image

// export default async function ContactsPage() {
//   const contacts = await getContacts();

//   return (
//     <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
//       <h1>My Contacts</h1>
//       <Link href="/contacts/new" style={{ padding: '8px 15px', backgroundColor: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
//         Add New Contact
//       </Link>

//       <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
//         {contacts.length === 0 ? (
//           <p>No contacts found. Add some!</p>
//         ) : (
//           contacts.map((contact: Contact) => (
//             <li key={contact.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
//               {/* *** แสดงรูปภาพโปรไฟล์ (กลมๆ) *** */}
//               {contact.profile_image_url ? (
//                 <Image
//                   src={contact.profile_image_url}
//                   alt={contact.first_name || 'Profile Image'}
//                   width={60}
//                   height={60}
//                   style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} // flexShrink: 0 เพื่อไม่ให้รูปหด
//                   onError={(e) => {
//                     // Fallback to a placeholder image if the image fails to load
//                     e.currentTarget.src = `https://placehold.co/60x60/cccccc/000000?text=${contact.first_name.charAt(0)}`;
//                   }}
//                 />
//               ) : (
//                 // Placeholder ถ้าไม่มีรูปภาพ
//                 <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#fff', flexShrink: 0 }}>
//                   {contact.first_name.charAt(0).toUpperCase()}
//                 </div>
//               )}
//               {/* *** สิ้นสุดส่วนรูปภาพ *** */}
//               <div style={{ flexGrow: 1 }}> {/* ให้ div นี้ขยายเต็มพื้นที่ที่เหลือ */}
//                 <h3>{contact.first_name} {contact.last_name}</h3>
//                 {contact.phone_number && <p style={{ margin: '0' }}>Phone: {contact.phone_number}</p>}
//                 {contact.email && <p style={{ margin: '0' }}>Email: {contact.email}</p>}
//               </div>
//               <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}> {/* flexShrink: 0 เพื่อไม่ให้ปุ่มหด */}
//                 <Link href={`/contacts/edit/${contact.id}`} style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: 'white', textDecoration: 'none', borderRadius: '3px' }}>
//                   Edit
//                 </Link>
//                 <form action={async () => {
//                   'use server';
//                   await deleteContact(contact.id);
//                 }}>
//                   <button type="submit" style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
//                     Delete
//                   </button>
//                 </form>
//               </div>
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   );
// }

// v.1.1.2 ==========================================================================

// app/contacts/page.tsx
// import Link from 'next/link';
// // แก้ไข path สำหรับ lib/actions และ import Contact interface เพื่อความปลอดภัยของ type
// import { getContacts, deleteContact, Contact } from '../../lib/actions'; 

// export default async function ContactsPage() {
//   const contacts = await getContacts();

//   return (
//     <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
//       <h1>My Contacts</h1>
//       <Link href="/contacts/new" style={{ padding: '8px 15px', backgroundColor: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
//         Add New Contact
//       </Link>

//       <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
//         {contacts.length === 0 ? (
//           <p>No contacts found. Add some!</p>
//         ) : (
//           contacts.map((contact: Contact) => ( // เพิ่ม type annotation สำหรับ 'contact'
//             <li key={contact.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <div>
//                 <h3>{contact.first_name} {contact.last_name}</h3>
//                 {contact.phone_number && <p>Phone: {contact.phone_number}</p>}
//                 {contact.email && <p>Email: {contact.email}</p>}
//               </div>
//               <div style={{ display: 'flex', gap: '10px' }}>
//                 <Link href={`/contacts/edit/${contact.id}`} style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: 'white', textDecoration: 'none', borderRadius: '3px' }}>
//                   Edit
//                 </Link>
//                 {/* ปุ่มลบ ใช้ Server Action โดยตรงใน Form */}
//                 <form action={async () => {
//                   'use server'; // ต้องระบุ use server ถ้าใช้ Server Action ใน Client Component ที่ไม่ได้อยู่ใน <form action={...}>
//                   await deleteContact(contact.id);
//                 }}>
//                   <button type="submit" style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
//                     Delete
//                   </button>
//                 </form>
//               </div>
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   );
// }
