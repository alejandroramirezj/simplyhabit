
export interface Task {
  id: string;
  title: string;
  emoji: string;
  completed: boolean;
  why: string;
  dueDate?: string;
  dueTime?: string;
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  activeDays: number[]; // 0-6 for days of week
  why: string;
  completedDates: string[]; // ISO date strings
}

export type Tab = 'tareas' | 'midia' | 'habitos';

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CalendarDay {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  hasHabits: boolean;
}
