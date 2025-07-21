import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const authConfig = {
  // adapter: PrismaAdapter(prisma), // Temporarily disabled for JWT sessions
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Add user info to the token when signing in
      if (user) {
        token.role = 'admin'; // Since only allowed emails can sign in
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add token info to the session
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Debug logging
      console.log('Sign-in attempt:', {
        email: user.email,
        name: user.name,
        provider: account.provider
      });
      
      // Only allow specific email addresses for admin access
      const allowedEmails = [
        'kayp.kieran@gmail.com', // Add your email here
        'kaylode@gmail.com', // Alternative email
        // Add other admin emails as needed
      ];
      
      if (allowedEmails.includes(user.email)) {
        console.log('✅ Sign-in allowed for:', user.email);
        return true;
      }
      
      console.log('❌ Sign-in rejected for:', user.email);
      // Reject sign-in for non-admin users
      return false;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authConfig)
