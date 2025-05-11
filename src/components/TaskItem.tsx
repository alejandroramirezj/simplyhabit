
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Task } from '@/types';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
}

const TaskItem = ({ task, onComplete }: TaskItemProps) => {
  const [swiped, setSwiped] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    // Only allow left swipe (negative diff)
    if (diff < 0) {
      setOffsetX(Math.max(diff, -100));
    }
    
    if (diff < -70) {
      setSwiped(true);
    } else {
      setSwiped(false);
    }
  };

  const handleTouchEnd = () => {
    if (swiped) {
      setIsCompleting(true);
      // Trigger the completion animation
      setTimeout(() => {
        onComplete(task.id);
      }, 300);
    } else {
      // Reset position
      setOffsetX(0);
    }
  };

  return (
    <div
      className={cn(
        "task-item relative",
        isCompleting && "animate-complete-task"
      )}
      style={{ transform: `translateX(${offsetX}px)` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mr-4 text-xl">{task.emoji}</div>
      <div className="flex-1">
        <div className={cn("font-medium", task.completed && "line-through text-gray-400")}>
          {task.title}
        </div>
        {task.why && (
          <div className="text-sm text-gray-500 mt-1">{task.why}</div>
        )}
      </div>
      {task.dueTime && (
        <div className="ml-2 text-sm text-gray-500">{task.dueTime}</div>
      )}
      
      {/* Completion indicator shown when swiped */}
      <div 
        className={cn(
          "absolute right-0 top-0 bottom-0 flex items-center justify-center bg-green-100 rounded-r-2xl transition-all",
          swiped ? "w-20" : "w-0"
        )}
      >
        <Check className={cn("text-green-500", swiped ? "opacity-100" : "opacity-0")} />
      </div>
    </div>
  );
};

export default TaskItem;
