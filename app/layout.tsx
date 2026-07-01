import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/nav/NavBar';
import { AuthProvider } from '@/context/AuthContext';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CollabBoard',
  description: 'Real-time collaborative kanban board',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geist.className} bg-[var(--surface-1)] text-[var(--text-primary)] antialiased`}
      >
        <AuthProvider>
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
