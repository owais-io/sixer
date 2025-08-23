import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Add your authorized email addresses here
      const authorizedEmails = [
        'owais.abbasi9@gmail.com', // Replace with your actual email
        // Add more authorized emails here
      ]
      
      if (authorizedEmails.includes(user.email)) {
        return true
      }
      
      return false // Deny access for unauthorized users
    },
    async session({ session, token }) {
      return session
    },
    async jwt({ token, account, user }) {
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
})