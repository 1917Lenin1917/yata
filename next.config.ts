// import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

// const withSerwist = withSerwistInit({
//   swSrc: "src/app/sw.ts",
//   swDest: "public/sw.js",
//
//   register: true,
//   reloadOnOnline: true,
//   disable: process.env.NODE_ENV !== "production",
// });
//
// export default withSerwist({
//   experimental: {
//     reactCompiler: true,
//   },
// });
const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [new URL("https://cataas.com/cat")],
  },
};

export default nextConfig;
