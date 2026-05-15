import { NextAuthOptions } from 'next-auth';
import { supabase } from '@/lib/supabase';

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
          image: profile.photo_url,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: { strategy: 'jwt' },
};
