export const config = {
  nextauth: {
    secret: process.env.NEXTAUTH_SECRET ?? 'your-fallback-secret'
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  }
} as const;