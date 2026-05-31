'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSyncStore } from '../../store/useSyncStore';
import Link from 'next/link';
import { CheckCircle2, Download, RefreshCw, FileAudio, Calendar, Layers } from 'lucide-react';

export default function SuccessRefined() {
  const activeTask = useSyncStore((state) => state.activeTask);
  const router = useRouter();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (!activeTask) {
      router.push('/');
    }
  }, [activeTask, router]);

  if (!activeTask) return null;

  const triggerDownloadSimulation = () => {
    setDownloadSuccess(true);
    // Hit the real streaming download endpoint with the correct filename
    const safeFilename = activeTask.title.replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_');
    const dynamicAnchor = document.createElement('a');
    dynamicAnchor.href = activeTask.downloadUrl;
    dynamicAnchor.download = `${safeFilename}.mp3`;
    document.body.appendChild(dynamicAnchor);
    dynamicAnchor.click();
    document.body.removeChild(dynamicAnchor);
  };

  return (
    <main className="min-h-[calc(100vh-73px)] py-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-surface-containerLowest/50 backdrop-blur-glass border border-outlineVariant/40 rounded-lg p-8 shadow-[0_12px_40px_rgba(0,0,0,0.5)] space-y-6">
        
        <div className="flex flex-col items-center text-center pb-4 border-b border-outlineVariant/20">
          <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-onSurface tracking-tight">Transcoding Loop Settled</h2>
          <p className="text-[11px] font-mono text-mutedText mt-1">ID3 mapping frames compiled cleanly without binary fragmentation.</p>
        </div>

        <div className="bg-surface-containerLow/60 p-4 rounded border border-outlineVariant/20 flex gap-5 items-center">
          <img 
            src={activeTask.coverUrl} 
            alt="Asset Envelope Cover Art" 
            className="w-24 h-24 object-cover rounded border border-outlineVariant/30 bg-surface-containerHigh shrink-0"
          />
          <div className="flex-1 min-w-0 space-y-1.5">
            <span className="text-[9px] font-mono text-primary uppercase font-bold tracking-widest bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-sm">
              Payload Hydrated
            </span>
            <h3 className="text-sm font-semibold text-onSurface truncate">{activeTask.title}</h3>
            
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-mutedText/90">
              <div className="truncate"><span className="text-mutedText text-[11px]">Artist:</span> <span className="text-onSurfaceVariant">{activeTask.artist}</span></div>
              <div className="truncate"><span className="text-mutedText text-[11px]">Album:</span> <span className="text-onSurfaceVariant">{activeTask.album}</span></div>
            </div>

            <div className="flex gap-4 pt-1.5 font-mono text-[10px] text-mutedText/60">
              <div className="flex items-center gap-1"><FileAudio className="w-3 h-3 text-primary" /> {activeTask.fileSize}</div>
              <div className="flex items-center gap-1"><Layers className="w-3 h-3 text-primary" /> {activeTask.duration}</div>
              <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {activeTask.timestamp}</div>
            </div>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono rounded text-center">
            Payload delivery pipeline complete. Check your operating system downloads location.
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={triggerDownloadSimulation}
            className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-semibold text-xs rounded transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(255,87,34,0.2)]"
          >
            <Download className="w-4 h-4" />
            <span>Download Local Audio Asset Container</span>
          </button>
          
          <Link
            href="/"
            className="w-full py-2.5 bg-surface-containerHigh/40 hover:bg-surface-containerHigh text-onSurface border border-outlineVariant/30 text-center text-xs font-medium rounded transition-all duration-150 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-mutedText" />
            Return to Transcoding Matrix
          </Link>
        </div>

      </div>
    </main>
  );
}