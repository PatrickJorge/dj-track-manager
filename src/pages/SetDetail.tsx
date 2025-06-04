import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ListMusic, ArrowLeft, Edit, Trash, Music, Plus } from 'lucide-react';
import { useSetStore } from '../stores/setStore';
import { useTrackStore, Track } from '../stores/trackStore';
import SetForm from '../components/sets/SetForm';

const SetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentSet, fetchSet, updateSet, deleteSet, removeTrackFromSet, isLoading } = useSetStore();
  const { tracks, fetchTracks } = useTrackStore();
  
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddTrackModal, setShowAddTrackModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (id) {
      fetchSet(id);
      fetchTracks();
    }
  }, [id, fetchSet, fetchTracks]);
  
  const filteredTracks = tracks.filter(track => {
    // If the track is already in the set, don't show it
    if (currentSet && Array.isArray(currentSet.tracks)) {
      const trackIds = currentSet.tracks.map(t => 
        typeof t === 'string' ? t : t._id
      );
      if (trackIds.includes(track._id)) return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      return (
        track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return true;
  });
  
  const handleEditSet = (data: Partial<typeof currentSet>) => {
    if (id && currentSet) {
      updateSet(id, data);
      setShowEditForm(false);
    }
  };
  
  const handleDeleteSet = async () => {
    if (id && window.confirm('Are you sure you want to delete this set?')) {
      await deleteSet(id);
      navigate('/sets');
    }
  };
  
  const handleRemoveTrack = async (trackId: string) => {
    if (id && window.confirm('Remove this track from the set?')) {
      await removeTrackFromSet(id, trackId);
    }
  };
  
  const handleAddTrack = async (trackId: string) => {
    if (id) {
      try {
        await fetch(`http://localhost:5000/api/sets/${id}/tracks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ trackId })
        });
        
        // Refresh the set data
        fetchSet(id);
        setShowAddTrackModal(false);
      } catch (error) {
        console.error('Error adding track to set:', error);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="waveform">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="waveform-bar"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!currentSet) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-4">Set not found</h2>
        <Link to="/sets" className="btn-primary">
          Back to Sets
        </Link>
      </div>
    );
  }
  
  const trackItems = Array.isArray(currentSet.tracks) 
    ? currentSet.tracks.map(track => {
        if (typeof track === 'string') {
          // Find the full track object from our tracks array
          const fullTrack = tracks.find(t => t._id === track);
          return fullTrack || { _id: track, title: 'Unknown Track', artist: 'Unknown Artist' };
        }
        return track;
      })
    : [];
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/sets" className="flex items-center text-dark-300 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to Sets</span>
        </Link>
      </div>
      
      <div className="bg-dark-800 border border-dark-700 rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-secondary-900/30 p-3 rounded-full">
                <ListMusic className="h-8 w-8 text-secondary-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{currentSet.name}</h1>
                <p className="text-dark-300">{trackItems.length} tracks</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowEditForm(true)}
                className="btn-outline flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                <span>Edit Set</span>
              </button>
              <button
                onClick={handleDeleteSet}
                className="btn btn-outline flex items-center text-error-500 hover:text-error-400 hover:border-error-700"
              >
                <Trash className="h-4 w-4 mr-2" />
                <span>Delete</span>
              </button>
            </div>
          </div>
          
          {currentSet.description && (
            <div className="mt-4 p-4 bg-dark-700/50 rounded">
              <p className="text-dark-300">{currentSet.description}</p>
            </div>
          )}
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Tracks in this Set</h2>
              <button
                onClick={() => setShowAddTrackModal(true)}
                className="btn-secondary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>Add Track</span>
              </button>
            </div>
            
            {trackItems.length > 0 ? (
              <div className="space-y-3">
                {trackItems.map((track, index) => (
                  <div 
                    key={track._id}
                    className="bg-dark-700/50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-dark-600 h-8 w-8 rounded-full flex items-center justify-center text-dark-300 font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{track.title}</h3>
                        <p className="text-dark-300 text-sm">{track.artist}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 ml-auto">
                      <Link
                        to={`/tracks/${track._id}`}
                        className="btn-outline text-xs py-1 px-2"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleRemoveTrack(track._id)}
                        className="p-1.5 rounded-full hover:bg-dark-600 text-dark-400 hover:text-error-400 transition-colors"
                        title="Remove from set"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-dark-900/50 rounded-lg border border-dark-800">
                <Music className="h-12 w-12 mx-auto text-dark-700 mb-3" />
                <h3 className="text-lg font-medium">No tracks in this set</h3>
                <p className="text-dark-400 mt-1">Add tracks to build your set</p>
                <button
                  onClick={() => setShowAddTrackModal(true)}
                  className="btn-secondary mt-4"
                >
                  Add Tracks
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showEditForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl">
            <SetForm
              title={`Edit: ${currentSet.name}`}
              initialData={currentSet}
              onSubmit={handleEditSet}
              onCancel={() => setShowEditForm(false)}
            />
          </div>
        </div>
      )}
      
      {showAddTrackModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl bg-dark-800 border border-dark-700 rounded-lg shadow-xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Add Track to Set</h2>
              <button
                onClick={() => setShowAddTrackModal(false)}
                className="p-1.5 rounded-full hover:bg-dark-700 transition-colors"
              >
                <Trash className="h-5 w-5 text-dark-400" />
              </button>
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search tracks..."
                className="input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {filteredTracks.length > 0 ? (
              <div className="space-y-3">
                {filteredTracks.map(track => (
                  <div
                    key={track._id}
                    className="bg-dark-700/50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-dark-800/80 p-2 rounded-full">
                        <Music className="h-5 w-5 text-primary-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">{track.title}</h3>
                        <p className="text-dark-300 text-sm">{track.artist}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-dark-400">BPM: {track.bpm}</span>
                      <span className="text-dark-400">|</span>
                      <span className="text-dark-400">Key: {track.key}</span>
                    </div>
                    
                    <button
                      onClick={() => handleAddTrack(track._id)}
                      className="btn-secondary text-xs py-1 px-2 ml-auto"
                    >
                      Add to Set
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-dark-400">
                  {searchTerm 
                    ? "No tracks found matching your search" 
                    : "No available tracks to add"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="btn-outline mt-3 text-sm"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SetDetail;