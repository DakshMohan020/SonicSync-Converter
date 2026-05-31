import './globals.css';
import Navigation from '../components/Navigation';

export const metadata = {
  title: 'SonicSync | YouTube to MP3 Converter',
  description: 'Convert any YouTube video to a high quality MP3 file instantly.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background min-h-screen text-onSurface overflow-x-hidden">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
