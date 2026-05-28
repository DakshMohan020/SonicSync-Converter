'use client';
import { useState } from 'react';
import { Settings, Volume2, Image, ShieldAlert, Cpu } from 'lucide-react';

export default function SettingsPage() {
  const [targetBitrate, setTargetBitrate] = useState('320');
  const [embedCoverArt, setEmbedCoverArt] = useState(true);
  const [strictValidation, setStrictValidation] = useState(false);

  return (
    <main className="min-h-[calc(100vh-73px)] max-w-3xl mx-auto p-8 space-y-6">
      <div className="border-b border-outlineVariant/20 pb-4">
        <h1 className="text-xl font-semibold text-onSurface tracking-tight">System Preferences Panel</h1>
        <p className="text-xs text-mutedText mt-0.5">Tune core frequency isolation settings, parsing arrays, and target encoder parameters.</p>
      </div>

      <div className="bg-surface-containerLowest/30 border border-outlineVariant/20 rounded-lg divide-y divide-outlineVariant/10">
        
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-onSurface">
              <Volume2 className="w-4 h-4 text-primary" />
              <span>Audio Bitrate Profile Engine</span>
            </div>
            <p className="text-[11px] text-mutedText max-w-md">Higher target quality boundaries enforce tight verification constraints over background arrays.</p>
          </div>
          <select 
            value={targetBitrate} 
            onChange={(e) => setTargetBitrate(e.target.value)}
            className="bg-surface-containerLow border border-outlineVariant text-xs font-mono text-onSurface rounded px-3 py-2 focus:outline-none focus:border-primary shrink-0"
          >
            <option value="320">320 kbps (Lossless Container Core)</option>
            <option value="256">256 kbps (Standard Distribution Band)</option>
            <option value="128">128 kbps (Ultra Compressed Architecture)</option>
          </select>
        </div>

        <div className="p-6 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-onSurface">
              <Image className="w-4 h-4 text-primary" />
              <span>Automate ID3 Album Cover Embedding</span>
            </div>
            <p className="text-[11px] text-mutedText max-w-md">Extract, resize, and bake thumbnail visual payloads directly into binary frames.</p>
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
              <span>Strict Server-Side Content Scrubbing</span>
            </div>
            <p className="text-[11px] text-mutedText max-w-md">Enforce verification mechanisms to block duplicate streams before executing processes.</p>
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