
import React, { useState } from 'react';
import { Habit } from '@/types';
import { formatDate, getDayOfWeek } from '@/utils/storage';
import { cn } from '@/lib/utils';
import HabitStreak from './HabitStreak';

interface HabitItemProps {
  habit: Habit;
  onToggleToday: (id: string) => void;
}

const HabitItem = ({ habit, onToggleToday }: HabitItemProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const today = new Date();
  const todayString = formatDate(today);
  const todayDay = getDayOfWeek(today);
  const isTodayActive = habit.activeDays.includes(todayDay);
  const isCompletedToday = habit.completedDates.includes(todayString);

  const handleToggle = () => {
    if (isTodayActive) {
      onToggleToday(habit.id);
    }
  };

  return (
    <div className="mb-4 bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center">
        <div 
          className={cn(
            "habit-bubble mr-3",
            isCompletedToday ? "bg-habito-mint" : "bg-habito-lavender"
          )}
          onClick={handleToggle}
        >
          <span>{habit.emoji}</span>
        </div>
        
        <div className="flex-1" onClick={() => setExpanded(!expanded)}>
          <div className="font-medium">{habit.name}</div>
          {isTodayActive && !isCompletedToday && (
            <div className="text-xs text-green-600 mt-1">¡Hoy toca!</div>
          )}
          {isCompletedToday && (
            <div className="text-xs text-green-600 mt-1">✅ ¡Completado hoy!</div>
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 animate-fade-in">
          <HabitStreak 
            completedDates={habit.completedDates} 
            className="mb-3"
          />
          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            <div className="font-medium mb-1">¿Por qué quiero este hábito?</div>
            <div>{habit.why}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitItem;
