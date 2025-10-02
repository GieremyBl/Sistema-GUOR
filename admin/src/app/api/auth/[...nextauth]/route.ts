import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const demoUsers = [
          {
            id: "1",
            email: "admin@modasestilosguor.com",
            password: "admin123",
            name: "Administrador GUOR"
          }
        ];

        const user = demoUsers.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Manejar redirecciones específicas
      if (url.startsWith("/login")) {
        return baseUrl + "/login";
      }
      if (url === "/signout") {
        return baseUrl + "/login";
      }
      // Para otras URLs, mantener el comportamiento por defecto
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl + "/dashboard";
    },
      async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.sub as string,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: "/login", 
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };