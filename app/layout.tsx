import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Shell } from '../src/ui';

const geistSans = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Studio · Northstar Supply',
  description: 'Sales performance and pipeline analytics workspace',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
