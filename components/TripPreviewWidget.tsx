'use client';

import { useState } from 'react';

interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  description: string;
  type: string;
  status?: string;
  icon: string;
}

interface ItineraryDay {
  dayName: string;
  title: string;
  dateStr: string;
  items: ItineraryItem[];
}

const mockItineraries: Record<number, ItineraryDay> = {
  1: {
    dayName: 'Day 1: Arrival',
    title: 'Paris Arrival & Pigalle',
    dateStr: 'October 14, 2024',
    items: [
      {
        id: 'day1-1',
        time: '2:00 PM',
        title: 'Check-in at Hotel Amour',
        description: '8 Rue de Navarin, 75009 Paris. A legendary spot in South Pigalle with a beautiful greenhouse restaurant.',
        type: 'STAY',
        status: 'CONFIRMED',
        icon: 'hotel',
      },
      {
        id: 'day1-2',
        time: '4:30 PM',
        title: 'Coffee at Boot Café',
        description: 'The smallest café in Paris. Great for a quick espresso and people watching in Le Marais.',
        type: 'COFFEE',
        icon: 'local_cafe',
      },
    ],
  },
  2: {
    dayName: 'Day 2: Exploration',
    title: 'Historic Heart & Marais Fallafel',
    dateStr: 'October 15, 2024',
    items: [
      {
        id: 'day2-1',
        time: '10:00 AM',
        title: 'Louvre Museum Guided Tour',
        description: 'Skip-the-line access to view the Mona Lisa, Winged Victory, and iconic historic masterpieces.',
        type: 'EXPLORE',
        status: 'BOOKED',
        icon: 'explore',
      },
      {
        id: 'day2-2',
        time: '1:00 PM',
        title: 'Lunch at L\'As du Fallafel',
        description: 'Famous, bustling counter-serve spot for outstanding falafel wraps in the middle of Marais.',
        type: 'FOOD',
        status: 'CONFIRMED',
        icon: 'restaurant',
      },
      {
        id: 'day2-3',
        time: '3:30 PM',
        title: 'Jardin des Tuileries Stroll',
        description: 'Walk through the historical royal garden situated between the Louvre and the Place de la Concorde.',
        type: 'RELAX',
        icon: 'filter_hdr',
      },
    ],
  },
  3: {
    dayName: 'Day 3: Marais Gems',
    title: 'Pastries & Boutique Shopping',
    dateStr: 'October 16, 2024',
    items: [
      {
        id: 'day3-1',
        time: '9:30 AM',
        title: 'Pastries at Du Pain et des Idées',
        description: 'World-renowned traditional bakery famous for its escargot pastries and fresh apple turnovers.',
        type: 'FOOD',
        icon: 'bakery_dining',
      },
      {
        id: 'day3-2',
        time: '11:30 AM',
        title: 'Boutique Hunt at Merci Concept Store',
        description: 'Trendsetting industrial-design shop featuring high fashion, retro accessories, and a cozy library cafe.',
        type: 'SHOPPING',
        status: 'CONFIRMED',
        icon: 'shopping_bag',
      },
      {
        id: 'day3-3',
        time: '6:00 PM',
        title: 'Seine River Cruise at Sunset',
        description: 'Panoramic glass-deck cruise starting near the Eiffel Tower, showcasing Paris landmarks in the golden hour.',
        type: 'SCENIC',
        status: 'BOOKED',
        icon: 'directions_boat',
      },
    ],
  },
};

export default function TripPreviewWidget() {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const currentItinerary = mockItineraries[selectedDay];

  return (
    <div className="lg:w-2/3 xl:w-3/4 w-full bg-white border border-surface-container rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px] xl:min-h-[550px]">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 xl:w-72 bg-surface-container-low border-r border-surface-container p-6 xl:p-8 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary text-2xl" data-icon="location_on">
              location_on
            </span>
            <span className="font-headline-md font-semibold text-on-surface">Paris, France</span>
          </div>
          
          <div className="flex flex-col gap-2">
            {Object.entries(mockItineraries).map(([dayKey, data]) => {
              const dayNum = Number(dayKey);
              const isActive = selectedDay === dayNum;
              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDay(dayNum)}
                  className={`w-full text-left px-4 py-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white border-surface-container font-label-md text-on-surface shadow-sm font-semibold'
                      : 'border-transparent font-label-md text-secondary hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  {data.dayName}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-surface-container">
          <div className="flex items-center gap-2 text-secondary">
            <span className="material-symbols-outlined text-md" data-icon="groups">
              groups
            </span>
            <span className="text-[11px] font-bold tracking-wider">4 CONTRIBUTORS</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Day Header */}
        <div className="px-8 xl:px-12 py-6 border-b border-surface-container flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-primary tracking-widest uppercase mb-1">
              {currentItinerary.dateStr}
            </p>
            <h3 className="font-headline-md text-on-surface font-semibold text-xl">
              {currentItinerary.title}
            </h3>
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-secondary" data-icon="more_horiz">
              more_horiz
            </span>
          </button>
        </div>

        {/* Itinerary Events */}
        <div className="p-8 xl:p-12 space-y-12 flex-1 overflow-y-auto max-h-[450px] xl:max-h-[500px]">
          {currentItinerary.items.map((item, index) => {
            const isLast = index === currentItinerary.items.length - 1;
            return (
              <div key={item.id} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    item.type === 'STAY' 
                      ? 'bg-primary-container text-on-primary-container' 
                      : 'bg-surface-container text-secondary group-hover:bg-surface-container-high'
                  }`}>
                    <span className="material-symbols-outlined text-lg">
                      {item.icon}
                    </span>
                  </div>
                  {!isLast && (
                    <div className="w-[1px] flex-1 bg-surface-container mt-2 min-h-[40px]"></div>
                  )}
                </div>
                
                <div className={`flex-1 ${!isLast ? 'pb-12 border-b border-surface-container-low' : ''}`}>
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className="font-headline-md text-on-surface font-semibold text-base transition-colors group-hover:text-primary">
                      {item.title}
                    </h4>
                    <span className="text-xs text-secondary font-mono tracking-tight shrink-0 mt-0.5">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-body-md text-secondary leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                      {item.type}
                    </span>
                    {item.status && (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'CONFIRMED'
                          ? 'bg-green-50 text-green-700 border border-green-100'
                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
