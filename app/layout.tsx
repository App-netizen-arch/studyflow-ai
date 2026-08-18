import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StudyFlow AI — Turn Notes Into Smarter Study Material',
  description: 'Transform your notes into concise summaries, key points, and AI-generated flashcards.',
  openGraph: { title: 'StudyFlow AI', description: 'Turn your notes into smarter study material.' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
