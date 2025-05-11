
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from 'lucide-react';
import { Task } from '@/types';
import { generateWeeklySchedule, loadSchedule, saveSchedule } from '@/utils/aiService';
import { useToast } from '@/hooks/use-toast';

interface AIWeeklyScheduleProps {
  tasks: Task[];
}

const AIWeeklySchedule = ({ tasks }: AIWeeklyScheduleProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [schedule, setSchedule] = useState(loadSchedule());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateSchedule = async () => {
    setIsLoading(true);
    try {
      const newSchedule = await generateWeeklySchedule(tasks);
      setSchedule(newSchedule);
      saveSchedule(newSchedule);
      
      toast({
        title: "Horario generado",
        description: "Se ha creado una sugerencia de horario semanal.",
      });
    } catch (error) {
      console.error("Error al generar horario:", error);
      
      toast({
        variant: "destructive",
        title: "No se pudo generar el horario",
        description: "Hubo un problema al crear la sugerencia. Inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const openDialog = () => {
    setIsDialogOpen(true);
    
    // Si no hay un horario guardado o hay nuevas tareas desde la última vez, genera uno nuevo
    const pendingTasks = tasks.filter(t => !t.completed).length;
    if (!schedule || pendingTasks > 0) {
      handleGenerateSchedule();
    }
  };

  return (
    <>
      <Button 
        onClick={openDialog}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Calendar size={18} />
        <span>Agendar con IA</span>
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sugerencia de horario semanal</DialogTitle>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="mt-2">
              {schedule && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">{schedule}</pre>
                </div>
              )}
              
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  onClick={handleGenerateSchedule}
                  variant="outline"
                >
                  Regenerar
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIWeeklySchedule;
