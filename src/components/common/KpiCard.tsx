import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface KpiCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  highlightLevel?: 'normal' | 'warning' | 'danger' | 'success' | 'earth-brown' | 'forest-green';
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  id,
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendDirection,
  highlightLevel = 'normal',
  onClick
}) => {
  const getThemeStyling = () => {
    switch (highlightLevel) {
      case 'danger':
        return {
          topBorder: 'border-t-4 border-t-red-700',
          iconBg: 'bg-red-50 text-red-700 border-red-200',
          hoverBorder: 'hover:border-red-400'
        };
      case 'warning':
        return {
          topBorder: 'border-t-4 border-t-[#b45309]', // Warm amber-brown
          iconBg: 'bg-[#fef3c7]/70 text-[#92400e] border-[#fde68a]',
          hoverBorder: 'hover:border-[#b45309]'
        };
      case 'success':
      case 'forest-green':
        return {
          topBorder: 'border-t-4 border-t-[#1b4332]', // Rich forest green
          iconBg: 'bg-[#e8f5e9] text-[#1b4332] border-[#a5d6a7]',
          hoverBorder: 'hover:border-[#2d6a4f]'
        };
      case 'earth-brown':
        return {
          topBorder: 'border-t-4 border-t-[#78350f]', // Warm terra cotta / saddle brown
          iconBg: 'bg-[#fef3c7]/60 text-[#78350f] border-[#fde68a]',
          hoverBorder: 'hover:border-[#92400e]'
        };
      default:
        return {
          topBorder: 'border-t-4 border-t-[#2d5a3c]', // Earthy deep green-slate
          iconBg: 'bg-[#f0f7f2] text-[#2d5a3c] border-[#c8e6c9]',
          hoverBorder: 'hover:border-[#2d5a3c]'
        };
    }
  };

  const theme = getThemeStyling();

  return (
    <div
      id={id}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`group bg-white border border-[#d6c7b2] shadow-xs p-4 flex flex-col justify-between transition-all duration-150 relative ${
        theme.topBorder
      } ${
        onClick
          ? `cursor-pointer ${theme.hoverBorder} hover:shadow-md hover:-translate-y-0.5 active:translate-y-0`
          : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b5847] font-mono">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-[#29221b] mt-1 tracking-tight">
            {value}
          </div>
        </div>
        <div className={`p-2 rounded-xs border transition-transform duration-150 group-hover:scale-105 ${theme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-[#e8ded1] flex items-center justify-between text-xs text-[#5c4a3b]">
        <span className="truncate pr-1">{subtext}</span>
        <div className="flex items-center gap-1 shrink-0">
          {trend && (
            <span
              className={`font-semibold font-mono text-[11px] ${
                trendDirection === 'down'
                  ? 'text-[#1b4332]'
                  : trendDirection === 'up'
                  ? 'text-red-700'
                  : 'text-[#6b5847]'
              }`}
            >
              {trend}
            </span>
          )}
          {onClick && (
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8c735d] group-hover:text-[#2d5a3c] transition-colors" />
          )}
        </div>
      </div>
    </div>
  );
};
