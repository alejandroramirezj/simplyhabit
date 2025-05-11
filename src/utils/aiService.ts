
import { Task, Habit, AIRecommendation } from "@/types";
import { generateId, formatDate } from "./storage";

// Local Storage Key for recommendations
const RECOMMENDATIONS_STORAGE_KEY = 'habitos-simple-ai-recommendations';

// Save and load recommendations
export const saveRecommendations = (recommendations: AIRecommendation[]): void => {
  localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(recommendations));
};

export const loadRecommendations = (): AIRecommendation[] => {
  const recommendationsJson = localStorage.getItem(RECOMMENDATIONS_STORAGE_KEY);
  return recommendationsJson ? JSON.parse(recommendationsJson) : [];
};

// Generate a simple recommendation without using the API
const generateSimpleRecommendation = (type: 'task' | 'habit' | 'motivation'): string => {
  const recommendations = {
    task: [
      "Divide las tareas grandes en pasos más pequeños para avanzar sin sentirte abrumado.",
      "La técnica de los 2 minutos: si lleva menos de 2 minutos, hazlo ahora mismo.",
      "Programa bloques de tiempo específicos para cada tarea importante.",
      "Empieza el día con la tarea más difícil para ganar impulso.",
      "Establece plazos claros para mantener el enfoque y evitar la procrastinación."
    ],
    habit: [
      "La consistencia es más importante que la perfección. Lo que importa es mantener el hábito.",
      "Asocia un nuevo hábito con uno que ya tengas para facilitar su incorporación.",
      "Celebra tus pequeños logros diarios para reforzar tus buenos hábitos.",
      "Un hábito toma aproximadamente 66 días en formarse. ¡Persiste!",
      "Empieza con versiones mínimas de tus hábitos para vencer la resistencia inicial."
    ],
    motivation: [
      "El camino hacia tus metas se construye paso a paso, cada día cuenta.",
      "No dejes que lo perfecto sea enemigo de lo bueno. Avanzar importa más que la perfección.",
      "Los pequeños hábitos tienen un impacto enorme cuando se mantienen en el tiempo.",
      "Confía en el proceso. Los resultados llegan cuando persistes más allá de las dificultades.",
      "Tu futuro se está creando con las decisiones que tomas hoy."
    ]
  };

  // Select a random recommendation based on type
  const typeRecommendations = recommendations[type];
  const randomIndex = Math.floor(Math.random() * typeRecommendations.length);
  return typeRecommendations[randomIndex];
};

// Generate task recommendation based on existing tasks
export const generateTaskRecommendation = async (tasks: Task[]): Promise<AIRecommendation> => {
  const message = generateSimpleRecommendation('task');
  
  return {
    id: generateId(),
    message,
    type: 'task',
    dismissed: false,
    createdAt: new Date().toISOString()
  };
};

// Generate habit recommendation based on habits
export const generateHabitRecommendation = async (habits: Habit[]): Promise<AIRecommendation> => {
  const message = generateSimpleRecommendation('habit');
  
  return {
    id: generateId(),
    message,
    type: 'habit',
    dismissed: false,
    createdAt: new Date().toISOString()
  };
};

// Generate motivational message
export const generateMotivationalMessage = async (): Promise<AIRecommendation> => {
  const message = generateSimpleRecommendation('motivation');
  
  return {
    id: generateId(),
    message,
    type: 'motivation',
    dismissed: false,
    createdAt: new Date().toISOString()
  };
};
