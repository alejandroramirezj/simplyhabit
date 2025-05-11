
import { Task, Habit, AIRecommendation } from "@/types";
import { generateId, formatDate } from "./storage";

// API Constants
const GEMINI_API_KEY = "AIzaSyB0tOQ30Zc6VO6HqGuyHf1OkttraUGIpQ8";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

// Local Storage Key for recommendations
const RECOMMENDATIONS_STORAGE_KEY = 'habitos-simple-ai-recommendations';
const SCHEDULE_STORAGE_KEY = 'habitos-simple-ai-schedule';

// Save and load recommendations
export const saveRecommendations = (recommendations: AIRecommendation[]): void => {
  localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(recommendations));
};

export const loadRecommendations = (): AIRecommendation[] => {
  const recommendationsJson = localStorage.getItem(RECOMMENDATIONS_STORAGE_KEY);
  return recommendationsJson ? JSON.parse(recommendationsJson) : [];
};

// Save and load AI schedule
export const saveSchedule = (schedule: string): void => {
  localStorage.setItem(SCHEDULE_STORAGE_KEY, schedule);
};

export const loadSchedule = (): string => {
  return localStorage.getItem(SCHEDULE_STORAGE_KEY) || '';
};

// Call Gemini API
const callGeminiAPI = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('Error en la respuesta de Gemini API:', await response.text());
      return generateFallbackResponse('error');
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0]?.content?.parts?.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error('Formato de respuesta inesperado:', data);
      return generateFallbackResponse('format');
    }
  } catch (error) {
    console.error('Error al llamar a Gemini API:', error);
    return generateFallbackResponse('network');
  }
};

// Generate a fallback response if the API fails
const generateFallbackResponse = (errorType: 'error' | 'format' | 'network'): string => {
  const fallbackResponses = {
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
    ],
    schedule: [
      "Lunes: Tareas de planificación y organización.\nMartes: Tareas que requieren concentración.\nMiércoles: Reuniones y colaboraciones.\nJueves: Tareas pendientes y seguimiento.\nViernes: Completar tareas semanales y evaluar progreso.",
      "Programa las tareas más difíciles en la mañana cuando tienes más energía. Deja las tareas administrativas para la tarde.",
      "Agrupa tareas similares en el mismo bloque horario para evitar el cambio constante de contexto."
    ]
  };
  
  // Select a random fallback response for scheduling
  const scheduleResponses = fallbackResponses.schedule;
  const randomIndex = Math.floor(Math.random() * scheduleResponses.length);
  return scheduleResponses[randomIndex];
};

// Generate task recommendation based on existing tasks
export const generateTaskRecommendation = async (tasks: Task[]): Promise<AIRecommendation> => {
  try {
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.filter(t => !t.completed).length;
    
    const prompt = `Eres un asistente minimalista y enfocado en productividad. Genera UN SOLO consejo breve y motivador (máximo 150 caracteres) relacionado con tareas pendientes.
    
    Información del usuario:
    - Tareas completadas recientes: ${completedTasks}
    - Tareas pendientes: ${pendingTasks}
    
    Ejemplos de tareas pendientes: ${tasks.filter(t => !t.completed).map(t => t.title).join(", ")}
    
    No menciones específicamente estas tareas, solo genera un consejo general sobre productividad.
    No uses emojis en tu respuesta.
    Responde directamente con el consejo, sin introducirlo.`;
    
    const message = await callGeminiAPI(prompt);
    
    return {
      id: generateId(),
      message: message || generateFallbackResponse('task'),
      type: 'task',
      dismissed: false,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error generando recomendación de tarea:", error);
    
    return {
      id: generateId(),
      message: generateSimpleRecommendation('task'),
      type: 'task',
      dismissed: false,
      createdAt: new Date().toISOString()
    };
  }
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

// Generate a schedule for tasks using Gemini API
export const generateWeeklySchedule = async (tasks: Task[]): Promise<string> => {
  try {
    const pendingTasks = tasks.filter(t => !t.completed);
    
    if (pendingTasks.length === 0) {
      return "No hay tareas pendientes para programar.";
    }
    
    const prompt = `Eres un asistente de planificación semanal. Ayúdame a organizar las siguientes tareas pendientes en una semana laboral (lunes a viernes). Considera qué días y momentos serían más adecuados para cada tarea. Sugiere un plan simple y claro.

    Tareas pendientes:
    ${pendingTasks.map(task => `- ${task.title} ${task.dueDate ? `(fecha límite: ${task.dueDate})` : ''}`).join('\n')}

    Responde con un plan estructurado por días de la semana, en formato simple. Por ejemplo:
    "Lunes: [tareas]
    Martes: [tareas]" etc.
    
    No incluyas introducciones ni conclusiones, solo el plan directo.`;
    
    const response = await callGeminiAPI(prompt);
    return response || generateFallbackResponse('schedule');
  } catch (error) {
    console.error("Error generando horario semanal:", error);
    return generateFallbackResponse('schedule');
  }
};
