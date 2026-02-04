
import React from 'react';
import { TimelineEvent } from '../types';
import { Briefcase, GraduationCap, Trophy, ExternalLink } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const getIcon = (type?: string) => {
    switch (type) {
      case 'edu': return <GraduationCap size={14} />;
      case 'award': return <Trophy size={14} />;
      default: return <Briefcase size={14} />;
    }
  };

  return (
    <div className="relative border-l border-slate-200 dark:border-slate-800 ml-32 sm:ml-40 pl-8 space-y-10">
      {events.map((event) => {
        // Simple hash function for color generation based on year/date
        const getYearColor = (dateString: string) => {
          const colors = [
            'text-blue-600 dark:text-blue-400',
            'text-emerald-600 dark:text-emerald-400',
            'text-purple-600 dark:text-purple-400',
            'text-amber-600 dark:text-amber-400',
            'text-rose-600 dark:text-rose-400',
            'text-indigo-600 dark:text-indigo-400',
          ];
          // Extract year if possible, otherwise use full string hash
          const yearMatch = dateString.match(/\d{4}/);
          const key = yearMatch ? yearMatch[0] : dateString;
          let hash = 0;
          for (let i = 0; i < key.length; i++) {
            hash = key.charCodeAt(i) + ((hash << 5) - hash);
          }
          return colors[Math.abs(hash) % colors.length];
        };

        return (
          <div key={event.id} className="relative">
            {/* Timeline Dot */}
            <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm z-10">
              {getIcon(event.iconType)}
            </div>

            {/* Date on the Left */}
            <div className={`absolute -left-[130px] sm:-left-[150px] top-0.5 w-[85px] sm:w-[105px] text-right font-mono text-sm font-bold leading-tight ${getYearColor(event.date)}`}>
              {event.date}
            </div>

            <div className="mb-1 flex items-center gap-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">{event.title}</h4>
              {event.link && (
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>

            {event.institution && (
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                {event.institution}
              </p>
            )}

            {event.description && (
              <div className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {event.description}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
