
import { Habit, Task } from "@/types";

// Local Storage Keys
const TASKS_STORAGE_KEY = 'habitos-simple-tasks';
const HABITS_STORAGE_KEY = 'habitos-simple-habits';

// Tasks functions
export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

export const loadTasks = (): Task[] => {
  const tasksJson = localStorage.getItem(TASKS_STORAGE_KEY);
  return tasksJson ? JSON.parse(tasksJson) : [];
};

// Habits functions
export const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
};

export const loadHabits = (): Habit[] => {
  const habitsJson = localStorage.getItem(HABITS_STORAGE_KEY);
  return habitsJson ? JSON.parse(habitsJson) : [];
};

// Generate IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Format date functions
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const getDayOfWeek = (date: Date): number => {
  return date.getDay();
};
