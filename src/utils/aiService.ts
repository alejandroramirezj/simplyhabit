
import { Task, Habit, AIRecommendation } from "@/types";
import { generateId, formatDate } from "./storage";

// Gemini API key
const API_KEY = "AIzaSyB0tOQ30Zc6VO6HqGuyHf1OkttraUGIpQ8";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

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

// Generate content with Gemini API
const generateWithGemini = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
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

    const data = await response.json();
    
    if (data.error) {
      console.error('Error from Gemini API:', data.error);
      return "Lo siento, no pude generar una recomendación en este momento.";
    }
    
    if (!data.candidates || !data.candidates[0]?.content?.parts || !data.candidates[0]?.content?.parts[0]?.text) {
      return "No se pudo obtener una respuesta válida.";
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "Error al conectar con la IA. Por favor, intenta más tarde.";
  }
};

// Generate task recommendation based on existing tasks
export const generateTaskRecommendation = async (tasks: Task[]): Promise<AIRecommendation> => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed);
  
  let prompt = `Eres un asistente minimalista y enfocado en productividad. Genera UN SOLO consejo breve y motivador (máximo 150 caracteres) relacionado con tareas pendientes.
  
  Información del usuario:
  - Tareas completadas recientes: ${completedTasks}
  - Tareas pendientes: ${pendingTasks.length}
  
  Ejemplos de tareas pendientes: ${pendingTasks.slice(0, 3).map(t => t.title).join(', ')}
  
  No menciones específicamente estas tareas, solo genera un consejo general sobre productividad.
  No uses emojis en tu respuesta.
  Responde directamente con el consejo, sin introducirlo.`;

  const message = await generateWithGemini(prompt);
  
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
  const today = new Date();
  const todayString = formatDate(today);
  const todayDay = today.getDay();
  
  const habitsForToday = habits.filter(h => h.activeDays.includes(todayDay));
  const completedToday = habitsForToday.filter(h => h.completedDates.includes(todayString)).length;
  const pendingToday = habitsForToday.length - completedToday;
  
  let prompt = `Eres un asistente minimalista y enfocado en hábitos. Genera UN SOLO consejo breve y motivador (máximo 150 caracteres) relacionado con hábitos.
  
  Información del usuario:
  - Hábitos programados para hoy: ${habitsForToday.length}
  - Hábitos completados hoy: ${completedToday}
  - Hábitos pendientes hoy: ${pendingToday}
  
  Ejemplos de hábitos: ${habits.slice(0, 3).map(h => h.name).join(', ')}
  
  No menciones específicamente estos hábitos, solo genera un consejo general sobre la formación de hábitos.
  No uses emojis en tu respuesta.
  Responde directamente con el consejo, sin introducirlo.`;

  const message = await generateWithGemini(prompt);
  
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
  let prompt = `Eres un asistente minimalista y motivador. Genera UNA SOLA frase motivadora breve (máximo 150 caracteres) que inspire a alguien a mantener sus buenos hábitos y completar sus tareas.
  
  La frase debe ser:
  - Concisa y directa
  - Positiva y alentadora
  - No debe mencionar específicamente tareas o hábitos
  - No debe incluir emojis
  
  Responde directamente con la frase motivadora, sin introducirla.`;

  const message = await generateWithGemini(prompt);
  
  return {
    id: generateId(),
    message,
    type: 'motivation',
    dismissed: false,
    createdAt: new Date().toISOString()
  };
};

