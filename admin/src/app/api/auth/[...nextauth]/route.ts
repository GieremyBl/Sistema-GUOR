import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
          throw new Error("Email y contraseña son requeridos");
        }

        try {
          // 1. Buscar usuario en tu base de datos
          const usuario = await prisma.usuario.findUnique({
            where: { email: credentials.email }
          });

          if (!usuario) {
            throw new Error("Credenciales inválidas");
          }

          // 2. Verificar contraseña
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            usuario.contraseña
          );

          if (!isPasswordValid) {
            throw new Error("Credenciales inválidas");
          }

          // 3. Verificar que el usuario esté activo
          if (!usuario.estado) {
            throw new Error("Usuario inactivo");
          }

          // 4. Login en Supabase Auth (opcional pero recomendado)
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password
          });

          // Si hay error en Supabase pero el usuario existe en BD, continuar
          // (puede pasar si el usuario se creó directamente en BD)

          return {
            id: usuario.id.toString(),
            email: usuario.email,
            name: `${usuario.nombre} ${usuario.apellido}`,
            rol: usuario.rol,
            authId: usuario.authId,
          };
        } catch (error: any) {
          console.error("Error en autorización:", error);
          throw new Error(error.message || "Error al autenticar");
        }
      }
    })
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/login")) {
        return baseUrl + "/";
      }
      if (url === "/signout") {
        return baseUrl + "/login";
      }
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl + "/";
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user = {
          ...session.user,
          id: token.id as string,
          rol: token.rol as string,
          authId: token.authId as string,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol = user.rol;
        token.authId = user.authId;
      }
      return token;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };