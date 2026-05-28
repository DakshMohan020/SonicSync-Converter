'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSyncStore } from '../../store/useSyncStore';
import { ShieldCheck, Mail, Key } from 'lucide-react';

export default function AuthPage() {
  const [operatorEmail, setOperatorEmail] = useState('');
  const [accessCipher, setAccessCipher] = useState('');
  const setIsAuthenticated = useSyncStore((state) => state.setIsAuthenticated);
  const router = useRouter();

  const processGateVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (operatorEmail && accessCipher) {
      setIsAuthenticated(true, operatorEmail);
      router.push('/history');
    }
  };

  return (
    <main className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm bg-surface-containerLowest/40 backdrop-blur-glass border border-outlineVariant/30 rounded-lg p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-1">
          <ShieldCheck className="w-7 h-7 text-primary mx-auto" />
          <h2 className="text-base font-semibold text-onSurface tracking-tight">Identity Verification Gate</h2>
          <p className="text-[11px] text-mutedText">Synchronize persistent multi-session architecture storage records.</p>
        </div>

        <form onSubmit={processGateVerification} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-mutedText uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-primary" /> Email Node Identifier
            </label>
            <input
              type="email"
              required
              placeholder="operator@sonicsync.io"
              value={operatorEmail}
              onChange={(e) => setOperatorEmail(e.target.value)}
              className="w-full bg-surface-containerLow border border-outlineVariant/40 rounded px-3 py-2.5 text-xs font-mono text-onSurface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-mutedText uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3 h-3 text-primary" /> Access Secret Token
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••••••"
              value={accessCipher}
              onChange={(e) => setAccessCipher(e.target.value)}
              className="w-full bg-surface-containerLow border border-outlineVariant/40 rounded px-3 py-2.5 text-xs font-mono text-onSurface focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded transition-all duration-150 mt-2 shadow-[0_2px_10px_rgba(255,87,34,0.1)]"
          >
            Authenticate Token Connection
          </button>
        </form>
      </div>
    </main>
  );
}