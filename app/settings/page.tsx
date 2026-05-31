'use client';
import { useState } from 'react';
import { Volume2, Image, Cpu } from 'lucide-react';

export default function SettingsPage() {
  const [targetBitrate, setTargetBitrate] = useState('320');
  const [embedCoverArt, setEmbedCoverArt] = useState(true);
  const [strictValidation, setStrictValidation] = useState(false);

  return (
    <main className="min-h-[calc(100vh-73px)] max-w-3xl mx-auto p-8 space-y-6">
      <div className="border-b border-outlineVariant/20 pb-4">
        <h1 className="text-xl font-semibold text-onSurface tracking-tight">Settings</h1>
        <p className="text-xs text-mutedText mt-0.5">Adjust how your MP3 files are converted and saved.</p>
      </div>

      <div className="bg-surface-containerLowest/30 border border-outlineVariant/20 rounded-lg divide-y divide-outlineVariant/10">

        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-onSurface">
              <Volume2 className="w-4 h-4 text-primary" />
              <span>Audio Quality</span>
            </div>
            <p className="text-[11px] text-mutedText max-w-md">Higher quality means a larger file size but better sound.</p>
          </div>
          <select
            value={targetBitrate}
            onChange={(e) => setTargetBitrate(e.target.value)}
            className="bg-surface-containerLow border border-outlineVariant text-xs font-mono text-onSurface rounded px-3 py-2 focus:outline-none focus:border-primary shrink-0"
          >
            <option value="320">320 kbps — Best Quality</option>
            <option value="256">256 kbps — Good Quality</option>
            <option value="128">128 kbps — Smaller File Size</option>
          </select>
        </div>

        <div className="p-6 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-onSurface">
              <Image className="w-4 h-4 text-primary" />
              <span>Embed Cover Art</span>
            </div>
            <p className="text-[11px] text-mutedText max-w-md">Automatically add the video thumbnail as the album art inside the MP3 file.</p>
          </div>
          <input
            type="checkbox"
            checked={embedCoverArt}
            onChange={(e) => setEmbedCoverArt(e.target.checked)}
            className="w-4 h-4 accent-primary rounded bg-surface-containerLow border-outlineVariant"
          />
        </div>

        <div className="p-6 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-onSurface">
              <Cpu className="w-4 h-4 text-primary" />
              <span>Skip Duplicate Conversions</span>
            </div>
            <p className="text-[11px] text-mutedText max-w-md">If you try to convert the same video twice, skip it and use the existing file instead.</p>
          </div>
          <input
            type="checkbox"
            checked={strictValidation}
            onChange={(e) => setStrictValidation(e.target.checked)}
            className="w-4 h-4 accent-primary rounded bg-surface-containerLow border-outlineVariant"
          />
        </div>

      </div>
    </main>
  );
}
