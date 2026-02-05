

import React from 'react';
export enum SectionType {
  ABOUT = 'about',
  ACADEMIA = 'academia',
  EXPERIENCES = 'experiences',
  BLOG = 'blog',
  TRACKING = 'tracking'
}

export interface ProfileInfo {
  name: string;
  title: string;
  affiliation: string;
  location: string;
  email: string;
  bio: string;
  about?: string[];
  avatarUrl: string;
  resumeUrl?: string;
  roles?: string[];
  interests?: string[];
  socials: {
    github?: string;
    twitter?: string;
    scholar?: string;
    linkedin?: string;
    facebook?: string;
    discord?: string;
    instagram?: string;
    steam?: string;
    orcid?: string;
  };
}

export interface TimelineEvent {
  id: string;
  date: string; // e.g., "Mar 2024"
  title: string;
  institution?: string;
  description?: string | React.ReactNode;
  iconType?: 'edu' | 'work' | 'award';
  link?: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  url?: string;
  pdfUrl?: string;
  abstract: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
  description?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface IndustryExperience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  link?: string;
}

export interface Award {
  id: string;
  title: string;
  event: string;
  year: number;
  link?: string;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  tags: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content?: string;
}

export interface TrackingStats {
  leetcode: {
    dailyDone: boolean;
    streak: number;
    solved: number;
    totalQuestions?: number;
    monthlySolves: { month: string; year: number; solved: number }[];
  };
  github: {
    totalStars: number;
    monthlyCommits: { month: string; year: number; commits: number }[];
  };
  travel: {
    visited: {
      country: string;
      code: string; // ISO3 code
      visits: number;
    }[];
    totalCountries: number;
  };
  goals: {
    title: string;
    current: number;
    total: number;
    unit: string;
  }[];
}
