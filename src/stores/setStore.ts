import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../config';
import { Track } from './trackStore';

export interface Set {
  _id: string;
  name: string;
  description?: string;
  tracks: (Track | string)[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface SetState {
  sets: Set[];
  currentSet: Set | null;
  isLoading: boolean;
  error: string | null;
  fetchSets: () => Promise<void>;
  fetchSet: (id: string) => Promise<void>;
  createSet: (set: Omit<Set, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSet: (id: string, set: Partial<Set>) => Promise<void>;
  deleteSet: (id: string) => Promise<void>;
  addTrackToSet: (setId: string, trackId: string) => Promise<void>;
  removeTrackFromSet: (setId: string, trackId: string) => Promise<void>;
  reorderTracks: (setId: string, trackIds: string[]) => Promise<void>;
}

export const useSetStore = create<SetState>((set, get) => ({
  sets: [],
  currentSet: null,
  isLoading: false,
  error: null,
  
  fetchSets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/sets`);
      set({ sets: response.data, isLoading: false });
    } catch (error) {
      console.error('Fetch sets error:', error);
      set({ error: 'Failed to fetch sets', isLoading: false });
    }
  },
  
  fetchSet: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/sets/${id}`);
      set({ currentSet: response.data, isLoading: false });
    } catch (error) {
      console.error('Fetch set error:', error);
      set({ error: 'Failed to fetch set', isLoading: false });
    }
  },
  
  createSet: async (set) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/sets`, set);
      set(state => ({ 
        sets: [...state.sets, response.data], 
        isLoading: false 
      }));
    } catch (error) {
      console.error('Create set error:', error);
      set({ error: 'Failed to create set', isLoading: false });
    }
  },
  
  updateSet: async (id, setData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/sets/${id}`, setData);
      set(state => ({ 
        sets: state.sets.map(s => s._id === id ? response.data : s),
        currentSet: state.currentSet?._id === id ? response.data : state.currentSet,
        isLoading: false 
      }));
    } catch (error) {
      console.error('Update set error:', error);
      set({ error: 'Failed to update set', isLoading: false });
    }
  },
  
  deleteSet: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/sets/${id}`);
      set(state => ({ 
        sets: state.sets.filter(s => s._id !== id),
        isLoading: false 
      }));
    } catch (error) {
      console.error('Delete set error:', error);
      set({ error: 'Failed to delete set', isLoading: false });
    }
  },
  
  addTrackToSet: async (setId, trackId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/sets/${setId}/tracks`, { trackId });
      set(state => ({ 
        sets: state.sets.map(s => s._id === setId ? response.data : s),
        currentSet: state.currentSet?._id === setId ? response.data : state.currentSet,
        isLoading: false 
      }));
    } catch (error) {
      console.error('Add track to set error:', error);
      set({ error: 'Failed to add track to set', isLoading: false });
    }
  },
  
  removeTrackFromSet: async (setId, trackId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_URL}/sets/${setId}/tracks/${trackId}`);
      set(state => ({ 
        sets: state.sets.map(s => s._id === setId ? response.data : s),
        currentSet: state.currentSet?._id === setId ? response.data : state.currentSet,
        isLoading: false 
      }));
    } catch (error) {
      console.error('Remove track from set error:', error);
      set({ error: 'Failed to remove track from set', isLoading: false });
    }
  },
  
  reorderTracks: async (setId, trackIds) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/sets/${setId}/reorder`, { trackIds });
      set(state => ({ 
        sets: state.sets.map(s => s._id === setId ? response.data : s),
        currentSet: state.currentSet?._id === setId ? response.data : state.currentSet,
        isLoading: false 
      }));
    } catch (error) {
      console.error('Reorder tracks error:', error);
      set({ error: 'Failed to reorder tracks', isLoading: false });
    }
  },
}));