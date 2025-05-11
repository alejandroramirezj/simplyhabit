
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DayOfWeek } from '@/types';

interface WeekdayPickerProps {
  selectedDays: DayOfWeek[];
  onChange: (days: DayOfWeek[]) => void;
}

const WeekdayPicker = ({ selectedDays, onChange }: WeekdayPickerProps) => {
  const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  // Map to JavaScript day numbers (0 = Sunday, 1 = Monday, ...) to match our DayOfWeek type
  const dayNumbers: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0];

  const toggleDay = (dayNumber: DayOfWeek) => {
    if (selectedDays.includes(dayNumber)) {
      onChange(selectedDays.filter(d => d !== dayNumber));
    } else {
      onChange([...selectedDays, dayNumber]);
    }
  };

  return (
    <div className="flex justify-between my-4">
      {dayLabels.map((label, index) => {
        const dayNumber = dayNumbers[index];
        const isSelected = selectedDays.includes(dayNumber);
        
        return (
          <Button
            key={label}
            type="button"
            variant="outline"
            onClick={() => toggleDay(dayNumber)}
            className={cn(
              "w-9 h-9 p-0 rounded-full",
              isSelected ? "bg-habito-mint border-habito-mint text-green-800" : "bg-transparent"
            )}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
};

export default WeekdayPicker;
