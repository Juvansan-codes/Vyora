import React from 'react';
import { motion } from 'framer-motion';

export default function DashboardSkeleton() {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] w-full px-6 lg:px-12 xl:px-20 py-12 xl:py-16 flex-1"
    >
      {/* AI Trip Planner Card Skeleton */}
      <div className="mb-10 xl:mb-14 bg-white border border-surface-container rounded-2xl p-6 xl:p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-surface-container animate-pulse"></div>
          <div className="space-y-2">
            <div className="w-48 h-6 bg-surface-container rounded animate-pulse"></div>
            <div className="w-96 max-w-full h-4 bg-surface-container-low rounded animate-pulse mt-1"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16 items-start">
        {/* Create Trip Form Column Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-surface-container rounded-2xl p-6 xl:p-8 shadow-sm space-y-6">
            <div className="w-40 h-6 bg-surface-container rounded animate-pulse border-b border-surface-container pb-4 mb-2"></div>
            <div className="space-y-4">
              <div className="w-full h-12 bg-surface-container-low rounded-lg animate-pulse"></div>
              <div className="w-full h-12 bg-surface-container-low rounded-lg animate-pulse"></div>
              <div className="w-full h-12 bg-surface-container rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Right Column: Trip List + AI Plans Skeletons */}
        <div className="lg:col-span-2 space-y-12 xl:space-y-16">
          
          {/* Your Itineraries Section Skeleton */}
          <div className="space-y-4">
            <div className="bg-white border border-surface-container rounded-2xl p-6 xl:p-8 shadow-sm">
              <div className="w-48 h-6 bg-surface-container rounded animate-pulse border-b border-surface-container pb-4 mb-6"></div>
              <div className="space-y-4 xl:space-y-6">
                {[1, 2].map((i) => (
                  <div key={`trip-${i}`} className="border border-surface-container rounded-xl p-6 xl:p-8 bg-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-3 w-full">
                      <div className="w-1/3 h-6 bg-surface-container rounded animate-pulse"></div>
                      <div className="w-1/4 h-4 bg-surface-container-low rounded animate-pulse"></div>
                    </div>
                    <div className="w-24 h-10 bg-surface-container rounded-lg animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Trip Plans Section Skeleton */}
          <div className="space-y-4">
            <div className="bg-white border border-surface-container rounded-2xl p-6 xl:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-surface-container pb-4 mb-6">
                <div className="w-40 h-6 bg-surface-container rounded animate-pulse"></div>
                <div className="w-28 h-10 bg-surface-container rounded-lg animate-pulse"></div>
              </div>
              <div className="space-y-4 xl:space-y-6">
                {[1, 2].map((i) => (
                  <div key={`ai-trip-${i}`} className="border border-surface-container rounded-xl p-6 xl:p-8 bg-white shadow-sm">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="space-y-2 w-full">
                        <div className="w-2/5 h-6 bg-surface-container rounded animate-pulse"></div>
                        <div className="w-1/3 h-4 bg-surface-container-low rounded animate-pulse"></div>
                      </div>
                      <div className="w-20 h-6 bg-surface-container rounded-full animate-pulse"></div>
                    </div>
                    <div className="w-full h-px bg-surface-container my-4"></div>
                    <div className="flex gap-4">
                      <div className="w-24 h-4 bg-surface-container-low rounded animate-pulse"></div>
                      <div className="w-32 h-4 bg-surface-container-low rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.main>
  );
}
