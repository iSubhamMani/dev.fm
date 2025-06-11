/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import Github from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "read:user repo",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // When the user signs in, attach the access token to the JWT
      if (account?.access_token) {
        token.userId = account.providerAccountId;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose the access token to the client via session
      session.accessToken = token.accessToken as string;
      session.userId = token.userId as string;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
