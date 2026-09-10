import React from 'react';
import { RiskLevel } from '../../types';

interface RiskScoreBarProps {
  score: number;
  level: RiskLevel;
  showBar?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskScoreBar: React.FC<RiskScoreBarProps> = ({ score, level, showBar = true, size = 'md' }) => {
  const getFillColor = (lvl: RiskLevel) => {
    switch (lvl) {
      case 'LOW':
        return 'bg-emerald-600';
      case 'MEDIUM':
        return 'bg-amber-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'CRITICAL':
        return 'bg-red-600';
      default:
        return 'bg-slate-500';
    }
  };

  const getTextColor = (lvl: RiskLevel) => {
    switch (lvl) {
      case 'LOW':
        return 'text-emerald-700';
      case 'MEDIUM':
        return 'text-amber-700';
      case 'HIGH':
        return 'text-orange-700';
      case 'CRITICAL':
        return 'text-red-700';
      default:
        return 'text-slate-700';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-1">
        <span className={`font-mono font-bold ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-base' : 'text-sm'} text-slate-900`}>
          {score}<span className="text-slate-500 text-xs font-normal">/100</span>
        </span>
        <span className={`text-xs font-semibold uppercase tracking-wider ${getTextColor(level)}`}>
          {level}
        </span>
      </div>
      {showBar && (
        <div className="w-full bg-slate-200 h-2 rounded-none overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getFillColor(level)}`}
            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          />
        </div>
      )}
    </div>
  );
};
