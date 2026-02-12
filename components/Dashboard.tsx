import React, { useState, useEffect } from 'react';
import { WakeUpRecord } from '../types';
import { getHistory, getTodaysRecord, getTargetTime, saveTargetTime } from '../services/storage';
import { HistoryChart } from './HistoryChart';
import { Button } from './ui/Button';
import { Sun, CheckCircle, Clock, CalendarDays, Target, Trophy, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { playClick } from '../services/sound';

interface DashboardProps {
  onStartWakeUp: () => void;
  lastRecord?: WakeUpRecord; 
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartWakeUp, lastRecord: propLastRecord, onReset }) => {
  const { t, language, setLanguage } = useLanguage();
  const [history, setHistory] = useState<WakeUpRecord[]>([]);
  const [todayRecord, setTodayRecord] = useState<WakeUpRecord | undefined>(undefined);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [targetTime, setTargetTime] = useState(getTargetTime());
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
    setTodayRecord(getTodaysRecord());
  }, [propLastRecord]); 

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleGoalSave = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTargetTime(newTime);
    saveTargetTime(newTime);
  };

  const handleLanguageSwitch = () => {
    playClick();
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  const handleReset = () => {
    playClick();
    onReset();
  };

  const isGoalMet = (recordTimestamp: string, target: string) => {
    const recordDate = new Date(recordTimestamp);
    const [targetH, targetM] = target.split(':').map(Number);
    const recordMinutes = recordDate.getHours() * 60 + recordDate.getMinutes();
    const targetMinutes = targetH * 60 + targetM;
    return recordMinutes <= targetMinutes;
  };

  const timeString = currentTime.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  const dateString = currentTime.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 p-6 pb-24 relative">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-10">
        <button 
          onClick={handleLanguageSwitch}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Languages size={14} />
          {language === 'en' ? '中文' : 'English'}
        </button>
      </div>

      {/* Header Section */}
      <div className="flex flex-col items-center text-center space-y-2 pt-6">
        <div className="bg-orange-100 p-3 rounded-full text-orange-500 mb-2">
            <Sun size={32} />
        </div>
        <h1 className="text-xl font-medium text-slate-500 uppercase tracking-wide">{t('appTitle')}</h1>
        <div className="text-6xl md:text-8xl font-bold text-slate-800 tracking-tighter tabular-nums">
          {timeString}
        </div>
        <p className="text-slate-400 font-medium">{dateString}</p>
      </div>

      {/* Main Action Card */}
      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center transform transition-all hover:scale-[1.01]">
        {todayRecord ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-green-500 space-y-4">
              <CheckCircle size={64} className="animate-bounce-slow" />
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-800">{t('goodMorning')}</h2>
                <p className="text-slate-500">{t('wokeUpAt')}</p>
                <div className="text-4xl font-bold text-slate-800">
                  {new Date(todayRecord.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                </div>
                {isGoalMet(todayRecord.timestamp, targetTime) && (
                   <div className="inline-flex items-center gap-2 text-orange-500 bg-orange-50 px-3 py-1 rounded-full text-sm font-semibold mt-2">
                     <Trophy size={14} /> {t('goalMet')}
                   </div>
                )}
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex flex-col items-center gap-3">
                <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {t('todaysChallenge')}: {t(todayRecord.gamePlayed)}
                </span>
                <button 
                  onClick={handleReset}
                  className="text-sm text-slate-400 hover:text-red-500 transition-colors underline decoration-slate-200 hover:decoration-red-200 underline-offset-4"
                >
                  {t('cancelWakeUp')}
                </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">{t('readyToStart')}</h2>
                <p className="text-slate-500">{t('readySubtitle')}</p>
             </div>
             <Button 
                onClick={onStartWakeUp} 
                className="text-lg py-4 w-full md:w-auto md:min-w-[200px] shadow-orange-300 shadow-lg"
             >
                {t('imAwake')}
             </Button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-1">
            <Clock className="text-blue-500 mb-2" size={24} />
            <span className="text-2xl font-bold text-slate-800">{history.length}</span>
            <span className="text-xs text-slate-400 uppercase font-semibold">{t('totalDays')}</span>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-1">
            <CalendarDays className="text-purple-500 mb-2" size={24} />
            <span className="text-2xl font-bold text-slate-800">
                {history.length > 0 ? history.length : 0}
            </span>
             <span className="text-xs text-slate-400 uppercase font-semibold">{t('streak')}</span>
        </div>

        <div 
          className="col-span-2 md:col-span-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-1 relative group cursor-pointer transition-colors hover:bg-slate-50"
          onClick={() => setIsEditingGoal(true)}
        >
            <Target className="text-pink-500 mb-2" size={24} />
            {isEditingGoal ? (
                <input 
                    type="time" 
                    value={targetTime}
                    onChange={handleGoalSave}
                    onBlur={() => setIsEditingGoal(false)}
                    autoFocus
                    className="text-2xl font-bold text-slate-800 bg-transparent border-b-2 border-pink-200 focus:border-pink-500 outline-none text-center w-full max-w-[120px]"
                />
            ) : (
                <span className="text-2xl font-bold text-slate-800">
                    {targetTime}
                </span>
            )}
            <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400 uppercase font-semibold">{t('dailyGoal')}</span>
                {!isEditingGoal && (
                    <span className="text-[10px] text-slate-300 bg-slate-100 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">{t('edit')}</span>
                )}
            </div>
        </div>
      </div>

      {/* History Chart */}
      <HistoryChart data={history} targetTime={targetTime} />
    </div>
  );
};