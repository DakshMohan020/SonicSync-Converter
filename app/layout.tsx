import './globals.css';
import Navigation from '../components/Navigation';

export const metadata = {
  title: 'SonicSync | Professional Video to High Fidelity ID3 MP3 Conversion Engine',
  description: 'Enterprise grade media extraction matrix using localized Obsidian design schemas.',
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