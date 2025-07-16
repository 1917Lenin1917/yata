import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { auth: withAuth } = NextAuth(authConfig);

export default withAuth((req) => {
  console.log(req);
  if (!req.auth) {
    return Response.redirect(new URL("/auth/login", req.url));
  }
});

// Only run on private routes
export const config = {
  matcher: ["/tickets/:path*"],
};
