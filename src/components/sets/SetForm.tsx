import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Set } from '../../stores/setStore';

interface SetFormProps {
  onSubmit: (data: Partial<Set>) => void;
  onCancel: () => void;
  initialData?: Partial<Set>;
  title: string;
}

const SetForm: React.FC<SetFormProps> = ({ onSubmit, onCancel, initialData, title }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Set>>({
    defaultValues: initialData || {
      name: '',
      description: '',
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
        <div>
          <label htmlFor="name" className="label">Set Name</label>
          <input
            id="name"
            {...register('name', { required: 'Name is required' })}
            className="input"
            placeholder="Enter set name"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-error-500">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="label">Description (Optional)</label>
          <textarea
            id="description"
            {...register('description')}
            className="input min-h-[100px]"
            placeholder="Describe the purpose or vibe of this set..."
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
            Save Set
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetForm;