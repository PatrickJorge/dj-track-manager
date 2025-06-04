import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Track } from '../../stores/trackStore';
import { KEY_OPTIONS, GENRE_OPTIONS } from '../../config';

interface TrackFormProps {
  onSubmit: (data: Partial<Track>) => void;
  onCancel: () => void;
  initialData?: Partial<Track>;
  title: string;
}

const TrackForm: React.FC<TrackFormProps> = ({ onSubmit, onCancel, initialData, title }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Track>>({
    defaultValues: initialData || {
      title: '',
      artist: '',
      bpm: 120,
      key: '1A',
      genre: 'House',
      duration: '0:00',
      links: {
        spotify: '',
        soundcloud: '',
        beatport: '',
        youtube: '',
      },
      notes: '',
    },
  });
  
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-lg shadow-xl p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          onClick={onCancel}
          className="p-1.5 rounded-full hover:bg-dark-700 transition-colors"
          title="Close"
        >
          <X className="h-5 w-5 text-dark-400" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="title" className="label">Track Title</label>
            <input
              id="title"
              {...register('title', { required: 'Title is required' })}
              className="input"
              placeholder="Enter track title"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-error-500">{errors.title.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="artist" className="label">Artist</label>
            <input
              id="artist"
              {...register('artist', { required: 'Artist is required' })}
              className="input"
              placeholder="Enter artist name"
            />
            {errors.artist && (
              <p className="mt-1 text-xs text-error-500">{errors.artist.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label htmlFor="bpm" className="label">BPM</label>
            <input
              id="bpm"
              type="number"
              {...register('bpm', { 
                required: 'BPM is required',
                min: { value: 20, message: 'Min BPM is 20' },
                max: { value: 999, message: 'Max BPM is 999' }
              })}
              className="input"
              placeholder="120"
            />
            {errors.bpm && (
              <p className="mt-1 text-xs text-error-500">{errors.bpm.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="key" className="label">Key</label>
            <select
              id="key"
              {...register('key', { required: 'Key is required' })}
              className="input"
            >
              {KEY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.key && (
              <p className="mt-1 text-xs text-error-500">{errors.key.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="duration" className="label">Duration</label>
            <input
              id="duration"
              {...register('duration', { required: 'Duration is required' })}
              className="input"
              placeholder="3:30"
            />
            {errors.duration && (
              <p className="mt-1 text-xs text-error-500">{errors.duration.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="genre" className="label">Genre</label>
            <select
              id="genre"
              {...register('genre', { required: 'Genre is required' })}
              className="input"
            >
              {GENRE_OPTIONS.map(genre => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            {errors.genre && (
              <p className="mt-1 text-xs text-error-500">{errors.genre.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="subgenre" className="label">Subgenre (Optional)</label>
            <input
              id="subgenre"
              {...register('subgenre')}
              className="input"
              placeholder="Enter subgenre"
            />
          </div>
        </div>
        
        <div>
          <label className="label">External Links (Optional)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="spotify" className="label text-xs">Spotify</label>
              <input
                id="spotify"
                {...register('links.spotify')}
                className="input"
                placeholder="https://open.spotify.com/track/..."
              />
            </div>
            
            <div>
              <label htmlFor="soundcloud" className="label text-xs">SoundCloud</label>
              <input
                id="soundcloud"
                {...register('links.soundcloud')}
                className="input"
                placeholder="https://soundcloud.com/..."
              />
            </div>
            
            <div>
              <label htmlFor="beatport" className="label text-xs">Beatport</label>
              <input
                id="beatport"
                {...register('links.beatport')}
                className="input"
                placeholder="https://www.beatport.com/track/..."
              />
            </div>
            
            <div>
              <label htmlFor="youtube" className="label text-xs">YouTube</label>
              <input
                id="youtube"
                {...register('links.youtube')}
                className="input"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="notes" className="label">Notes (Optional)</label>
          <textarea
            id="notes"
            {...register('notes')}
            className="input min-h-[100px]"
            placeholder="Add performance notes, cue points, or other track details..."
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Save Track
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrackForm;