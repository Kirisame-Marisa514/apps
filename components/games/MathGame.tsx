import React, { useState, useEffect, useCallback } from 'react';
import { GameProps } from '../../types';
import { Button } from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface DifficultyConfig {
  key: string;
  time: number;
  ops: string[];
  range: { min: number, max: number };
  multRange: { min: number, max: number };
  required: number;
  variant: 'secondary' | 'primary' | 'danger';
}

const CONFIGS: Record<Difficulty, DifficultyConfig> = {
  EASY: {
    key: 'easy',
    time: 60,
    ops: ['+', '-'],
    range: { min: 2, max: 12 },
    multRange: { min: 2, max: 5 },
    required: 3,
    variant: 'secondary' // Blue
  },
  MEDIUM: {
    key: 'medium',
    time: 45,
    ops: ['+', '-', '*'],
    range: { min: 4, max: 20 },
    multRange: { min: 2, max: 9 },
    required: 5,
    variant: 'primary' // Orange
  },
  HARD: {
    key: 'hard',
    time: 30,
    ops: ['+', '-', '*'],
    range: { min: 10, max: 50 },
    multRange: { min: 4, max: 12 },
    required: 7,
    variant: 'danger' // Red
  }
};

export const MathGame: React.FC<GameProps> = ({ onComplete, onFailure }) => {
  const { t } = useLanguage();
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [problem, setProblem] = useState<{ q: string, a: number } | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const activeConfig = difficulty ? CONFIGS[difficulty] : null;

  const generateProblem = useCallback(() => {
    if (!difficulty) return;
    const config = CONFIGS[difficulty];
    const { ops, range, multRange } = config;

    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b;

    if (op === '*') {
      a = Math.floor(Math.random() * (multRange.max - multRange.min + 1)) + multRange.min;
      b = Math.floor(Math.random() * (multRange.max - multRange.min + 1)) + multRange.min;
    } else {
      a = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      b = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }

    if (op === '-' && b > a) {
      [a, b] = [b, a];
    }

    let ans = 0;
    if (op === '+') ans = a + b;
    if (op === '-') ans = a - b;
    if (op === '*') ans = a * b;

    setProblem({ q: `${a} ${op} ${b}`, a: ans });
    setUserAnswer('');
  }, [difficulty]);

  const handleSelectDifficulty = (level: Difficulty) => {
    setDifficulty(level);
    setTimeLeft(CONFIGS[level].time);
  };

  useEffect(() => {
    if (difficulty) {
      generateProblem();
    }
  }, [difficulty, generateProblem]);

  useEffect(() => {
    if (!difficulty) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onFailure();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [difficulty, onFailure]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem || !activeConfig) return;

    if (parseInt(userAnswer) === problem.a) {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore >= activeConfig.required) {
        onComplete();
      } else {
        generateProblem();
      }
    } else {
      setUserAnswer('');
      setTimeLeft(prev => Math.max(0, prev - 3));
    }
  };

  if (!difficulty || !activeConfig) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-8 w-full max-w-md mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">{t('mathTitle')}</h2>
          <p className="text-slate-500">{t('chooseLevel')}</p>
        </div>
        <div className="w-full space-y-3">
          {(Object.keys(CONFIGS) as Difficulty[]).map((level) => {
            const config = CONFIGS[level];
            return (
              <Button
                key={level}
                fullWidth
                variant={config.variant}
                onClick={() => handleSelectDifficulty(level)}
                className="flex justify-between items-center px-6 group"
              >
                <span className="font-bold">{t(config.key)}</span>
                <span className="text-sm opacity-90 font-normal group-hover:opacity-100 transition-opacity">
                   {config.required} Qs / {config.time}s
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6 w-full max-w-md mx-auto">
      <div className="w-full flex justify-between items-center text-slate-500">
        <span className="font-bold">{t('score')}: {score}/{activeConfig.required}</span>
        <span className={`font-mono font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-slate-700'}`}>
          00:{timeLeft.toString().padStart(2, '0')}
        </span>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">{t('mathTitle')}</h2>
        <p className="text-slate-500">{t('solveToProve', { n: activeConfig.required })}</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full text-center">
        <div className="text-5xl font-bold text-slate-800 mb-6 font-mono">
          {problem?.q}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            autoFocus
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full text-center text-3xl p-4 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:outline-none transition-colors"
            placeholder="?"
          />
          <Button type="submit" fullWidth disabled={!userAnswer}>
            {t('submit')}
          </Button>
        </form>
      </div>
    </div>
  );
};