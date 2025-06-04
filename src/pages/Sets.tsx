import React, { useEffect, useState } from 'react';
import { Search, Plus, ListMusic } from 'lucide-react';
import { useSetStore, Set } from '../stores/setStore';
import SetCard from '../components/sets/SetCard';
import SetForm from '../components/sets/SetForm';

const Sets: React.FC = () => {
  const { sets, fetchSets, createSet, updateSet, deleteSet, isLoading } = useSetStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentSet, setCurrentSet] = useState<Set | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchSets();
  }, [fetchSets]);
  
  const filteredSets = sets.filter(set => 
    set.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (set.description && set.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleAddSet = (data: Partial<Set>) => {
    createSet(data as Omit<Set, '_id' | 'userId' | 'createdAt' | 'updatedAt'>);
    setShowAddForm(false);
  };
  
  const handleEditSet = (data: Partial<Set>) => {
    if (currentSet) {
      updateSet(currentSet._id, data);
      setShowEditForm(false);
      setCurrentSet(null);
    }
  };
  
  const handleDeleteSet = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this set?')) {
      await deleteSet(id);
    }
  };
  
  const openEditForm = (id: string) => {
    const set = sets.find(s => s._id === id);
    if (set) {
      setCurrentSet(set);
      setShowEditForm(true);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Sets</h1>
          <p className="text-dark-300 mt-1">Organize tracks into performance sets</p>
        </div>
        
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-secondary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>Create Set</span>
        </button>
      </div>
      
      <div className="flex items-center space-x-2 bg-dark-800 border border-dark-700 rounded-md px-3 py-2">
        <Search className="h-5 w-5 text-dark-400" />
        <input
          type="text"
          placeholder="Search sets..."
          className="bg-transparent border-none outline-none text-white w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="waveform">
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className="waveform-bar"></div>
            ))}
          </div>
        </div>
      ) : filteredSets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSets.map((set) => (
            <SetCard
              key={set._id}
              set={set}
              onEdit={openEditForm}
              onDelete={handleDeleteSet}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-dark-900/50 rounded-lg border border-dark-800">
          <ListMusic className="h-16 w-16 mx-auto text-dark-700 mb-4" />
          <h3 className="text-xl font-medium">
            {searchTerm ? "No sets found" : "You haven't created any sets yet"}
          </h3>
          <p className="text-dark-400 mt-2 max-w-md mx-auto">
            {searchTerm
              ? "No sets match your search criteria. Try a different search term."
              : "Sets help you organize tracks for your gigs. Create your first set to get started."}
          </p>
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="btn-outline mt-4"
            >
              Clear Search
            </button>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-secondary mt-4"
            >
              Create Your First Set
            </button>
          )}
        </div>
      )}
      
      {showAddForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl">
            <SetForm
              title="Create New Set"
              onSubmit={handleAddSet}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}
      
      {showEditForm && currentSet && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl">
            <SetForm
              title={`Edit: ${currentSet.name}`}
              initialData={currentSet}
              onSubmit={handleEditSet}
              onCancel={() => {
                setShowEditForm(false);
                setCurrentSet(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sets;