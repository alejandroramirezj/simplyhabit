
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tab } from '@/types';
import TareasTab from './TareasTab';
import MiDiaTab from './MiDiaTab';
import HabitosTab from './HabitosTab';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('tareas');

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'tareas', label: 'Tareas', emoji: '📝' },
    { id: 'midia', label: 'Mi día', emoji: '📆' },
    { id: 'habitos', label: 'Hábitos', emoji: '💪' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tareas':
        return <TareasTab />;
      case 'midia':
        return <MiDiaTab />;
      case 'habitos':
        return <HabitosTab />;
      default:
        return <TareasTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Tab content */}
        <div className="flex-1">{renderTabContent()}</div>
        
        {/* Bottom tab navigation */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200">
          <div className="flex justify-around relative">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center py-3 px-5 flex-1",
                  activeTab === tab.id && "text-green-600"
                )}
              >
                <div className="text-xl mb-1">{tab.emoji}</div>
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
            
            {/* Animated tab indicator */}
            <div
              className="tab-indicator"
              style={{
                left: `${(tabs.findIndex((t) => t.id === activeTab) * 100) / 3}%`,
                width: '33.333%',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
