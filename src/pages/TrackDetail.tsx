import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Music, ExternalLink, Edit, ArrowLeft, Trash } from 'lucide-react';
import { useTrackStore } from '../stores/trackStore';
import { useSetStore } from '../stores/setStore';
import TrackForm from '../components/tracks/TrackForm';
import { KEY_OPTIONS } from '../config';

const TrackDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTrack, fetchTrack, updateTrack, deleteTrack, isLoading } = useTrackStore();
  const { sets, fetchSets } = useSetStore();
  
  const [showEditForm, setShowEditForm] = useState(false);
  const [tracksInSets, setTracksInSets] = useState<{ setId: string; name: string }[]>([]);
  
  useEffect(() => {
    if (id) {
      fetchTrack(id);
      fetchSets();
    }
  }, [id, fetchTrack, fetchSets]);
  
  useEffect(() => {
    if (sets.length > 0 && currentTrack) {
      const trackSets = sets.filter(set => {
        if (!Array.isArray(set.tracks)) return false;
        return set.tracks.some(trackId => 
          typeof trackId === 'string' 
            ? trackId === currentTrack._id 
            : trackId._id === currentTrack._id
        );
      }).map(set => ({ setId: set._id, name: set.name }));
      
      setTracksInSets(trackSets);
    }
  }, [sets, currentTrack]);
  
  const handleEditTrack = (data: Partial<typeof currentTrack>) => {
    if (id && currentTrack) {
      updateTrack(id, data);
      setShowEditForm(false);
    }
  };
  
  const handleDeleteTrack = async () => {
    if (id && window.confirm('Are you sure you want to delete this track?')) {
      await deleteTrack(id);
      navigate('/tracks');
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
  
  if (!currentTrack) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-4">Track not found</h2>
        <Link to="/tracks" className="btn-primary">
          Back to Tracks
        </Link>
      </div>
    );
  }
  
  const keyObj = KEY_OPTIONS.find(k => k.value === currentTrack.key);
  const keyLabel = keyObj ? keyObj.label.split(' - ')[1] : currentTrack.key;
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/tracks" className="flex items-center text-dark-300 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to Tracks</span>
        </Link>
      </div>
      
      <div className="bg-dark-800 border border-dark-700 rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-900/30 p-3 rounded-full">
                <Music className="h-8 w-8 text-primary-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{currentTrack.title}</h1>
                <p className="text-xl text-dark-300">{currentTrack.artist}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowEditForm(true)}
                className="btn-outline flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                <span>Edit Track</span>
              </button>
              <button
                onClick={handleDeleteTrack}
                className="btn btn-outline flex items-center text-error-500 hover:text-error-400 hover:border-error-700"
              >
                <Trash className="h-4 w-4 mr-2" />
                <span>Delete</span>
              </button>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Track Details</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark-700/50 p-3 rounded">
                    <p className="text-dark-400 text-sm">BPM</p>
                    <p className="text-xl font-semibold">{currentTrack.bpm}</p>
                  </div>
                  <div className="bg-dark-700/50 p-3 rounded">
                    <p className="text-dark-400 text-sm">Key</p>
                    <p className="text-xl font-semibold">{keyLabel}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark-700/50 p-3 rounded">
                    <p className="text-dark-400 text-sm">Genre</p>
                    <p className="text-lg font-medium">{currentTrack.genre}</p>
                    {currentTrack.subgenre && (
                      <p className="text-dark-400 text-sm">{currentTrack.subgenre}</p>
                    )}
                  </div>
                  <div className="bg-dark-700/50 p-3 rounded">
                    <p className="text-dark-400 text-sm">Duration</p>
                    <p className="text-lg font-medium">{currentTrack.duration}</p>
                  </div>
                </div>
              </div>
              
              {currentTrack.notes && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Notes</h3>
                  <div className="bg-dark-700/50 p-4 rounded">
                    <p className="text-dark-300 whitespace-pre-line">{currentTrack.notes}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">External Links</h3>
              {currentTrack.links && Object.entries(currentTrack.links).some(([_, url]) => url) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(currentTrack.links).map(([platform, url]) => {
                    if (!url) return null;
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 bg-dark-700/50 p-3 rounded hover:bg-dark-700 transition-colors"
                      >
                        <ExternalLink className="h-5 w-5 text-dark-400" />
                        <span className="capitalize">{platform}</span>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="text-dark-400">No external links available</p>
              )}
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Included in Sets</h3>
                {tracksInSets.length > 0 ? (
                  <div className="space-y-3">
                    {tracksInSets.map(set => (
                      <Link
                        key={set.setId}
                        to={`/sets/${set.setId}`}
                        className="flex items-center space-x-3 bg-dark-700/50 p-3 rounded hover:bg-dark-700 transition-colors"
                      >
                        <ListMusic className="h-5 w-5 text-secondary-500" />
                        <span>{set.name}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-dark-400">This track is not included in any sets</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showEditForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <TrackForm
              title={`Edit: ${currentTrack.title}`}
              initialData={currentTrack}
              onSubmit={handleEditTrack}
              onCancel={() => setShowEditForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackDetail;