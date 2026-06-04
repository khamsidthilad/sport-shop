import type { Metadata } from 'next';
import { Bebas_Neue, Inter } from 'next/font/google';
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

export const metadata: Metadata = {
  title: 'SportShop — Premium Sports Gear & Equipment',
  description:
    'Authentic sports gear from Nike, Adidas, Puma & more. Football, basketball, running shoes, fitness equipment and sportswear.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable}`}>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <QueryProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
