import React, { useState } from 'react';
import { GameType } from '../types';
import { MathGame } from './games/MathGame';
import { MemoryGame } from './games/MemoryGame';
import { RiddleGame } from './games/RiddleGame';
import { ColorMatchGame } from './games/ColorMatchGame';
import { WordScrambleGame } from './games/WordScrambleGame';
import { Button } from './ui/Button';
import { XCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { playSuccess, playFailure, playClick } from '../services/sound';

interface GameControllerProps {
  onSuccess: (game: GameType) => void;
  onCancel: () => void;
}

export const GameController: React.FC<GameControllerProps> = ({ onSuccess, onCancel }) => {
  const { t } = useLanguage();
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [failed, setFailed] = useState(false);

  // Pick a random game on mount
  React.useEffect(() => {
    const games = Object.values(GameType);
    const randomGame = games[Math.floor(Math.random() * games.length)];
    setActiveGame(randomGame);
  }, []);

  const handleFailure = () => {
    playFailure();
    setFailed(true);
  };

  const handleSuccess = (gameType: GameType) => {
    playSuccess();
    onSuccess(gameType);
  };

  const retry = () => {
    setFailed(false);
    // Pick a new game
    const games = Object.values(GameType);
    let nextGame = games[Math.floor(Math.random() * games.length)];
    
    // Try to pick a different game if possible for variety
    if (games.length > 1 && nextGame === activeGame) {
         nextGame = games.filter(g => g !== activeGame)[Math.floor(Math.random() * (games.length - 1))];
    }
    setActiveGame(nextGame);
  };

  const handleCancel = () => {
    playClick();
    onCancel();
  };

  if (failed) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/90 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl">
          <div className="flex justify-center text-red-500 mb-4">
             <XCircle size={64} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">{t('stillDreaming')}</h2>
          <p className="text-slate-600">{t('failedCheck')}</p>
          <div className="space-y-3">
             <Button onClick={retry} fullWidth variant="primary">{t('tryAgain')}</Button>
             <Button onClick={handleCancel} fullWidth variant="outline">{t('giveUp')}</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!activeGame) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white sm:bg-slate-50 flex flex-col items-center justify-center">
        <div className="absolute top-4 right-4">
            <button onClick={handleCancel} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle size={24} />
            </button>
        </div>
        
        <div className="w-full max-w-lg">
            {activeGame === GameType.MATH && (
                <MathGame onComplete={() => handleSuccess(GameType.MATH)} onFailure={handleFailure} />
            )}
            {activeGame === GameType.MEMORY && (
                <MemoryGame onComplete={() => handleSuccess(GameType.MEMORY)} onFailure={handleFailure} />
            )}
            {activeGame === GameType.RIDDLE && (
                <RiddleGame onComplete={() => handleSuccess(GameType.RIDDLE)} onFailure={handleFailure} />
            )}
            {activeGame === GameType.COLOR_MATCH && (
                <ColorMatchGame onComplete={() => handleSuccess(GameType.COLOR_MATCH)} onFailure={handleFailure} />
            )}
            {activeGame === GameType.WORD_SCRAMBLE && (
                <WordScrambleGame onComplete={() => handleSuccess(GameType.WORD_SCRAMBLE)} onFailure={handleFailure} />
            )}
        </div>
    </div>
  );
};