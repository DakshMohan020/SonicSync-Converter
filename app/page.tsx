'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSyncStore } from '../store/useSyncStore';
import { ArrowRight, HelpCircle, Shield, Zap } from 'lucide-react';

export default function HomeRefined() {
  const [targetUrl, setTargetUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineState, setPipelineState] = useState('');
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const router = useRouter();
  const setActiveTask = useSyncStore((state) => state.setActiveTask);
  const addSessionDownload = useSyncStore((state) => state.addSessionDownload);

  useEffect(() => {
    return () => { timerRefs.current.forEach(clearTimeout); };
  }, []);

  const initPipelineAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl) return;

    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];

    setIsProcessing(true);
    setPipelineState('Connecting to YouTube...');

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      const extractionPayload = await response.json();

      if (!response.ok) {
        throw new Error(extractionPayload.error || 'Conversion failed. Please try again.');
      }

      timerRefs.current.push(
        setTimeout(() => setPipelineState('Extracting audio...'), 1200)
      );
      timerRefs.current.push(
        setTimeout(() => setPipelineState('Converting to MP3...'), 2400)
      );
      timerRefs.current.push(
        setTimeout(() => {
          setActiveTask(extractionPayload);
          addSessionDownload(extractionPayload);
          setIsProcessing(false);
          router.push('/success');
        }, 3600)
      );

    } catch (err) {
      console.error(err);
      setPipelineState(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-4 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-3xl bg-surface-containerLowest/40 backdrop-blur-glass border border-outlineVariant/20 rounded-lg p-10 relative z-10 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-mono tracking-widest text-primary uppercase bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-sm">
            Free YouTube to MP3 Converter
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-onSurface">
            Convert Any YouTube Video to MP3
          </h1>
          <p className="text-mutedText text-sm max-w-md mx-auto">
            Paste a YouTube link below and get a high quality MP3 download in seconds. No sign up needed.
          </p>
        </div>

        <form onSubmit={initPipelineAction} className="space-y-4">
          <div className="relative">
            <input
              type="url"
              required
              disabled={isProcessing}
              placeholder="Paste a YouTube URL (e.g. https://www.youtube.com/watch?v=...)"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full bg-surface-containerLow border border-outlineVariant/40 rounded px-4 py-4 text-xs font-mono text-onSurface placeholder:text-mutedText/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-150"
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 shadow-[0_4px_20px_rgba(255,87,34,0.15)]"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-3">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="font-mono text-xs text-onSurface/90">{pipelineState}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span>Convert to MP3</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            )}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-outlineVariant/20 text-xs font-mono text-mutedText">
          <div className="flex items-start gap-2.5 bg-surface-containerLowest/50 p-3 rounded border border-outlineVariant/10">
            <Zap className="w-4 h-4 text-primary shrink-0" />
            <div>
              <div className="text-onSurface font-medium text-[11px]">320 kbps Quality</div>
              <p className="text-[10px] text-mutedText/70 mt-0.5">High quality audio, every time.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-surface-containerLowest/50 p-3 rounded border border-outlineVariant/10">
            <Shield className="w-4 h-4 text-primary shrink-0" />
            <div>
              <div className="text-onSurface font-medium text-[11px]">Auto Song Tags</div>
              <p className="text-[10px] text-mutedText/70 mt-0.5">Title, artist and cover art included.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-surface-containerLowest/50 p-3 rounded border border-outlineVariant/10">
            <HelpCircle className="w-4 h-4 text-primary shrink-0" />
            <div>
              <div className="text-onSurface font-medium text-[11px]">Developer API</div>
              <p className="text-[10px] text-mutedText/70 mt-0.5">Integrate conversions into your own app.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
