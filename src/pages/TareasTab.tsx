
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskItem from '@/components/TaskItem';
import AddTaskForm from '@/components/AddTaskForm';
import { Task } from '@/types';
import { loadTasks, saveTasks } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

const TareasTab = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load tasks from local storage
    const savedTasks = loadTasks();
    setTasks(savedTasks);
  }, []);

  const handleAddTask = (task: Task) => {
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    toast({
      title: "Tarea añadida",
      description: "Se ha añadido la tarea correctamente.",
    });
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

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tareas 📝</h1>
        <Button 
          onClick={() => setIsAddTaskOpen(true)}
          className="rounded-full h-10 w-10 p-0"
          aria-label="Añadir tarea"
        >
          <PlusCircle size={20} />
        </Button>
      </div>

      {pendingTasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-2">No tienes tareas pendientes</p>
          <p className="text-sm">Añade una tarea con el botón +</p>
        </div>
      )}

      <div className="mb-6">
        {pendingTasks.map((task) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onComplete={handleCompleteTask}
          />
        ))}
      </div>

      {completedTasks.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-gray-500 mb-4">Completadas</h2>
          <div>
            {completedTasks.slice(0, 3).map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onComplete={handleCompleteTask}
              />
            ))}
            
            {completedTasks.length > 3 && (
              <div className="text-center text-sm text-gray-500 mt-2">
                {completedTasks.length - 3} tareas más completadas
              </div>
            )}
          </div>
        </>
      )}

      <AddTaskForm 
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSave={handleAddTask}
      />
    </div>
  );
};

export default TareasTab;
