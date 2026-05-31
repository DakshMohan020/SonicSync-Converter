import './globals.css';
import Navigation from '../components/Navigation';

export const metadata = {
  title: 'SonicSync | YouTube to MP3 Converter',
  description: 'Convert any YouTube video to a high quality MP3 file instantly.',
};

// Inline script to purge the old hardcoded demo entry from localStorage before React hydrates
const purgeLegacyScript = `
(function() {
  try {
    Object.keys(localStorage)
      .filter(function(k) { return k.indexOf('sonicsync_history:') === 0; })
      .forEach(function(k) {
        var items = JSON.parse(localStorage.getItem(k) || '[]');
        var cleaned = items.filter(function(i) { return i.id !== 'archived-09c'; });
        if (cleaned.length !== items.length) {
          localStorage.setItem(k, JSON.stringify(cleaned));
        }
      });
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background min-h-screen text-onSurface overflow-x-hidden">
        {/* Runs synchronously before hydration to wipe any legacy demo data */}
        <script dangerouslySetInnerHTML={{ __html: purgeLegacyScript }} />
        <Navigation />
        {children}
      </body>
    </html>
  );
}
