import './globals.css';
import Navigation from '../components/Navigation';

export const metadata = {
  title: 'SonicSync | YouTube to MP3 Converter',
  description: 'Convert any YouTube video to a high quality MP3 file instantly.',
};

// Runs before React hydration — wipes all persisted history from any previous
// version of the app that may have contained demo/seed data.
// The version flag prevents this from running on every page load after the first wipe.
const purgeScript = `
(function() {
  try {
    if (localStorage.getItem('sonicsync_db_version') !== '2') {
      Object.keys(localStorage)
        .filter(function(k) { return k.startsWith('sonicsync_history:'); })
        .forEach(function(k) { localStorage.removeItem(k); });
      localStorage.setItem('sonicsync_db_version', '2');
    }
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background min-h-screen text-onSurface overflow-x-hidden">
        <script dangerouslySetInnerHTML={{ __html: purgeScript }} />
        <Navigation />
        {children}
      </body>
    </html>
  );
}
