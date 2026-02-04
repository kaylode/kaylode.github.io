
import React from 'react';
import { ProfileInfo } from '@/types';
import { Mail, MapPin, Github, Twitter, GraduationCap, Linkedin, Facebook, Instagram, Gamepad2, Gamepad, FileText } from 'lucide-react';
import { Card } from './ui';

interface SidebarProps {
  profile: ProfileInfo;
}

const Sidebar: React.FC<SidebarProps> = ({ profile }) => {
  const socialIcons = {
    github: { icon: Github, title: "GitHub" },
    twitter: { icon: Twitter, title: "Twitter" },
    scholar: { icon: GraduationCap, title: "Scholar" },
    linkedin: { icon: Linkedin, title: "LinkedIn" },
    facebook: { icon: Facebook, title: "Facebook" },
    instagram: { icon: Instagram, title: "Instagram" },
    discord: { icon: Gamepad2, title: "Discord" },
    steam: { icon: Gamepad, title: "Steam" },
    orcid: { icon: FileText, title: "ORCID" }
  };

  return (
    <Card className="p-6 h-fit">
      <div className="flex flex-col items-center lg:items-start">
        <img
          src={profile.avatarUrl}
          alt={profile.name}
          className="w-32 h-32 lg:w-48 lg:h-48 rounded-2xl object-cover mb-6 ring-4 ring-slate-100 dark:ring-slate-800"
        />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">{profile.name}</h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium mb-4 text-center lg:text-left">{profile.title}</p>

        {/* Roles Badges */}
        {profile.roles && (
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
            {profile.roles.map((role, i) => (
              <span key={i} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
                {role}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-3 w-full border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <GraduationCap size={18} className="text-slate-400" />
            <span>{profile.affiliation}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <MapPin size={18} className="text-slate-400" />
            <span>{profile.location}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <Mail size={18} className="text-slate-400" />
            <a href={`mailto:${profile.email}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {profile.email}
            </a>
          </div>
          {profile.resumeUrl && (
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 pt-2">
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity w-full justify-center font-medium"
              >
                <FileText size={16} /> Download Resume
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-6 justify-center lg:justify-start">
          {Object.entries(profile.socials).map(([key, url]) => {
            const platform = socialIcons[key as keyof typeof socialIcons];
            if (!platform || !url) return null;
            const Icon = platform.icon;

            return (
              <a
                key={key}
                href={url}
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                title={platform.title}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-8 flex justify-center w-full">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <img
              src="/bmc_qr.png"
              alt="Buy Me A Coffee"
              className="w-32 h-32 object-contain"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Sidebar;
