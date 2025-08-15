// v.1.1.4 ================================================================================
// app/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import liff from '@line/liff';

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID;

// กำหนด type จาก liff.getProfile()
type LiffProfile = Awaited<ReturnType<typeof liff.getProfile>>;

export default function HomePage() {
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // ✅ ลบ isNotInLine ออก เพราะเราจะอนุญาตให้ Login เสมอ
  // const [isNotInLine, setIsNotInLine] = useState(false);
  
  const [pwaStatus, setPwaStatus] = useState<"กำลังทำงาน" | "ปิดอยู่">("ปิดอยู่");

  useEffect(() => {
    const initLiff = async () => {
      try {
        if (!LIFF_ID) {
          // หาก LIFF_ID ไม่ถูกกำหนด จะแสดง Error และไม่พยายาม Init LIFF
          setLiffError("LIFF_ID is not defined. LINE login features will be unavailable.");
          setIsLoading(false);
          return;
        }

        await liff.init({ liffId: LIFF_ID });

        // ตรวจสอบสถานะการล็อกอินเสมอ ไม่ว่าจะอยู่ใน LINE Client หรือไม่
        setIsLoggedIn(liff.isLoggedIn());

        if (liff.isLoggedIn()) {
          // หากล็อกอินอยู่ ดึงข้อมูลโปรไฟล์
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
        } 
        // ✅ ไม่ต้องมี else if (!liff.isInClient()) แล้ว เพราะเราจะให้ login ได้เสมอ
        // หากไม่ได้ล็อกอิน liff.login() จะถูกเรียกเมื่อผู้ใช้กดปุ่ม
        
      } catch (err: unknown) {
        console.error("LIFF init error:", err);
        // setLiffError(err.message || 'Failed to initialize LIFF.');
        const message = err instanceof Error ? err.message : 'Failed to initialize LIFF.';
        setLiffError(message);
        // setIsNotInLine(true); // ลบออก
      } finally {
        setIsLoading(false);
      }
    };

     // ✅ เช็คสถานะ PWA
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        if (registrations.length > 0) {
          setPwaStatus("กำลังทำงาน");
        } else {
          setPwaStatus("ปิดอยู่");
        }
      });
    }

    initLiff();
  }, []);

  const handleLogin = () => {
    // เรียก liff.login() เสมอเมื่อยังไม่ได้ล็อกอิน
    // LIFF จะจัดการ Redirect ไปหน้า LINE Login หรือ Silent Login ให้เอง
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  };

  const handleLogout = () => {
    if (liff.isLoggedIn()) {
      liff.logout();
      setIsLoggedIn(false);
      setProfile(null);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.center}>
        <p>กำลังโหลด LIFF App...</p>
      </div>
    );
  }

  // ✅ ลบเงื่อนไข if (isNotInLine) ออก เพราะเราจะแสดง UI เดียวกันทั้งหมด
  // และให้ปุ่ม Login with LINE จัดการการล็อกอินไม่ว่าจะอยู่ใน LINE หรือ Browser

  return (
    <div style={styles.center}>
      <h1>ยินดีต้อนรับสู่ My Contacts App!</h1>
      <p>จัดการรายชื่อผู้ติดต่อของคุณได้อย่างง่ายดาย</p>

      {/* แสดง Error หาก LIFF_ID ไม่ถูกต้อง หรือ Init ล้มเหลว */}
      {liffError && (
        <p style={{ color: 'red', marginTop: '20px' }}>
          {liffError}
          {liffError.includes("LIFF_ID is not defined") && (
            <span> โปรดตั้งค่า NEXT_PUBLIC_LIFF_ID ใน Environment Variables</span>
          )}
        </p>
      )}

      {isLoggedIn && profile ? (
        <div style={styles.profileCard}>
          <h2>โปรไฟล์ LINE</h2>
          {profile.pictureUrl && (
            <img
              src={profile.pictureUrl}
              alt={profile.displayName}
              style={styles.profileImage}
            />
          )}
          <p>ชื่อ: <strong>{profile.displayName}</strong></p>
          {profile.userId && <p>User ID: <strong>{profile.userId}</strong></p>}
          <button onClick={handleLogout} style={styles.buttonRed}>
            ออกจากระบบ LINE
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 20 }}>
          <p>คุณยังไม่ได้ล็อกอินด้วย LINE</p>
          <button onClick={handleLogin} style={styles.buttonGreen}>
            ล็อกอินด้วย LINE
          </button>
        </div>
      )}

      <Link href="/contactsviews" style={styles.buttonBlue}>
        ไปที่รายชื่อผู้ติดต่อ
      </Link>

      <div style={styles.dbStatus}>
        <p>สถานะการเชื่อมต่อฐานข้อมูล: <span style={{ color: 'green', fontWeight: 'bold' }}>สำเร็จ!</span></p>
        <p>สถานะ PWA: <strong style={{ color: pwaStatus === "กำลังทำงาน" ? "green" : "red" }}>{pwaStatus}</strong></p>
      </div>
    </div>
  );
}

