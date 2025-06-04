import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, ListMusic, Plus, Clock, Search, BarChart2, Star, UserPlus, Award, Trophy } from 'lucide-react';
import { useTrackStore, Track } from '../stores/trackStore';
import { useSetStore, Set } from '../stores/setStore';
import TrackCard from '../components/tracks/TrackCard';
import SetCard from '../components/sets/SetCard';
import { useAuthStore } from '../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { tracks, fetchTracks, isLoading: tracksLoading } = useTrackStore();
  const { sets, fetchSets, isLoading: setsLoading } = useSetStore();
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [recentSets, setRecentSets] = useState<Set[]>([]);
  const [quickSearch, setQuickSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showQuickFilters, setShowQuickFilters] = useState(false);

  useEffect(() => {
    fetchTracks();
    fetchSets();
  }, [fetchTracks, fetchSets]);

  useEffect(() => {
    if (tracks.length > 0) {
      const sorted = [...tracks].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentTracks(sorted.slice(0, 4));
    }

    if (sets.length > 0) {
      const sorted = [...sets].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentSets(sorted.slice(0, 3));
    }
  }, [tracks, sets]);

  const isLoading = tracksLoading || setsLoading;

  // Estatísticas rápidas
  const now = new Date();
  const tracksThisMonth = tracks.filter(track => {
    const created = new Date(track.createdAt);
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  });
  const setsMostPlayed = sets.slice(0, 1); // Exemplo: pegar o primeiro set como mais tocado

  const trackSuggestions = tracks.filter(track =>
    quickSearch.length > 0 &&
    (track.title.toLowerCase().includes(quickSearch.toLowerCase()) ||
      track.artist.toLowerCase().includes(quickSearch.toLowerCase()))
  ).slice(0, 5);

  // Função para calcular conquistas
  const getAchievements = () => {
    const achievements = [];
    if (tracks.length >= 10) {
      achievements.push({
        icon: <Trophy className="w-5 h-5 text-yellow-400" />, label: '10 tracks adicionadas!'
      });
    }
    if (sets.length >= 1) {
      achievements.push({
        icon: <Award className="w-5 h-5 text-accent-400" />, label: 'Primeiro set criado!'
      });
    }
    return achievements;
  };
  const achievements = getAchievements();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="waveform">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="waveform-bar"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome, {user?.name || 'DJ'}</h1>
          <p className="text-dark-300 mt-1">Manage your tracks and sets with ease</p>
        </div>
        <div className="flex gap-2">
          <Link to="/tracks" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Track
          </Link>
          <Link to="/sets" className="btn-secondary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Set
          </Link>
        </div>
      </div>

      {/* Estatísticas rápidas e atalhos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div className="bg-dark-800 rounded-lg p-4 flex items-center gap-4 shadow">
          <BarChart2 className="w-8 h-8 text-primary-400" />
          <div>
            <div className="text-lg font-bold text-white">{tracksThisMonth.length}</div>
            <div className="text-xs text-dark-300">Tracks este mês</div>
          </div>
        </div>
        <div className="bg-dark-800 rounded-lg p-4 flex items-center gap-4 shadow">
          <Star className="w-8 h-8 text-yellow-400" />
          <div>
            <div className="text-lg font-bold text-white">{setsMostPlayed.length > 0 ? setsMostPlayed[0].name : '-'}</div>
            <div className="text-xs text-dark-300">Set mais tocado</div>
          </div>
        </div>
        <div className="bg-dark-800 rounded-lg p-4 flex items-center gap-4 shadow">
          <UserPlus className="w-8 h-8 text-accent-400" />
          <div>
            <div className="text-lg font-bold text-white">{user?.name || 'DJ'}</div>
            <div className="text-xs text-dark-300">Usuário</div>
          </div>
        </div>
        <div className="bg-dark-800 rounded-lg p-4 flex items-center gap-4 shadow">
          <Music className="w-8 h-8 text-secondary-400" />
          <div>
            <div className="text-lg font-bold text-white">{tracks.length}</div>
            <div className="text-xs text-dark-300">Total de Tracks</div>
          </div>
        </div>
      </div>

      {achievements.length > 0 && (
        <div className="flex flex-wrap gap-3 items-center mt-2">
          {achievements.map((ach, idx) => (
            <div key={idx} className="flex items-center bg-dark-800 border border-dark-700 rounded-full px-4 py-2 text-sm text-white gap-2 shadow animate-fade-in">
              {ach.icon}
              <span>{ach.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-4">
        <div className="card bg-primary-900/20 border-primary-700/30 p-6 flex flex-col">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-primary-800/50 p-2 rounded-full">
              <Music className="h-6 w-6 text-primary-400" />
            </div>
            <h2 className="text-xl font-medium text-white">Tracks</h2>
          </div>
          <p className="text-4xl font-bold text-white">{tracks.length}</p>
          <p className="text-dark-400 text-sm mt-1">Total tracks</p>
          <div className="mt-auto pt-4">
            <Link to="/tracks" className="btn-primary w-full text-center">
              Manage Tracks
            </Link>
          </div>
        </div>

        <div className="card bg-secondary-900/20 border-secondary-700/30 p-6 flex flex-col">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-secondary-800/50 p-2 rounded-full">
              <ListMusic className="h-6 w-6 text-secondary-400" />
            </div>
            <h2 className="text-xl font-medium text-white">Sets</h2>
          </div>
          <p className="text-4xl font-bold text-white">{sets.length}</p>
          <p className="text-dark-400 text-sm mt-1">Total sets</p>
          <div className="mt-auto pt-4">
            <Link to="/sets" className="btn-secondary w-full text-center">
              Manage Sets
            </Link>
          </div>
        </div>

        <div className="card bg-accent-900/20 border-accent-700/30 p-6 flex flex-col">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-accent-800/50 p-2 rounded-full">
              <Plus className="h-6 w-6 text-accent-400" />
            </div>
            <h2 className="text-xl font-medium text-white">Add New</h2>
          </div>
          <div className="flex flex-col space-y-3">
            <Link to="/tracks" className="btn-outline text-center">
              Add Track
            </Link>
            <Link to="/sets" className="btn-outline text-center">
              Create Set
            </Link>
          </div>
        </div>

        <div className="card bg-dark-800 border-dark-700 p-6 flex flex-col relative">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-dark-700 p-2 rounded-full">
              <Search className="h-6 w-6 text-dark-400" />
            </div>
            <h2 className="text-xl font-medium text-white">Quick Search</h2>
          </div>
          <div className="flex flex-col space-y-3">
            <div className="input flex items-center space-x-2 relative">
              <Search className="h-4 w-4 text-dark-500" />
              <input
                type="text"
                placeholder="Search by track, artist..."
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-dark-400"
                value={quickSearch}
                onChange={e => {
                  setQuickSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              />
              <button
                className="ml-2 btn-outline text-xs px-2 py-1"
                onClick={() => setShowQuickFilters(v => !v)}
                type="button"
              >
                Filtros
              </button>
            </div>
            {showSuggestions && trackSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-16 bg-dark-900 border border-dark-700 rounded shadow z-20">
                {trackSuggestions.map(s => (
                  <div
                    key={s._id}
                    className="px-4 py-2 hover:bg-dark-800 cursor-pointer text-sm"
                    onMouseDown={() => {
                      setQuickSearch(s.title);
                      setShowSuggestions(false);
                    }}
                  >
                    <span className="font-medium text-white">{s.title}</span>
                    <span className="text-dark-400 ml-2">{s.artist}</span>
                  </div>
                ))}
              </div>
            )}
            {showQuickFilters && (
              <div className="mt-2 p-4 bg-dark-900 border border-dark-700 rounded-lg shadow">
                <div className="mb-2">
                  <label className="label">Gênero</label>
                  <select className="input">
                    <option value="">Todos</option>
                    {/* Adicione opções de gênero dinamicamente se desejar */}
                    <option value="House">House</option>
                    <option value="Techno">Techno</option>
                    <option value="Pop">Pop</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="label">Artista</label>
                  <input className="input" placeholder="Nome do artista" />
                </div>
                <div className="mb-2">
                  <label className="label">Ano</label>
                  <input className="input" type="number" placeholder="2024" />
                </div>
                <button className="btn-primary mt-2 w-full">Aplicar Filtros</button>
              </div>
            )}
          </div>
          <div className="mt-4">
            <Link to="/tracks" className="text-sm text-primary-400 hover:text-primary-300">
              Advanced search →
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent Tracks</h2>
          <Link to="/tracks" className="text-sm text-primary-400 hover:text-primary-300 flex items-center">
            <span>View all</span>
            <Clock className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {recentTracks.length > 0 ? (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recentTracks.map(track => (
                <motion.div
                  key={track._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TrackCard
                    track={track}
                    onEdit={() => { }}
                    onDelete={() => {
                      toast.success('Track removida com sucesso!');
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-12 bg-dark-900/50 rounded-lg border border-dark-800">
            <Music className="h-12 w-12 mx-auto text-dark-700 mb-3" />
            <h3 className="text-lg font-medium text-white">No tracks yet</h3>
            <p className="text-dark-400 mt-1">Start by adding your first track</p>
            <Link to="/tracks" className="btn-primary mt-4 inline-block">
              Add Track
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent Sets</h2>
          <Link to="/sets" className="text-sm text-primary-400 hover:text-primary-300 flex items-center">
            <span>View all</span>
            <Clock className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {recentSets.length > 0 ? (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentSets.map(set => (
                <motion.div
                  key={set._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SetCard
                    set={set}
                    onEdit={() => { }}
                    onDelete={() => {
                      toast.success('Set removido com sucesso!');
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-12 bg-dark-900/50 rounded-lg border border-dark-800">
            <ListMusic className="h-12 w-12 mx-auto text-dark-700 mb-3" />
            <h3 className="text-lg font-medium text-white">No sets yet</h3>
            <p className="text-dark-400 mt-1">Start by creating your first set</p>
            <Link to="/sets" className="btn-secondary mt-4 inline-block">
              Create Set
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;