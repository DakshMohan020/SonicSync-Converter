'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncStore } from '../store/useSyncStore';
import { Disc, Library, History, Code, Settings, UserCheck, LogIn } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const { isAuthenticated, userEmail, setIsAuthenticated } = useSyncStore();

  const primaryNavigationMap = [
    { name: 'Converter', path: '/', icon: Disc },
    { name: 'Library', path: '/library', icon: Library },
    { name: 'Downloads', path: '/history', icon: History },
    { name: 'API', path: '/api-hub', icon: Code },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="w-full sticky top-0 z-50 bg-surface-containerLowest/70 backdrop-blur-glass border-b border-outlineVariant/30 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-10">
        <Link href="/" className="text-lg font-bold tracking-tight text-onSurface flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-primary rounded-sm inline-block animate-pulse"></span>
          SONIC<span className="text-primary font-mono text-xs tracking-wider">SYNC</span>
        </Link>
        <div className="flex items-center space-x-1">
          {primaryNavigationMap.map((route) => {
            const CurrentIcon = route.icon;
            const isCurrentlyActive = pathname === route.path;
            return (
              <Link
                key={route.path}
                href={route.path}
                className={`px-3 py-1.5 rounded transition-all duration-200 text-xs font-medium flex items-center gap-2 relative ${
                  isCurrentlyActive ? 'text-onSurface bg-surface-containerHigh' : 'text-mutedText hover:text-onSurface'
                }`}
              >
                <CurrentIcon className={`w-3.5 h-3.5 ${isCurrentlyActive ? 'text-primary' : 'text-mutedText'}`} />
                {route.name}
                {isCurrentlyActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary rounded-sm" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded border border-outlineVariant/30 text-[11px] font-mono text-onSurfaceVariant">
              <UserCheck className="w-3 h-3 text-emerald-400" />
              {userEmail}
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-xs text-mutedText hover:text-primary transition-colors duration-150"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <Link
            href="/auth"
            className="px-4 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded transition-all duration-200 flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,87,34,0.1)]"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}