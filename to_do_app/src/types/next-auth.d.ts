import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    username: string;
    role: number;
    id: string;
  }
  interface Session {
    user: User;
    token: {
      username: string;
      role: number;
      id: string;
    };
  }
}
