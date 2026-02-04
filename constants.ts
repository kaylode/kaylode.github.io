
import {
  ProfileInfo,
  Publication,
  Education,
  Certificate,
  IndustryExperience,
  Award,
  Project,
  BlogPost,
  TimelineEvent,
  TrackingStats
} from '@/types';

import data from '@/data.json';

export const PROFILE_DATA: ProfileInfo = data.profile;

export const TIMELINE_EVENTS: TimelineEvent[] = data.timeline as TimelineEvent[];

export const ACADEMIA_DATA = data.academia as unknown as {
  publications: Publication[];
  education: Education[];
  certificates: Certificate[];
};

export const EXPERIENCES_DATA = data.experiences as unknown as {
  industry: IndustryExperience[];
  projects: Project[];
  awards: Award[];
  keywords: string[];
};

export const BLOG_POSTS: BlogPost[] = data.blog as BlogPost[];

export const TRACKING_DATA: TrackingStats = data.tracking as TrackingStats;
