import React, { useState, useEffect } from 'react';
import { AIRecommendation as AIRecommendationType, Task, Habit } from '@/types';
import { loadRecommendations, saveRecommendations, generateTaskRecommendation, generateHabitRecommendation, generateMotivationalMessage } from '@/utils/aiService';
import AIRecommendation from './AIRecommendation';

interface AIRecommendationsProps {
  tasks: Task[];
  habits: Habit[];
}

const AIRecommendations = ({ tasks, habits }: AIRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<AIRecommendationType[]>([]);
  const [loading, setLoading] = useState(false);

  // Load recommendations on mount
  useEffect(() => {
    const savedRecommendations = loadRecommendations();
    
    // Filter out dismissed recommendations
    const activeRecommendations = savedRecommendations.filter(r => !r.dismissed);
    
    setRecommendations(activeRecommendations);
    
    // If no active recommendations, generate new ones
    if (activeRecommendations.length === 0) {
      generateRecommendations();
    }
  }, []);

  // Generate new recommendations
  const generateRecommendations = async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      // Randomly choose which type of recommendation to generate
      const randomType = Math.floor(Math.random() * 3);
      
      let newRecommendation;
      
      switch (randomType) {
        case 0:
          newRecommendation = await generateTaskRecommendation(tasks);
          break;
        case 1:
          newRecommendation = await generateHabitRecommendation(habits);
          break;
        default:
          newRecommendation = await generateMotivationalMessage();
      }
      
      const updatedRecommendations = [...recommendations, newRecommendation];
      
      // Keep only the 3 most recent recommendations
      const limitedRecommendations = updatedRecommendations.slice(-3);
      
      setRecommendations(limitedRecommendations);
      saveRecommendations(limitedRecommendations);
      
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Dismiss a recommendation
  const handleDismiss = (id: string) => {
    const updatedRecommendations = recommendations.map(rec => 
      rec.id === id ? { ...rec, dismissed: true } : rec
    );
    
    const activeRecommendations = updatedRecommendations.filter(r => !r.dismissed);
    
    setRecommendations(activeRecommendations);
    saveRecommendations(updatedRecommendations);
    
    // Generate a new recommendation if all are dismissed
    if (activeRecommendations.length === 0) {
      generateRecommendations();
    }
  };

  if (recommendations.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="mb-6">
      {recommendations.map((recommendation) => (
        <AIRecommendation
          key={recommendation.id}
          recommendation={recommendation}
          onDismiss={handleDismiss}
        />
      ))}
      
      {loading && (
        <div className="text-center py-2 text-sm text-gray-500">
          Generando recomendación...
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
