'use client';

import { useState } from 'react';
import TripForm from './TripForm';
import { Trip } from '@/types';
import { motion, useReducedMotion } from 'framer-motion';
import ConfirmModal from './ConfirmModal';

interface TripListProps {
  trips: Trip[];
  onTripUpdated: () => void;
}

export default function TripList({ trips, onTripUpdated }: TripListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, y: 0, 
      transition: { duration: shouldReduceMotion ? 0 : 0.3 } 
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    
    try {
      const res = await fetch(`/api/trips/${deletingId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onTripUpdated();
      }
    } catch (error) {
      console.error('Failed to delete trip:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (trips.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-surface-container rounded-2xl text-secondary bg-surface-container-low/40">
        <span className="material-symbols-outlined text-4xl mb-2 block text-secondary/60">
          event_busy
        </span>
        <p className="font-semibold text-body-lg">No trips planned yet.</p>
        <p className="text-xs text-secondary/80 mt-1">Start by planning a destination on the left.</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 xl:space-y-6"
    >
      {trips.map((trip) => {
        // Status indicator configurations
        let statusBg = 'bg-surface-container';
        let statusText = 'text-secondary';
        let dotColor = 'bg-secondary';
        
        if (trip.status === 'planning') {
          statusBg = 'bg-primary-container/10';
          statusText = 'text-primary';
          dotColor = 'bg-primary-container';
        } else if (trip.status === 'booked') {
          statusBg = 'bg-surface-container-highest';
          statusText = 'text-on-surface-variant';
          dotColor = 'bg-secondary';
        } else if (trip.status === 'completed') {
          statusBg = 'bg-green-50';
          statusText = 'text-green-700';
          dotColor = 'bg-green-500';
        }

        return (
          <motion.div 
            key={trip._id} 
            variants={itemVariants}
            whileHover={shouldReduceMotion ? {} : { y: -4, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.12)' }}
            className="border border-surface-container border-l-[4px] border-l-transparent rounded-xl p-6 xl:p-8 bg-white hover:border-l-primary transition-colors duration-300 shadow-sm relative group"
          >
            {editingId === trip._id ? (
              <div className="bg-surface-container-low/30 p-4 -mx-6 -my-6 rounded-xl border border-surface-container">
                <div className="flex justify-between items-center mb-4 border-b border-surface-container pb-2">
                  <span className="font-bold text-sm text-on-surface">Edit Itinerary</span>
                  <button 
                    onClick={() => setEditingId(null)}
                    className="text-xs text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
                <TripForm 
                  initialData={trip} 
                  onTripCreated={() => {
                    setEditingId(null);
                    onTripUpdated();
                  }}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">
                      location_on
                    </span>
                    <h3 className="text-lg xl:text-xl font-bold text-on-surface leading-snug">
                      {trip.destination}
                    </h3>
                  </div>
                  
                  {trip.description && (
                    <p className="text-body-md xl:text-base text-secondary leading-relaxed">
                      {trip.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 pt-2">
                    {/* Status Badge with Dot */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBg} ${statusText}`}>
                      <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                      {trip.status}
                    </span>
                    
                    {/* Date */}
                    <span className="text-xs text-secondary font-mono tracking-tight flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">calendar_today</span>
                      {new Date(trip.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setEditingId(trip._id)}
                    className="w-9 h-9 rounded-full flex items-center justify-center border border-surface-container text-secondary hover:border-primary hover:text-primary transition-all cursor-pointer shadow-sm hover:shadow"
                    title="Edit Trip"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button
                    onClick={() => setDeletingId(trip._id)}
                    className="w-9 h-9 rounded-full flex items-center justify-center border border-surface-container text-secondary hover:border-error hover:text-error transition-all cursor-pointer shadow-sm hover:shadow"
                    title="Delete Trip"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}

      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        title="Delete Trip"
        message="Are you sure you want to delete this itinerary? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </motion.div>
  );
}
