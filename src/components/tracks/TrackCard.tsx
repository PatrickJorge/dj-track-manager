import React from 'react';
import { Link } from 'react-router-dom';
import { Music, ExternalLink, Edit, Trash } from 'lucide-react';
import { Track } from '../../stores/trackStore';
import { KEY_OPTIONS } from '../../config';

interface TrackCardProps {
  track: Track;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddToSet?: () => void;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, onEdit, onDelete, onAddToSet }) => {
  const keyObj = KEY_OPTIONS.find(k => k.value === track.key);
  const keyLabel = keyObj ? keyObj.label.split(' - ')[1] : track.key;
  
  return (
    <div className="card card-hover">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-dark-700 p-2 rounded-full">
              <Music className="h-6 w-6 text-primary-500" />
            </div>
            <div>
              <h3 className="font-medium text-lg">{track.title}</h3>
              <p className="text-dark-300">{track.artist}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(track._id)}
              className="p-1.5 rounded-full hover:bg-dark-700 transition-colors"
              title="Edit track"
            >
              <Edit className="h-4 w-4 text-dark-400" />
            </button>
            <button
              onClick={() => onDelete(track._id)}
              className="p-1.5 rounded-full hover:bg-error-900/50 transition-colors"
              title="Delete track"
            >
              <Trash className="h-4 w-4 text-dark-400 hover:text-error-400" />
            </button>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <span className="text-dark-400">BPM:</span>{' '}
            <span className="font-medium">{track.bpm}</span>
          </div>
          <div>
            <span className="text-dark-400">Key:</span>{' '}
            <span className="font-medium">{keyLabel}</span>
          </div>
          <div>
            <span className="text-dark-400">Genre:</span>{' '}
            <span className="font-medium">{track.genre}</span>
          </div>
          <div>
            <span className="text-dark-400">Duration:</span>{' '}
            <span className="font-medium">{track.duration}</span>
          </div>
        </div>
        
        {track.notes && (
          <div className="mt-3 p-2 bg-dark-700/50 rounded text-sm">
            <p className="text-dark-300">{track.notes}</p>
          </div>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-2">
            {track.links && Object.entries(track.links).map(([platform, url]) => {
              if (!url) return null;
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:bg-dark-700 transition-colors"
                  title={`Open in ${platform}`}
                >
                  <ExternalLink className="h-4 w-4 text-dark-400" />
                </a>
              );
            })}
          </div>
          
          <div className="flex space-x-2">
            {onAddToSet && (
              <button
                onClick={onAddToSet}
                className="btn-outline text-xs py-1 px-2"
              >
                Add to Set
              </button>
            )}
            <Link
              to={`/tracks/${track._id}`}
              className="btn-primary text-xs py-1 px-2"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;