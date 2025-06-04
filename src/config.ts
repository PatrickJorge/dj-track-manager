export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const KEY_OPTIONS = [
  { value: '1A', label: '1A - A Minor' },
  { value: '2A', label: '2A - E Minor' },
  { value: '3A', label: '3A - B Minor' },
  { value: '4A', label: '4A - F# Minor' },
  { value: '5A', label: '5A - C# Minor' },
  { value: '6A', label: '6A - G# Minor' },
  { value: '7A', label: '7A - D# Minor' },
  { value: '8A', label: '8A - A# Minor' },
  { value: '9A', label: '9A - F Minor' },
  { value: '10A', label: '10A - C Minor' },
  { value: '11A', label: '11A - G Minor' },
  { value: '12A', label: '12A - D Minor' },
  { value: '1B', label: '1B - C Major' },
  { value: '2B', label: '2B - G Major' },
  { value: '3B', label: '3B - D Major' },
  { value: '4B', label: '4B - A Major' },
  { value: '5B', label: '5B - E Major' },
  { value: '6B', label: '6B - B Major' },
  { value: '7B', label: '7B - F# Major' },
  { value: '8B', label: '8B - C# Major' },
  { value: '9B', label: '9B - G# Major' },
  { value: '10B', label: '10B - D# Major' },
  { value: '11B', label: '11B - A# Major' },
  { value: '12B', label: '12B - F Major' },
];

export const GENRE_OPTIONS = [
  'House',
  'Tech House',
  'Deep House',
  'Progressive House',
  'Techno',
  'Melodic Techno',
  'Trance',
  'Progressive Trance',
  'Drum & Bass',
  'Dubstep',
  'Trap',
  'Hip Hop',
  'R&B',
  'Pop',
  'Ambient',
  'Downtempo',
  'Electronica',
  'Experimental',
  'Other'
];

export const getLinkIcon = (url: string): string => {
  if (url.includes('spotify.com')) return 'spotify';
  if (url.includes('soundcloud.com')) return 'soundcloud';
  if (url.includes('beatport.com')) return 'beatport';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  return 'link';
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};