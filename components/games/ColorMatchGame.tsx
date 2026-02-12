import React, { useState, useEffect, useCallback } from 'react';
import { GameProps } from '../../types';
import { Button } from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

const COLORS_DATA = [
  { id: 'RED', hex: '#ef4444', en: 'RED', zh: '红' },
  { id: 'BLUE', hex: '#3b82f6', en: 'BLUE', zh: '蓝' },
  { id: 'GREEN', hex: '#22c55e', en: 'GREEN', zh: '绿' },
  { id: 'YELLOW', hex: '#eab308', en: 'YELLOW', zh: '黄' },
  { id: 'PURPLE', hex: '#a855f7', en: 'PURPLE', zh: '紫' },
  { id: 'ORANGE', hex: '#f97316', en: 'ORANGE', zh: '橙' },
];

export const ColorMatchGame: React.FC<GameProps> = ({ onComplete, onFailure }) => {
  const { t, language } = useLanguage();
  const REQUIRED_SCORE = 5;
  const TIME_LIMIT = 20;

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [currentRound, setCurrentRound] = useState<{ word: string, colorHex: string, answerId: string } | null>(null);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onFailure();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onFailure]);

  const generateRound = useCallback(() => {
    // Ink Color (Answer)
    const inkColorIndex = Math.floor(Math.random() * COLORS_DATA.length);
    const inkColor = COLORS_DATA[inkColorIndex];

    // Display Text (Distraction)
    const wordIndex = Math.floor(Math.random() * COLORS_DATA.length);
    const wordObj = COLORS_DATA[wordIndex];
    
    setCurrentRound({
      word: language === 'zh' ? wordObj.zh : wordObj.en,
      colorHex: inkColor.hex,
      answerId: inkColor.id
    });
  }, [language]);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  const handleChoice = (colorId: string) => {
    if (!currentRound) return;

    if (colorId === currentRound.answerId) {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore >= REQUIRED_SCORE) {
        onComplete();
      } else {
        generateRound();
      }
    } else {
      setTimeLeft(prev => Math.max(0, prev - 3));
    }
  };

  if (!currentRound) return null;

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6 w-full max-w-md mx-auto">
       <div className="w-full flex justify-between items-center text-slate-500">
        <span className="font-bold">{t('score')}: {score}/{REQUIRED_SCORE}</span>
        <span className={`font-mono font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-slate-700'}`}>
          00:{timeLeft.toString().padStart(2, '0')}
        </span>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">{t('colorTitle')}</h2>
        <p className="text-slate-500">{t('colorInstruction')}</p>
      </div>

      <div className="bg-white p-12 rounded-2xl shadow-xl border border-slate-100 w-full text-center flex items-center justify-center h-48">
        <span 
            className="text-6xl font-black tracking-wider transition-all"
            style={{ color: currentRound.colorHex }}
        >
            {currentRound.word}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        {COLORS_DATA.map((c) => (
            <Button 
                key={c.id}
                onClick={() => handleChoice(c.id)}
                className="font-bold border-2 border-slate-100 hover:border-slate-300 !bg-white !text-slate-700"
            >
                {language === 'zh' ? c.zh : c.en}
            </Button>
        ))}
      </div>
    </div>
  );
};