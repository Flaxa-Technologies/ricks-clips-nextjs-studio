import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ricks Clips (@RicksClips3000) — Next.js 3D/2.5D Shorts Studio & Frame-by-Frame Lab',
  description:
    'Programmatic YouTube Shorts engine in Next.js + React Three Fiber analyzing @RicksClips3000 frame by frame (0 to 300 frames @ 30fps).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
