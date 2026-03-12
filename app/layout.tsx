import type { Metadata } from 'next';
import BackgroundFx from './background-fx';
import './globals.css';

export const metadata: Metadata = {
  title: 'GemPulse',
  description: 'Internal loyalty program prototype on Next.js'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <BackgroundFx />
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}