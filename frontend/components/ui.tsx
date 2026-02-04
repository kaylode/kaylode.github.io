
import React from 'react';

export const Button = ({ className = '', variant = 'primary', ...props }: any) => {
  const variants: any = {
    primary: 'bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-900 hover:bg-slate-900/90 dark:hover:bg-slate-100/90',
    outline: 'border border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/80',
  };
  return (
    <button 
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${variants[variant]} ${className}`} 
      {...props} 
    />
  );
};

export const Card = ({ className = '', ...props }: any) => (
  <div className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 shadow-sm ${className}`} {...props} />
);

export const Badge = ({ className = '', variant = 'default', ...props }: any) => {
  const variants: any = {
    default: 'bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-900',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100',
    outline: 'text-slate-950 dark:text-slate-50 border border-slate-200 dark:border-slate-800',
  };
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 ${variants[variant]} ${className}`} {...props} />
  );
};

export const Input = ({ className = '', ...props }: any) => (
  <input
    className={`flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);
