
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import EmojiPicker from './EmojiPicker';
import { Task } from '@/types';
import { generateId } from '@/utils/storage';

interface AddTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const AddTaskForm = ({ isOpen, onClose, onSave }: AddTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('📝');
  const [why, setWhy] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      emoji,
      completed: false,
      why: why.trim(),
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined
    };
    
    onSave(newTask);
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setTitle('');
    setEmoji('📝');
    setWhy('');
    setDueDate('');
    setDueTime('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva tarea</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <EmojiPicker onSelect={setEmoji} selectedEmoji={emoji} />
            
            <div className="flex-1">
              <Label htmlFor="title">Tarea</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="¿Qué necesitas hacer?"
                className="mb-2"
                required
              />

              <div className="text-xs text-gray-500">
                {title.length > 0 && <p>Consejo: Si tarda menos de 2 min, ¡hazlo ahora!</p>}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="why">¿Por qué?</Label>
            <Textarea
              id="why"
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="¿Por qué es importante para ti?"
              className="resize-none"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate">Fecha (opcional)</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dueTime">Hora (opcional)</Label>
              <Input
                id="dueTime"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskForm;
