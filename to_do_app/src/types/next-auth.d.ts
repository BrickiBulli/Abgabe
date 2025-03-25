import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    username: string
    role: Number
  }
  interface Session {
    user: User 
    token:{
        username:string
        role: Number
    }
  }
}