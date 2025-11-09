import { DefaultSession, DefaultUser } from 'next-auth';
import { Role } from './index';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      rol: Role;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    rol: Role;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    rol: Role;
  }
}
