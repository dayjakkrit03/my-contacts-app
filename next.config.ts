// v.1.1.2 ============================================================
// next.config.ts
import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const baseConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ptsv8ytv52ixxwnb.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default withPWA({
  dest: "public",
  disable: false, // ✅ เปิด PWA ใน dev ด้วย // ✅ ใช้ PWA ทั้ง dev และ prod  //disable: process.env.NODE_ENV === "development", 
  register: true,
  workboxOptions: {
    skipWaiting: true, // ✅ ให้ SW update ทันที
    clientsClaim: true, // ✅ ให้ SW ควบคุมทุกแท็บทันที
  },
})(baseConfig);

// v.1.1.2 ============================================================

// next.config.ts
// import type { NextConfig } from "next";
// import withPWA from "@ducanh2912/next-pwa";

// const nextConfig: NextConfig = {

//   reactStrictMode: true,

//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "ptsv8ytv52ixxwnb.public.blob.vercel-storage.com",
//         pathname: "/**",
//       },
//     ],
//   },

//   // หากคุณใช้ Turbopack (ตามที่เห็นใน log) อาจจะต้องเพิ่ม experimental.turbopack = true
//   // แต่ถ้าโปรเจกต์คุณสร้างมาด้วย Turbopack อยู่แล้ว อาจไม่จำเป็นต้องระบุซ้ำ
//   experimental: {
//     // turbopack: true, 
//   },

// };

// const withPWAConfig = withPWA({
//   dest: "public",
//   disable: process.env.NODE_ENV === "development", // ✅ อย่าลืมคอมเมนต์บรรทัดนี้ออกเมื่อจะ Deploy Production
//   register: true,
//   // workboxOptions ไม่จำเป็นต้องระบุถ้าไม่ต้องการปรับแต่งเพิ่มเติม
//   // workboxOptions: {
//   //   // clientsClaim: true,
//   //   // skipWaiting: true,
//   // }
// });

// export default nextConfig;
