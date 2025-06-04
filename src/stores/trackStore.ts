import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../config';

export interface Track {
  _id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  genre: string;
  subgenre?: string;
  duration: string;
  links?: {
    spotify?: string;
    soundcloud?: string;
    beatport?: string;
    youtube?: string;
  };
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackFilters {
  search?: string;
  bpmMin?: number;
  bpmMax?: number;
  key?: string;
  genre?: string;
}

interface TrackState {
  tracks: Track[];
  currentTrack: Track | null;
  isLoading: boolean;
  error: string | null;
  filters: TrackFilters;
  fetchTracks: () => Promise<void>;
  fetchTrack: (id: string) => Promise<void>;
  createTrack: (track: Omit<Track, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTrack: (id: string, track: Partial<Track>) => Promise<void>;
  deleteTrack: (id: string) => Promise<void>;
  setFilters: (filters: TrackFilters) => void;
  clearFilters: () => void;
}

export const useTrackStore = create<TrackState>((set, get) => ({
  tracks: [],
  currentTrack: null,
  isLoading: false,
  error: null,
  filters: {},
  
  fetchTracks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.bpmMin) queryParams.append('bpmMin', filters.bpmMin.toString());
      if (filters.bpmMax) queryParams.append('bpmMax', filters.bpmMax.toString());
      if (filters.key) queryParams.append('key', filters.key);
      if (filters.genre) queryParams.append('genre', filters.genre);
      
      const url = `${API_URL}/tracks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await axios.get(url);
      
      set({ tracks: response.data, isLoading: false });
    } catch (error) {
      console.error('Fetch tracks error:', error);
      set({ error: 'Failed to fetch tracks', isLoading: false });
    }
  },
  
  fetchTrack: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/tracks/${id}`);
      set({ currentTrack: response.data, isLoading: false });
    } catch (error) {
      console.error('Fetch track error:', error);
      set({ error: 'Failed to fetch track', isLoading: false });
    }
  },
  
  createTrack: async (track) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/tracks`, track);
      set(state => ({ 
        tracks: [...state.tracks, response.data], 
        isLoading: false 
      }));
    } catch (error) {
      console.error('Create track error:', error);
      set({ error: 'Failed to create track', isLoading: false });
    }
  },
  
  updateTrack: async (id, track) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/tracks/${id}`, track);
      set(state => ({ 
        tracks: state.tracks.map(t => t._id === id ? response.data : t),
        currentTrack: state.currentTrack?._id === id ? response.data : state.currentTrack,
        isLoading: false 
      }));
    } catch (error) {
      console.error('Update track error:', error);
      set({ error: 'Failed to update track', isLoading: false });
    }
  },
  
  deleteTrack: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/tracks/${id}`);
      set(state => ({ 
        tracks: state.tracks.filter(t => t._id !== id),
        isLoading: false 
      }));
    } catch (error) {
      console.error('Delete track error:', error);
      set({ error: 'Failed to delete track', isLoading: false });
    }
  },
  
  setFilters: (filters) => set(state => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  
  clearFilters: () => set({ filters: {} }),
}));