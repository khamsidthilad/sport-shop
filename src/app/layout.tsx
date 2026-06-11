import type { Metadata } from 'next';
import { Bebas_Neue, Inter, Noto_Sans_Lao } from 'next/font/google';
import { lo } from '@/lib/lao';
import { Toaster } from 'sonner';
import ReduxProvider from '@/providers/ReduxProvider';
import QueryProvider from '@/providers/QueryProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const notoSansLao = Noto_Sans_Lao({
  subsets: ['lao', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lao',
  display: 'swap',
});

export const metadata: Metadata = {
  title: lo.meta.title,
  description: lo.meta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lo" className={`${inter.variable} ${bebasNeue.variable} ${notoSansLao.variable}`}>
      <body className={`${notoSansLao.className} min-h-screen antialiased`}>
        <QueryProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
