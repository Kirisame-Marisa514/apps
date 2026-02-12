import React from 'react';
import { WakeUpRecord } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

interface HistoryChartProps {
  data: WakeUpRecord[];
  targetTime: string;
}

export const HistoryChart: React.FC<HistoryChartProps> = ({ data, targetTime }) => {
  const { t, language } = useLanguage();

  const chartData = data.slice(-14).map(record => { 
    const date = new Date(record.timestamp);
    const minutesOfDay = date.getHours() * 60 + date.getMinutes();
    return {
      date: date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { month: 'numeric', day: 'numeric' }),
      minutes: minutesOfDay,
      timeLabel: date.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      fullDate: date.toDateString()
    };
  });

  const formatYAxis = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const [targetH, targetM] = targetTime.split(':').map(Number);
  const targetMinutes = (targetH || 0) * 60 + (targetM || 0);

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        {t('noHistory')}
      </div>
    );
  }

  return (
    <div className="w-full h-64 bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">{t('wakeUpTrends')}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickMargin={10}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickFormatter={formatYAxis} 
            domain={['dataMin - 60', 'dataMax + 60']}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [formatYAxis(value), t('time')]}
            labelStyle={{ color: '#64748b' }}
          />
          <ReferenceLine 
            y={targetMinutes} 
            stroke="#cbd5e1" 
            strokeDasharray="3 3" 
            label={{ value: t('dailyGoal'), fill: "#94a3b8", fontSize: 10, position: 'right' }} 
          />
          <Line 
            type="monotone" 
            dataKey="minutes" 
            stroke="#f59e0b" 
            strokeWidth={3} 
            dot={{ r: 4, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, fill: "#f59e0b" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};