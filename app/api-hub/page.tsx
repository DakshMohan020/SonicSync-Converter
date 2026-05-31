'use client';
import { useState } from 'react';
import { Code, TerminalSquare, Key } from 'lucide-react';

export default function ApiHubPage() {
  const [apiKeyGenerated, setApiKeyGenerated] = useState(false);
  
  const mockApiResponsePayload = `{
  "status": "success",
  "pipeline_execution_ms": 348,
  "payload": {
    "bitrate": "320kbps",
    "container": "audio/mp3",
    "id3_attributes": {
      "title": "Decoded Stream Frame Vector",
      "artist": "SonicSync Endpoint Node",
      "assigned_album": "Isolated Context Vol. IV"
    },
    "asset_uri": "https://storage.sonicsync.io/payload/cf78a3d1.mp3"
  }
}`;

  return (
    <main className="min-h-[calc(100vh-73px)] max-w-5xl mx-auto p-8 space-y-8">
      <div className="border-b border-outlineVariant/20 pb-4">
        <h1 className="text-xl font-semibold text-onSurface tracking-tight">Developer API Gateway Hub</h1>
        <p className="text-xs text-mutedText mt-0.5">Integrate programmatic audio extraction and frequency demux modules directly into remote applications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-surface-containerLowest/40 backdrop-blur-glass border border-outlineVariant/20 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <TerminalSquare className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-onSurface">Endpoint Infrastructure Specs</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 font-mono text-[11px] bg-surface-containerLowest p-2.5 rounded border border-outlineVariant/20">
                <span className="px-1.5 py-0.5 bg-primary text-white font-bold rounded-sm text-[10px]">POST</span>
                <span className="text-onSurfaceVariant font-medium">https://api.sonicsync.io/v1/transcode/synchronous</span>
              </div>
              <p className="text-xs text-mutedText leading-relaxed">
                Pass a clean string within data parameters. The synchronization pipeline isolates raw audio vectors, flushes frame headers, generates automated ID3 mapping matrices, and exposes short-lived edge content cache target URLs.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-outlineVariant/10">
              <div className="text-[11px] font-mono text-mutedText">Obligatory Transcoder Request Headers:</div>
              <div className="font-mono text-[11px] bg-surface-containerLow p-3 rounded text-onSurfaceVariant/80 space-y-1 border border-outlineVariant/10">
                <div>Authorization: <span className="text-primary">Bearer sk_live_sonicsync_49f...</span></div>
                <div>Content-Type: <span className="text-secondary">application/json</span></div>
              </div>
            </div>
          </div>

          <div className="bg-surface-containerLowest/40 backdrop-blur-glass border border-outlineVariant/20 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-onSurface">Runtime Sandbox Tokens</h3>
              </div>
              <button 
                onClick={() => setApiKeyGenerated(true)}
                className="px-2.5 py-1 bg-surface-containerHigh hover:bg-surface-containerHighest border border-outlineVariant/30 rounded font-mono text-[10px] text-onSurface transition-colors"
              >
                {apiKeyGenerated ? 'Regenerate Token' : 'Generate Secret Key'}
              </button>
            </div>
            {apiKeyGenerated ? (
              <div className="bg-surface-containerLow p-3 rounded border border-emerald-500/20 font-mono text-[11px] text-emerald-400 break-all">
                sk_live_sonicsync_73f01b92a4e8d3c790118ea02bc
              </div>
            ) : (
              <p className="text-xs text-mutedText">No sandbox secret token strings match your current application container signature.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-surface-containerLowest/40 backdrop-blur-glass border border-outlineVariant/20 rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 text-mutedText font-mono text-[10px] uppercase tracking-wider font-semibold">
              <Code className="w-3.5 h-3.5 text-primary" />
              <span>JSON Response Spec</span>
            </div>
            <pre className="bg-surface-containerLowest border border-outlineVariant/20 p-4 rounded text-[10px] font-mono text-onSurfaceVariant/90 overflow-x-auto leading-relaxed max-h-[380px]">
              {mockApiResponsePayload}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}