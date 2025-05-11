
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const COMMON_EMOJIS = [
  '💪', '🏃', '🧘', '📚', '💧', '🥗', '😴', '🧹', '💰', '🎸', 
  '✍️', '🌱', '🧠', '❤️', '🚫', '🗣️', '☀️', '🌙', '🏠', '📝'
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  selectedEmoji?: string;
}

const EmojiPicker = ({ onSelect, selectedEmoji = '📝' }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onSelect(emoji);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="h-14 w-14 text-2xl rounded-full bg-habito-softblue hover:bg-habito-softblue/80"
        >
          {selectedEmoji}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="emoji-grid">
          {COMMON_EMOJIS.map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              className="h-10 p-0 hover:bg-habito-softblue/20"
              onClick={() => handleEmojiClick(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