// 🎨 Styles Object
const styles: { [key: string]: React.CSSProperties } = {
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  buttonBlue: {
    padding: '10px 20px',
    backgroundColor: '#0070f3',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    marginTop: '20px',
  },
  buttonRed: {
    padding: '8px 15px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  buttonGreen: {
    padding: '10px 20px',
    backgroundColor: '#00B900',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  profileCard: {
    marginTop: '20px',
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  profileImage: {
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    objectFit: 'cover',
  },
  dbStatus: {
    marginTop: '30px',
    fontSize: '0.8em',
    color: '#666',
  },
};

// v.1.1.4 ================================================================================

// v.1.1.3 ================================================================================
// app/page.tsx
// 'use client';

// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import liff from '@line/liff';

// const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID;

// // ✅ กำหนด type จาก liff.getProfile()
// type LiffProfile = Awaited<ReturnType<typeof liff.getProfile>>;

// export default function HomePage() {
//   const [profile, setProfile] = useState<LiffProfile | null>(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [liffError, setLiffError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isNotInLine, setIsNotInLine] = useState(false);

//   useEffect(() => {
//     const initLiff = async () => {
//       try {
//         if (!LIFF_ID) {
//           setIsNotInLine(true);
//           setLiffError("LIFF_ID is not defined.");
//           return;
//         }
//         await liff.init({ liffId: LIFF_ID });

//         if (liff.isInClient()) {
//           setIsLoggedIn(liff.isLoggedIn());
//           if (liff.isLoggedIn()) {
//             const userProfile = await liff.getProfile();
//             setProfile(userProfile);
//           }
//         } else {
//           setIsNotInLine(true);
//           setLiffError("This app is not running inside LINE.");
//         }
//       } catch (err: any) {
//         console.error("LIFF init error:", err);
//         setLiffError(err.message || 'Failed to initialize LIFF.');
//         setIsNotInLine(true);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     initLiff();
//   }, []);

//   const handleLogin = () => {
//     if (!liff.isLoggedIn()) {
//       liff.login();
//     }
//   };

//   const handleLogout = () => {
//     if (liff.isLoggedIn()) {
//       liff.logout();
//       setIsLoggedIn(false);
//       setProfile(null);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div style={styles.center}>
//         <p>กำลังโหลด LIFF App...</p>
//       </div>
//     );
//   }

//   if (isNotInLine) {
//     return (
//       <div style={styles.center}>
//         <h1>ยินดีต้อนรับสู่ My Contacts App!</h1>
//         <p>จัดการรายชื่อผู้ติดต่อของคุณได้อย่างง่ายดาย</p>

//         {liffError && <p style={{ color: 'orange', marginTop: 20 }}>{liffError}</p>}

//         <Link href="/contacts" style={styles.buttonBlue}>
//           ไปที่รายชื่อผู้ติดต่อ
//         </Link>

//         <div style={styles.dbStatus}>
//           <p>สถานะการเชื่อมต่อฐานข้อมูล: <span style={{ color: 'green', fontWeight: 'bold' }}>สำเร็จ!</span></p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.center}>
//       <h1>ยินดีต้อนรับสู่ My Contacts App!</h1>
//       <p>จัดการรายชื่อผู้ติดต่อของคุณได้อย่างง่ายดาย</p>

//       {isLoggedIn && profile ? (
//         <div style={styles.profileCard}>
//           <h2>โปรไฟล์ LINE</h2>
//           {profile.pictureUrl && (
//             <img
//               src={profile.pictureUrl}
//               alt={profile.displayName}
//               style={styles.profileImage}
//             />
//           )}
//           <p>ชื่อ: <strong>{profile.displayName}</strong></p>
//           {profile.userId && <p>User ID: <strong>{profile.userId}</strong></p>}
//           <button onClick={handleLogout} style={styles.buttonRed}>
//             ออกจากระบบ LINE
//           </button>
//         </div>
//       ) : (
//         <div style={{ marginTop: 20 }}>
//           <p>คุณยังไม่ได้ล็อกอินด้วย LINE</p>
//           <button onClick={handleLogin} style={styles.buttonGreen}>
//             ล็อกอินด้วย LINE
//           </button>
//         </div>
//       )}

//       <Link href="/contacts" style={styles.buttonBlue}>
//         ไปที่รายชื่อผู้ติดต่อ
//       </Link>

//       <div style={styles.dbStatus}>
//         <p>สถานะการเชื่อมต่อฐานข้อมูล: <span style={{ color: 'green', fontWeight: 'bold' }}>สำเร็จ!</span></p>
//       </div>
//     </div>
//   );
// }

// // 🎨 Styles Object
// const styles: { [key: string]: React.CSSProperties } = {
//   center: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: '100vh',
//     textAlign: 'center',
//     fontFamily: 'sans-serif',
//   },
//   buttonBlue: {
//     padding: '10px 20px',
//     backgroundColor: '#0070f3',
//     color: 'white',
//     textDecoration: 'none',
//     borderRadius: '5px',
//     marginTop: '20px',
//   },
//   buttonRed: {
//     padding: '8px 15px',
//     backgroundColor: '#dc3545',
//     color: 'white',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     marginTop: '10px',
//   },
//   buttonGreen: {
//     padding: '10px 20px',
//     backgroundColor: '#00B900',
//     color: 'white',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     fontSize: '16px',
//   },
//   profileCard: {
//     marginTop: '20px',
//     padding: '15px',
//     border: '1px solid #eee',
//     borderRadius: '8px',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     gap: '10px',
//   },
//   profileImage: {
//     borderRadius: '50%',
//     width: '80px',
//     height: '80px',
//     objectFit: 'cover',
//   },
//   dbStatus: {
//     marginTop: '30px',
//     fontSize: '0.8em',
//     color: '#666',
//   },
// };


// v.1.1.3 ================================================================================

// v.1.1.2 ================================================================================
// app/page.tsx
// import Link from 'next/link';

// export default function HomePage() {
//   return (
//     <div style={{ 
//       display: 'flex', 
//       flexDirection: 'column', 
//       alignItems: 'center', 
//       justifyContent: 'center', 
//       minHeight: '100vh', 
//       textAlign: 'center',
//       fontFamily: 'sans-serif'
//     }}>
//       <h1>Welcome to My Contacts App!</h1>
//       <p>Manage your contacts easily.</p>
//       <Link href="/contacts" style={{ 
//         padding: '10px 20px', 
//         backgroundColor: '#0070f3', 
//         color: 'white', 
//         textDecoration: 'none', 
//         borderRadius: '5px', 
//         marginTop: '20px' 
//       }}>
//         Go to Contacts
//       </Link>
//       <div style={{ marginTop: '30px', fontSize: '0.8em', color: '#666' }}>
//         <p>Database Connection Status: <span style={{ color: 'green', fontWeight: 'bold' }}>Successful!</span></p>
//       </div>
//     </div>
//   );
// }

// v.1.1.2 ================================================================================

// v.1.1.1 ================================================================================
// app/page.tsx
// import { redirect } from 'next/navigation';

// export default function HomePage() {
//   // Redirect ไปยังหน้า /contacts ทันที
//   redirect('/contacts');
//   // เนื่องจากมีการ redirect, โค้ดด้านล่างนี้จะไม่ถูกเรียกใช้
//   return null; 
// }
// v.1.1.1 ================================================================================

// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
//           <li className="mb-2 tracking-[-.01em]">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
//               app/page.tsx
//             </code>
//             .
//           </li>
//           <li className="tracking-[-.01em]">
//             Save and see your changes instantly.
//           </li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }
