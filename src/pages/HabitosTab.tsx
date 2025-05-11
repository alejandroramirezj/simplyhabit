
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HabitItem from '@/components/HabitItem';
import AddHabitForm from '@/components/AddHabitForm';
import { Habit } from '@/types';
import { loadHabits, saveHabits, formatDate } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

const HabitosTab = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load habits from local storage
    const savedHabits = loadHabits();
    setHabits(savedHabits);
  }, []);

  const handleAddHabit = (habit: Habit) => {
    const updatedHabits = [...habits, habit];
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
    
    toast({
      title: "Hábito añadido",
      description: "Has añadido un nuevo hábito correctamente.",
    });
  };

  const handleToggleHabitToday = (id: string) => {
    const today = formatDate(new Date());
    
    const updatedHabits = habits.map(habit => {
      if (habit.id === id) {
        const isCompleted = habit.completedDates.includes(today);
        const completedDates = isCompleted
          ? habit.completedDates.filter(date => date !== today)
          : [...habit.completedDates, today];
        
        return {
          ...habit,
          completedDates
        };
      }
      return habit;
    });
    
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
    
    // Get the habit that was toggled
    const habit = updatedHabits.find(h => h.id === id);
    const isCompleted = habit?.completedDates.includes(today);
    
    if (isCompleted) {
      toast({
        title: `¡${habit?.emoji} ${habit?.name} completado!`,
        description: habit?.why || "¡Buen trabajo!",
      });
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hábitos 💪</h1>
        <Button 
          onClick={() => setIsAddHabitOpen(true)}
          className="rounded-full h-10 w-10 p-0"
          aria-label="Añadir hábito"
        >
          <PlusCircle size={20} />
        </Button>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-2">No tienes hábitos configurados</p>
          <p className="text-sm">Añade un hábito con el botón +</p>
        </div>
      ) : (
        <div>
          {habits.map((habit) => (
            <HabitItem 
              key={habit.id} 
              habit={habit} 
              onToggleToday={handleToggleHabitToday}
            />
          ))}
        </div>
      )}

      <AddHabitForm 
        isOpen={isAddHabitOpen}
        onClose={() => setIsAddHabitOpen(false)}
        onSave={handleAddHabit}
      />
    </div>
  );
};

export default HabitosTab;
