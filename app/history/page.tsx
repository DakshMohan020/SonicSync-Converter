'use client';
import { useSyncStore } from '../../store/useSyncStore';
import Link from 'next/link';
import { Lock, Cloud, ExternalLink, Calendar } from 'lucide-react';

export default function HistoryPage() {
  const { isAuthenticated, permanentDownloads } = useSyncStore();

  // Route Condition A: Non-Authenticated Locked System
  if (!isAuthenticated) {
    return (
      <main className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-surface-containerLowest/40 backdrop-blur-glass border border-outlineVariant/30 rounded-lg p-8 text-center space-y-5 shadow-xl">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto text-primary animate-pulse">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base font-semibold text-onSurface tracking-tight">Cloud Database Synchronizer Locked</h2>
            <p className="text-xs text-mutedText leading-relaxed max-w-xs mx-auto">
              Persistent cross-session history registries are isolated behind secure token profiles. Authenticate to sync logs.
            </p>
          </div>
          <Link 
            href="/auth" 
            className="block w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded transition-all duration-150 shadow-[0_2px_10px_rgba(255,87,34,0.1)]"
          >
            Authenticate Profile Instance
          </Link>
        </div>
      </main>
    );
  }

  // Route Condition B: Authenticated View Hydrated with Sync Stores
  return (
    <main className="min-h-[calc(100vh-73px)] max-w-5xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-outlineVariant/20 pb-4">
        <div>
          <h1 className="text-xl font-semibold text-onSurface tracking-tight">Cloud Synced Historic Log</h1>
          <p className="text-xs text-mutedText mt-0.5">Permanent account ledger synced down to database clusters.</p>
        </div>
        <div className="font-mono text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
          <Cloud className="w-3 h-3 animate-bounce" /> Database Replica Active
        </div>
      </div>

      <div className="space-y-3">
        {permanentDownloads.map((log) => (
          <div 
            key={log.id} 
            className="bg-surface-containerLowest/40 backdrop-blur-glass border border-outlineVariant/20 rounded p-4 flex items-center justify-between hover:border-outline/30 transition-all duration-150"
          >
            <div className="flex items-center space-x-4 min-w-0">
              <img src={log.coverUrl} alt="Art Asset" className="w-11 h-11 rounded object-cover border border-outlineVariant/20 shrink-0" />
              <div className="min-w-0 space-y-0.5">
                <h3 className="text-xs font-medium text-onSurface truncate max-w-md">{log.title}</h3>
                <div className="flex items-center space-x-2 text-[11px] text-mutedText">
                  <span>{log.artist}</span>
                  <span className="text-outlineVariant">•</span>
                  <div className="flex items-center gap-1 text-[10px] font-mono bg-surface-container px-1.5 py-0.5 rounded">
                    <Calendar className="w-2.5 h-2.5 text-primary" /> {log.timestamp}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 font-mono text-xs">
              <span className="text-mutedText/70 text-[11px]">{log.fileSize}</span>
              <a 
                href={log.targetUrl}
                target="_blank"
                className="p-1.5 hover:bg-surface-container text-mutedText hover:text-onSurface rounded border border-outlineVariant/10 transition-colors duration-100"
                title="View origin stream"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a 
                href={log.downloadUrl}
                className="px-3 py-1.5 bg-surface-containerHigh/60 hover:bg-surface-containerHigh text-onSurface border border-outlineVariant/30 rounded text-[11px] font-sans font-medium transition-all duration-150"
              >
                Pull Asset
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}