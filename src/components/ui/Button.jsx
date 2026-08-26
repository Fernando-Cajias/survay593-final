import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  icon: Icon,
}) => {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-stitch transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
    xl: 'text-lg px-8 py-3.5 gap-3 font-bold',
  };

  const variants = {
    primary:
      'bg-primary hover:bg-primary-light text-white shadow-glow-sm hover:shadow-glow border border-primary-light/30',
    secondary: 'bg-secondary hover:bg-secondary-light text-white border border-secondary-light/30',
    outline:
      'bg-transparent hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white border border-rose-400/30',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/30',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};
