import React from 'react';
import { Link } from 'react-router-dom';
import { ListMusic, Edit, Trash } from 'lucide-react';
import { Set } from '../../stores/setStore';

interface SetCardProps {
  set: Set;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SetCard: React.FC<SetCardProps> = ({ set, onEdit, onDelete }) => {
  return (
    <div className="card card-hover">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-dark-700 p-2 rounded-full">
              <ListMusic className="h-6 w-6 text-secondary-500" />
            </div>
            <div>
              <h3 className="font-medium text-lg">{set.name}</h3>
              <p className="text-dark-300">
                {Array.isArray(set.tracks) ? `${set.tracks.length} tracks` : '0 tracks'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(set._id)}
              className="p-1.5 rounded-full hover:bg-dark-700 transition-colors"
              title="Edit set"
            >
              <Edit className="h-4 w-4 text-dark-400" />
            </button>
            <button
              onClick={() => onDelete(set._id)}
              className="p-1.5 rounded-full hover:bg-error-900/50 transition-colors"
              title="Delete set"
            >
              <Trash className="h-4 w-4 text-dark-400 hover:text-error-400" />
            </button>
          </div>
        </div>
        
        {set.description && (
          <div className="mt-3 p-2 bg-dark-700/50 rounded text-sm">
            <p className="text-dark-300">{set.description}</p>
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <Link
            to={`/sets/${set._id}`}
            className="btn-secondary text-xs py-1 px-2"
          >
            View Set
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SetCard;