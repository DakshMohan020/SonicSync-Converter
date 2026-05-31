'use client';
import { useState } from 'react';
import { Code, TerminalSquare, Key, Copy, Check } from 'lucide-react';

export default function ApiHubPage() {
  const [copied, setCopied] = useState(false);

  const curlExample = `curl -X POST http://localhost:3000/api/convert \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'`;

  const exampleResponse = `{
  "id": "sync-a3f9bc",
  "title": "Never Gonna Give You Up",
  "artist": "Rick Astley",
  "album": "Single",
  "duration": "3:33",
  "fileSize": "8.2 MB",
  "coverUrl": "https://i.ytimg.com/vi/dQw4w9WgXcQ/...",
  "downloadUrl": "/api/download/sync-a3f9bc",
  "timestamp": "2026-06-01"
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(curlExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-[calc(100vh-73px)] max-w-5xl mx-auto p-8 space-y-8">
      <div className="border-b border-outlineVariant/20 pb-4">
        <h1 className="text-xl font-semibold text-onSurface tracking-tight">Developer API</h1>
        <p className="text-xs text-mutedText mt-0.5">
          Use the SonicSync API to convert YouTube videos to MP3 from your own app or script.
          The API runs on the same server as this app — no separate sign up needed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* Endpoint */}
          <div className="bg-surface-containerLowest/40 backdrop-blur-glass border border-outlineVariant/20 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <TerminalSquare className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-onSurface">Convert Endpoint</h2>
            </div>

            <div className="flex items-center space-x-3 font-mono text-[11px] bg-surface-containerLowest p-2.5 rounded border border-outlineVariant/20">
              <span className="px-1.5 py-0.5 bg-primary text-white font-bold rounded-sm text-[10px]">POST</span>
              <span className="text-onSurfaceVariant font-medium">/api/convert</span>
            </div>

            <p className="text-xs text-mutedText leading-relaxed">
              Send a YouTube URL in the request body. The server will download the audio, convert it to MP3,
              and return the file details plus a download link.
            </p>

            <div className="space-y-2 pt-2 border-t border-outlineVariant/10">
              <div className="text-[11px] font-mono text-mutedText mb-1">Request body (JSON):</div>
              <div className="font-mono text-[11px] bg-surface-containerLow p-3 rounded text-onSurfaceVariant/80 border border-outlineVariant/10">
                {'{'} <span className="text-primary">"url"</span>: <span className="text-emerald-400">"https://www.youtube.com/watch?v=..."</span> {'}'}
              </div>
            </div>

            <div className="space-y-2 border-t border-outlineVariant/10 pt-3">
              <div className="text-[11px] font-mono text-mutedText mb-1">Download the converted file:</div>
              <div className="flex items-center space-x-3 font-mono text-[11px] bg-surface-containerLowest p-2.5 rounded border border-outlineVariant/20">
                <span className="px-1.5 py-0.5 bg-emerald-600 text-white font-bold rounded-sm text-[10px]">GET</span>
                <span className="text-onSurfaceVariant font-medium">/api/download/[id]?filename=Song_Name</span>
              </div>
              <p className="text-[11px] text-mutedText">Use the <code className="text-primary">id</code> and <code className="text-primary">downloadUrl</code> from the convert response.</p>
            </div>
          </div>

          {/* cURL Example */}
          <div className="bg-surface-containerLowest/40 backdrop-blur-glass border border-outlineVariant/20 rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-onSurface">Example Request</h3>
              </div>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 bg-surface-containerHigh hover:bg-surface-containerHighest border border-outlineVariant/30 rounded font-mono text-[10px] text-onSurface transition-colors flex items-center gap-1.5"
              >
                {copied ? <><Check className="w-3 h-3 text-emerald-400" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
            </div>
            <pre className="bg-surface-containerLow p-3 rounded border border-outlineVariant/10 font-mono text-[11px] text-onSurfaceVariant/90 whitespace-pre-wrap break-all">
              {curlExample}
            </pre>
            <p className="text-[11px] text-mutedText">
              No API key required. The API is open — anyone running this app locally or on a server can use it directly.
            </p>
          </div>
        </div>

        {/* Example Response */}
        <div className="space-y-4">
          <div className="bg-surface-containerLowest/40 backdrop-blur-glass border border-outlineVariant/20 rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 text-mutedText font-mono text-[10px] uppercase tracking-wider font-semibold">
              <Code className="w-3.5 h-3.5 text-primary" />
              <span>Example Response</span>
            </div>
            <pre className="bg-surface-containerLowest border border-outlineVariant/20 p-4 rounded text-[10px] font-mono text-onSurfaceVariant/90 overflow-x-auto leading-relaxed max-h-[380px]">
              {exampleResponse}
            </pre>
          </div>

          <div className="bg-surface-containerLowest/40 backdrop-blur-glass border border-outlineVariant/20 rounded-lg p-5 space-y-2">
            <div className="text-[11px] font-semibold text-onSurface">Notes</div>
            <ul className="text-[11px] text-mutedText space-y-1.5 list-disc list-inside leading-relaxed">
              <li>Only YouTube URLs are supported.</li>
              <li>Converted files are stored temporarily on the server and may be deleted after a short time.</li>
              <li>For personal and development use only.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
