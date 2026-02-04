
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import AIAssistant from './components/AIAssistant';
import { ThemeToggle } from './components/ThemeToggle';
import { Timeline } from './components/Timeline';
import { SectionType } from './types';
import {
  PROFILE_DATA,
  ACADEMIA_DATA,
  EXPERIENCES_DATA,
  BLOG_POSTS,
  TIMELINE_EVENTS,
  TRACKING_DATA
} from './constants';
import {
  GraduationCap,
  Briefcase,
  User,
  Trophy,
  Code,
  BookOpen,
  PenTool,
  Cpu,
  Award,
  History,
  Activity,
  Github,
  CheckCircle2,
  Globe,
  BarChart3,
  Star,
  Heart,
  Coffee
} from 'lucide-react';
import { Badge, Button, Card } from './components/ui';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionType>(SectionType.ABOUT);

  const navigation = [
    { name: 'About', id: SectionType.ABOUT, icon: User },
    { name: 'Academia', id: SectionType.ACADEMIA, icon: GraduationCap },
    { name: 'Experiences', id: SectionType.EXPERIENCES, icon: Briefcase },
    { name: 'Tracking', id: SectionType.TRACKING, icon: Activity },
    { name: 'Blog', id: SectionType.BLOG, icon: PenTool },
  ];

  const [blogPosts, setBlogPosts] = useState(BLOG_POSTS);
  const [trackingStats, setTrackingStats] = useState(TRACKING_DATA);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogRes, trackingRes] = await Promise.all([
          fetch('http://localhost:8000/api/blog'),
          fetch('http://localhost:8000/api/tracking')
        ]);
        if (blogRes.ok) {
          const blogData = await blogRes.json();
          const mappedBlog = blogData.map((post: any) => ({
            id: post.id,
            title: post.title,
            date: new Date(post.published_at).toISOString().split('T')[0],
            excerpt: post.excerpt,
          }));
          setBlogPosts(mappedBlog);
        }
        if (trackingRes.ok) {
          const trackingData = await trackingRes.json();
          // Merge fetched data with existing static data (e.g. travel, goals)
          setTrackingStats(prev => ({
            ...prev,
            ...trackingData
          }));
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case SectionType.ABOUT:
        return (
          <section className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-6">About Me</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <div className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-8 space-y-4">
                  {PROFILE_DATA.about && PROFILE_DATA.about.length > 0 ? (
                    PROFILE_DATA.about.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  ) : (
                    <p>{PROFILE_DATA.bio}</p>
                  )}
                </div>

                {PROFILE_DATA.interests && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Heart size={20} className="text-red-500" /> Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {PROFILE_DATA.interests.map((interest) => (
                        <Badge key={interest} variant="outline" className="px-3 py-1">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Cpu size={20} className="text-blue-500" /> Key Expertises
                </h3>
                <div className="flex flex-wrap gap-2 mb-12">
                  {EXPERIENCES_DATA.keywords.map((tag) => (
                    <Badge key={tag} variant="secondary" className="px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>


            <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-8 flex items-center gap-3">
                <History className="text-blue-500" /> Journey Timeline
              </h3>
              <Timeline events={TIMELINE_EVENTS} />
            </div>
          </section>
        );

      case SectionType.ACADEMIA:
        return (
          <section className="animate-in fade-in slide-in-from-top-4 duration-500 flex flex-col space-y-16">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-8 flex items-center gap-3">
                <GraduationCap className="text-blue-500" /> Education
              </h3>
              <Timeline
                events={ACADEMIA_DATA.education.map(edu => ({
                  id: edu.id,
                  date: edu.year,
                  title: edu.degree,
                  institution: edu.institution,
                  description: edu.description,
                  iconType: 'edu'
                }))}
              />
            </div>

            <div className="pt-12 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-8 flex items-center gap-3">
                <BookOpen className="text-blue-500" /> Publications
              </h2>
              <div className="space-y-10">
                <Timeline
                  events={ACADEMIA_DATA.publications.map((pub) => ({
                    id: pub.id.toString(),
                    date: pub.year.toString(),
                    title: pub.title,
                    institution: pub.venue,
                    iconType: 'edu',
                    link: pub.pdfUrl || pub.url,
                    description: (
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {pub.authors.map((author, idx) => (
                            <span
                              key={author}
                              className={
                                author === PROFILE_DATA.name
                                  ? 'font-semibold text-slate-900 dark:text-slate-100'
                                  : ''
                              }
                            >
                              {author}
                              {idx < pub.authors.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed max-w-2xl">
                          {pub.abstract}
                        </p>
                      </div>
                    ),
                  }))}
                />
              </div>
            </div>
          </section>
        );

      case SectionType.EXPERIENCES:
        return (
          <section className="animate-in fade-in slide-in-from-top-4 duration-500 flex flex-col space-y-20">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-8 flex items-center gap-3">
                <Briefcase className="text-blue-500" /> Industrial Experiences
              </h2>
              <div className="space-y-8">
                <Timeline
                  events={EXPERIENCES_DATA.industry.map((exp) => ({
                    id: exp.id,
                    date: exp.duration,
                    title: exp.role,
                    institution: exp.company,
                    description: exp.description,
                    iconType: 'work',
                    link: exp.link,
                  }))}
                />
              </div>
            </div>

            <div className="pt-12 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-8 flex items-center gap-3">
                <Trophy className="text-blue-500" /> Honors & Awards
              </h2>
              <div className="space-y-8">
                <Timeline
                  events={EXPERIENCES_DATA.awards.map((aw) => ({
                    id: aw.id,
                    date: aw.year.toString(),
                    title: aw.title,
                    institution: aw.event,
                    iconType: 'award',
                    link: aw.link,
                    description: aw.description,
                  }))}
                />
              </div>
            </div>

            <div className="pt-12 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-8 flex items-center gap-3">
                <Code className="text-blue-500" /> Personal Projects
              </h2>
              <div className="grid sm:grid-cols-2 gap-8">
                {EXPERIENCES_DATA.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="group cursor-pointer"
                    onClick={() => window.open(proj.link, '_blank')}
                  >
                    <div className="overflow-hidden rounded-xl mb-4 border border-slate-200 dark:border-slate-800 aspect-video relative">
                      <img
                        src={proj.imageUrl}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={proj.title}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 group-hover:text-blue-500 transition-colors mb-2 flex items-center gap-2">
                      {proj.title} <Globe size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{proj.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {proj.tags.map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case SectionType.TRACKING:
        return (
          <section className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-8 flex items-center gap-3">
              <BarChart3 className="text-blue-500" /> Personal Tracking
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* LeetCode Tracker */}
              <Card className="p-6 border-l-4 border-l-yellow-500 sm:col-span-2">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Code size={20} className="text-yellow-600" />
                    <h3 className="font-bold">LeetCode Daily</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {trackingStats.leetcode?.dailyDone && (
                      <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2 size={12} className="mr-1" /> Today Done
                      </Badge>
                    )}
                    <span className="text-slate-500 ml-2">Total Solved</span>
                    <span className="font-bold">
                      {trackingStats.leetcode?.solved}
                      {trackingStats.leetcode?.totalQuestions && <span className="text-slate-400 font-normal"> / {trackingStats.leetcode.totalQuestions}</span>}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-end justify-between gap-1 h-32 pt-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                    {trackingStats.leetcode?.monthlySolves?.map((item, i) => {
                      const solvesArray = trackingStats.leetcode.monthlySolves.map(c => c.solved);
                      const maxSolves = Math.max(...solvesArray, 1); // Prevent division by zero
                      const height = Math.max((item.solved / maxSolves) * 100, 5);
                      return (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1 group relative h-full justify-end">
                          <div
                            className="w-full bg-yellow-500/80 rounded-t-sm transition-all duration-500 hover:bg-yellow-500"
                            style={{ height: `${height}%` }}
                          >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg">
                              {item.solved} solved
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-2 px-1">
                    {trackingStats.leetcode?.monthlySolves?.map((item, i) => (
                      <span key={i} className="text-[10px] text-slate-400 font-mono">
                        {item.month}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>

              {/* GitHub Tracker */}
              <Card className="p-6 border-l-4 border-l-slate-900 dark:border-l-slate-100 sm:col-span-2">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Github size={20} />
                    <h3 className="font-bold">GitHub Activity</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500">Total Stars</span>
                    <span className="font-bold flex items-center gap-1">
                      {trackingStats.github?.totalStars} <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-end justify-between gap-1 h-32 pt-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                    {trackingStats.github?.monthlyCommits.map((item, i) => {
                      const commitsArray = trackingStats.github.monthlyCommits.map(c => c.commits);
                      const maxCommits = Math.max(...commitsArray, 1);
                      const height = Math.max((item.commits / maxCommits) * 100, 5);
                      return (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1 group relative h-full justify-end">
                          <div
                            className="w-full bg-slate-800 dark:bg-slate-200 rounded-t-sm transition-all duration-500 hover:bg-blue-600 dark:hover:bg-blue-400"
                            style={{ height: `${height}%` }}
                          >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg">
                              {item.commits} commits
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-2 px-1">
                    {trackingStats.github?.monthlyCommits.map((item, i) => (
                      <span key={i} className="text-[10px] text-slate-400 font-mono">
                        {item.month}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Travel Tracker */}
              <Card className="p-6 border-l-4 border-l-blue-500 sm:col-span-2">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-2">
                    <Globe size={20} className="text-blue-500" />
                    <h3 className="font-bold">Travel Progress</h3>
                  </div>
                  <Badge variant="outline">{trackingStats.travel?.totalCountries} Countries Visited</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trackingStats.travel?.countries.map(country => (
                    <Badge key={country} variant="secondary" className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                      {country}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Custom Goals */}
              {trackingStats.goals?.map((goal: any, i: number) => (
                <Card key={i} className="p-6 sm:col-span-2">
                  <div className="flex justify-between items-end mb-3">
                    <h3 className="font-bold text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wider">{goal.title}</h3>
                    <span className="text-xs font-mono">{goal.current} / {goal.total} {goal.unit}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-1000"
                      style={{ width: `${(goal.current / goal.total) * 100}%` }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </section>
        );

      case SectionType.BLOG:
        return (
          <section className="animate-in fade-in slide-in-from-top-4 duration-500">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-12">Blog</h2>
            <div className="space-y-16">
              {blogPosts.map((post) => (
                <article key={post.id} className="group cursor-pointer max-w-3xl">
                  <div className="text-xs font-mono font-bold text-slate-400 mb-3 uppercase tracking-widest">{post.date}</div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all mb-4">
                    {post.title}
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                  <Button variant="ghost" className="p-0 h-auto text-blue-600 dark:text-blue-400 hover:bg-transparent hover:underline text-base font-bold">
                    Read article →
                  </Button>
                </article>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-900 dark:text-slate-50 text-xl tracking-tight">
              {PROFILE_DATA.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-1">
              {navigation.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'secondary' : 'ghost'}
                  className={`h-9 px-4 ${activeSection === item.id ? 'font-bold' : 'font-medium'}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.name}
                </Button>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          <div className="w-full lg:w-72 lg:sticky lg:top-24 self-start">
            <Sidebar profile={PROFILE_DATA} />
          </div>

          <div className="flex-1 min-w-0">
            <nav className="md:hidden flex gap-2 mb-10 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide border-b border-slate-200 dark:border-slate-800">
              {navigation.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'secondary' : 'outline'}
                  className="whitespace-nowrap h-9"
                  onClick={() => setActiveSection(item.id)}
                >
                  <item.icon size={14} className="mr-2" />
                  {item.name}
                </Button>
              ))}
            </nav>
            <div className="pb-32">{renderContent()}</div>
          </div>
        </div>
      </main>
      <AIAssistant />
      <footer className="border-t border-slate-200 dark:border-slate-800 py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">© {new Date().getFullYear()} {PROFILE_DATA.name}</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-3">Built with Antigravity</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
