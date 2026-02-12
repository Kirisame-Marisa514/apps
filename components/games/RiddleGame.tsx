import React, { useState, useEffect } from 'react';
import { GameProps, RiddleData } from '../../types';
import { fetchMorningRiddle } from '../../services/gemini';
import { Button } from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

export const RiddleGame: React.FC<GameProps> = ({ onComplete, onFailure }) => {
  const { t, language } = useLanguage();
  const [data, setData] = useState<RiddleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const riddle = await fetchMorningRiddle(language);
        if (mounted) {
            setData(riddle);
            setLoading(false);
        }
      } catch (e) {
        onFailure();
      }
    };
    load();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const handleOptionClick = (option: string) => {
    if (!data) return;
    setSelectedOption(option);
    
    setTimeout(() => {
        if (option === data.answer) {
            onComplete();
        } else {
            onFailure();
        }
    }, 800);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
        <div className="h-4 w-64 bg-slate-200 rounded-lg"></div>
        <div className="space-y-3 w-full max-w-sm mt-8">
            <div className="h-12 bg-slate-200 rounded-xl"></div>
            <div className="h-12 bg-slate-200 rounded-xl"></div>
        </div>
        <p className="text-slate-400 text-sm mt-4">{t('consultingOracle')}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8 w-full max-w-md mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">{t('riddleTitle')}</h2>
        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 text-slate-800 text-lg font-medium shadow-sm">
            {data.question}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 w-full">
        {data.options.map((option, idx) => {
            let variant: 'outline' | 'primary' | 'danger' = 'outline';
            if (selectedOption === option) {
                variant = option === data.answer ? 'primary' : 'danger';
            }
            
            return (
                <Button
                    key={idx}
                    variant={variant}
                    onClick={() => handleOptionClick(option)}
                    disabled={selectedOption !== null}
                    fullWidth
                    className={`
                        ${selectedOption === option && option === data.answer ? '!bg-green-500 !border-green-500 !text-white' : ''}
                        ${selectedOption === option && option !== data.answer ? '!bg-red-500 !border-red-500 !text-white' : ''}
                        justify-start text-left
                    `}
                >
                    {option}
                </Button>
            );
        })}
      </div>
    </div>
  );
};