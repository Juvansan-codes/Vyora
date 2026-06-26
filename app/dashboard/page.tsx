'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import TripList from '@/components/TripList';
import TripForm from '@/components/TripForm';
import AITripPlanList from '@/components/AITripPlanList';
import { Trip } from '@/types';
import { AITripPlan } from '@/types/ai-trip-plan';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import DashboardSkeleton from '@/components/DashboardSkeleton';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [aiPlans, setAiPlans] = useState<AITripPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/trips');
      if (res.ok) {
        const data = await res.json();
        setTrips(data);
      }
    } catch (error) {
      console.error('Failed to fetch trips', error);
    }
  };

  const fetchAIPlans = async () => {
    try {
      const res = await fetch('/api/ai-trip-plans?limit=10');
      if (res.ok) {
        const data = await res.json();
        setAiPlans(data.plans || []);
      }
    } catch (error) {
      console.error('Failed to fetch AI plans', error);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchTrips(), fetchAIPlans()]);
    setLoading(false);
  };

  useEffect(() => {
    if (status === 'authenticated') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === 'unauthenticated') {
    return null; // Handled by middleware
  }

  const isLoading = status === 'loading' || loading;

  return (
    <div className="min-h-screen bg-surface pb-12 font-sans flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-black/10 sticky top-0 z-40">
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
                {status === 'loading' ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-surface-container animate-pulse"></div>
                    <div className="w-24 h-4 bg-surface-container rounded animate-pulse hidden sm:block"></div>
                  </>
                ) : (
                  <>
                    <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      {session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
                    </span>
                    <span className="text-sm font-semibold text-on-surface hidden sm:inline">
                      {session?.user?.name || session?.user?.email}
                    </span>
                  </>
                )}
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
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: 'easeOut' }}
        className="mx-auto max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] w-full px-6 lg:px-12 xl:px-20 py-12 xl:py-16 flex-1"
      >
        {/* AI Trip Planner Card */}
        <Link
          href="/dashboard/ai-planner"
          className="group block mb-10 xl:mb-14 bg-white border border-surface-container border-l-[4px] border-l-transparent rounded-2xl p-6 xl:p-8 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.12)] hover:border-l-primary transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-on-primary-container text-2xl">
                  travel_explore
                </span>
              </div>
              <div>
                <h2 className="text-lg xl:text-xl font-bold text-on-surface flex items-center gap-2">
                  AI Trip Planner
                  <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container text-label-sm font-semibold">
                    NEW
                  </span>
                </h2>
                <p className="text-body-md text-secondary mt-0.5">
                  Chat with Vyora AI to plan your perfect trip — get itineraries, budget estimates, and personalized recommendations.
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-2xl text-primary/40 group-hover:text-primary group-hover:translate-x-1 transition-all hidden sm:block">
              arrow_forward
            </span>
          </div>
        </Link>

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

          {/* Right Column: Trip List + AI Plans */}
          <div className="lg:col-span-2 space-y-12 xl:space-y-16">
            {/* Your Itineraries Section */}
            <div className="space-y-4">
              <div className="bg-white border border-surface-container rounded-2xl p-6 xl:p-8 shadow-sm">
                <h2 className="text-lg xl:text-xl font-bold text-on-surface border-b border-surface-container pb-4 mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">luggage</span>
                  Your Itineraries
                </h2>
                <TripList trips={trips} onTripUpdated={fetchTrips} />
              </div>
            </div>

            {/* AI Trip Plans Section */}
            <div className="space-y-4">
              <div className="bg-white border border-surface-container rounded-2xl p-6 xl:p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-surface-container pb-4 mb-6">
                  <h2 className="text-lg xl:text-xl font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                    AI Trip Plans
                  </h2>
                  <Link
                    href="/dashboard/ai-planner?new=true"
                    className="px-4 py-2 bg-surface-container text-on-surface rounded-lg font-semibold text-sm hover:bg-primary hover:text-white hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                    Create Plan
                  </Link>
                </div>
                <AITripPlanList plans={aiPlans} onPlanUpdated={fetchAll} />
              </div>
            </div>
          </div>
        </div>
      </motion.main>
      )}
    </div>
  );
}
