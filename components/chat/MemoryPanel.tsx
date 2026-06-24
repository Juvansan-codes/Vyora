'use client';

import type { TripMemory } from '@/types/chat';

interface MemoryPanelProps {
  memory: TripMemory;
  onClear: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const MEMORY_FIELDS: {
  key: keyof TripMemory;
  label: string;
  icon: string;
  format?: (value: unknown) => string;
}[] = [
  { key: 'destination', label: 'Destination', icon: 'location_on' },
  { key: 'startDate', label: 'Start Date', icon: 'calendar_today' },
  { key: 'endDate', label: 'End Date', icon: 'event' },
  {
    key: 'duration',
    label: 'Duration',
    icon: 'schedule',
    format: (v) => `${v} days`,
  },
  {
    key: 'budget',
    label: 'Budget',
    icon: 'payments',
    format: (v) => `${v}`,
  },
  { key: 'currency', label: 'Currency', icon: 'currency_exchange' },
  {
    key: 'travelers',
    label: 'Travelers',
    icon: 'group',
    format: (v) => `${v} ${Number(v) === 1 ? 'person' : 'people'}`,
  },
  { key: 'travelStyle', label: 'Style', icon: 'style' },
  { key: 'transportation', label: 'Transport', icon: 'directions_transit' },
  { key: 'accommodation', label: 'Stay', icon: 'hotel' },
];

export default function MemoryPanel({
  memory,
  onClear,
  isOpen,
  onToggle,
}: MemoryPanelProps) {
  const hasMemory = Object.entries(memory).some(([, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== '';
  });

  const activeFields = MEMORY_FIELDS.filter((field) => {
    const value = memory[field.key];
    return value !== undefined && value !== null && value !== '';
  });

  return (
    <>
      {/* Toggle button (always visible) */}
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-label-md font-medium transition-all cursor-pointer ${
          hasMemory
            ? 'bg-primary-container/20 text-primary hover:bg-primary-container/30'
            : 'bg-surface-container text-secondary hover:bg-surface-container-high'
        }`}
      >
        <span className="material-symbols-outlined text-base">
          {hasMemory ? 'memory' : 'memory'}
        </span>
        Trip Context
        {hasMemory && (
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        )}
      </button>

      {/* Panel overlay on mobile, sidebar on desktop */}
      {isOpen && (
        <>
          {/* Mobile overlay backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={onToggle}
          />

          {/* Panel */}
          <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-surface-container z-50 shadow-xl lg:shadow-none lg:static lg:z-auto lg:h-auto lg:border lg:rounded-2xl overflow-hidden flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-container bg-surface-container-low">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">
                  neurology
                </span>
                <h3 className="text-label-md font-bold text-on-surface uppercase tracking-wider">
                  Trip Memory
                </h3>
              </div>
              <button
                onClick={onToggle}
                className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer lg:hidden"
              >
                <span className="material-symbols-outlined text-base text-secondary">
                  close
                </span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {!hasMemory ? (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-4xl text-secondary/30 mb-2 block">
                    psychology
                  </span>
                  <p className="text-body-md text-secondary/50">
                    No trip details yet.
                  </p>
                  <p className="text-label-sm text-secondary/40 mt-1">
                    Start chatting to build your trip context automatically.
                  </p>
                </div>
              ) : (
                <>
                  {activeFields.map((field) => {
                    const value = memory[field.key];
                    const displayValue = field.format
                      ? field.format(value)
                      : String(value);

                    return (
                      <div
                        key={field.key}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface-container-low"
                      >
                        <span className="material-symbols-outlined text-base text-primary/70">
                          {field.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-label-sm text-secondary/60 uppercase tracking-wider">
                            {field.label}
                          </p>
                          <p className="text-body-md text-on-surface font-medium truncate">
                            {displayValue}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Interests */}
                  {memory.interests && memory.interests.length > 0 && (
                    <div className="px-3 py-2.5 rounded-lg bg-surface-container-low">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-base text-primary/70">
                          interests
                        </span>
                        <p className="text-label-sm text-secondary/60 uppercase tracking-wider">
                          Interests
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {memory.interests.map((interest) => (
                          <span
                            key={interest}
                            className="px-2 py-0.5 rounded-md bg-primary-container/20 text-primary text-label-sm font-medium"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Clear button */}
            {hasMemory && (
              <div className="px-4 py-3 border-t border-surface-container">
                <button
                  onClick={onClear}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-error/20 text-error text-label-md font-medium hover:bg-error/5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    delete_sweep
                  </span>
                  Clear Trip Context
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
