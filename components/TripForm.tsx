'use client';

import { useState } from 'react';
import { Trip } from '@/types';

interface TripFormProps {
  onTripCreated: () => void;
  initialData?: Trip;
  onCancel?: () => void;
}

export default function TripForm({ onTripCreated, initialData, onCancel }: TripFormProps) {
  const [destination, setDestination] = useState(initialData?.destination || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState(initialData?.status || 'planning');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isEdit = !!initialData;
    const url = isEdit ? `/api/trips/${initialData._id}` : '/api/trips';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, description, status }),
      });

      if (res.ok) {
        if (!isEdit) {
          setDestination('');
          setDescription('');
          setStatus('planning');
        }
        onTripCreated();
      }
    } catch (error) {
      console.error('Error saving trip:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 xl:space-y-8">
      <div>
        <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
          Destination
        </label>
        <input
          type="text"
          required
          className="block w-full border-b border-surface-container py-3 xl:py-4 px-1 text-on-surface placeholder-secondary/55 bg-transparent focus:border-b-2 focus:border-primary focus:outline-none transition-all text-body-md xl:text-base"
          placeholder="e.g. Kyoto, Japan"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
          Description
        </label>
        <textarea
          rows={3}
          className="block w-full border-b border-surface-container py-3 xl:py-4 px-1 text-on-surface placeholder-secondary/55 bg-transparent focus:border-b-2 focus:border-primary focus:outline-none transition-all text-body-md xl:text-base resize-none"
          placeholder="Add trip notes, flights or hotel details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
          Status
        </label>
        <div className="relative">
          <select
            className="block w-full border-b border-surface-container py-3 xl:py-4 px-1 text-on-surface bg-transparent focus:border-b-2 focus:border-primary focus:outline-none transition-all text-body-md xl:text-base appearance-none cursor-pointer"
            value={status}
            onChange={(e) => setStatus(e.target.value as Trip['status'])}
          >
            <option value="planning" className="bg-white text-on-surface">Planning (Upcoming)</option>
            <option value="booked" className="bg-white text-on-surface">Booked (Confirmed)</option>
            <option value="completed" className="bg-white text-on-surface">Completed</option>
          </select>
          <span className="material-symbols-outlined text-secondary absolute right-2 top-3 pointer-events-none text-lg">
            expand_more
          </span>
        </div>
      </div>

      <div className="flex gap-4 pt-2 xl:pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 justify-center bg-primary-container text-on-primary-container py-3 xl:py-4 px-6 rounded-lg font-headline-md font-semibold hover:shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer text-center text-sm xl:text-base"
        >
          {loading ? 'Saving...' : initialData ? 'Update Trip' : 'Create Trip'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 justify-center border border-surface-container bg-white py-3 xl:py-4 px-6 rounded-lg font-headline-md font-semibold text-secondary hover:bg-surface-container-low transition-colors text-center text-sm xl:text-base cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
