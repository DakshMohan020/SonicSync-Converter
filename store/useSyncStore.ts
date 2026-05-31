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
  sessionDownloads: VideoMetadata[];   // This session only — clears on page reload
  permanentDownloads: VideoMetadata[]; // Shown in History when signed in
  activeTask: VideoMetadata | null;
  setIsAuthenticated: (status: boolean, email?: string) => void;
  addSessionDownload: (item: VideoMetadata) => void;
  setActiveTask: (item: VideoMetadata | null) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  isAuthenticated: false,
  userEmail: null,
  sessionDownloads: [],
  permanentDownloads: [],
  activeTask: null,

  setIsAuthenticated: (status, email) => set((state) => ({
    isAuthenticated: status,
    userEmail: status ? (email ?? state.userEmail) : null,
    // On sign out, clear permanent history from memory (it will reload fresh on next sign in)
    permanentDownloads: status ? state.permanentDownloads : [],
  })),

  addSessionDownload: (item) => set((state) => ({
    sessionDownloads: [item, ...state.sessionDownloads],
    permanentDownloads: state.isAuthenticated
      ? [item, ...state.permanentDownloads]
      : state.permanentDownloads,
  })),

  setActiveTask: (item) => set({ activeTask: item }),
}));
