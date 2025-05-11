
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarDay } from "@/types";

interface CalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  habitDates?: string[];
}

const CalendarView = ({ selectedDate, onSelectDate, habitDates = [] }: CalendarViewProps) => {
  const [viewType, setViewType] = useState<"day" | "week">("day");

  const generateCalendarDays = (): CalendarDay[] => {
    const today = new Date();
    const days: CalendarDay[] = [];
    
    // Display current week (7 days) starting from today - 3 days
    const startDate = new Date(selectedDate);
    startDate.setDate(startDate.getDate() - 3);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      
      days.push({
        date,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: date.toDateString() === selectedDate.toDateString(),
        hasHabits: habitDates?.includes(dateString) || false,
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const dayNames = ["D", "L", "M", "X", "J", "V", "S"];

  const toggleViewType = () => {
    setViewType(viewType === "day" ? "week" : "day");
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">
          {viewType === "day" ? "Hoy" : "Esta semana"}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleViewType}
          className="text-xs h-8"
        >
          Ver {viewType === "day" ? "semana" : "día"}
        </Button>
      </div>

      {/* Calendar days row */}
      <div className="flex justify-between mb-2">
        {calendarDays.map((day, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="text-xs text-gray-500 mb-1">
              {dayNames[day.date.getDay()]}
            </div>
            <button
              className={cn(
                "calendar-day",
                day.isToday && "border border-habito-softblue",
                day.isSelected && "selected",
                day.hasHabits && !day.isSelected && "bg-gray-100"
              )}
              onClick={() => onSelectDate(day.date)}
            >
              {day.date.getDate()}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
