import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'telegram',
      name: 'Telegram',
      type: 'oauth',
      clientId: process.env.TELEGRAM_BOT_NAME,
      clientSecret: process.env.TELEGRAM_BOT_TOKEN,
      authorization: { url: 'https://oauth.telegram.org/request', params: { scope: 'user' } },
      token: 'https://oauth.telegram.org/request',
      userinfo: 'https://api.telegram.org/getUser',
      profile(profile: any) {
        return {
          id: String(profile.id),
          name: profile.first_name + (profile.last_name ? ' ' + profile.last_name : ''),
          email: profile.username ? `${profile.username}@telegram.user` : null,
          image: profile.photo_url,
        };
      },
    },
    CredentialsProvider({
      id: 'credentials',
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Dynamic import to avoid issues
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

        if (!supabaseUrl || !supabaseKey) return null;

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email.toLowerCase().trim())
          .single();

        if (error || !user) return null;

        // Verify password with bcrypt
        const bcrypt = await import('bcryptjs');
        const valid = await bcrypt.default.compare(credentials.password, user.password_hash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name || user.email.split('@')[0],
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};
