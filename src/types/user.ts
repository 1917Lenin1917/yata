export interface User {
  id: number;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
}

declare module "next-auth" {
  interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }
}
