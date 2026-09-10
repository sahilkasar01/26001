import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  score?: number;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'sm', score, className = '' }) => {
  let colorClasses = '';

  switch (level) {
    case 'LOW':
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      break;
    case 'MEDIUM':
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-300';
      break;
    case 'HIGH':
      colorClasses = 'bg-orange-50 text-orange-800 border-orange-300';
      break;
    case 'CRITICAL':
      colorClasses = 'bg-red-50 text-red-800 border-red-300 font-bold';
      break;
    default:
      colorClasses = 'bg-stone-100 text-stone-800 border-stone-300';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
    lg: 'text-sm font-semibold px-3 py-1.5'
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-xs border uppercase tracking-wider ${sizeClasses} ${colorClasses} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          level === 'LOW'
            ? 'bg-emerald-600'
            : level === 'MEDIUM'
            ? 'bg-amber-600'
            : level === 'HIGH'
            ? 'bg-orange-600'
            : 'bg-red-600'
        }`}
      />
      <span>{level}</span>
      {score !== undefined && <span className="font-mono ml-0.5">({score})</span>}
    </span>
  );
};
