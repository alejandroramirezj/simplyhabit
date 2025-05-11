
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import EmojiPicker from './EmojiPicker';
import WeekdayPicker from './WeekdayPicker';
import { Habit, DayOfWeek } from '@/types';
import { generateId } from '@/utils/storage';

interface AddHabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Habit) => void;
}

const AddHabitForm = ({ isOpen, onClose, onSave }: AddHabitFormProps) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('💪');
  const [why, setWhy] = useState('');
  const [days, setDays] = useState<DayOfWeek[]>([1, 2, 3, 4, 5]); // Mon-Fri by default
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    const newHabit: Habit = {
      id: generateId(),
      name: name.trim(),
      emoji,
      why: why.trim(),
      activeDays: days,
      completedDates: []
    };
    
    onSave(newHabit);
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setName('');
    setEmoji('💪');
    setWhy('');
    setDays([1, 2, 3, 4, 5]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo hábito</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <EmojiPicker onSelect={setEmoji} selectedEmoji={emoji} />
            
            <div className="flex-1">
              <Label htmlFor="name">Nombre del hábito</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="¿Qué hábito quieres desarrollar?"
                required
              />
            </div>
          </div>

          <div>
            <Label>¿Qué días quieres practicarlo?</Label>
            <WeekdayPicker selectedDays={days} onChange={setDays} />
          </div>

          <div>
            <Label htmlFor="why">¿Por qué quieres este hábito?</Label>
            <Textarea
              id="why"
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="Esta razón te motivará cuando lo necesites"
              className="resize-none"
              rows={3}
            />
            <div className="text-xs text-gray-500 mt-1">
              Este texto aparecerá como recordatorio cuando completes tu hábito
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

export default AddHabitForm;
