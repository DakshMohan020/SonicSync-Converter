'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSyncStore } from '../../store/useSyncStore';
import { ShieldCheck, Mail, Key, UserPlus, LogIn } from 'lucide-react';

// NOTE: This is a frontend-only mock auth system (no real backend/database).
// Accounts are stored in localStorage for demo purposes.

const STORAGE_KEY = 'sonicsync_accounts';

function getAccounts(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveAccount(email: string, password: string) {
  const accounts = getAccounts();
  accounts[email.toLowerCase()] = password;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setIsAuthenticated = useSyncStore((state) => state.setIsAuthenticated);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const accounts = getAccounts();
      const normalizedEmail = email.toLowerCase().trim();

      if (mode === 'signup') {
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        if (accounts[normalizedEmail]) {
          setError('An account with this email already exists. Please sign in.');
          setLoading(false);
          return;
        }
        saveAccount(normalizedEmail, password);
        setIsAuthenticated(true, normalizedEmail);
        router.push('/history');
      } else {
        // Sign in
        if (!accounts[normalizedEmail]) {
          setError('No account found with this email. Please sign up first.');
          setLoading(false);
          return;
        }
        if (accounts[normalizedEmail] !== password) {
          setError('Incorrect password. Please try again.');
          setLoading(false);
          return;
        }
        setIsAuthenticated(true, normalizedEmail);
        router.push('/history');
      }
    }, 500);
  };

  return (
    <main className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm bg-surface-containerLowest/40 backdrop-blur-glass border border-outlineVariant/30 rounded-lg p-8 space-y-6 shadow-xl">

        {/* Header */}
        <div className="text-center space-y-1">
          <ShieldCheck className="w-7 h-7 text-primary mx-auto" />
          <h2 className="text-base font-semibold text-onSurface tracking-tight">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-[11px] text-mutedText">
            {mode === 'signin'
              ? 'Sign in to save your download history across sessions.'
              : 'Create a free account to save your conversion history.'}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-surface-containerLow rounded border border-outlineVariant/20 p-0.5">
          <button
            onClick={() => { setMode('signin'); setError(''); }}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition-all duration-150 flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-surface-containerHigh text-onSurface'
                : 'text-mutedText hover:text-onSurface'
            }`}
          >
            <LogIn className="w-3 h-3" /> Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition-all duration-150 flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-surface-containerHigh text-onSurface'
                : 'text-mutedText hover:text-onSurface'
            }`}
          >
            <UserPlus className="w-3 h-3" /> Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-mutedText uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-primary" /> Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-containerLow border border-outlineVariant/40 rounded px-3 py-2.5 text-xs font-mono text-onSurface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-mutedText uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3 h-3 text-primary" /> Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-containerLow border border-outlineVariant/40 rounded px-3 py-2.5 text-xs font-mono text-onSurface focus:outline-none focus:border-primary"
            />
          </div>

          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-mutedText uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3 h-3 text-primary" /> Confirm Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-surface-containerLow border border-outlineVariant/40 rounded px-3 py-2.5 text-xs font-mono text-onSurface focus:outline-none focus:border-primary"
              />
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded transition-all duration-150 mt-2 shadow-[0_2px_10px_rgba(255,87,34,0.1)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

      </div>
    </main>
  );
}
