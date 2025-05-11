
import React, { useState, useEffect } from 'react';
import CalendarView from '@/components/CalendarView';
import TaskItem from '@/components/TaskItem';
import { Task } from '@/types';
import { loadTasks, saveTasks, formatDate } from '@/utils/storage';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const MiDiaTab = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load tasks from local storage
    const savedTasks = loadTasks();
    setTasks(savedTasks);
  }, []);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCompleteTask = (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    // Show toast only when completing (not when uncompleting)
    const completedTask = updatedTasks.find(task => task.id === id);
    if (completedTask?.completed) {
      toast({
        title: "¡Tarea completada!",
        description: "Bien hecho 🎉",
      });
    }
  };

  // Filter tasks for selected date
  const selectedDateStr = formatDate(selectedDate);
  const tasksForSelectedDate = tasks.filter(task => 
    !task.completed && (!task.dueDate || task.dueDate === selectedDateStr)
  );

  // Group tasks by morning, afternoon, evening
  const morningTasks = tasksForSelectedDate.filter(task => 
    task.dueTime && parseInt(task.dueTime.split(':')[0]) < 12
  );
  
  const afternoonTasks = tasksForSelectedDate.filter(task => 
    task.dueTime && parseInt(task.dueTime.split(':')[0]) >= 12 && parseInt(task.dueTime.split(':')[0]) < 18
  );
  
  const eveningTasks = tasksForSelectedDate.filter(task => 
    task.dueTime && parseInt(task.dueTime.split(':')[0]) >= 18
  );
  
  const unscheduledTasks = tasksForSelectedDate.filter(task => !task.dueTime);

  // Get task dates for calendar highlights
  const taskDates = [...new Set(tasks.map(task => task.dueDate).filter(Boolean))];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Mi día 📆</h1>
      
      <CalendarView 
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        habitDates={taskDates}
      />
      
      <div className="space-y-6">
        {/* Morning section */}
        <div className={cn("card-container", morningTasks.length === 0 && "opacity-50")}>
          <h2 className="text-sm uppercase font-semibold text-gray-500 mb-3">Mañana ☀️</h2>
          {morningTasks.length > 0 ? (
            morningTasks.map(task => (
              <TaskItem key={task.id} task={task} onComplete={handleCompleteTask} />
            ))
          ) : (
            <div className="text-center py-3 text-sm text-gray-400">No hay tareas para la mañana</div>
          )}
        </div>
        
        {/* Afternoon section */}
        <div className={cn("card-container", afternoonTasks.length === 0 && "opacity-50")}>
          <h2 className="text-sm uppercase font-semibold text-gray-500 mb-3">Tarde 🌤️</h2>
          {afternoonTasks.length > 0 ? (
            afternoonTasks.map(task => (
              <TaskItem key={task.id} task={task} onComplete={handleCompleteTask} />
            ))
          ) : (
            <div className="text-center py-3 text-sm text-gray-400">No hay tareas para la tarde</div>
          )}
        </div>
        
        {/* Evening section */}
        <div className={cn("card-container", eveningTasks.length === 0 && "opacity-50")}>
          <h2 className="text-sm uppercase font-semibold text-gray-500 mb-3">Noche 🌙</h2>
          {eveningTasks.length > 0 ? (
            eveningTasks.map(task => (
              <TaskItem key={task.id} task={task} onComplete={handleCompleteTask} />
            ))
          ) : (
            <div className="text-center py-3 text-sm text-gray-400">No hay tareas para la noche</div>
          )}
        </div>
        
        {/* Unscheduled tasks */}
        {unscheduledTasks.length > 0 && (
          <div className="card-container">
            <h2 className="text-sm uppercase font-semibold text-gray-500 mb-3">Sin programar ⏰</h2>
            {unscheduledTasks.map(task => (
              <TaskItem key={task.id} task={task} onComplete={handleCompleteTask} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MiDiaTab;
