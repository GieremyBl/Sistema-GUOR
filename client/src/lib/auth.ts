import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials, RegisterData } from '@/types/user';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => void;
  register: (data: RegisterData) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

// Simular almacenamiento en localStorage (en producción usarías una API real)
const getStoredUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('mayorista_users');
  return stored ? JSON.parse(stored) : [];
};

const saveUserToStorage = (user: User) => {
  if (typeof window === 'undefined') return;
  const users = getStoredUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  if (existingIndex > -1) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem('mayorista_users', JSON.stringify(users));
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      register: (data: RegisterData) => {
        const users = getStoredUsers();
        
        // Verificar si el correo ya existe
        if (users.some(u => u.correo === data.correo)) {
          throw new Error('Este correo ya está registrado');
        }

        const newUser: User = {
          id: `user_${Date.now()}`,
          nombre: data.nombre,
          apellidos: data.apellidos,
          ruc: data.ruc,
          correo: data.correo,
          empresa: data.empresa,
          telefono: data.telefono,
          direccion: data.direccion,
          createdAt: new Date(),
        };

        saveUserToStorage(newUser);
        set({ user: newUser, isAuthenticated: true });
      },

      login: (credentials: LoginCredentials) => {
        const users = getStoredUsers();
        const user = users.find(
          u => u.correo === credentials.correo && u.ruc === credentials.ruc
        );

        if (!user) {
          throw new Error('Correo o RUC inválidos');
        }

        set({ user, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
