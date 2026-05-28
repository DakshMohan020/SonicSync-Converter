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
  sessionDownloads: VideoMetadata[]; // Library View: Local Session Memory Cache
  permanentDownloads: VideoMetadata[]; // History View: Cloud Backed Accounts Cache
  activeTask: VideoMetadata | null; // Payload carrier for /success route handover
  setIsAuthenticated: (status: boolean, email?: string) => void;
  addSessionDownload: (item: VideoMetadata) => void;
  setActiveTask: (item: VideoMetadata | null) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  isAuthenticated: false,
  userEmail: null,
  sessionDownloads: [],
  // Pre-seed baseline authenticated data history blocks cleanly excluding sample boilerplate videos
  permanentDownloads: [
    {
      id: 'archived-09c',
      title: 'Structural Synthesis (Continuous Mix File)',
      artist: 'Krypton Audio Engineers',
      album: 'Architectures of Noise',
      duration: '7:42',
      coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
      fileSize: '18.1 MB',
      downloadUrl: '#',
      timestamp: '2026-05-12',
      targetUrl: 'https://www.youtube.com/watch?v=s7118241x'
    }
  ],
  activeTask: null,
  setIsAuthenticated: (status, email) => set({ 
    isAuthenticated: status, 
    userEmail: email || null 
  }),
  addSessionDownload: (item) => set((state) => {
    const freshSessionList = [item, ...state.sessionDownloads];
    const freshPermanentList = state.isAuthenticated 
      ? [item, ...state.permanentDownloads] 
      : state.permanentDownloads;
    return { 
      sessionDownloads: freshSessionList, 
      permanentDownloads: freshPermanentList 
    };
  }),
  setActiveTask: (item) => set({ activeTask: item }),
}));