import React from 'react';

export const KpiCard = ({ title, value, subtitle, icon: Icon, accent = 'primary', className = '' }) => {
  const accents = {
    primary: 'border-t-primary text-primary-light',
    secondary: 'border-t-secondary text-secondary-light',
    success: 'border-t-emerald-500 text-emerald-400',
    warning: 'border-t-amber-500 text-amber-400',
    error: 'border-t-rose-500 text-rose-400',
  };

  return (
    <div
      className={`glass-card p-5 border-t-2 relative overflow-hidden flex flex-col justify-between ${
        accents[accent] || accents.primary
      } ${className}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-stitch bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-300">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div>
        <div className="text-3xl font-extrabold tracking-tight text-white">{value}</div>
        {subtitle && <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
};
