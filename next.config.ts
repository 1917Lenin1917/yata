import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",

  register: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV !== "production",
});

export default withSerwist({});
