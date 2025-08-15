import type { NextConfig } from "next";
// import withPWAInit from "@ducanh2912/next-pwa";

// const withPWA = withPWAInit({
//   dest: "public",
//   disable: process.env.NODE_ENV === "development",
//   register: true,
//   workboxOptions: {
//     skipWaiting: true,
//     clientsClaim: true,
//   },
// });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ptsv8ytv52ixxwnb.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "profile.line-scdn.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;