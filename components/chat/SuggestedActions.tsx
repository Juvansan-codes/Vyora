'use client';

import type { TripMemory } from '@/types/chat';

interface SuggestedActionsProps {
  memory: TripMemory;
  onAction: (prompt: string) => void;
  visible: boolean;
}

interface ActionChip {
  label: string;
  prompt: string;
  icon: string;
}

export default function SuggestedActions({
  memory,
  onAction,
  visible,
}: SuggestedActionsProps) {
  if (!visible) return null;

  const destination = memory.destination;

  const actions: ActionChip[] = destination
    ? [
        {
          label: 'Generate itinerary',
          prompt: `Generate a detailed day-by-day itinerary for my trip to ${destination}.`,
          icon: 'route',
        },
        {
          label: 'Estimate budget',
          prompt: `Give me a detailed budget breakdown for my trip to ${destination}.`,
          icon: 'payments',
        },
        {
          label: `Best hotels in ${destination}`,
          prompt: `What are the best hotels and accommodation options in ${destination}?`,
          icon: 'hotel',
        },
        {
          label: `Things to do`,
          prompt: `What are the top things to do and must-see attractions in ${destination}?`,
          icon: 'attractions',
        },
        {
          label: 'Packing checklist',
          prompt: `Create a packing checklist for my trip to ${destination}.`,
          icon: 'checklist',
        },
        {
          label: 'Food & dining',
          prompt: `What are the best local foods and restaurants to try in ${destination}?`,
          icon: 'restaurant',
        },
        {
          label: 'Transportation',
          prompt: `What are the best transportation options for getting around in ${destination}?`,
          icon: 'directions_transit',
        },
      ]
    : [
        {
          label: 'Plan a trip',
          prompt: 'I want to plan a new trip. Can you help me get started?',
          icon: 'flight_takeoff',
        },
        {
          label: 'Destination ideas',
          prompt:
            'Can you suggest some great travel destinations based on different budgets and interests?',
          icon: 'explore',
        },
        {
          label: 'Weekend getaway',
          prompt: 'Suggest a weekend getaway destination that is easy to travel to.',
          icon: 'weekend',
        },
        {
          label: 'Budget trip ideas',
          prompt: 'What are some great destinations for a budget-friendly trip?',
          icon: 'savings',
        },
        {
          label: 'Adventure travel',
          prompt: 'Suggest some exciting adventure travel destinations with outdoor activities.',
          icon: 'hiking',
        },
      ];

  return (
    <div className="px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <p className="text-label-sm text-secondary/60 mb-2 font-medium uppercase tracking-wider">
          Suggestions
        </p>
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => onAction(action.prompt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-container-high bg-white text-body-md text-secondary hover:text-primary hover:border-primary/30 hover:bg-primary-container/10 transition-all active:scale-[0.97] cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">
                {action.icon}
              </span>
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
