import React from 'react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  color?: 'blue' | 'gold' | 'green' | 'red';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp,
  color = 'blue'
}) => {
  const colorStyles = {
    blue: 'bg-brand-blue/10 text-brand-blue',
    gold: 'bg-brand-gold/10 text-brand-gold',
    green: 'bg-brand-success/10 text-brand-success',
    red: 'bg-brand-danger/10 text-brand-danger',
  };

  return (
    <div className="bg-brand-primary border border-white/5 rounded-xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div className={cn("p-3 rounded-lg", colorStyles[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-xs">
          <span className={cn("font-medium", trendUp ? "text-brand-success" : "text-brand-danger")}>
            {trend}
          </span>
          <span className="text-slate-500 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
};
