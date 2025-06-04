import React, { useEffect, useState } from 'react';
import { Search, Sliders, Plus, Music } from 'lucide-react';
import { useTrackStore, Track, TrackFilters } from '../stores/trackStore';
import TrackCard from '../components/tracks/TrackCard';
import TrackForm from '../components/tracks/TrackForm';
import { KEY_OPTIONS, GENRE_OPTIONS } from '../config';

const Tracks: React.FC = () => {
  const { tracks, fetchTracks, createTrack, updateTrack, deleteTrack, isLoading, filters, setFilters, clearFilters } = useTrackStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<TrackFilters>(filters);
  
  useEffect(() => {
    fetchTracks();
  }, [fetchTracks, filters]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, search: e.target.value });
  };
  
  const applyFilters = () => {
    setFilters(localFilters);
    setShowFilters(false);
  };
  
  const resetFilters = () => {
    setLocalFilters({});
    clearFilters();
    setShowFilters(false);
  };
  
  const handleAddTrack = (data: Partial<Track>) => {
    createTrack(data as Omit<Track, '_id' | 'userId' | 'createdAt' | 'updatedAt'>);
    setShowAddForm(false);
  };
  
  const handleEditTrack = (data: Partial<Track>) => {
    if (currentTrack) {
      updateTrack(currentTrack._id, data);
      setShowEditForm(false);
      setCurrentTrack(null);
    }
  };
  
  const handleDeleteTrack = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this track?')) {
      await deleteTrack(id);
    }
  };
  
  const openEditForm = (id: string) => {
    const track = tracks.find(t => t._id === id);
    if (track) {
      setCurrentTrack(track);
      setShowEditForm(true);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Tracks</h1>
          <p className="text-dark-300 mt-1">Manage your music collection</p>
        </div>
        
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>Add Track</span>
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row items-start gap-4">
        <div className="w-full md:flex-1 flex items-center space-x-2 bg-dark-800 border border-dark-700 rounded-md px-3 py-2">
          <Search className="h-5 w-5 text-dark-400" />
          <input
            type="text"
            placeholder="Search by title, artist..."
            className="bg-transparent border-none outline-none text-white w-full"
            value={localFilters.search || ''}
            onChange={handleSearch}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-outline flex items-center w-full md:w-auto"
        >
          <Sliders className="h-5 w-5 mr-2" />
          <span>Filters</span>
        </button>
      </div>
      
      {showFilters && (
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
          <h3 className="font-medium mb-4">Filter Tracks</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="bpmMin" className="label">Min BPM</label>
              <input
                id="bpmMin"
                type="number"
                className="input"
                placeholder="Min BPM"
                value={localFilters.bpmMin || ''}
                onChange={(e) => setLocalFilters({ ...localFilters, bpmMin: parseInt(e.target.value) || undefined })}
              />
            </div>
            
            <div>
              <label htmlFor="bpmMax" className="label">Max BPM</label>
              <input
                id="bpmMax"
                type="number"
                className="input"
                placeholder="Max BPM"
                value={localFilters.bpmMax || ''}
                onChange={(e) => setLocalFilters({ ...localFilters, bpmMax: parseInt(e.target.value) || undefined })}
              />
            </div>
            
            <div>
              <label htmlFor="key" className="label">Key</label>
              <select
                id="key"
                className="input"
                value={localFilters.key || ''}
                onChange={(e) => setLocalFilters({ ...localFilters, key: e.target.value || undefined })}
              >
                <option value="">Any Key</option>
                {KEY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="genre" className="label">Genre</label>
            <select
              id="genre"
              className="input"
              value={localFilters.genre || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, genre: e.target.value || undefined })}
            >
              <option value="">Any Genre</option>
              {GENRE_OPTIONS.map(genre => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              onClick={resetFilters}
              className="btn-outline"
            >
              Clear Filters
            </button>
            <button 
              onClick={applyFilters}
              className="btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="waveform">
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className="waveform-bar"></div>
            ))}
          </div>
        </div>
      ) : tracks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tracks.map((track) => (
            <TrackCard
              key={track._id}
              track={track}
              onEdit={openEditForm}
              onDelete={handleDeleteTrack}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-dark-900/50 rounded-lg border border-dark-800">
          <Music className="h-16 w-16 mx-auto text-dark-700 mb-4" />
          <h3 className="text-xl font-medium">No tracks found</h3>
          <p className="text-dark-400 mt-2 max-w-md mx-auto">
            {Object.keys(filters).length > 0
              ? "No tracks match your filter criteria. Try adjusting your filters."
              : "Your track collection is empty. Start by adding your first track."}
          </p>
          {Object.keys(filters).length > 0 ? (
            <button
              onClick={resetFilters}
              className="btn-outline mt-4"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary mt-4"
            >
              Add Your First Track
            </button>
          )}
        </div>
      )}
      
      {showAddForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <TrackForm
              title="Add New Track"
              onSubmit={handleAddTrack}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}
      
      {showEditForm && currentTrack && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <TrackForm
              title={`Edit: ${currentTrack.title}`}
              initialData={currentTrack}
              onSubmit={handleEditTrack}
              onCancel={() => {
                setShowEditForm(false);
                setCurrentTrack(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracks;