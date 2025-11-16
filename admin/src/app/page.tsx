import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Si hay sesión, redirigir al dashboard
  if (session) {
    redirect('/dashboard');
  }

  // Si no hay sesión, redirigir al login
  redirect('/login');
}