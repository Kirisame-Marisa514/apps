import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { GameController } from './components/GameController';
import { saveRecord, removeTodaysRecord } from './services/storage';
import { GameType, WakeUpRecord } from './types';
import { LanguageProvider } from './contexts/LanguageContext';

function AppContent() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [newRecord, setNewRecord] = useState<WakeUpRecord | undefined>(undefined);

  const handleStartWakeUp = () => {
    setIsPlaying(true);
  };

  const handleGameSuccess = (game: GameType) => {
    const record = saveRecord(game);
    setNewRecord(record);
    setIsPlaying(false);
  };

  const handleGameCancel = () => {
    setIsPlaying(false);
  };

  const handleCancelWakeUp = () => {
    removeTodaysRecord();
    setNewRecord(undefined); 
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-200">
      <Dashboard 
        onStartWakeUp={handleStartWakeUp} 
        lastRecord={newRecord}
        onReset={handleCancelWakeUp}
      />
      
      {isPlaying && (
        <GameController 
          onSuccess={handleGameSuccess}
          onCancel={handleGameCancel}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}