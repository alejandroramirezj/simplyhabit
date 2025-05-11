
import React from 'react';
import { AIRecommendation as AIRecommendationType } from '@/types';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';

interface AIRecommendationProps {
  recommendation: AIRecommendationType;
  onDismiss: (id: string) => void;
}

const AIRecommendation = ({ recommendation, onDismiss }: AIRecommendationProps) => {
  return (
    <div className="bg-blue-50 rounded-xl p-4 mb-4 shadow-sm relative">
      <div className="flex items-start">
        <div className="text-blue-500 mr-3">
          <MessageSquare size={20} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-800">{recommendation.message}</p>
          <p className="text-xs text-gray-500 mt-1">Recomendación de IA</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDismiss(recommendation.id)}
          className="h-6 w-6 p-0 rounded-full"
          aria-label="Descartar recomendación"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
};

export default AIRecommendation;
