import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import ReduxProvider from '@/providers/ReduxProvider';
import QueryProvider from '@/providers/QueryProvider';
import './globals.css';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body className="min-h-screen antialiased">
        <QueryProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
