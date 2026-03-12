import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GemPulse',
  description: 'Internal loyalty program prototype on Next.js'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
