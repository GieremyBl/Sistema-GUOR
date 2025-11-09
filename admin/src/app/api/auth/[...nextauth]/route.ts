import NextAuth, { AuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';
import { Role } from '@/app/types/index';
import { config } from '@/config/auth.config';

// Extender el tipo Session de NextAuth
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      rol: Role;
    } & DefaultSession['user']
  }

  interface User {
    id: string;
    rol: Role;
  }
}

const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceKey
);

export const authOptions: AuthOptions = {
  secret: config.nextauth.secret,
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciales inválidas');
        }

        // 1. Autenticar con Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password
        });

        if (authError || !authData.user) {
          throw new Error('Credenciales incorrectas');
        }

        // 2. Obtener información del usuario
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('id, email, nombre, apellido, rol, estado')
          .eq('email', credentials.email)
          .single();

        if (userError || !userData) {
          // ¡ESTO NOS DIRÁ EL ERROR EXACTO!
           console.error("Error al buscar en tabla 'usuarios':", userError?.message);
          throw new Error('Usuario no encontrado');
        }
        // 3. Verificar estado del usuario
        if (!userData.estado) {
          throw new Error('Usuario inactivo');
        }
        // 4. Éxito - retornar usuario
        return {
          id: userData.id.toString(),
          email: userData.email,
          name: `${userData.nombre} ${userData.apellido}`,
          rol: userData.rol as Role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.rol = user.rol;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.rol = token.rol as Role;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 días
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };