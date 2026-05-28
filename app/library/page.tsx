'use client';
import { useSyncStore } from '../../store/useSyncStore';
import Link from 'next/link';
import { Download, Library, Music } from 'lucide-react';

export default function LibraryPage() {
  const { sessionDownloads } = useSyncStore();

  return (
    <main className="min-h-[calc(100vh-73px)] max-w-5xl mx-auto p-8 space-y-6">
      <div className="border-b border-outlineVariant/20 pb-4">
        <h1 className="text-xl font-semibold text-onSurface tracking-tight">Active Session Queue</h1>
        <p className="text-xs text-mutedText mt-0.5">Transient track memory block allocations. Items below clear on browser reload events.</p>
      </div>

      {sessionDownloads.length === 0 ? (
        <div className="bg-surface-containerLowest/30 backdrop-blur-glass border border-outlineVariant/20 rounded-lg p-12 text-center space-y-3">
          <Library className="w-8 h-8 text-outline/40 mx-auto" />
          <p className="text-xs text-mutedText">No assets have been structured inside this dynamic runtime framework yet.</p>
          <Link href="/" className="inline-block text-xs font-mono text-primary hover:underline pt-2">
            → Access core conversion input gate
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sessionDownloads.map((asset) => (
            <div 
              key={asset.id} 
              className="bg-surface-containerLowest/40 backdrop-blur-glass border border-outlineVariant/20 hover:border-outlineVariant/50 rounded p-4 flex items-center justify-between transition-all duration-150"
            >
              <div className="flex items-center space-x-4 min-w-0">
                <img src={asset.coverUrl} alt="Cover Map" className="w-11 h-11 rounded object-cover border border-outlineVariant/20 shrink-0" />
                <div className="min-w-0 space-y-0.5">
                  <h3 className="text-xs font-medium text-onSurface truncate max-w-md">{asset.title}</h3>
                  <p className="text-[11px] text-mutedText truncate">{asset.artist} — {asset.album}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 font-mono text-xs">
                <div className="text-mutedText text-[11px] bg-surface-container/60 px-2 py-0.5 rounded border border-outlineVariant/10 flex items-center gap-1">
                  <Music className="w-3 h-3 text-primary" /> {asset.fileSize}
                </div>
                <span className="text-primary font-semibold">{asset.duration}</span>
                <a 
                  href={asset.downloadUrl}
                  className="px-3 py-1.5 bg-primary/10 hover:bg-primary border border-primary/20 hover:border-transparent text-primary hover:text-white rounded text-[11px] font-sans font-medium transition-all duration-150 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Fetch File
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}