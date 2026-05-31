import { create } from 'zustand';

export interface VideoMetadata {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
  fileSize: string;
  downloadUrl: string;
  timestamp: string;
  targetUrl: string;
}

interface SyncState {
  isAuthenticated: boolean;
  userEmail: string | null;
  sessionDownloads: VideoMetadata[];
  permanentDownloads: VideoMetadata[];
  activeTask: VideoMetadata | null;
  setIsAuthenticated: (status: boolean, email?: string) => void;
  addSessionDownload: (item: VideoMetadata) => void;
  setActiveTask: (item: VideoMetadata | null) => void;
}

const HISTORY_KEY = 'sonicsync_history';
const LEGACY_SEED_ID = 'archived-09c'; // ID of the old fake seed entry

// Load history for a user from localStorage, stripping any legacy seed data
function loadHistory(email: string): VideoMetadata[] {
  try {
    const raw = localStorage.getItem(`${HISTORY_KEY}:${email}`);
    const parsed: VideoMetadata[] = raw ? JSON.parse(raw) : [];
    // Strip the old hardcoded demo entry in case it was persisted
    return parsed.filter((item) => item.id !== LEGACY_SEED_ID);
  } catch {
    return [];
  }
}

function saveHistory(email: string, items: VideoMetadata[]) {
  try {
    localStorage.setItem(`${HISTORY_KEY}:${email}`, JSON.stringify(items));
  } catch {
    // Storage quota exceeded or unavailable — fail silently
  }
}

export const useSyncStore = create<SyncState>((set, get) => ({
  isAuthenticated: false,
  userEmail: null,
  sessionDownloads: [],
  permanentDownloads: [],
  activeTask: null,

  setIsAuthenticated: (status, email) => {
    if (status && email) {
      // Sign in — load this user's real history from localStorage
      const history = loadHistory(email);
      set({ isAuthenticated: true, userEmail: email, permanentDownloads: history });
    } else {
      // Sign out — clear in-memory state, keep localStorage intact for next sign in
      set({ isAuthenticated: false, userEmail: null, permanentDownloads: [] });
    }
  },

  addSessionDownload: (item) => set((state) => {
    const newSessionList = [item, ...state.sessionDownloads];
    let newPermanentList = state.permanentDownloads;

    if (state.isAuthenticated && state.userEmail) {
      // Avoid duplicates (same id)
      const alreadyExists = state.permanentDownloads.some((d) => d.id === item.id);
      if (!alreadyExists) {
        newPermanentList = [item, ...state.permanentDownloads];
        saveHistory(state.userEmail, newPermanentList);
      }
    }

    return { sessionDownloads: newSessionList, permanentDownloads: newPermanentList };
  }),

  setActiveTask: (item) => set({ activeTask: item }),
}));
