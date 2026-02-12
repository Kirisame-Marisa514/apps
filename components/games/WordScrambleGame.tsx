import React, { useState, useEffect } from 'react';
import { GameProps } from '../../types';
import { Button } from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

const WORDS_EN = [
  'MORNING', 'SUNRISE', 'COFFEE', 'STRETCH', 'SHOWER', 
  'BREAKFAST', 'AWAKE', 'ENERGY', 'ALARM', 'ROUTINE',
  'FRESH', 'BRIGHT', 'EARLY', 'SHINE', 'START',
  'PANCAKE', 'OMELET', 'TOAST', 'YOGURT', 'FRUIT'
];

// 4-character idioms or common phrases for Chinese version
const WORDS_ZH = [
  '早睡早起', '精神焕发', '闻鸡起舞', '旭日东升', '一日之计',
  '生机勃勃', '神清气爽', '阳光明媚', '朝气蓬勃', '元气满满'
];

export const WordScrambleGame: React.FC<GameProps> = ({ onComplete, onFailure }) => {
  const { t, language } = useLanguage();
  const REQUIRED_WORDS = 3;
  
  const [wordsToSolve, setWordsToSolve] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambled, setScrambled] = useState('');
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); 
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const source = language === 'zh' ? WORDS_ZH : WORDS_EN;
    const shuffled = [...source].sort(() => 0.5 - Math.random());
    setWordsToSolve(shuffled.slice(0, REQUIRED_WORDS));
    setCurrentWordIndex(0);
  }, [language]);

  useEffect(() => {
    if (wordsToSolve.length > 0) {
        const word = wordsToSolve[currentWordIndex];
        // Scramble
        let scr = word.split('').sort(() => 0.5 - Math.random()).join('');
        // Ensure it's not same as original
        let attempts = 0;
        while (scr === word && attempts < 10) {
            scr = word.split('').sort(() => 0.5 - Math.random()).join('');
            attempts++;
        }
        // Add spaces for english legibility, not needed for chinese really but consistent style
        setScrambled(language === 'zh' ? scr : scr.split('').join(' ')); 
        setInput('');
        setIsError(false);
    }
  }, [currentWordIndex, wordsToSolve, language]);

  useEffect(() => {
    if (timeLeft <= 0) {
        onFailure();
        return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onFailure]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentWord = wordsToSolve[currentWordIndex];
    
    // Normalize input
    const normalizedInput = language === 'zh' ? input.trim() : input.toUpperCase().trim();

    if (normalizedInput === currentWord) {
        if (currentWordIndex + 1 >= REQUIRED_WORDS) {
            onComplete();
        } else {
            setCurrentWordIndex(prev => prev + 1);
        }
    } else {
        setIsError(true);
        setTimeout(() => setIsError(false), 500);
        setInput('');
    }
  };

  if (wordsToSolve.length === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6 w-full max-w-md mx-auto">
      <div className="w-full flex justify-between items-center text-slate-500">
        <span className="font-bold">{t('word')}: {currentWordIndex + 1}/{REQUIRED_WORDS}</span>
        <span className={`font-mono font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-slate-700'}`}>
          00:{timeLeft.toString().padStart(2, '0')}
        </span>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">{t('scrambleTitle')}</h2>
        <p className="text-slate-500">{t('scrambleInstruction')}</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full text-center">
        <div className="text-4xl font-bold text-slate-800 mb-8 font-mono tracking-[0.2em] uppercase break-words">
          {scrambled}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            autoFocus
            value={input}
            onChange={(e) => {
                setInput(e.target.value);
                if (isError) setIsError(false);
            }}
            className={`w-full text-center text-3xl p-4 rounded-xl border-2 transition-all uppercase focus:outline-none ${
                isError 
                ? 'border-red-500 bg-red-50' 
                : 'border-slate-200 focus:border-purple-500'
            }`}
            placeholder={t('typeHere')}
          />
          <Button type="submit" fullWidth disabled={!input} variant="secondary">
            {t('submit')}
          </Button>
        </form>
      </div>
    </div>
  );
};