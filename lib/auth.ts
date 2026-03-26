import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user";
import { loginSchema } from "@/lib/validators";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        await connectToDatabase();
        const user = await User.findOne({ email: parsed.data.email.toLowerCase() });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(parsed.data.password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          currency: user.currency
        };
      }
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
          })
        ]
      : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
          })
        ]
      : [])
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account || account.provider === "credentials" || !user.email) {
        return true;
      }

      await connectToDatabase();
      const existingUser = await User.findOne({ email: user.email.toLowerCase() });

      if (!existingUser) {
        const placeholderPassword = await bcrypt.hash(randomUUID(), 12);
        await User.create({
          name: user.name || user.email.split("@")[0],
          email: user.email.toLowerCase(),
          password: placeholderPassword,
          currency: "USD"
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.currency = user.currency;
      }

      if ((!token.id || !token.currency) && token.email) {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: token.email.toLowerCase() });

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.currency = dbUser.currency;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.currency = token.currency;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET
};

export function getAuthSession() {
  return getServerSession(authOptions);
}
