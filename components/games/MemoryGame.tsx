import React, { useState, useEffect } from 'react';
import { GameProps } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { playClick } from '../../services/sound';

export const MemoryGame: React.FC<GameProps> = ({ onComplete, onFailure }) => {
  const { t } = useLanguage();
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [level, setLevel] = useState(1);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const REQUIRED_LEVELS = 3;
  const GRID_SIZE = 4; // 2x2 grid

  const generateSequence = (currentLevel: number) => {
    const newStep = Math.floor(Math.random() * GRID_SIZE);
    setSequence(prev => [...prev, newStep]);
    setUserSequence([]);
    setIsPlayingSequence(true);
  };

  useEffect(() => {
    generateSequence(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isPlayingSequence && sequence.length > 0) {
      let i = 0;
      const interval = setInterval(() => {
        if (i >= sequence.length) {
          clearInterval(interval);
          setActiveIndex(null);
          setIsPlayingSequence(false);
          return;
        }
        
        setActiveIndex(sequence[i]);
        
        setTimeout(() => {
           setActiveIndex(null);
        }, 400);

        i++;
      }, 800);

      return () => clearInterval(interval);
    }
  }, [sequence, isPlayingSequence]);

  const handleTileClick = (index: number) => {
    if (isPlayingSequence) return;
    
    playClick(); // Sound effect

    const nextExpectedIndex = userSequence.length;
    if (sequence[nextExpectedIndex] === index) {
      const newUserSeq = [...userSequence, index];
      setUserSequence(newUserSeq);
      
      setActiveIndex(index);
      setTimeout(() => setActiveIndex(null), 200);

      if (newUserSeq.length === sequence.length) {
        if (level >= REQUIRED_LEVELS) {
            setTimeout(onComplete, 500);
        } else {
            setLevel(prev => prev + 1);
            setTimeout(() => generateSequence(level + 1), 1000);
        }
      }
    } else {
      onFailure();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6 w-full max-w-md mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">{t('memoryTitle')}</h2>
        <p className="text-slate-500">
            {t('level')} {level}/{REQUIRED_LEVELS}. {isPlayingSequence ? t('watchCarefully') : t('yourTurn')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-64 h-64">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => handleTileClick(i)}
            disabled={isPlayingSequence}
            className={`
              rounded-2xl transition-all duration-200 shadow-lg transform active:scale-95
              ${activeIndex === i 
                ? 'bg-blue-500 shadow-blue-300 scale-105' 
                : 'bg-white hover:bg-slate-50 border-2 border-slate-100'
              }
            `}
          />
        ))}
      </div>
    </div>
  );
};