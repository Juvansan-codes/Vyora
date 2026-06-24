'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import TripList from '@/components/TripList';
import TripForm from '@/components/TripForm';
import { Trip } from '@/types';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/trips');
      if (res.ok) {
        const data = await res.json();
        setTrips(data);
      }
    } catch (error) {
      console.error('Failed to fetch trips', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTrips();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface text-sm uppercase tracking-widest text-secondary font-semibold font-sans">
        <span className="material-symbols-outlined text-primary text-3xl animate-spin mr-2" data-icon="progress_activity">
          progress_activity
        </span>
        Loading dashboard...
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Handled by middleware
  }

  return (
    <div className="min-h-screen bg-surface pb-12 font-sans flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-surface-container sticky top-0 z-40">
        <div className="mx-auto max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] w-full px-6 lg:px-12 xl:px-20">
          <div className="flex h-16 xl:h-20 justify-between items-center">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/logo.svg" 
                  alt="Vyora Logo" 
                  className="w-7 h-7 group-hover:scale-105 transition-transform"
                />
                <span className="font-display text-xl font-bold text-on-surface tracking-tight">Vyora</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 border-r border-surface-container pr-6">
                <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
                </span>
                <span className="text-sm font-semibold text-on-surface hidden sm:inline">
                  {session?.user?.name || session?.user?.email}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="mx-auto max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] w-full px-6 lg:px-12 xl:px-20 py-12 xl:py-16 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16 items-start">
          {/* Create Trip Form Column */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 xl:top-28">
            <div className="bg-white border border-surface-container rounded-2xl p-6 xl:p-8 shadow-sm space-y-4">
              <h2 className="text-lg xl:text-xl font-bold text-on-surface border-b border-surface-container pb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">add_box</span>
                Plan a New Trip
              </h2>
              <TripForm onTripCreated={fetchTrips} />
            </div>
          </div>

          {/* Trip List Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-surface-container rounded-2xl p-6 xl:p-8 shadow-sm">
              <h2 className="text-lg xl:text-xl font-bold text-on-surface border-b border-surface-container pb-4 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">luggage</span>
                Your Itineraries
              </h2>
              <TripList trips={trips} onTripUpdated={fetchTrips} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
