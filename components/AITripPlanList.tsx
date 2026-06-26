'use client';

import { AITripPlan } from '@/types/ai-trip-plan';
import AITripPlanCard from './AITripPlanCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import QuickPreviewModal from './QuickPreviewModal';
import { motion, useReducedMotion } from 'framer-motion';
import ConfirmModal from './ConfirmModal';

interface AITripPlanListProps {
  plans: AITripPlan[];
  onPlanUpdated: () => void;
}

export default function AITripPlanList({ plans, onPlanUpdated }: AITripPlanListProps) {
  const router = useRouter();
  const [previewPlanId, setPreviewPlanId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 }
    }
  };

  const handlePreview = (planId: string) => {
    setPreviewPlanId(planId);
  };

  const handleExport = (planId: string) => {
    window.open(`/dashboard/ai-planner/print/${encodeURIComponent(planId)}`, '_blank');
  };

  const handleContinue = (planId: string) => {
    router.push(`/dashboard/ai-planner?planId=${encodeURIComponent(planId)}`);
  };

  const confirmConvert = async () => {
    if (!convertingId) return;

    try {
      const res = await fetch(`/api/ai-trip-plans/${convertingId}/convert`, {
        method: 'POST',
      });

      if (res.ok) {
        // Optional: show a nice toast instead of alert
        // alert('Plan converted to itinerary successfully!');
        onPlanUpdated();
      } else {
        const error = await res.json();
        alert(`Failed to convert: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to convert plan:', error);
      alert('Failed to convert plan. Please try again.');
    } finally {
      setConvertingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    try {
      const res = await fetch(`/api/ai-trip-plans/${deletingId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onPlanUpdated();
      } else {
        alert('Failed to delete plan');
      }
    } catch (error) {
      console.error('Failed to delete plan:', error);
      alert('Failed to delete plan. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (plans.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-surface-container rounded-2xl text-secondary bg-surface-container-low/40">
        <span className="material-symbols-outlined text-4xl mb-2 block text-secondary/60">
          explore_off
        </span>
        <p className="font-semibold text-body-lg">No AI trip plans yet.</p>
        <p className="text-xs text-secondary/80 mt-1">
          Create your first AI-powered itinerary to get started.
        </p>
        <Link
          href="/dashboard/ai-planner?new=true"
          className="inline-block mt-4 px-6 py-2 bg-primary-container text-on-primary-container rounded-lg font-semibold text-sm hover:shadow-md transition-all cursor-pointer"
        >
          Create AI Plan
        </Link>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 xl:space-y-6"
      >
        {plans.map((plan) => (
          <AITripPlanCard
            key={plan._id}
            plan={plan}
            onPreview={() => handlePreview(plan._id)}
            onExport={() => handleExport(plan._id)}
            onContinue={() => handleContinue(plan._id)}
            onConvert={() => setConvertingId(plan._id)}
            onDelete={() => setDeletingId(plan._id)}
          />
        ))}
      </motion.div>

      {previewPlanId && (
        <QuickPreviewModal
          planId={previewPlanId}
          onClose={() => setPreviewPlanId(null)}
        />
      )}

      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        title="Delete AI Plan"
        message="Are you sure you want to delete this AI trip plan? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />

      <ConfirmModal
        isOpen={!!convertingId}
        onClose={() => setConvertingId(null)}
        onConfirm={confirmConvert}
        title="Convert AI Plan"
        message="Convert this AI generated plan into a real itinerary? It will be added to Your Itineraries."
        confirmText="Convert"
        isDestructive={false}
      />
    </>
  );
}
