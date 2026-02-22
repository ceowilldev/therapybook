import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const therapist = await prisma.therapist.findUnique({
        where: { userId: user.id }
      })
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          therapistId: therapist?.id
        }
      }
    }
  },
  pages: {
    signIn: '/signin',
  }
})

export { handler as GET, handler as POST }
