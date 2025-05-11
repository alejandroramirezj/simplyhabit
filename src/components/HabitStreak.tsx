
import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface HabitStreakProps {
  completedDates: string[];
  className?: string;
}

const HabitStreak = ({ completedDates, className }: HabitStreakProps) => {
  const lastSixWeeks = useMemo(() => {
    const today = new Date();
    const result = [];
    
    // Get the last 6 weeks (42 days)
    for (let i = 41; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      result.push({
        date: dateString,
        completed: completedDates.includes(dateString)
      });
    }
    
    // Group by week (7 days per week)
    const weeks = [];
    for (let i = 0; i < 6; i++) {
      weeks.push(result.slice(i * 7, (i + 1) * 7));
    }
    
    return weeks;
  }, [completedDates]);
  
  return (
    <div className={cn("grid grid-cols-7 gap-1", className)}>
      {lastSixWeeks.flatMap((week, weekIndex) => 
        week.map((day, dayIndex) => (
          <div
            key={`${weekIndex}-${dayIndex}`}
            className={cn(
              "w-3 h-3 rounded-sm",
              day.completed ? "bg-green-500" : "bg-gray-100"
            )}
            title={day.date}
          />
        ))
      )}
    </div>
  );
};

export default HabitStreak;
