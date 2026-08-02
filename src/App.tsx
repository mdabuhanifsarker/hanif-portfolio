import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wirshemphpkyyzpexzoa.supabase.co";
const SUPABASE_KEY = "sb_publishable_tWJ1SIXe6zQbL2qpAW6xpw_XKYw58Jk";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

function getYouTubeId(url: string | Blob | undefined | null) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.')) {
    return trimmed;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

import { motion, AnimatePresence, Reorder } from 'motion/react';
import { getTravelRecommendation } from './services/geminiService';
import { StatsSection } from './components/StatsSection';
import { 
  Star,
  Play, 
  Grid, 
  Mail, 
  User, 
  Cpu, 
  Palette, 
  Zap, 
  Award, 
  MessageSquare, 
  CheckCircle2, 
  Bell,
  ArrowRight,
  Monitor,
  Maximize2,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Upload,
  Phone,
  Trash2,
  Image,
  AlertCircle,
  MapPin,
  Send,
  RotateCcw,
} from 'lucide-react';

import { 
  FaFacebook, 
  FaYoutube, 
  FaInstagram, 
  FaPinterest, 
  FaLinkedin, 
  FaDribbble, 
  FaBehance, 
  FaGithub, 
  FaTelegramPlane 
} from 'react-icons/fa';

// --- Types ---
type Page = 'home' | 'projects' | 'reviews' | 'about' | 'contact';

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number | null;
  comment: string;
  date: string;
  createdAt?: number;
}

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  img: string;
  videoUrl?: string | Blob;
  type: 'video' | 'folder';
  subItems?: ProjectItem[];
  createdAt?: string | number;
}

function getYouTubeThumbnail(url: string | Blob | undefined | null) {
  if (!url || typeof url !== 'string') return null;
  const id = getYouTubeId(url);
  if (id) {
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return null;
}

function getProjectThumbnail(project: ProjectItem) {
  if (project) {
    if (project.videoUrl && typeof project.videoUrl === 'string') {
      const ytThumb = getYouTubeThumbnail(project.videoUrl);
      if (ytThumb) return ytThumb;
    }
    if (project.img && typeof project.img === 'string' && project.img.trim() !== "") {
      return project.img;
    }
  }
  return 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200';
}

function getCaseInsensitiveProp(obj: any, keyName: string) {
  if (!obj || typeof obj !== 'object') return undefined;
  if (obj[keyName] !== undefined) return obj[keyName];
  const targetLower = keyName.toLowerCase();
  const foundKey = Object.keys(obj).find(k => k.toLowerCase() === targetLower);
  return foundKey ? obj[foundKey] : undefined;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
}

interface UserStats {
  xp: number;
  level: number;
  unlockedBadges: string[];
}

// --- Common UI Components ---

const Sidebar = ({ isOpen, onClose, setPage, currentPage }: { isOpen: boolean, onClose: () => void, setPage: (p: Page) => void, currentPage: Page }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] h-screen"
        />
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-screen w-80 bg-[#0B0D10] border-l border-[#252D37] z-[101] p-12 flex flex-col gap-12 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        >
          <div className="flex justify-between items-center">
            <span className="text-[#4F8CFF] font-black text-sm tracking-widest uppercase">NAVIGATE</span>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors border border-[#252D37]">
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {(['home', 'projects', 'reviews', 'about', 'contact'] as Page[]).map((item) => (
              <button
                key={item}
                onClick={() => { setPage(item); onClose(); }}
                className={`text-left text-3xl font-bold tracking-tight transition-all duration-300 hover:translate-x-2 ${
                  currentPage === item ? 'text-[#4F8CFF]' : 'text-slate-300 hover:text-[#4F8CFF]'
                }`}
              >
                {item === 'projects' ? 'PORTFOLIO' : item.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="mt-auto space-y-6">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Connect</p>
            <div className="flex gap-4">
               {[
                 { Icon: Mail, link: "mailto:mdabuhanifsarker91@gmail.com" },
                 { Icon: Phone, link: "tel:+8801870766945" },
                 { Icon: MessageSquare, link: "https://wa.me/8801870766945" }
               ].map((item, idx) => (
                 <a 
                   key={idx} 
                   href={item.link}
                   target={item.link.startsWith('http') ? "_blank" : undefined}
                   rel={item.link.startsWith('http') ? "noreferrer" : undefined}
                   className="p-3 bg-white/5 rounded-2xl text-slate-450 hover:text-[#4F8CFF] transition-colors border border-[#252D37] cursor-pointer"
                 >
                   <item.Icon size={18} />
                 </a>
               ))}
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const Navbar = ({ currentPage, setPage, onOpenMenu, logoUrl }: { currentPage: Page, setPage: (p: Page) => void, onOpenMenu: () => void, logoUrl: string | null }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-4 md:py-5 bg-[#0B0D10]/80 backdrop-blur-[20px] border-b border-[#252D37]">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 text-[#4F8CFF] font-black text-xl md:text-2xl tracking-tight cursor-pointer hover:brightness-110 transition-all"
        onClick={() => setPage('home')}
      >
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt="Logo" 
            referrerPolicy="no-referrer"
            className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-full border border-[#252D37] bg-[#12161B]" 
          />
        ) : (
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#12161B] border border-[#252D37] animate-pulse flex items-center justify-center shrink-0">
            <div className="w-5 h-5 rounded-full bg-white/10" />
          </div>
        )}
        ABU HANIF
      </motion.div>
      
      <div className="hidden md:flex gap-10">
        {(['home', 'projects', 'reviews', 'contact', 'about'] as Page[]).map((item) => (
          <button
            key={item}
            onClick={() => setPage(item)}
            className={`font-medium uppercase text-xs tracking-widest transition-colors duration-200 ${
              currentPage === item ? 'text-[#4F8CFF]' : 'text-[#9CA8B8] hover:text-[#4F8CFF]'
            }`}
          >
            {item === 'projects' ? 'PORTFOLIO' : item.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPage('contact')}
          className="hidden md:flex bg-[#4F8CFF] hover:bg-[#72A8FF] text-white px-8 py-3 h-[48px] items-center justify-center rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-250 shadow-[0_10px_30px_rgba(79,140,255,0.15)]"
        >
          Hire Me
        </motion.button>
        
        <button 
          onClick={onOpenMenu}
          className="p-3 bg-white/5 rounded-full text-white hover:bg-white/10 active:scale-90 transition-all duration-75 border border-[#252D37] touch-manipulation cursor-pointer flex items-center justify-center"
        >
          <Menu size={20} />
        </button>
      </div>
    </nav>
  );
};

const MobileNav = ({ current, setPage }: { current: Page, setPage: (p: Page) => void }) => (
  <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass-card px-8 py-4 flex gap-8 shadow-2xl border-[#252D37] bg-[#171C22]/80 backdrop-blur-[20px]">
    {[
      { id: 'home', icon: Play },
      { id: 'projects', icon: Grid },
      { id: 'reviews', icon: Award },
      { id: 'about', icon: User },
      { id: 'contact', icon: Mail },
    ].map((item) => (
      <button 
        key={item.id} 
        onClick={() => setPage(item.id as Page)}
        className={`p-2 rounded-full transition-all ${current === item.id ? 'bg-[#4F8CFF]/10 text-[#4F8CFF] scale-110' : 'text-[#697586]'}`}
      >
        <item.icon size={18} />
      </button>
    ))}
  </div>
);

// --- Sections ---

const Hero = ({ onAboutMe, aboutImage, setPage, cvUrl }: { onAboutMe: () => void, aboutImage: string | null, setPage: (p: Page) => void, cvUrl?: string | null }) => (
  <section className="flex flex-col pt-12 md:pt-16 pb-24 px-6 md:px-12 relative overflow-hidden bg-[#02040A] -mt-[35px]">
    {/* Left-edge bright cyan-blue lens flare bleed */}
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[80%] bg-gradient-to-br from-[#0052FF]/20 to-[#00F0FF]/15 blur-[150px] rounded-full pointer-events-none opacity-80" />
    {/* Subtle right glow behind viewfinder */}
    <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-[#0052FF]/5 blur-[130px] rounded-full pointer-events-none" />
    
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-7xl mx-auto w-full relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="lg:col-span-7 space-y-6 md:space-y-8"
      >
        {/* Main Header matching mockup exactly */}
        <h1 className="tracking-tighter -letter-spacing-[0.03em] max-w-2xl flex flex-col gap-1">
          <span className="text-2xl sm:text-3xl font-normal text-[#9CA8B8] block">
            I create
          </span>
          <span className="text-5xl sm:text-7xl lg:text-[76px] lg:leading-[1.1] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#00E5FF] filter drop-shadow-[0_0_25px_rgba(0,102,255,0.35)] block">
            Visualization
          </span>
        </h1>
        
        <p className="text-[#9CA8B8] text-base md:text-lg max-w-xl leading-relaxed font-medium">
          I specialize in high-end video editing, color grading, and motion design for brands and creators.
        </p>
        
        {/* Dual Pill CTA Buttons matching mockup */}
        <div className="flex flex-wrap gap-4 pt-4 items-center">
          <motion.button 
            whileHover={{ 
              scale: 1.03, 
              y: -2,
              boxShadow: "0 0 25px rgba(0, 82, 255, 0.45), inset 0 1px 3px rgba(255, 255, 255, 0.25)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setPage('projects');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="relative bg-[#060B15]/50 backdrop-blur-md text-[#A5C9FF] hover:text-white border border-[#0052FF]/40 hover:border-[#0084FF] px-8 py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 touch-manipulation cursor-pointer select-none shadow-[0_0_15px_rgba(0,82,255,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)]"
          >
            <span>View My Work</span> <ArrowRight size={16} />
          </motion.button>

          <motion.button 
            whileHover={{ 
              scale: 1.03, 
              y: -2,
              boxShadow: "0 0 25px rgba(0, 82, 255, 0.45), inset 0 1px 3px rgba(255, 255, 255, 0.25)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const targetUrl = cvUrl || 'https://drive.google.com/file/d/1gYg75vT_L_yqF5L9A9P6zLpxgS7i2l9-/view?usp=sharing';
              if (targetUrl) {
                const link = document.createElement('a');
                link.href = targetUrl;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                if (!targetUrl.includes('drive.google.com') && !targetUrl.includes('dropbox.com')) {
                  link.download = 'CV.pdf';
                }
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }}
            className="relative bg-[#060B15]/50 backdrop-blur-md text-[#A5C9FF] hover:text-white border border-[#0052FF]/40 hover:border-[#0084FF] px-8 py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 touch-manipulation cursor-pointer select-none shadow-[0_0_15px_rgba(0,82,255,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)]"
          >
            <span>Download CV</span>
            <svg className="w-4 h-4 text-[#A5C9FF]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </motion.button>
        </div>

        {/* Social Icons list with glossy look */}
        <div className="flex gap-3 pt-4">
          {[
            { Icon: FaYoutube, link: "https://www.youtube.com/@Abu_Hanif_Sarker", color: "#FF0000" },
            { Icon: FaFacebook, link: "https://www.facebook.com/profile.php?id=61592538396121", color: "#1877F2" },
            { Icon: FaBehance, link: "https://www.behance.net/mdabuhanifsarker", color: "#0057FF" },
            { Icon: FaLinkedin, link: "https://www.linkedin.com/in/mdabuhanifsarker/", color: "#0077B5" },
            { Icon: Mail, link: "mailto:mdabuhanifsarker91@gmail.com", color: "#0084FF" }
          ].map((social, idx) => (
            <motion.a 
              key={idx}
              href={social.link}
              target="_blank"
              rel="noreferrer"
              whileHover={{ 
                y: -3, 
                scale: 1.1, 
                borderColor: social.color,
                boxShadow: `0 0 15px ${social.color}40`,
                backgroundColor: `${social.color}10`
              }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#070C15]/90 border transition-all shadow-md cursor-pointer"
              style={{ 
                borderColor: `${social.color}33`,
                color: social.color 
              }}
            >
              <social.Icon size={16} />
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Advanced rotating circular viewfinder with handwriting signature overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        className="lg:col-span-5 flex justify-center lg:justify-end w-full"
      >
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-[380px] md:h-[380px] flex items-center justify-center">
          {/* Concentric rotating orbit lines with nodes */}
          <div className="absolute inset-0 rounded-full border border-[#0052FF]/15 animate-[spin_180s_linear_infinite] pointer-events-none" />
          <div className="absolute inset-4 rounded-full border border-dashed border-[#00E5FF]/20 animate-[spin_90s_linear_infinite] pointer-events-none" />
          
          {/* Inner glowing orbit */}
          <div className="absolute inset-10 rounded-full border border-[#0084FF]/35 pointer-events-none animate-[pulse_6s_ease-in-out_infinite]" />
          
          {/* Compass Orbit Dots (Top, Bottom, Left, Right nodes) */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#00E5FF] rounded-full shadow-[0_0_10px_rgba(0,229,255,0.8)] z-20" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#00E5FF] rounded-full shadow-[0_0_10px_rgba(0,229,255,0.8)] z-20" />
          <div className="absolute left-10 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#0052FF] rounded-full shadow-[0_0_10px_rgba(0,82,255,0.8)] z-20" />
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#0052FF] rounded-full shadow-[0_0_10px_rgba(0,82,255,0.8)] z-20" />

          {/* Blue glowing backlight spot */}
          <div className="absolute inset-12 rounded-full bg-gradient-to-tr from-[#0052FF]/10 to-[#00E5FF]/10 blur-3xl opacity-80 pointer-events-none" />

          {/* Concentric border and image mask */}
          <div className="w-[72%] h-[72%] rounded-full p-1 bg-gradient-to-tr from-[#1E2B43] via-[#0C1220] to-[#0084FF]/40 relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="w-full h-full rounded-full overflow-hidden border border-[#1E2B43] relative bg-[#040814]">
              {aboutImage ? (
                <img 
                  src={aboutImage} 
                  className="w-full h-full object-cover rounded-full"
                  alt="Abu Hanif Profile"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#0C1220] animate-pulse flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10" />
                </div>
              )}
            </div>
          </div>

          {/* Handwriting/Signature text overlay at bottom middle point */}
          <div className="absolute bottom-[-24px] sm:bottom-[-32px] left-1/2 transform -translate-x-1/2 z-20 pointer-events-none select-none text-center whitespace-nowrap">
            <span className="font-caveat text-5xl sm:text-6.5xl text-[#00E5FF] font-semibold tracking-wide drop-shadow-[0_3px_12px_rgba(0,229,255,0.7)]">
              Abu Hanif
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const BestWorksSection = ({ 
  isAdmin,
  projects, 
  setProjects, 
  categories,
  setCategories,
  bestWorks, 
  setBestWorks,
  setActiveVideo, 
  setPage,
  setSelectedCategoryId,
  addNotification,
  siteSettings
}: { 
  isAdmin: boolean,
  projects: ProjectItem[], 
  setProjects: React.Dispatch<React.SetStateAction<ProjectItem[]>>,
  categories: string[],
  setCategories: React.Dispatch<React.SetStateAction<string[]>>,
  bestWorks: string[], 
  setBestWorks: React.Dispatch<React.SetStateAction<string[]>>,
  setActiveVideo: (url: string | Blob | null) => void, 
  setPage: (p: Page) => void,
  setSelectedCategoryId: (id: string | null) => void,
  addNotification: any,
  siteSettings: {
    clients: string | number;
    projects: string | number;
    income: string | number;
  }
}) => {
  const videoProjects = projects.filter(p => p.type === 'video');
  const bestProjects = videoProjects.filter(p => bestWorks.includes(p.id));

  const videoProjectsRef = useRef<ProjectItem[]>(videoProjects);
  videoProjectsRef.current = videoProjects;

  const videoIdsKey = videoProjects.map(p => p.id).join(',');

  const defaultBestVideos: ProjectItem[] = [
    {
      id: 'default-best-1',
      title: "Podcast Intro & Cinematic Visual Editing",
      category: "PODCAST",
      img: "https://img.youtube.com/vi/Fm7fS-E0Vn8/maxresdefault.jpg",
      videoUrl: "https://www.youtube.com/watch?v=Fm7fS-E0Vn8",
      type: 'video'
    },
    {
      id: 'default-best-2',
      title: "Corporate Brand Story & Storytelling reel",
      category: "CORPORATE VIDEO",
      img: "https://img.youtube.com/vi/1O0_o-8tO-s/maxresdefault.jpg",
      videoUrl: "https://www.youtube.com/watch?v=1O0_o-8tO-s",
      type: 'video'
    }
  ];

  const prevPairIdsRef = useRef<string[]>([]);
  const prevVideoIdsKeyRef = useRef<string>(videoIdsKey);

  // Function to pick 2 distinct random videos, avoiding repeating the exact same pair immediately
  const pickRandomPair = useCallback((videoList: ProjectItem[]): ProjectItem[] => {
    if (!videoList || videoList.length === 0) {
      return defaultBestVideos.slice(0, 2);
    }

    if (videoList.length === 1) {
      const single = videoList[0];
      const hasDb = videoList.some(p => p.id.toString().startsWith('sb-'));
      if (!hasDb) {
        const fallback = defaultBestVideos.find(d => d.id !== single.id) || defaultBestVideos[1];
        return [single, fallback];
      }
      return [single];
    }

    // Generate all distinct index pairs (i, j) where i < j
    const pairs: [number, number][] = [];
    for (let i = 0; i < videoList.length; i++) {
      for (let j = i + 1; j < videoList.length; j++) {
        pairs.push([i, j]);
      }
    }

    const prevSet = new Set(prevPairIdsRef.current);

    // Exclude the pair if both IDs match the previous pair
    const validPairs = pairs.filter(([i, j]) => {
      const idA = videoList[i].id;
      const idB = videoList[j].id;
      if (prevSet.size === 2 && prevSet.has(idA) && prevSet.has(idB)) {
        return false;
      }
      return true;
    });

    const poolToUse = validPairs.length > 0 ? validPairs : pairs;
    const chosenPair = poolToUse[Math.floor(Math.random() * poolToUse.length)];

    let itemA = videoList[chosenPair[0]];
    let itemB = videoList[chosenPair[1]];

    // 50% chance to swap order
    if (Math.random() < 0.5) {
      [itemA, itemB] = [itemB, itemA];
    }

    prevPairIdsRef.current = [itemA.id, itemB.id];
    return [itemA, itemB];
  }, []);

  const [displayProjects, setDisplayProjects] = useState<ProjectItem[]>(() => {
    return pickRandomPair(videoProjects);
  });

  // Timer to automatically rotate 2 random videos every 1 minute (60,000ms)
  useEffect(() => {
    if (prevVideoIdsKeyRef.current !== videoIdsKey) {
      prevVideoIdsKeyRef.current = videoIdsKey;
      setDisplayProjects(pickRandomPair(videoProjectsRef.current));
    }

    const intervalId = setInterval(() => {
      setDisplayProjects(pickRandomPair(videoProjectsRef.current));
    }, 60000);

    return () => clearInterval(intervalId);
  }, [videoIdsKey, pickRandomPair]);

  // Map displayProjects against latest videoProjects state to ensure up-to-date thumbnails and titles
  const currentDisplayProjects = displayProjects.map(dp => {
    const latest = videoProjects.find(vp => vp.id === dp.id);
    return latest || dp;
  });

  // Admin and management state
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [targetSlotIndex, setTargetSlotIndex] = useState<number | null>(null);
  const [showManager, setShowManager] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [newProject, setNewProject] = useState<{ 
    title: string; 
    category: string; 
    videoUrl: string | Blob; 
    videoFile: File | null;
    img: string;
  }>({ 
    title: '', 
    category: categories[0] || 'PODCAST', 
    videoUrl: '', 
    videoFile: null,
    img: ''
  });

  const [newCatName, setNewCatName] = useState('');
  const [showCatAdder, setShowCatAdder] = useState(false);

  // Pre-select category if opening manager
  useEffect(() => {
    if (showManager && !newProject.category && categories.length > 0) {
      setNewProject(prev => ({ ...prev, category: categories[0] }));
    }
  }, [showManager, categories]);

  // Auto resolve YouTube thumbnail
  useEffect(() => {
    if (newProject.videoUrl && typeof newProject.videoUrl === 'string') {
      const ytid = getYouTubeId(newProject.videoUrl);
      if (ytid) {
        const expectedImg = `https://img.youtube.com/vi/${ytid}/maxresdefault.jpg`;
        setNewProject(prev => prev.img === expectedImg ? prev : { ...prev, img: expectedImg });
      }
    }
  }, [newProject.videoUrl]);

  const addCategory = () => {
    if (newCatName && !categories.includes(newCatName.toUpperCase())) {
      setCategories(prev => [...prev, newCatName.toUpperCase()]);
      setNewProject(prev => ({ ...prev, category: newCatName.toUpperCase() }));
      setNewCatName('');
      setShowCatAdder(false);
    }
  };

  const handleSaveFeatured = async () => {
    if (!newProject.title) {
      addNotification("Validation Error", "Please provide a title.");
      return;
    }
    setIsUploading(true);
    
    let finalVideoUrl: string | Blob = newProject.videoUrl;
    let finalImg = newProject.img || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200';

    if (newProject.videoFile) {
      finalVideoUrl = newProject.videoFile;
    }

    // De-duplication helper matching exact titles/URLs/Files
    const isUrlMatch = (pUrl: any) => {
      if (typeof pUrl === 'string' && typeof finalVideoUrl === 'string') {
        const cleanP = pUrl.replace(/https?:\/\/(www\.)?/, '').trim().toLowerCase();
        const cleanF = finalVideoUrl.replace(/https?:\/\/(www\.)?/, '').trim().toLowerCase();
        return cleanP === cleanF;
      }
      if (pUrl instanceof Blob && finalVideoUrl instanceof Blob) {
        return (pUrl as any).name === (finalVideoUrl as any).name && pUrl.size === finalVideoUrl.size;
      }
      return false;
    };

    const existingProj = projects.find(p => 
      p.category.toUpperCase() === newProject.category.toUpperCase() &&
      (p.title.trim().toLowerCase() === newProject.title.trim().toLowerCase() || isUrlMatch(p.videoUrl))
    );

    let finalProjectId = '';

    if (existingProj) {
      // Re-use already matched entry from projects state
      finalProjectId = existingProj.id;
      setProjects(prev => prev.map(p => {
        if (p.id === finalProjectId) {
          return {
            ...p,
            title: newProject.title,
            img: finalImg,
            videoUrl: finalVideoUrl,
            type: 'video'
          };
        }
        return p;
      }));
    } else {
      // Check if we are re-syncing from a non-default editing mode click:
      const isDefaultId = editingProject && editingProject.id.startsWith('default-best-');
      const editingExistingProj = editingProject && !isDefaultId ? projects.find(p => p.id === editingProject.id) : null;

      if (editingExistingProj) {
        finalProjectId = editingExistingProj.id;
        setProjects(prev => prev.map(p => {
          if (p.id === finalProjectId) {
            return {
              ...p,
              title: newProject.title,
              category: newProject.category.toUpperCase(),
              img: finalImg,
              videoUrl: finalVideoUrl,
              type: 'video'
            };
          }
          return p;
        }));
      } else {
        // Build an entirely fresh regular project so that it dynamically enters portfolio dedicated category folders
        finalProjectId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const brandNewProj: ProjectItem = {
          id: finalProjectId,
          title: newProject.title,
          category: newProject.category.toUpperCase(),
          img: finalImg,
          videoUrl: finalVideoUrl,
          type: 'video'
        };

        setProjects(prev => [brandNewProj, ...prev]);

        // Ensure category array registers it
        if (!categories.includes(newProject.category.toUpperCase())) {
          setCategories(prev => [...prev, newProject.category.toUpperCase()]);
        }
      }
    }

    // Pin position index list update for layout rendering items
    setBestWorks(prev => {
      const newList = [...prev];
      while (newList.length < 2) {
        newList.push('');
      }
      if (targetSlotIndex !== null && targetSlotIndex >= 0 && targetSlotIndex < 2) {
        newList[targetSlotIndex] = finalProjectId;
      } else {
        const idx = newList.indexOf(editingProject?.id || '');
        if (idx !== -1) {
          newList[idx] = finalProjectId;
        } else {
          newList.push(finalProjectId);
        }
      }
      return newList;
    });

    setIsUploading(false);
    setShowManager(false);
    setEditingProject(null);
    setTargetSlotIndex(null);
    setNewProject({ title: '', category: categories[0] || 'PODCAST', videoUrl: '', videoFile: null, img: '' });
    addNotification("Featured Saved & Added", `"${newProject.title}" has been linked to the Best Works and portfolio category.`);
  };

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12 -mt-[70px] -mb-[70px]">
      <div className="flex justify-center text-center w-full relative">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-none -letter-spacing-[0.03em]">
          BEST <span className="text-[#4F8CFF]">WORKS</span>
        </h2>
        {isAdmin && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#4F8CFF]/10 border border-[#4F8CFF]/20 text-[#4F8CFF] px-3 py-1.5 rounded-[14px] text-[10px] uppercase font-bold tracking-widest">
            Admin Mode
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {currentDisplayProjects.map((project, idx) => (
          <motion.div 
            key={project.id || idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              if (project.videoUrl) {
                setPage('projects');
                setSelectedCategoryId(project.category);
                setActiveVideo(project.videoUrl);
              } else {
                addNotification("No Video", "This project doesn't have an associated video yet.");
              }
            }}
            className="bg-[#171C22] border border-[#252D37] aspect-video relative group overflow-hidden cursor-pointer rounded-[22px] hover:border-[#4F8CFF]/30 active:scale-95 transition-all duration-300 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
          >
            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingProject(project);
                  setNewProject({
                    title: project.title,
                    category: project.category || categories[0] || 'PODCAST',
                    videoUrl: typeof project.videoUrl === 'string' ? project.videoUrl : '',
                    videoFile: project.videoUrl instanceof Blob ? project.videoUrl as File : null,
                    img: project.img || ''
                  });
                  setTargetSlotIndex(idx);
                  setShowManager(true);
                }}
                className="absolute top-4 right-4 z-20 bg-[#4F8CFF] hover:bg-[#72A8FF] text-white p-3 rounded-full transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-90"
                title="Edit featured video slot"
              >
                <Settings size={16} />
              </button>
            )}

            <img 
              src={getProjectThumbnail(project)} 
              className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:opacity-100 transition-all duration-700" 
              alt={project.title} 
              referrerPolicy="no-referrer"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-85 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-[#4F8CFF] uppercase tracking-widest bg-[#4F8CFF]/10 border border-[#4F8CFF]/20 rounded-full px-3 py-1 w-fit">
                {project.category}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-[#F5F7FA] tracking-tight leading-snug">{project.title}</h3>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="w-14 h-14 bg-[#4F8CFF]/10 backdrop-blur-2xl rounded-full flex items-center justify-center text-[#4F8CFF] border border-[#4F8CFF]/40 shadow-2xl shadow-[#4F8CFF]/20">
                <Play fill="currentColor" size={20} className="ml-1" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <motion.button 
          whileHover={{ 
            scale: 1.03, 
            y: -3,
            boxShadow: "0 0 25px rgba(0, 82, 255, 0.45), inset 0 1px 3px rgba(255, 255, 255, 0.25)"
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setPage('projects');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="relative bg-[#060B15]/50 backdrop-blur-md text-[#A5C9FF] hover:text-white border border-[#0052FF]/40 hover:border-[#0084FF] px-10 py-3.5 h-[48px] rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-250 flex items-center justify-center gap-3 w-full sm:w-auto touch-manipulation cursor-pointer shadow-[0_0_15px_rgba(0,82,255,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)]"
        >
          <span>Visit Portfolio</span> <ArrowRight size={16} />
        </motion.button>
      </div>

      <StatsSection siteSettings={siteSettings} />

      {/* Slide-over/Backdropped BestWorks Project Manager Modal */}
      <AnimatePresence>
        {showManager && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowManager(false);
                setEditingProject(null);
                setTargetSlotIndex(null);
              }}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-xl p-8 sm:p-12 space-y-6 sm:space-y-8 relative z-10 rounded-[3rem] bg-[#0d0d0d] border border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg shadow-primary/20">
                    <Settings size={22} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                      Featured Slot {targetSlotIndex !== null ? targetSlotIndex + 1 : ""}
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Customize Featured Showcase Videos</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setShowManager(false);
                    setEditingProject(null);
                    setTargetSlotIndex(null);
                  }} 
                  className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all border border-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* 1. SELECTION SWAP SELECTOR (Choose from existing projects) */}
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest block">Option A: Link to Existing Video</span>
                  <p className="text-[11px] text-slate-500">Pick any video from your portfolio to display here</p>
                </div>
                <div className="relative">
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-primary text-white appearance-none cursor-pointer text-sm"
                    value={projects.some(p => p.id === editingProject?.id) ? editingProject?.id : ''}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      if (selectedId) {
                        const found = projects.find(p => p.id === selectedId);
                        if (found) {
                          setEditingProject(found);
                          setNewProject({
                            title: found.title,
                            category: found.category || categories[0] || 'PODCAST',
                            videoUrl: typeof found.videoUrl === 'string' ? found.videoUrl : '',
                            videoFile: found.videoUrl instanceof Blob ? null : null,
                            img: found.img || ''
                          });
                        }
                      }
                    }}
                  >
                    <option value="" className="bg-[#000000] text-slate-500">-- Select Portfolio Project --</option>
                    {projects.filter(p => p.type === 'video').map(p => (
                      <option key={p.id} value={p.id} className="bg-[#0c0c0c] text-white">
                        [{p.category}] {p.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-600 justify-center">
                <span className="h-px bg-white/5 flex-grow" />
                <span>OR REEDIT / UPLOAD NEW</span>
                <span className="h-px bg-white/5 flex-grow" />
              </div>

              {/* 2. INLINE CREATOR/EDITOR BAR */}
              <div className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Video Title</label>
                  <input 
                    className="w-full bg-white/5 border border-white/5 focus:border-primary rounded-2xl p-4 focus:outline-none transition-all text-white text-sm"
                    placeholder="Enter visual masterpiece title..."
                    value={newProject.title}
                    onChange={e => setNewProject({...newProject, title: e.target.value})}
                  />
                </div>

                {/* Category Picker */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</label>
                    <button 
                      onClick={() => setShowCatAdder(!showCatAdder)}
                      className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                    >
                      {showCatAdder ? 'Pick Existing' : '+ New Category'}
                    </button>
                  </div>
                  
                  {showCatAdder ? (
                    <div className="flex gap-2">
                      <input 
                        className="flex-grow bg-white/5 border border-primary/30 rounded-xl p-3 focus:outline-none text-white text-xs"
                        placeholder="New category name..."
                        value={newCatName}
                        onChange={e => setNewCatName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addCategory()}
                      />
                      <button 
                         onClick={addCategory}
                         className="bg-primary text-black px-4 rounded-xl text-[10px] font-black uppercase"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <select 
                        className="w-full bg-white/5 border border-white/5 focus:border-primary rounded-2xl p-4 focus:outline-none transition-all text-white appearance-none cursor-pointer text-sm"
                        value={newProject.category}
                        onChange={e => setNewProject({...newProject, category: e.target.value})}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat} className="bg-[#0d0d0d]">{cat}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  )}
                </div>

                {/* File Upload / Video URL */}
                <div className="p-5 border border-white/5 bg-white/[0.01] rounded-3xl space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Video Source</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label 
                      htmlFor="featured-video-file" 
                      className="flex-1 flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all border border-dashed border-white/10"
                    >
                      <Upload size={20} className="text-primary mb-2" />
                      <span className="text-[9px] font-black text-white uppercase tracking-wider">Choose File</span>
                      <input 
                        type="file" 
                        id="featured-video-file" 
                        accept="video/*" 
                        className="hidden" 
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewProject({ ...newProject, videoFile: file, videoUrl: '' });
                          }
                        }}
                      />
                    </label>

                    <div className="flex items-center justify-center text-[10px] text-slate-600 font-bold">OR</div>

                    <div className="flex-[2] space-y-1 flex flex-col justify-center">
                      <input 
                        className="w-full bg-white/5 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-primary text-white text-xs"
                        placeholder="Pasted Video URL (YouTube, Drive, etc...)"
                        value={typeof newProject.videoUrl === 'string' ? newProject.videoUrl : ''}
                        onChange={e => setNewProject({...newProject, videoUrl: e.target.value, videoFile: null})}
                      />
                    </div>
                  </div>

                  {newProject.videoFile && (
                    <p className="text-[9px] font-black text-primary uppercase select-none">
                      ✓ File Attach: {newProject.videoFile.name}
                    </p>
                  )}
                </div>

                {/* Thumbnail Preview and Upload */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Video Thumbnail Image</label>
                  <div className="flex gap-4">
                    <label 
                      htmlFor="featured-thumbnail-file" 
                      className="flex-1 flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all border border-dashed border-white/10 text-center"
                    >
                      <Image size={20} className="text-[#63e5f1] mb-2" />
                      <span className="text-[9px] font-black text-white uppercase tracking-wider">Custom Thumbnail</span>
                      <input 
                        type="file" 
                        id="featured-thumbnail-file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewProject({ ...newProject, img: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {newProject.img && (
                      <div className="relative aspect-video w-32 bg-black rounded-xl overflow-hidden border border-white/10 shrink-0">
                        <img src={newProject.img} className="w-full h-full object-cover opacity-80" alt="Preview" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Action */}
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={isUploading}
                  onClick={handleSaveFeatured}
                  className="w-full bg-primary hover:brightness-110 text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-2"
                >
                  {isUploading ? "Syncing..." : (
                    <>
                      <CheckCircle2 size={16} />
                      Save & Pin Featured Video
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

const ReviewList = ({ reviews }: { reviews: Review[] }) => {
  const [showAll, setShowAll] = useState(false);

  // Sort reviews newest first
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      const timeA = a.createdAt || (a.date ? new Date(a.date).getTime() : 0);
      const timeB = b.createdAt || (b.date ? new Date(b.date).getTime() : 0);
      return timeB - timeA;
    });
  }, [reviews]);

  const reviewsWithRating = sortedReviews.filter(r => r.rating !== null && r.rating !== undefined && r.rating !== 0);
  const averageScoreVal = reviewsWithRating.length > 0
    ? (reviewsWithRating.reduce((sum, r) => sum + Number(r.rating), 0) / reviewsWithRating.length).toFixed(1)
    : "0.0";

  const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 2);

  return (
    <div className="space-y-12 w-full max-w-4xl mx-auto pt-4">
      <div id="community-voice-heading" className="flex items-center justify-between border-b border-[#252D37] pb-8 scroll-mt-28">
        <h3 className="text-2xl font-bold text-[#F5F7FA] uppercase tracking-tight flex items-center gap-3">
          Community Voice <span className="text-[#4F8CFF] text-lg font-bold">({sortedReviews.length})</span>
        </h3>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[#4F8CFF] font-bold text-xl">{averageScoreVal}</div>
            <div className="text-[9px] font-bold text-[#697586] uppercase tracking-widest">Average Score</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence mode="popLayout">
          {displayedReviews.map((rev, idx) => {
            const firstChar = rev.email ? rev.email.charAt(0) : (rev.name ? rev.name.charAt(0) : "A");
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, delay: idx * 0.04, ease: "easeOut" }}
                key={rev.id} 
                className="bg-[#171C22] border border-[#252D37] p-8 md:p-10 rounded-[22px] space-y-6 group hover:border-[#4F8CFF]/20 transition-all duration-300 shadow-[0_15px_45px_rgba(0,0,0,0.15)]"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 items-center min-w-0">
                    <div className="w-12 h-12 bg-[#4F8CFF]/10 rounded-[14px] flex items-center justify-center text-[#4F8CFF] font-bold text-lg border border-[#4F8CFF]/20 uppercase shrink-0">
                      {firstChar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[#F5F7FA] font-bold text-base tracking-tight uppercase truncate">
                        {rev.email ? rev.email.split('@')[0] : (rev.name || "Anonymous Client")}
                      </p>
                      {rev.email && (
                        <p className="text-[#697586] text-[10px] font-bold uppercase tracking-widest truncate">
                          {rev.email}
                        </p>
                      )}
                    </div>
                  </div>
                  {rev.rating !== null && rev.rating !== undefined && rev.rating !== 0 && (
                    <div className="flex items-center gap-1.5 bg-[#4F8CFF]/10 px-3 py-1.5 rounded-full text-[#4F8CFF] shrink-0">
                      <Star size={12} fill="currentColor" />
                      <span className="font-bold text-xs">{rev.rating}.0</span>
                    </div>
                  )}
                </div>
                {rev.comment && rev.comment.trim() !== "" && (
                  <div className="relative text-slate-300 font-normal leading-relaxed italic text-base border-l-2 border-[#4F8CFF]/20 pl-6 py-1 break-words">
                    "{rev.comment}"
                  </div>
                )}
                <div className="flex justify-between items-center text-[9px] font-bold text-[#697586] uppercase tracking-[0.2em] pt-4 border-t border-[#252D37]">
                  <span>Verified Experience</span>
                  <span>{rev.date}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {sortedReviews.length === 0 && (
          <div className="py-20 text-center glass-card border-dashed border-white/10 rounded-[3rem]">
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}

        {sortedReviews.length > 2 && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                if (showAll) {
                  setShowAll(false);
                  const headingEl = document.getElementById('community-voice-heading');
                  if (headingEl) {
                    headingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                } else {
                  setShowAll(true);
                }
              }}
              className="px-6 py-2.5 bg-[#252D37] hover:bg-[#4F8CFF] text-[#F5F7FA] font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2 border border-white/5 hover:border-transparent active:scale-95"
            >
              <span>{showAll ? 'Show Less' : 'Show More'}</span>
              {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ReviewsSection = ({
  reviews,
  setReviews,
  selectedRating,
  setSelectedRating,
  addNotification,
  onSubmitReview,
  showReviewList = true
}: {
  reviews: Review[],
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>,
  selectedRating: number,
  setSelectedRating: (rating: number) => void,
  addNotification: (title: string, message: string) => void,
  onSubmitReview: (rating: number | null, opinion: string, email: string) => Promise<boolean>,
  showReviewList?: boolean
}) => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
      <header className="text-center">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-none -letter-spacing-[0.03em]">
          REVIEW <span className="text-[#4F8CFF]">ME</span>
        </h2>
      </header>

      <div className="flex justify-center w-full">
        {/* Submit review form centered */}
        <div className="w-full max-w-xl bg-[#171C22] border border-[#252D37] p-8 md:p-10 rounded-[22px] space-y-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4F8CFF]/5 blur-3xl rounded-full pointer-events-none" />
          
          <div className="text-center space-y-4 relative z-10">
            <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">Leave a Rating</h3>
            <div className="flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  onClick={() => {
                    const form = document.getElementById('home-review-form') as HTMLFormElement;
                    if (form) {
                      form.dataset.rating = star.toString();
                      setSelectedRating(star);
                    }
                  }}
                  className={`p-1 transition-all hover:scale-125 active:scale-95 cursor-pointer ${selectedRating >= star ? 'text-[#4F8CFF]' : 'text-slate-700 hover:text-slate-500'}`}
                >
                  <Star size={30} fill={selectedRating >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
            <p className="text-[10px] font-bold text-[#697586] uppercase tracking-widest italic">Pick your score</p>
          </div>

          <form 
            id="home-review-form"
            className="grid grid-cols-1 gap-6 relative z-10"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const emailVal = (formData.get('userEmail') as string || "").trim();
              const opinionVal = (formData.get('userComment') as string || "").trim();
              
              if (selectedRating === 0 && opinionVal === "") {
                alert("Please select a rating, write an opinion, or both!");
                return;
              }
              
              const success = await onSubmitReview(selectedRating, opinionVal, emailVal);
              if (success) {
                addNotification("Review Posted", "Thank you for your valuable feedback!");
                setSelectedRating(0);
                (e.target as HTMLFormElement).reset();
              }
            }}
          >
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#9CA8B8] uppercase tracking-widest">Your Email (Optional)</label>
              <input 
                type="email" 
                name="userEmail" 
                className="w-full bg-[#11161C] border border-[#252D37] rounded-[14px] px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4F8CFF] transition-all font-medium placeholder:text-slate-600 focus:shadow-[0_0_15px_rgba(79,140,255,0.15)]" 
                placeholder="alex@example.com" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#9CA8B8] uppercase tracking-widest">Your Opinion</label>
              <textarea 
                name="userComment" 
                rows={4} 
                className="w-full bg-[#11161C] border border-[#252D37] rounded-[14px] p-4 text-white text-sm focus:outline-none focus:border-[#4F8CFF] transition-all font-medium resize-none placeholder:text-slate-600 focus:shadow-[0_0_15px_rgba(79,140,255,0.15)]" 
                placeholder="How was your experience working with me?" 
              />
            </div>
            <div>
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-[#4F8CFF] hover:bg-[#72A8FF] text-white rounded-full font-bold uppercase text-xs tracking-widest shadow-[0_10px_30px_rgba(79,140,255,0.15)] transition-all cursor-pointer"
              >
                Post My Review
              </motion.button>
            </div>
          </form>
        </div>
      </div>

      {showReviewList && <ReviewList reviews={reviews} />}
    </section>
  );
};

const ContactSection = ({ 
  handleEmailSubmit,
  isSending = false
}: { 
  handleEmailSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  isSending?: boolean
}) => {
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const nameInput = document.getElementById('contact-name');
    if (nameInput) {
      nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => nameInput.focus(), 300);
    }
  };

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      <header className="text-center">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-none -letter-spacing-[0.03em]">
          CONTACT <span className="text-[#4F8CFF]">ME</span>
        </h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        
        {/* Left Side: Contact Info & Let's talk with gorgeous orbit animation */}
        <div className="bg-[#0C1220] border border-[#1E2B43] p-8 sm:p-10 md:p-12 rounded-[24px] flex flex-col justify-between space-y-10 shadow-[0_20px_60px_rgba(0,0,0,0.55)] relative overflow-hidden">
          {/* Subtle blue accent blur backing */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#0052FF]/10 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-white tracking-tight leading-none">
              Let's talk <span className="text-[#0084FF] inline-block animate-pulse font-sans">.</span>
            </h2>
            <p className="text-[#9CA8B8] text-sm sm:text-base font-medium leading-relaxed max-w-xs">
              I'm just glad to be your editor ! Thanks.
            </p>
          </div>

          <div className="space-y-6 relative z-10 max-w-sm">
            {/* Call */}
            <div className="flex items-center gap-5">
              <a 
                href="https://wa.me/8801870766945"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-[#0052FF]/10 hover:bg-[#0052FF]/20 text-[#0084FF] rounded-full flex items-center justify-center border border-[#0052FF]/20 shrink-0 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,82,255,0.1)] hover:scale-105"
              >
                <Phone size={18} />
              </a>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Phone</p>
                <a 
                  href="https://wa.me/8801870766945"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white font-extrabold text-sm sm:text-lg block truncate hover:text-[#0084FF] transition-colors"
                >
                  +880 1870 766945
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-5">
              <a 
                href="#contact-form"
                onClick={handleEmailClick}
                className="w-12 h-12 bg-[#0052FF]/10 hover:bg-[#0052FF]/20 text-[#0084FF] rounded-full flex items-center justify-center border border-[#0052FF]/20 shrink-0 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,82,255,0.1)] hover:scale-105"
              >
                <Mail size={18} />
              </a>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email</p>
                <a 
                  href="#contact-form" 
                  onClick={handleEmailClick}
                  className="text-white font-extrabold text-sm sm:text-lg block truncate hover:text-[#0084FF] transition-colors cursor-pointer"
                  title="mdabuhanifsarker91@gmail.com"
                >
                  mdabuhanifsarker91@gmail.com
                </a>
              </div>
            </div>

            {/* Location */}
            <a 
              href="https://maps.app.goo.gl/8md9qCKRhSMkmigKA" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-5 group/location cursor-pointer"
            >
              <div className="w-12 h-12 bg-[#0052FF]/10 group-hover/location:bg-[#0052FF]/20 text-[#0084FF] rounded-full flex items-center justify-center border border-[#0052FF]/20 shrink-0 transition-all shadow-[0_0_15px_rgba(0,82,255,0.1)] group-hover/location:scale-105">
                <MapPin size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover/location:text-[#0084FF] transition-colors">Location</p>
                <p className="text-white font-extrabold text-sm sm:text-lg truncate group-hover/location:text-[#0084FF] transition-colors">Gazipur, Dhaka, Bangladesh</p>
              </div>
            </a>
          </div>

          {/* Abstract Rotating Orbital Sphere Widget matching mockup exactly */}
          <div className="absolute right-4 bottom-24 md:right-8 md:bottom-28 w-44 h-44 pointer-events-none opacity-25 md:opacity-100">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Center glowing blue sphere */}
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#0052FF] to-[#00E5FF] shadow-[0_0_35px_rgba(0,102,255,0.95)] animate-pulse" />
              
              {/* Orbit Ring 1 */}
              <div className="absolute w-32 h-10 rounded-full border border-[#0084FF]/25 transform -rotate-[25deg] animate-[spin_12s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
                {/* Orbiter 1 */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#00E5FF] rounded-full shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
              </div>

              {/* Orbit Ring 2 */}
              <div className="absolute w-36 h-14 rounded-full border border-[#0052FF]/15 transform rotate-[40deg] animate-[spin_18s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
                {/* Orbiter 2 */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0052FF] rounded-full shadow-[0_0_8px_rgba(0,82,255,0.8)]" />
              </div>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Follow me</h4>
            <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
              {[
                { Icon: FaFacebook, url: 'https://www.facebook.com/profile.php?id=61592538396121', color: '#1877F2' },
                { Icon: FaYoutube, url: 'https://www.youtube.com/@Abu_Hanif_Sarker', color: '#FF0000' },
                { Icon: FaInstagram, url: 'https://www.instagram.com/editor_abu.hanif/', color: '#E4405F' },
                { Icon: FaPinterest, url: 'https://www.pinterest.com/mdabuhanifsarker', color: '#BD081C' },
                { Icon: FaLinkedin, url: 'https://www.linkedin.com/in/mdabuhanifsarker/', color: '#0A66C2' },
                { Icon: FaBehance, url: 'https://www.behance.net/mdabuhanifsarker', color: '#0057FF' },
                { Icon: FaGithub, url: 'https://github.com/mdabuhanifsarker', color: '#FFFFFF' },
                { Icon: FaTelegramPlane, url: 'https://t.me/mdabuhanifsarker', color: '#26A5E4' },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -3, scale: 1.1, borderColor: "rgba(0, 102, 255, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-[#040814]/80 border border-[#1E2B43] text-slate-450 hover:text-white transition-all shadow-sm"
                  style={{ color: social.color }}
                >
                  <social.Icon size={14} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form styled identically to mockup */}
        <div id="contact-form" className="bg-[#0C1220] border border-[#1E2B43] p-8 sm:p-10 md:p-12 rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-white tracking-tight leading-none mb-8">
            Mail Me <span className="text-[#0084FF] inline-block animate-pulse font-sans">.</span>
          </h2>
          <form 
            onSubmit={handleEmailSubmit} 
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <input 
                  id="contact-name"
                  name="name" 
                  placeholder="Your Name"
                  required 
                  disabled={isSending}
                  className="w-full h-14 bg-[#040814] border border-[#1E2B43] rounded-xl px-4 focus:outline-none focus:border-[#0084FF] text-white transition-all font-medium disabled:opacity-50 text-sm placeholder-slate-550 focus:shadow-[0_0_15px_rgba(0,102,255,0.15)]" 
                />
              </div>
              <div className="space-y-1.5">
                <input 
                  name="email" 
                  type="email" 
                  placeholder="Email Address"
                  required 
                  disabled={isSending}
                  className="w-full h-14 bg-[#040814] border border-[#1E2B43] rounded-xl px-4 focus:outline-none focus:border-[#0084FF] text-white transition-all font-medium disabled:opacity-50 text-sm placeholder-slate-550 focus:shadow-[0_0_15px_rgba(0,102,255,0.15)]" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <input 
                name="phone" 
                placeholder="Subject (Optional)"
                disabled={isSending}
                className="w-full h-14 bg-[#040814] border border-[#1E2B43] rounded-xl px-4 focus:outline-none focus:border-[#0084FF] text-white transition-all font-medium disabled:opacity-50 text-sm placeholder-slate-550 focus:shadow-[0_0_15px_rgba(0,102,255,0.15)]" 
              />
            </div>

            <div className="space-y-1.5">
              <textarea 
                name="message" 
                placeholder="Your Message"
                required 
                rows={4} 
                disabled={isSending}
                className="w-full bg-[#040814] border border-[#1E2B43] rounded-xl p-4 focus:outline-none focus:border-[#0084FF] text-white resize-none transition-all font-medium disabled:opacity-50 text-sm placeholder-slate-550 focus:shadow-[0_0_15px_rgba(0,102,255,0.15)]" 
              />
            </div>

            <motion.button 
              whileHover={isSending ? {} : { scale: 1.02, y: -2 }}
              whileTap={isSending ? {} : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              type="submit" 
              disabled={isSending}
              className={`w-full h-14 ${isSending ? 'bg-[#1E2B43] cursor-not-allowed text-slate-500' : 'bg-gradient-to-r from-[#0052FF] to-[#0084FF] hover:brightness-110 text-white shadow-[0_10px_30px_rgba(0,82,255,0.3)]'} rounded-xl font-bold uppercase text-xs tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 touch-manipulation cursor-pointer`}
            >
              {isSending ? (
                <>
                  Sending Message...
                  <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-550 border-t-white" />
                </>
              ) : (
                <>
                  <span>Send Message</span> <ArrowRight size={14} />
                </>
              )}
            </motion.button>
          </form>
        </div>

      </div>
    </section>
  );
};

const VideoPlayerWrapper = ({ src, onError, addNotification }: { src: string | Blob, onError: (e: any) => void, addNotification: any }) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (src instanceof Blob) {
      const url = URL.createObjectURL(src);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setObjectUrl(src);
    }
  }, [src]);

  if (!objectUrl) return null;

  // YouTube Embed Support
  if (typeof src === 'string' && (src.includes('youtube.com') || src.includes('youtu.be'))) {
    let videoId = '';
    let isShorts = false;
    const uStr = src;
    if (uStr.includes('v=')) {
      videoId = uStr.split('v=')[1].split('&')[0];
    } else if (uStr.includes('youtu.be/')) {
      videoId = uStr.split('youtu.be/')[1].split('?')[0];
    } else if (uStr.includes('embed/')) {
      videoId = uStr.split('embed/')[1].split('?')[0];
    } else if (uStr.includes('shorts/')) {
      videoId = uStr.split('shorts/')[1].split('?')[0];
      isShorts = true;
    }
    
    if (!videoId) return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 gap-4">
        <AlertCircle size={48} />
        <p className="font-bold">Invalid YouTube URL</p>
      </div>
    );

    return (
      <div className={`w-full ${isShorts ? 'aspect-[9/16] max-h-[85vh]' : 'aspect-video'} bg-black`}>
        <iframe 
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} 
          className="w-full h-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        />
      </div>
    );
  }

  // Google Drive Support
  if (typeof src === 'string' && src.includes('drive.google.com')) {
    const driveEmbed = src.replace('/view', '/preview').replace('/edit', '/preview');
    return (
      <div className="w-full aspect-video bg-black">
        <iframe 
          src={driveEmbed} 
          className="w-full h-full border-none"
          allow="autoplay"
        />
      </div>
    );
  }

  return (
    <video 
      src={objectUrl} 
      className="w-full h-full max-h-[90vh] object-contain"
      controls 
      autoPlay
      playsInline
      onError={onError}
    />
  );
};

const Portfolio = ({ 
  isAdmin, 
  projects, 
  setProjects, 
  groupedProjects,
  selectedCategoryId,
  setSelectedCategoryId,
  categories,
  setCategories,
  addNotification,
  isSaving,
  logoUrl,
  setLogoUrl,
  onSaveLogoUrl,
  activeVideo,
  setActiveVideo,
  bestWorks,
  setBestWorks,
  supabaseStatus,
  onRefreshSupabase
}: { 
  isAdmin: boolean, 
  projects: ProjectItem[], 
  setProjects: React.Dispatch<React.SetStateAction<ProjectItem[]>>,
  groupedProjects: any[],
  selectedCategoryId: string | null,
  setSelectedCategoryId: (id: string | null) => void,
  categories: string[],
  setCategories: React.Dispatch<React.SetStateAction<string[]>>,
  addNotification: (title: string, message: string) => void,
  isSaving: boolean,
  logoUrl: string | null,
  setLogoUrl: (url: string | null) => void,
  onSaveLogoUrl?: (url: string | null) => Promise<void>,
  activeVideo: string | Blob | null,
  setActiveVideo: (url: string | Blob | null) => void,
  bestWorks: string[],
  setBestWorks: React.Dispatch<React.SetStateAction<string[]>>,
  supabaseStatus: any,
  onRefreshSupabase: () => Promise<void>
}) => {
  const activeFolder = groupedProjects.find(f => f.id === selectedCategoryId);

  const renderTwoColorTitle = (text: string) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= 1) {
      return <span className="text-white text-[42px]">{text}</span>;
    }
    const firstWord = words[0];
    const restOfWords = words.slice(1).join(' ');
    return (
      <>
        <span className="text-white text-[42px]">{firstWord}</span> <span className="text-[#4F8CFF] text-[42px]">{restOfWords}</span>
      </>
    );
  };

  // Scroll to upper side when entering/exiting category
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategoryId]);

  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [showManager, setShowManager] = useState(false);
  const [newProject, setNewProject] = useState<{ 
    title: string; 
    category: string; 
    videoUrl: string | Blob; 
    videoFile: File | null;
    img: string;
  }>({ 
    title: '', 
    category: categories[0] || 'PODCAST', 
    videoUrl: '', 
    videoFile: null,
    img: ''
  });

  // Pre-select category if inside a folder when opening manager
  useEffect(() => {
    if (showManager && selectedCategoryId && !editingProject) {
      setNewProject(prev => ({ ...prev, category: selectedCategoryId }));
    }
  }, [showManager, selectedCategoryId, editingProject]);

  // Auto resolve YouTube thumbnail
  useEffect(() => {
    if (newProject.videoUrl && typeof newProject.videoUrl === 'string') {
      const ytid = getYouTubeId(newProject.videoUrl);
      if (ytid) {
        const expectedImg = `https://img.youtube.com/vi/${ytid}/maxresdefault.jpg`;
        setNewProject(prev => prev.img === expectedImg ? prev : { ...prev, img: expectedImg });
      }
    }
  }, [newProject.videoUrl]);

  const [newCatName, setNewCatName] = useState('');
  const [showCatAdder, setShowCatAdder] = useState(false);
  const [viewMode, setViewMode] = useState<'create' | 'list' | 'settings'>('create');

  const addCategory = () => {
    if (newCatName && !categories.includes(newCatName.toUpperCase())) {
      setCategories(prev => [...prev, newCatName.toUpperCase()]);
      setNewProject(prev => ({ ...prev, category: newCatName.toUpperCase() }));
      setNewCatName('');
      setShowCatAdder(false);
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const addProject = async () => {
    if (!newProject.title) return;
    setIsUploading(true);
    
    let finalVideoUrl: string | Blob = newProject.videoUrl;
    let finalImg = newProject.img || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200';

    if (newProject.videoFile) {
      finalVideoUrl = newProject.videoFile;
    }
    
    const project: ProjectItem = {
      id: editingProject ? editingProject.id : Math.random().toString(36).substr(2, 9),
      title: newProject.title,
      category: newProject.category,
      img: finalImg,
      videoUrl: finalVideoUrl,
      type: 'video'
    };

    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === editingProject.id ? project : p));
      addNotification("Project Updated", `"${project.title}" has been saved successfully.`);
    } else {
      setProjects(prev => [project, ...prev]);
      addNotification("Upload Success", `"${project.title}" added to your portfolio.`);
    }

    setIsUploading(false);
    setShowManager(false);
    setEditingProject(null);
    setNewProject({ title: '', category: categories[0] || 'PODCAST', videoUrl: '', videoFile: null, img: '' });
  };

  const removeProject = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const confirmed = window.confirm("Are you sure you want to remove this project?");
    if (confirmed) {
      setProjects(prev => prev.filter(p => p.id !== id));
      return true;
    }
    return false;
  };

  const startEdit = (project: ProjectItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(project);
    setNewProject({
      title: project.title,
      category: project.category,
      videoUrl: project.videoUrl || '',
      videoFile: null,
      img: project.img
    });
    setShowManager(true);
  };

  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const currentVideos = selectedCategoryId ? activeFolder?.subItems || [] : groupedProjects;

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 space-y-12 md:space-y-16 min-h-screen">
      <div className="flex flex-col items-center justify-center text-center gap-6 w-full">
        <div className="space-y-4 flex flex-col items-center justify-center w-full">
          <div className="flex items-center justify-center gap-4">
            {selectedCategoryId && (
                <button 
                onClick={() => setSelectedCategoryId(null)}
                className="p-3 bg-gradient-to-r from-[#0052FF] to-[#0084FF] rounded-full text-white hover:brightness-110 transition-all flex items-center justify-center shadow-lg shadow-[#0052FF]/20 cursor-pointer"
              >
                <ArrowRight size={20} className="rotate-180" />
              </button>
            )}
            <h2 id="creative-showcase-heading" className="text-[42px] font-black text-[#4F8CFF] tracking-tighter text-center flex items-center justify-center gap-2 leading-tight">
              {activeFolder ? (
                renderTwoColorTitle(activeFolder.title)
              ) : (
                <>
                  <span className="text-white text-[42px]">Creative</span> <span className="text-[#4F8CFF] text-[42px]">Showcase</span>
                </>
              )}
            </h2>
          </div>
          <p className="text-slate-500 font-medium tracking-wide text-xs md:text-sm uppercase max-w-xl text-center">
            {activeFolder ? `EXPLORING ${activeFolder.title} COLLECTION` : "A collection of my best film edits, color grading, and visual storytelling."}
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isSaving ? 'text-primary animate-pulse' : 'text-emerald-500'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isSaving ? 'bg-primary' : 'bg-emerald-500'}`} />
              {isSaving ? 'Syncing...' : 'Saved to DB'}
            </div>
            <button 
              onClick={() => setShowManager(true)}
              className="glass-card px-6 py-3 rounded-2xl flex items-center gap-3 text-slate-400 hover:text-primary transition-all text-xs font-black uppercase tracking-widest border border-white/5"
            >
              <Settings size={14} /> Manage Projects
            </button>
          </div>
        )}
      </div>

      {/* Supabase Database Sync Diagnostics Panel */}
      {isAdmin && (
        <div className="glass-card p-6 rounded-[2rem] border border-white/5 bg-black/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full shrink-0 ${
                supabaseStatus.loading 
                  ? 'bg-amber-400 animate-ping' 
                  : supabaseStatus.error 
                    ? 'bg-rose-500' 
                    : supabaseStatus.rowsCount === 0 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
              }`} />
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Supabase Live Connection Status</h4>
                <p className="text-[11px] text-slate-400 font-sans">
                  {supabaseStatus.loading 
                    ? "Querying database..." 
                    : supabaseStatus.error 
                      ? `Issue detected: ${supabaseStatus.error.includes("ZERO rows") ? "Empty Table / RLS Check" : "Connection/API Issue"}` 
                      : `Active. Fetched ${supabaseStatus.rowsCount} records successfully.`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button 
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] uppercase tracking-wider font-black text-slate-300 transition-all border border-white/5"
              >
                {showDiagnostics ? "Hide Details" : "Show Diagnostics"}
              </button>
              <button 
                onClick={onRefreshSupabase}
                disabled={supabaseStatus.loading}
                className={`p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-all border border-primary/20 flex items-center justify-center ${supabaseStatus.loading ? 'animate-spin' : ''}`}
                title="Re-query Supabase Database"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Collapsible details list */}
          {showDiagnostics && (
            <div className="pt-4 border-t border-white/5 space-y-4 text-xs font-mono overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/40 p-4 rounded-2xl space-y-2 border border-white/5">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-sans">Diagnostic Report</span>
                  <div className="space-y-1 text-slate-300">
                    <p>Target URL: <span className="text-[#63e5f1] break-all">{SUPABASE_URL}</span></p>
                    <p>API Key Configured: <span className="text-emerald-400">Yes (Publishable Key)</span></p>
                    <p>Last Attempt: <span className="text-amber-400 font-bold">{supabaseStatus.lastFetched || 'Never'}</span></p>
                    <p>Total Retrieved Rows: <span className="text-white font-black">{supabaseStatus.rowsCount ?? 'N/A'}</span></p>
                  </div>
                </div>
                
                <div className="bg-black/40 p-4 rounded-2xl space-y-2 border border-white/5">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-sans">Policy & Schema Troubleshooting</span>
                  <div className="space-y-1 text-slate-300 font-sans text-[11px] leading-relaxed">
                    <p className="text-slate-400 font-bold">If query returns 0 rows, check that:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>The table is named exactly <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-xs text-primary">PORTFOLIO</code> (case-sensitive)</li>
                      <li>Columns are named exactly: <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-xs">title</code>, <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-xs">category</code>, <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-xs">youtube_url</code>, and optionally <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-xs">cover_image</code></li>
                      <li>Row-Level Security (RLS) is disabled or a public <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-xs">SELECT</code> policy allows public read access.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-sans">Table Resolution Details (Attempts Log)</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-slate-300 border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-500 text-[10px] font-bold uppercase tracking-wider font-sans">
                        <th className="py-2 pr-4">Table Tried</th>
                        <th className="py-2 pr-4">REST API Status</th>
                        <th className="py-2">JS Client SDK Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-[11px]">
                      {supabaseStatus.tableAttempts?.map((attempt: any, i: number) => (
                        <tr key={i} className="hover:bg-white/[0.02]">
                          <td className="py-3 pr-4 font-bold text-[#63e5f1] font-mono">{attempt.tableName}</td>
                          <td className="py-3 pr-4">
                            <div className="space-y-1">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${attempt.restSuccess ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/10' : 'bg-rose-500/20 text-rose-400 border border-rose-500/10'}`}>
                                {attempt.restSuccess ? 'Success' : `HTTP ${attempt.restStatus}`}
                              </span>
                              <p className="text-slate-400 text-[10px] font-mono mt-1 max-w-xs sm:max-w-md truncate" title={attempt.restMessage}>
                                {attempt.restMessage}
                              </p>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="space-y-1">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${attempt.sdkSuccess ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/10' : attempt.sdkError ? 'bg-rose-500/20 text-rose-400 border border-rose-500/10' : 'bg-slate-800 text-slate-400'}`}>
                                {attempt.sdkSuccess ? 'Success' : attempt.sdkError ? 'Error' : 'Not Attempted'}
                              </span>
                              {attempt.sdkError && (
                                <p className="text-rose-400/80 text-[10px] font-mono mt-1 max-w-xs sm:max-w-md truncate" title={attempt.sdkError}>
                                  {attempt.sdkError}
                                </p>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {currentVideos.length === 0 && selectedCategoryId ? (
        <div className="py-32 text-center space-y-8 bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-white/5">
          <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary/30 mx-auto">
            <Play size={48} />
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-black text-white uppercase tracking-tight">Folder is Empty</h3>
            <p className="text-slate-500 max-w-sm mx-auto">This collection doesn't have any videos yet.</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => {
                setNewProject(prev => ({ ...prev, category: selectedCategoryId }));
                setShowManager(true);
                setViewMode('create');
              }}
              className="bg-primary text-black px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/20"
            >
              Upload First Video
            </button>
          )}
        </div>
      ) : (
        <Reorder.Group 
          axis="y"
          values={currentVideos}
          onReorder={(newOrder) => {
            if (!isAdmin) return;
            if (selectedCategoryId) {
              const otherProjects = projects.filter(p => p.category !== selectedCategoryId);
              setProjects([...otherProjects, ...newOrder]);
            } else {
              setCategories(newOrder.map(f => f.id));
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
        >
          <AnimatePresence mode="popLayout">
            {currentVideos.map((project) => (
              <Reorder.Item
                drag={isAdmin}
                value={project}
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => {
                  if (project.type === 'folder') {
                    setSelectedCategoryId(project.id);
                  } else if (project.videoUrl) {
                    setActiveVideo(project.videoUrl);
                  } else {
                    addNotification("No Video", "This project doesn't have an associated video yet.");
                  }
                }}
                className={`glass-card relative group overflow-hidden cursor-pointer rounded-[1.5rem] md:rounded-[2rem] border-white/5 hover:border-primary/30 active:scale-95 transition-all duration-500 ${project.type === 'folder' ? 'aspect-video w-full' : 'min-h-[160px]'}`}
              >
                {project.type === 'folder' ? (
                  <>
                    <motion.img 
                      initial={{ scale: 1.15 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      src={getProjectThumbnail(project)} 
                      className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
                      alt={project.title} 
                    />
                    
                    {/* Video count badge positioned at the bottom right corner */}
                    <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-10 pointer-events-none">
                      <span className="px-3.5 py-1.5 bg-black/70 backdrop-blur-md rounded-full text-[10px] md:text-xs font-bold text-slate-200 border border-white/10 shadow-xl flex items-center gap-1.5">
                        {project.subItems?.length || 0} Video{(project.subItems?.length || 0) === 1 ? '' : 's'}
                      </span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/20">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 backdrop-blur-2xl rounded-full flex items-center justify-center text-primary border border-primary/40 shadow-2xl shadow-primary/20">
                        <Maximize2 size={24} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8 bg-[#09090b]/90 backdrop-blur-md rounded-[1.5rem] md:rounded-[2rem] border border-white/10 hover:border-primary/40 transition-all duration-300">
                    <img 
                      src={getProjectThumbnail(project)} 
                      className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none rounded-[1.5rem] md:rounded-[2rem] filter blur-sm" 
                      alt="" 
                    />

                    {/* Thumbnail Next to Title */}
                    <div className="relative z-10 flex items-center gap-4 sm:gap-6 w-full">
                      <div className="relative shrink-0 w-28 sm:w-36 md:w-44 aspect-video rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black group-hover:border-primary transition-all">
                        <img 
                          src={getProjectThumbnail(project)} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (project.videoUrl && typeof project.videoUrl === 'string') {
                              const ytid = getYouTubeId(project.videoUrl);
                              if (ytid && !target.src.includes('hqdefault')) {
                                target.src = `https://img.youtube.com/vi/${ytid}/hqdefault.jpg`;
                              }
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                          <div className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center shadow-lg">
                            <Play fill="currentColor" size={14} className="ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-primary text-[9px] md:text-[10px] font-black tracking-[0.2em] px-2.5 py-0.5 bg-primary/10 border border-primary/20 rounded-full uppercase">
                            {project.category}
                          </span>
                          {getYouTubeId(typeof project.videoUrl === 'string' ? project.videoUrl : '') && (
                            <span className="text-[#FF0000] text-[9px] font-black tracking-wider px-2 py-0.5 bg-[#FF0000]/10 border border-[#FF0000]/20 rounded-full flex items-center gap-1">
                              <FaYoutube size={11} /> YOUTUBE
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg md:text-2xl font-black text-white leading-snug tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                          {project.title}
                        </h3>
                      </div>
                    </div>

                    <div className="relative z-10 pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400">
                        Click to watch video
                      </span>
                      {project.videoUrl && typeof project.videoUrl === 'string' && (
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(project.videoUrl as string, '_blank');
                          }}
                          className="px-3.5 py-1.5 bg-primary/10 hover:bg-primary hover:text-black rounded-xl text-primary transition-all font-sans text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 pointer-events-auto border border-primary/30 active:scale-95 shadow-md"
                          title="Watch directly on YouTube"
                        >
                          YouTube <ArrowRight size={10} className="-rotate-45" />
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}

      {/* Project Manager Modal */}
      <AnimatePresence>
        {showManager && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowManager(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-xl p-12 space-y-8 relative z-10 rounded-[3rem] bg-[#0d0d0d] border-white/10"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg shadow-primary/20">
                    {viewMode === 'create' ? <Upload size={24} /> : <Settings size={24} />}
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setViewMode('create')}
                      className="text-2xl font-black uppercase tracking-tight text-white"
                    >
                      {editingProject ? 'Edit' : 'Upload'}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {editingProject && viewMode === 'create' && (
                    <button 
                      id="remove-project-btn"
                      onClick={(e) => { 
                        const confirmed = window.confirm("Remove this project permanently?");
                        if(confirmed) {
                          setProjects(prev => prev.filter(p => p.id !== editingProject.id));
                          setShowManager(false); 
                          setEditingProject(null);
                        }
                      }}
                      className="px-5 py-2.5 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] transition-all flex items-center gap-2 border border-red-500/20 active:scale-95"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  )}
                  <button 
                    id="close-manager-btn"
                    onClick={() => { setShowManager(false); setEditingProject(null); setViewMode('create'); }} 
                    className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white hover:rotate-90 transition-all active:scale-90 border border-white/10"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {viewMode === 'create' ? (
                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Project Title</label>
                  <input 
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-primary transition-all text-white"
                    placeholder="e.g. Cinematic Intro"
                    value={newProject.title}
                    onChange={e => setNewProject({...newProject, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</label>
                    <button 
                      onClick={() => setShowCatAdder(!showCatAdder)}
                      className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                    >
                      {showCatAdder ? 'Cancel' : '+ New Category'}
                    </button>
                  </div>
                  
                  {showCatAdder ? (
                    <div className="flex gap-2">
                      <input 
                        className="flex-grow bg-white/5 border border-primary/30 rounded-xl p-3 focus:outline-none text-white text-xs"
                        placeholder="Type category name..."
                        value={newCatName}
                        onChange={e => setNewCatName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addCategory()}
                      />
                      <button 
                         onClick={addCategory}
                         className="bg-primary text-black px-4 rounded-xl text-[10px] font-black uppercase"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <select 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-primary transition-all text-white appearance-none cursor-pointer"
                        value={newProject.category}
                        onChange={e => setNewProject({...newProject, category: e.target.value})}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat} className="bg-[#0d0d0d]">{cat}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Project Thumbnail</label>
                  
                  <label 
                    htmlFor="thumb-upload" 
                    className="flex flex-col items-center justify-center p-8 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl cursor-pointer hover:bg-white/10 hover:border-primary/50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                      <Image size={24} />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Choose from Gallery</span>
                    <input 
                      type="file" 
                      id="thumb-upload" 
                      className="hidden" 
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const base64String = reader.result as string;
                            setNewProject({ ...newProject, img: base64String });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {newProject.img && (
                    <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden border border-white/10 relative group">
                      <img src={newProject.img} className="w-full h-full object-cover opacity-80" alt="Preview" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                         <span className="text-[9px] font-black text-white uppercase tracking-widest">Thumbnail Selected</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6 border-2 border-dashed border-white/10 rounded-[3rem] bg-white/[0.02] space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <label 
                      htmlFor="video-upload" 
                      className="flex-1 flex flex-col items-center gap-4 text-center cursor-pointer group hover:bg-white/5 transition-all p-6 rounded-[2rem]"
                    >
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Upload size={32} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">Import Video File</p>
                        <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">From PC or Gallery</p>
                      </div>
                      <input 
                        type="file" 
                        accept="video/*" 
                        className="hidden" 
                        id="video-upload" 
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewProject({ ...newProject, videoFile: file, videoUrl: '' });
                          }
                        }}
                      />
                    </label>

                    <div className="hidden md:flex items-center text-slate-700 font-bold">OR</div>

                    <div className="flex-1 space-y-2 flex flex-col justify-center">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Video Link (YouTube/Drive)</label>
                      <input 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-primary transition-all text-white text-sm"
                        placeholder="https://youtube.com/watch?v=..."
                        value={typeof newProject.videoUrl === 'string' ? newProject.videoUrl : ''}
                        onChange={e => setNewProject({...newProject, videoUrl: e.target.value, videoFile: null})}
                      />
                    </div>
                  </div>

                  {newProject.videoFile && (
                    <div className="space-y-3 p-4 bg-black/40 rounded-2xl border border-white/5">
                      <div className="aspect-video w-full bg-black rounded-xl overflow-hidden relative border border-white/10">
                        <video 
                          key={URL.createObjectURL(newProject.videoFile)}
                          src={URL.createObjectURL(newProject.videoFile)} 
                          className="w-full h-full object-contain" 
                          controls
                        />
                      </div>
                      <div className="flex justify-between items-center px-1">
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest truncate max-w-[250px]">
                          {newProject.videoFile.name}
                        </p>
                        <button 
                          onClick={() => setNewProject({ ...newProject, videoFile: null })}
                          className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}

                  {newProject.videoUrl && !newProject.videoFile && (
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                        <Play size={20} />
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <p className="text-white font-bold text-xs">Video Link Attached</p>
                        <p className="text-slate-500 text-[10px] truncate">
                          {typeof newProject.videoUrl === 'string' ? newProject.videoUrl : (newProject.videoUrl instanceof Blob ? 'Media File Attached' : '')}
                        </p>
                      </div>
                      <button 
                         onClick={() => setNewProject({...newProject, videoUrl: ''})}
                         className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
                <motion.button 
                  whileHover={!isUploading ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isUploading ? { scale: 0.98 } : {}}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={addProject}
                  disabled={isUploading}
                  className={`w-full py-6 rounded-3xl font-black uppercase text-xs tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 ${isUploading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-primary text-black hover:brightness-110 shadow-primary/20'}`}
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                      Processing Video...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      {editingProject ? 'Save Changes' : 'Confirm & Add to Portfolio'}
                    </>
                  )}
                </motion.button>
              </div>
            ) : viewMode === 'list' ? (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl mb-6 flex justify-between items-center">
                  <p className="text-[11px] font-black text-primary uppercase tracking-widest">
                    Total Assets: {projects.length}
                  </p>
                  <button 
                    onClick={() => {
                      if(window.confirm("Clear all projects? This cannot be undone.")) {
                        setProjects([]);
                        const request = indexedDB.open('PortfolioDB', 4);
                        request.onsuccess = (e: any) => {
                          const db = e.target.result;
                          const tx = db.transaction('projects', 'readwrite');
                          tx.objectStore('projects').clear();
                        };
                      }
                    }}
                    className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                {projects.length === 0 ? (
                  <div className="py-20 text-center space-y-4 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <p className="text-slate-500 text-sm font-medium">Your gallery is empty.</p>
                    <button 
                      onClick={() => setViewMode('create')}
                      className="px-6 py-3 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      Start Uploading
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {projects.map((proj) => (
                      <div key={proj.id} className="glass-card p-4 rounded-3xl flex items-center gap-4 group hover:border-primary/30 transition-all bg-white/[0.02]">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/10">
                          <img src={getProjectThumbnail(proj)} className="w-full h-full object-cover" alt={proj.title} />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-white font-bold text-sm truncate uppercase tracking-tight">{proj.title}</p>
                          <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mt-1">{proj.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { setEditingProject(proj); setViewMode('create'); }}
                            className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all"
                            title="Edit"
                          >
                            <Settings size={16} />
                          </button>
                          <button 
                            onClick={() => removeProject(proj.id)}
                            className="w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Site Identity</label>
                    <p className="text-slate-400 text-xs">Update your professional logo for the header.</p>
                  </div>

                  <div className="flex flex-col items-center gap-6 p-8 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[2rem]">
                    {logoUrl ? (
                      <div className="relative group">
                        <img 
                          src={logoUrl} 
                          alt="Logo Preview" 
                          referrerPolicy="no-referrer"
                          className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-full bg-black border border-white/10" 
                        />
                        <button 
                          onClick={async () => {
                            setLogoUrl(null);
                            addNotification("Logo Removed", "Your site logo has been removed.");
                            if (onSaveLogoUrl) {
                              await onSaveLogoUrl(null);
                            }
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-full flex items-center justify-center text-slate-600 border border-white/5">
                        <Image size={32} />
                      </div>
                    )}

                    <label 
                      htmlFor="logo-upload" 
                      className="bg-primary text-black px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:brightness-110 cursor-pointer shadow-xl shadow-primary/20 transition-all flex items-center gap-2"
                    >
                      <Upload size={14} /> {logoUrl ? 'Change Logo' : 'Upload Logo'}
                      <input 
                        type="file" 
                        id="logo-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              const base64String = reader.result as string;
                              setLogoUrl(base64String);
                              addNotification("Logo Updated", "Your site logo has been changed successfully.");
                              if (onSaveLogoUrl) {
                                await onSaveLogoUrl(base64String);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Best Works Curation */}
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Best Works Curation</label>
                      <p className="text-slate-400 text-xs">Select up to 4 video projects to show in the "Best Works" gallery on the Home page.</p>
                    </div>

                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                      {projects.filter(p => p.type === 'video').length === 0 ? (
                        <p className="text-slate-600 text-xs py-4 text-center border border-white/5 rounded-2xl">
                          No videos available yet. Create some video projects first!
                        </p>
                      ) : (
                        projects.filter(p => p.type === 'video').map((project) => {
                          const isBest = bestWorks.includes(project.id);
                          return (
                            <div 
                              key={project.id} 
                              onClick={() => {
                                if (isBest) {
                                  setBestWorks(bestWorks.filter(id => id !== project.id));
                                } else {
                                  if (bestWorks.length >= 4) {
                                    addNotification("Selection Limit", "You can only select up to 4 Best Works. Deselect another one first.");
                                  } else {
                                    setBestWorks([...bestWorks, project.id]);
                                    addNotification("Pinned", `"${project.title}" was pinned to Best Works!`);
                                  }
                                }
                              }}
                              className={`flex items-center gap-4 p-3 rounded-2xl border transition-all cursor-pointer ${isBest ? 'bg-primary/5 border-primary/30' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                            >
                              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black border border-white/5">
                                <img src={getProjectThumbnail(project)} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-black text-xs truncate uppercase">{project.title}</p>
                                <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{project.category}</p>
                              </div>
                              <div className={`p-2 rounded-xl shrink-0 transition-all ${isBest ? 'text-primary bg-primary/10' : 'text-slate-600 bg-white/5'}`}>
                                <Star size={14} fill={isBest ? "currentColor" : "none"} />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#63e5f1] bg-white/[0.01] p-3 rounded-xl border border-white/5">
                      <span>Selection Status</span>
                      <span>{bestWorks.length} / 4 Selected</span>
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-2xl border-white/5 bg-white/[0.01] space-y-2">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <AlertCircle size={12} /> Optimization Tip
                    </p>
                    <p className="text-slate-500 text-[10px] leading-relaxed">
                      For best results, use a circular or square PNG with a transparent background. 
                      Recommended size: 512x512px.
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      setShowManager(false);
                      addNotification("Settings Saved", "Your site identity and Best Works have been updated.");
                    }}
                    className="w-full bg-primary text-black py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-3"
                  >
                    <CheckCircle2 size={18} /> Confirm & Save Settings
                  </button>
                </div>
              </div>
            )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Player Modal Removed and moved globally to App level */}
    </section>
  );
};

const AIAdvisor = () => {
  const [projectType, setProjectType] = useState('');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const getAdvice = async () => {
    if (!projectType) return;
    setLoading(true);
    const rec = await getTravelRecommendation(projectType);
    setAdvice(rec);
    setLoading(false);
  };

  return (
    <section id="ai-advisor" className="py-24 md:py-32 px-6 md:px-12">
      <div className="glass-card p-8 md:p-12 max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center bg-primary/[0.02]">
        <div className="space-y-6">
          <div className="bg-primary/10 text-primary p-3 rounded-2xl w-fit">
            <Cpu size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">AI Workflow Advisor</h2>
          <p className="text-slate-400 leading-relaxed text-base md:text-lg">
            Tell us about your project, and our trained visual director will recommend the perfect cinematic recipe for your edit.
          </p>
        </div>

        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="e.g., Luxury watch commercial..."
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="w-full bg-[#131313] border border-white/10 rounded-2xl p-6 text-white text-lg focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-600"
          />
          <button 
            onClick={getAdvice}
            disabled={loading}
            className="w-full bg-primary text-black py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-3"
          >
            {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Settings size={20}/></motion.div> : "Generate Strategy"}
          </button>
          
          <AnimatePresence>
            {advice && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#131313] p-8 rounded-2xl border-l-4 border-primary mt-4"
              >
                <p className="italic text-slate-300 leading-relaxed font-medium">"{advice}"</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// --- Main Engine ---

export default function App() {
  const [currentPage, setPageInternal] = useState<Page>('home');

  useEffect(() => {
    // Clear any hash on refresh to always land on the home page as the default
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  const [selectedCategoryId, setSelectedCategoryIdInternal] = useState<string | null>(() => {
    const rawHash = window.location.hash.replace('#', '');
    if (rawHash.startsWith('projects/')) {
      return decodeURIComponent(rawHash.substring('projects/'.length));
    }
    return null;
  });

  const setSelectedCategoryId = (id: string | null) => {
    setSelectedCategoryIdInternal(id);
    if (id) {
      window.location.hash = `projects/${encodeURIComponent(id)}`;
    } else {
      window.location.hash = 'projects';
    }
  };

  const setPage = (newPage: Page) => {
    setPageInternal(newPage);
    setShowAllReviews(false);
    const validPages: Page[] = ['home', 'projects', 'reviews', 'about', 'contact'];
    if (validPages.includes(newPage)) {
      if (newPage === 'home') {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
      } else {
        window.location.hash = newPage;
      }
    }
    if (newPage !== 'projects') {
      setSelectedCategoryIdInternal(null);
    }
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '');
      const hashPage = rawHash.split('/')[0] as Page;
      const validPages: Page[] = ['home', 'projects', 'reviews', 'about', 'contact'];
      const pageToSet = validPages.includes(hashPage) ? hashPage : 'home';
      setPageInternal(pageToSet);
      setShowAllReviews(false);

      if (rawHash.startsWith('projects/')) {
        const cat = decodeURIComponent(rawHash.substring('projects/'.length));
        setSelectedCategoryIdInternal(cat);
      } else {
        setSelectedCategoryIdInternal(null);
      }
      window.scrollTo({ top: 0, behavior: 'instant' as any });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Collect all project categories dynamically based on Supabase table editor inputs
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean);
        }
      } catch (e) {
        // Fallback
      }
    }
    return [];
  });

  // Map category names to their custom cover_image_url from the Supabase 'categories' table
  const [categoryCovers, setCategoryCovers] = useState<Record<string, string>>({});

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [aboutImage, setAboutImage] = useState<string | null>(null);
  const [homeImageUrl, setHomeImageUrl] = useState<string | null>(null);
  const [aboutImageUrl, setAboutImageUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [bestWorks, setBestWorks] = useState<string[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | Blob | null>(null);

  const savedScrollY = useRef<number>(0);
  const pushedModalState = useRef<boolean>(false);

  // Helper to dynamically create/update all platform favicons and OG/Twitter metadata in document <head>
  const updateFaviconInHead = (rawUrl: string, ogUrl?: string) => {
    if (!rawUrl || typeof rawUrl !== 'string') return;
    const cleanUrl = rawUrl.trim();
    if (!cleanUrl) return;

    const cacheBustUrl = cleanUrl.includes('?') 
      ? `${cleanUrl}&v=${Date.now()}`
      : `${cleanUrl}?v=${Date.now()}`;

    // 1. Standard favicons, shortcut icons, and sizes
    const faviconLinks = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
    if (faviconLinks.length > 0) {
      faviconLinks.forEach((link) => {
        link.href = cacheBustUrl;
      });
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = cacheBustUrl;
      document.head.appendChild(newLink);
    }

    // 2. Apple Touch Icon (iOS / Safari)
    const appleLinks = document.querySelectorAll<HTMLLinkElement>("link[rel*='apple-touch-icon']");
    if (appleLinks.length > 0) {
      appleLinks.forEach((link) => {
        link.href = cacheBustUrl;
      });
    } else {
      const newAppleLink = document.createElement('link');
      newAppleLink.rel = 'apple-touch-icon';
      newAppleLink.sizes = '180x180';
      newAppleLink.href = cacheBustUrl;
      document.head.appendChild(newAppleLink);
    }

    // 3. Microsoft / Windows Tile Image
    const msTile = document.querySelector<HTMLMetaElement>("meta[name='msapplication-TileImage']");
    if (msTile) {
      msTile.content = cacheBustUrl;
    } else {
      const newMsMeta = document.createElement('meta');
      newMsMeta.name = 'msapplication-TileImage';
      newMsMeta.content = cacheBustUrl;
      document.head.appendChild(newMsMeta);
    }

    // 4. Open Graph & Twitter Image Meta Tags
    const ogImgToUse = (ogUrl && typeof ogUrl === 'string' && ogUrl.trim() !== '') ? ogUrl.trim() : cleanUrl;
    const cacheBustOg = ogImgToUse.includes('?') ? `${ogImgToUse}&v=${Date.now()}` : `${ogImgToUse}?v=${Date.now()}`;

    const ogImage = document.querySelector<HTMLMetaElement>("meta[property='og:image']");
    if (ogImage) {
      ogImage.content = cacheBustOg;
    } else {
      const newOg = document.createElement('meta');
      newOg.setAttribute('property', 'og:image');
      newOg.content = cacheBustOg;
      document.head.appendChild(newOg);
    }

    const ogSecureImage = document.querySelector<HTMLMetaElement>("meta[property='og:image:secure_url']");
    if (ogSecureImage) {
      ogSecureImage.content = cacheBustOg;
    } else {
      const newOgSec = document.createElement('meta');
      newOgSec.setAttribute('property', 'og:image:secure_url');
      newOgSec.content = cacheBustOg;
      document.head.appendChild(newOgSec);
    }

    const twImage = document.querySelector<HTMLMetaElement>("meta[name='twitter:image']");
    if (twImage) {
      twImage.content = cacheBustOg;
    } else {
      const newTw = document.createElement('meta');
      newTw.name = 'twitter:image';
      newTw.content = cacheBustOg;
      document.head.appendChild(newTw);
    }
  };

  // Handle browser / mobile back button for active video modal
  useEffect(() => {
    if (activeVideo) {
      savedScrollY.current = window.scrollY || document.documentElement.scrollTop || 0;
      window.history.pushState({ modalType: 'videoModal' }, '');
      pushedModalState.current = true;

      const handlePopState = () => {
        if (pushedModalState.current) {
          pushedModalState.current = false;
          setActiveVideo(null);
          const restoreY = savedScrollY.current;
          setTimeout(() => {
            window.scrollTo({ top: restoreY, behavior: 'instant' as any });
          }, 10);
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [activeVideo]);

  const handleCloseVideoModal = () => {
    if (pushedModalState.current) {
      pushedModalState.current = false;
      window.history.back();
    }
    setActiveVideo(null);
    const restoreY = savedScrollY.current;
    setTimeout(() => {
      window.scrollTo({ top: restoreY, behavior: 'instant' as any });
    }, 10);
  };
  const [siteSettings, setSiteSettings] = useState<{
    clients: string | number;
    projects: string | number;
    income: string | number;
  }>({
    clients: 5,
    projects: 50,
    income: 200
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const [supabaseStatus, setSupabaseStatus] = useState<{
    loading: boolean;
    error: string | null;
    rowsCount: number | null;
    lastFetched: string | null;
    tableAttempts: Array<{
      tableName: string;
      restSuccess: boolean;
      restStatus: number | string;
      restMessage: string;
      sdkSuccess: boolean;
      sdkError: string;
    }>;
  }>({
    loading: false,
    error: null,
    rowsCount: null,
    lastFetched: null,
    tableAttempts: []
  });

  // Helper to fetch categories table from Supabase
  const fetchSupabaseCategoriesTable = async () => {
    const catNames: string[] = [];
    const coversMap: Record<string, string> = {};
    let catRows: any[] = [];

    const tablesToTry = ['categories', 'CATEGORIES', 'Categories'];
    for (const tableName of tablesToTry) {
      if (catRows.length > 0) break;
      try {
        const restUrl = `${SUPABASE_URL}/rest/v1/${tableName}?select=*`;
        const res = await fetch(restUrl, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.ok) {
          const text = await res.text();
          if (text) {
            catRows = JSON.parse(text);
            console.log(`[Supabase Sync] Loaded ${catRows.length} category rows from REST API (${tableName})`);
          }
        }
      } catch (err) {
        console.warn(`[Supabase Categories] REST fetch failed for ${tableName}:`, err);
      }

      if (catRows.length === 0) {
        try {
          const { data, error } = await supabaseClient.from(tableName).select('*');
          if (!error && data && data.length > 0) {
            catRows = data;
            console.log(`[Supabase Sync] Loaded ${catRows.length} category rows from SDK client (${tableName})`);
          }
        } catch (err) {
          console.warn(`[Supabase Categories] SDK fetch failed for ${tableName}:`, err);
        }
      }
    }

    if (catRows && catRows.length > 0) {
      catRows.forEach((row: any) => {
        const name = getCaseInsensitiveProp(row, 'name') ||
                     getCaseInsensitiveProp(row, 'title') ||
                     getCaseInsensitiveProp(row, 'category_name') ||
                     getCaseInsensitiveProp(row, 'category') || '';

        const coverUrl = getCaseInsensitiveProp(row, 'cover_image_url') ||
                         getCaseInsensitiveProp(row, 'cover_image') ||
                         getCaseInsensitiveProp(row, 'image_url') ||
                         getCaseInsensitiveProp(row, 'cover') ||
                         getCaseInsensitiveProp(row, 'img') ||
                         getCaseInsensitiveProp(row, 'image') || '';

        if (name && typeof name === 'string' && name.trim()) {
          const cleanName = name.trim();
          catNames.push(cleanName);
          if (coverUrl && typeof coverUrl === 'string' && coverUrl.trim()) {
            coversMap[cleanName.toUpperCase()] = coverUrl.trim();
            coversMap[cleanName] = coverUrl.trim();
          }
        }
      });
    }

    return { catNames, coversMap };
  };

  // Function to fetch from Supabase dynamically
  const fetchSupabasePortfolio = async () => {
    console.log("[Supabase Sync] Fetching dynamic portfolio data...");
    setSupabaseStatus(prev => ({ ...prev, loading: true, error: null }));
    
    // 0. Fetch Categories Table
    const { catNames: categoryTableNames, coversMap: categoryTableCovers } = await fetchSupabaseCategoriesTable();
    setCategoryCovers(categoryTableCovers);

    let sbRows: any[] = [];
    let loadedSuccessfully = false;
    const tableAttempts: any[] = [];

    // Use the exact 'PORTFOLIO' table name as requested
    const tablesToTry = ['PORTFOLIO'];

    for (const tableName of tablesToTry) {
      if (loadedSuccessfully) break;
      let restSuccess = false;
      let restStatus: number | string = "N/A";
      let restMessage = "";
      let sdkSuccess = false;
      let sdkError = "";

      // 1. Try REST API
      try {
        const restUrl = `${SUPABASE_URL}/rest/v1/${tableName}?select=*`;
        console.log(`[Supabase Sync] Querying REST API for table: ${tableName}`);
        const response = await fetch(restUrl, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        restStatus = response.status;
        if (response.ok) {
          const textData = await response.text();
          restMessage = textData ? `HTTP 200: Successfully parsed.` : "Empty Body";
          if (textData) {
            try {
              sbRows = JSON.parse(textData);
              console.log(`[Supabase Sync] Successfully loaded ${sbRows.length} rows from REST API (${tableName})`);
              restSuccess = true;
              loadedSuccessfully = true;
            } catch (err: any) {
              restMessage = `JSON parse failed: ${err.message}`;
              console.warn(`[Supabase Sync] JSON parse failed for REST table '${tableName}':`, err);
            }
          } else {
            restSuccess = true;
            loadedSuccessfully = true;
            sbRows = [];
          }
        } else {
          const errText = await response.text();
          restMessage = `HTTP ${response.status}: ${errText}`;
          console.warn(`[Supabase Sync] REST API HTTP error for table '${tableName}':`, response.status, errText);
        }
      } catch (err: any) {
        restMessage = `Network fetch failed: ${err.message}`;
        console.warn(`[Supabase Sync] REST API fetch failed for table '${tableName}':`, err);
      }

      // 2. If REST failed, try SDK Client
      if (!loadedSuccessfully) {
        try {
          console.log(`[Supabase Sync] Falling back to JS Client SDK for table: ${tableName}`);
          const { data, error } = await supabaseClient
            .from(tableName)
            .select('*');
          
          if (!error && data) {
            sbRows = data;
            sdkSuccess = true;
            loadedSuccessfully = true;
            console.log(`[Supabase Sync] Successfully loaded ${sbRows.length} rows from SDK client (${tableName})`);
          } else if (error) {
            sdkError = `[${error.code}] ${error.message} (Details: ${error.details || 'none'}, Hint: ${error.hint || 'none'})`;
            console.warn(`[Supabase Sync] SDK client error for table '${tableName}':`, error);
          }
        } catch (err: any) {
          sdkError = `Exception: ${err.message}`;
          console.warn(`[Supabase Sync] SDK client exception for table '${tableName}':`, err);
        }
      }

      tableAttempts.push({
        tableName,
        restSuccess,
        restStatus,
        restMessage,
        sdkSuccess,
        sdkError
      });
    }

    let errorSummary: string | null = null;
    if (!loadedSuccessfully) {
      const firstAttempt = tableAttempts[0];
      errorSummary = `Failed to query tables. Table '${firstAttempt?.tableName}' REST status: ${firstAttempt?.restStatus}. SDK error: ${firstAttempt?.sdkError || 'N/A'}`;
    } else if (sbRows.length === 0) {
      errorSummary = "Query succeeded but returned ZERO rows. If you have rows in the table, please check your Row-Level Security (RLS) policy on Supabase and make sure a SELECT policy allows public read access.";
    }

    setSupabaseStatus({
      loading: false,
      error: errorSummary,
      rowsCount: loadedSuccessfully ? sbRows.length : null,
      lastFetched: new Date().toLocaleTimeString(),
      tableAttempts
    });

    console.group("%c[Supabase Sync Diagnostic]", "color: #63e5f1; font-weight: bold; font-size: 14px;");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Successfully Loaded?:", loadedSuccessfully);
    console.log("Rows Fetched:", sbRows.length);
    console.log("Rows Data:", sbRows);
    if (errorSummary) {
      console.warn("Status/Error Summary:", errorSummary);
    }
    console.log("Full Table Query Attempts Summary:");
    console.table(tableAttempts);
    console.groupEnd();

    if (loadedSuccessfully) {
      console.log(`[Supabase Sync] Raw rows fetched from Supabase:`, sbRows);
      const mappedProjects: ProjectItem[] = sbRows.map((row: any, idx: number) => {
        const title = getCaseInsensitiveProp(row, 'title') || getCaseInsensitiveProp(row, 'name') || 'Untitled Video';
        const link = getCaseInsensitiveProp(row, 'youtube_url') || 
                     getCaseInsensitiveProp(row, 'youtube') || 
                     getCaseInsensitiveProp(row, 'video_url') || 
                     getCaseInsensitiveProp(row, 'url') || 
                     getCaseInsensitiveProp(row, 'link') || '';
        const rawCategory = getCaseInsensitiveProp(row, 'category') || 
                            getCaseInsensitiveProp(row, 'folder') || 
                            getCaseInsensitiveProp(row, 'folder_name') || 'General';
        const normalizedCategory = rawCategory.toString().trim();

        const ytid = getYouTubeId(link);
        const explicitCover = getCaseInsensitiveProp(row, 'cover_image') || 
                              getCaseInsensitiveProp(row, 'thumbnail') || 
                              getCaseInsensitiveProp(row, 'img');

        const thumb = (explicitCover && typeof explicitCover === 'string' && explicitCover.trim() !== '')
          ? explicitCover.trim()
          : (ytid 
              ? `https://img.youtube.com/vi/${ytid}/hqdefault.jpg`
              : "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800");

        const createdAt = getCaseInsensitiveProp(row, 'created_at') || 
                          getCaseInsensitiveProp(row, 'createdat') || 
                          getCaseInsensitiveProp(row, 'created_time') || 
                          getCaseInsensitiveProp(row, 'uploaded_at') || 
                          getCaseInsensitiveProp(row, 'date') || 
                          row.id || idx;

        return {
          id: `sb-${row.id || idx}`,
          title: title,
          category: normalizedCategory,
          img: thumb,
          videoUrl: link,
          type: 'video' as const,
          createdAt: createdAt
        };
      });

      // Extract unique categories combining 'categories' table entries and 'PORTFOLIO' table entries
      const dbCategories: string[] = [];
      const seen = new Set<string>();

      // 1. Add categories explicitly defined in 'categories' table first
      categoryTableNames.forEach(cat => {
        if (cat && cat.trim()) {
          const upper = cat.trim().toUpperCase();
          if (!seen.has(upper)) {
            seen.add(upper);
            dbCategories.push(cat.trim());
          }
        }
      });

      // 2. Add any additional categories found in 'PORTFOLIO' rows
      mappedProjects.forEach(p => {
        const cat = p.category;
        if (cat && cat.trim()) {
          const upper = cat.trim().toUpperCase();
          if (!seen.has(upper)) {
            seen.add(upper);
            dbCategories.push(cat.trim());
          }
        }
      });

      console.log("[Supabase Sync] Dynamically loaded categories based on Supabase tables:", dbCategories);
      setCategories(dbCategories);
      setProjects(mappedProjects);
    }

    // Fetch site_settings from Supabase independently
    await fetchSupabaseSettings();
    // Fetch site_assets from Supabase independently
    await fetchSupabaseAssets();
  };

  // Function to fetch site_settings from Supabase
  const fetchSupabaseSettings = async () => {
    const maskedKey = SUPABASE_KEY ? `${SUPABASE_KEY.substring(0, 8)}...${SUPABASE_KEY.substring(SUPABASE_KEY.length - 8)}` : "Missing";
    console.log(`[Supabase Settings] Initiating fetch for 'site_settings'. URL: ${SUPABASE_URL}, Publishable Key: ${maskedKey}`);
    
    let fetchedRow: any = null;
    let errorDetails: string[] = [];

    // Helper to get properties case-insensitively
    const getCaseInsensitiveProp = (obj: any, keyName: string) => {
      if (!obj) return undefined;
      const lowerKey = keyName.toLowerCase();
      for (const k of Object.keys(obj)) {
        if (k.toLowerCase() === lowerKey) {
          return obj[k];
        }
      }
      return undefined;
    };

    // Attempt 1: JS Client SDK
    try {
      console.log("[Supabase Settings] Attempt 1: Querying via JS Client SDK from table 'site_settings' (select *)...");
      const { data, error } = await supabaseClient
        .from('site_settings')
        .select('*');

      if (error) {
        const errMsg = `SDK Error: [${error.code}] ${error.message} (Details: ${error.details || 'none'}, Hint: ${error.hint || 'none'})`;
        console.error("[Supabase Settings Error] SDK fetch encountered an error:", errMsg);
        errorDetails.push(errMsg);
      } else if (data && data.length > 0) {
        console.log("[Supabase Settings Success] site_settings loaded via SDK:", data[0]);
        fetchedRow = data[0];
      } else {
        const noRowMsg = "SDK query returned 200 OK but the returned array was empty (0 rows found in 'site_settings').";
        console.warn("[Supabase Settings Warning] SDK returned empty array:", noRowMsg);
        errorDetails.push(noRowMsg);
      }
    } catch (err: any) {
      const excMsg = `SDK Exception: ${err.message || err}`;
      console.error("[Supabase Settings Error] SDK fetch threw an exception:", excMsg);
      errorDetails.push(excMsg);
    }

    // Attempt 2: REST API fallback (if Attempt 1 didn't yield a row)
    if (!fetchedRow) {
      try {
        const restUrl = `${SUPABASE_URL}/rest/v1/site_settings?select=*`;
        console.log(`[Supabase Settings] Attempt 2: Querying via fallback REST API: ${restUrl}`);
        
        const response = await fetch(restUrl, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const text = await response.text();
          if (text) {
            const parsed = JSON.parse(text);
            if (parsed && parsed.length > 0) {
              console.log("[Supabase Settings Success] site_settings loaded via REST fallback:", parsed[0]);
              fetchedRow = parsed[0];
            } else {
              const noRowMsg = "REST fallback query returned HTTP 200 but the array was empty (0 rows found in 'site_settings').";
              console.warn("[Supabase Settings Warning] REST fallback returned empty array:", noRowMsg);
              errorDetails.push(noRowMsg);
            }
          } else {
            const emptyBodyMsg = "REST fallback returned HTTP 200 but with an empty body.";
            console.warn("[Supabase Settings Warning] REST fallback returned empty body:", emptyBodyMsg);
            errorDetails.push(emptyBodyMsg);
          }
        } else {
          const errText = await response.text();
          const restErrorMsg = `REST fallback HTTP Error ${response.status} (${response.statusText}): ${errText}`;
          console.error("[Supabase Settings Error] REST fallback fetch failed:", restErrorMsg);
          errorDetails.push(restErrorMsg);
        }
      } catch (err: any) {
        const excMsg = `REST Exception: ${err.message || err}`;
        console.error("[Supabase Settings Error] REST fallback fetch threw an exception:", excMsg);
        errorDetails.push(excMsg);
      }
    }

    // Apply fetched values or print final error logs
    if (fetchedRow) {
      const clientsVal = getCaseInsensitiveProp(fetchedRow, 'clients');
      const projectsVal = getCaseInsensitiveProp(fetchedRow, 'projects');
      const incomeVal = getCaseInsensitiveProp(fetchedRow, 'income');
      const faviconVal = getCaseInsensitiveProp(fetchedRow, 'favicon_url') ||
                         getCaseInsensitiveProp(fetchedRow, 'favicon') ||
                         getCaseInsensitiveProp(fetchedRow, 'favicon_link') ||
                         getCaseInsensitiveProp(fetchedRow, 'icon_url');
      const ogVal = getCaseInsensitiveProp(fetchedRow, 'og_image') ||
                    getCaseInsensitiveProp(fetchedRow, 'og_image_url') ||
                    getCaseInsensitiveProp(fetchedRow, 'twitter_image');
      const logoVal = getCaseInsensitiveProp(fetchedRow, 'logo_url') ||
                      getCaseInsensitiveProp(fetchedRow, 'logo');
      const homeVal = getCaseInsensitiveProp(fetchedRow, 'home_image_url') ||
                      getCaseInsensitiveProp(fetchedRow, 'home_image');
      const aboutVal = getCaseInsensitiveProp(fetchedRow, 'about_image_url') ||
                       getCaseInsensitiveProp(fetchedRow, 'about_image');

      console.log("[Supabase Settings] Extracted case-insensitive values:", { clientsVal, projectsVal, incomeVal, faviconVal, ogVal, logoVal });

      const favToUse = faviconVal || logoVal || homeVal;
      if (favToUse && typeof favToUse === 'string' && favToUse.trim() !== '') {
        console.log("[Supabase Settings Success] Updating document head assets:", favToUse.trim());
        updateFaviconInHead(favToUse.trim(), ogVal || logoVal || homeVal);
      }

      if (logoVal && typeof logoVal === 'string' && logoVal.trim() !== '') {
        setLogoUrl(logoVal.trim());
      }
      if (homeVal && typeof homeVal === 'string' && homeVal.trim() !== '') {
        setHomeImageUrl(homeVal.trim());
      }
      if (aboutVal && typeof aboutVal === 'string' && aboutVal.trim() !== '') {
        setAboutImageUrl(aboutVal.trim());
        setAboutImage(aboutVal.trim());
      }

      setSiteSettings({
        clients: clientsVal !== undefined && clientsVal !== null ? clientsVal : 5,
        projects: projectsVal !== undefined && projectsVal !== null ? projectsVal : 50,
        income: incomeVal !== undefined && incomeVal !== null ? incomeVal : 200
      });
    } else {
      console.error(
        "[Supabase Settings Error] Failed to retrieve any rows from 'site_settings' table. " +
        "This is likely due to either an empty table or active Row-Level Security (RLS) policies blocking read access. " +
        "Please ensure there is at least one row in the 'site_settings' table and that RLS is disabled or has a policy allowing SELECT for anon roles.\n" +
        "Errors logged during attempts:\n" + 
        errorDetails.map((msg, i) => `  ${i + 1}. ${msg}`).join("\n")
      );
    }
  };

  // Function to fetch site_assets from Supabase
  const fetchSupabaseAssets = async () => {
    const maskedKey = SUPABASE_KEY ? `${SUPABASE_KEY.substring(0, 8)}...${SUPABASE_KEY.substring(SUPABASE_KEY.length - 8)}` : "Missing";
    console.log(`[Supabase Assets] Initiating fetch for 'site_assets'. URL: ${SUPABASE_URL}, Publishable Key: ${maskedKey}`);
    
    let fetchedRow: any = null;
    let errorDetails: string[] = [];

    const getCaseInsensitiveProp = (obj: any, keyName: string) => {
      if (!obj) return undefined;
      const lowerKey = keyName.toLowerCase();
      for (const k of Object.keys(obj)) {
        if (k.toLowerCase() === lowerKey) {
          return obj[k];
        }
      }
      return undefined;
    };

    // Attempt 1: JS Client SDK (try ordering first, fallback if fails)
    try {
      console.log("[Supabase Assets] Attempt 1: Querying via JS Client SDK from table 'site_assets'...");
      
      // Try fetching latest row sorted by id descending
      let queryResult = await supabaseClient
        .from('site_assets')
        .select('*')
        .order('id', { ascending: false });

      if (queryResult.error) {
        console.warn("[Supabase Assets] SDK order by 'id' failed, trying order by 'created_at' desc...");
        queryResult = await supabaseClient
          .from('site_assets')
          .select('*')
          .order('created_at', { ascending: false });
      }

      if (queryResult.error) {
        console.warn("[Supabase Assets] SDK order by 'created_at' failed, querying without order...");
        queryResult = await supabaseClient
          .from('site_assets')
          .select('*');
      }

      const { data, error } = queryResult;

      if (error) {
        const errMsg = `SDK Error: [${error.code}] ${error.message} (Details: ${error.details || 'none'}, Hint: ${error.hint || 'none'})`;
        console.error("[Supabase Assets Error] SDK fetch encountered an error:", errMsg);
        errorDetails.push(errMsg);
      } else if (data && data.length > 0) {
        console.log(`[Supabase Assets Success] site_assets loaded via SDK (${data.length} rows found, using row index 0):`, data[0]);
        fetchedRow = data[0];
      } else {
        const noRowMsg = "SDK query returned 200 OK but the returned array was empty (0 rows found in 'site_assets').";
        console.warn("[Supabase Assets Warning] SDK returned empty array:", noRowMsg);
        errorDetails.push(noRowMsg);
      }
    } catch (err: any) {
      const excMsg = `SDK Exception: ${err.message || err}`;
      console.error("[Supabase Assets Error] SDK fetch threw an exception:", excMsg);
      errorDetails.push(excMsg);
    }

    // Attempt 2: REST API fallback (if Attempt 1 didn't yield a row)
    if (!fetchedRow) {
      try {
        let restUrl = `${SUPABASE_URL}/rest/v1/site_assets?select=*&order=id.desc`;
        console.log(`[Supabase Assets] Attempt 2: Querying via fallback REST API (id desc): ${restUrl}`);
        
        let response = await fetch(restUrl, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          restUrl = `${SUPABASE_URL}/rest/v1/site_assets?select=*&order=created_at.desc`;
          console.log(`[Supabase Assets] REST fallback id order failed, trying created_at desc: ${restUrl}`);
          response = await fetch(restUrl, {
            method: 'GET',
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`,
              'Content-Type': 'application/json'
            }
          });
        }

        if (!response.ok) {
          restUrl = `${SUPABASE_URL}/rest/v1/site_assets?select=*`;
          console.log(`[Supabase Assets] REST fallback created_at order failed, trying default select: ${restUrl}`);
          response = await fetch(restUrl, {
            method: 'GET',
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`,
              'Content-Type': 'application/json'
            }
          });
        }

        if (response.ok) {
          const text = await response.text();
          if (text) {
            const parsed = JSON.parse(text);
            if (parsed && parsed.length > 0) {
              console.log("[Supabase Assets Success] site_assets loaded via REST fallback:", parsed[0]);
              fetchedRow = parsed[0];
            } else {
              const noRowMsg = "REST fallback query returned HTTP 200 but the array was empty (0 rows found in 'site_assets').";
              console.warn("[Supabase Assets Warning] REST fallback returned empty array:", noRowMsg);
              errorDetails.push(noRowMsg);
            }
          } else {
            const emptyBodyMsg = "REST fallback returned HTTP 200 but with an empty body.";
            console.warn("[Supabase Assets Warning] REST fallback returned empty body:", emptyBodyMsg);
            errorDetails.push(emptyBodyMsg);
          }
        } else {
          const errText = await response.text();
          const restErrorMsg = `REST fallback HTTP Error ${response.status} (${response.statusText}): ${errText}`;
          console.error("[Supabase Assets Error] REST fallback fetch failed:", restErrorMsg);
          errorDetails.push(restErrorMsg);
        }
      } catch (err: any) {
        const excMsg = `REST Exception: ${err.message || err}`;
        console.error("[Supabase Assets Error] REST fallback fetch threw an exception:", excMsg);
        errorDetails.push(excMsg);
      }
    }

    // Apply fetched values or print final error logs
    if (fetchedRow) {
      const logoVal = getCaseInsensitiveProp(fetchedRow, 'logo_url') ||
                      getCaseInsensitiveProp(fetchedRow, 'logo');
      const homeVal = getCaseInsensitiveProp(fetchedRow, 'home_image_url') ||
                      getCaseInsensitiveProp(fetchedRow, 'home_image') ||
                      getCaseInsensitiveProp(fetchedRow, 'homepage_image');
      const aboutVal = getCaseInsensitiveProp(fetchedRow, 'about_image_url') ||
                       getCaseInsensitiveProp(fetchedRow, 'about_image') ||
                       getCaseInsensitiveProp(fetchedRow, 'profile_image');
      const cvVal = getCaseInsensitiveProp(fetchedRow, 'CV') ||
                    getCaseInsensitiveProp(fetchedRow, 'cv') ||
                    getCaseInsensitiveProp(fetchedRow, 'cv_url') ||
                    getCaseInsensitiveProp(fetchedRow, 'resume_url') ||
                    getCaseInsensitiveProp(fetchedRow, 'pdf_url');
      const faviconVal = getCaseInsensitiveProp(fetchedRow, 'favicon_url') ||
                         getCaseInsensitiveProp(fetchedRow, 'favicon') ||
                         getCaseInsensitiveProp(fetchedRow, 'favicon_link') ||
                         getCaseInsensitiveProp(fetchedRow, 'icon_url');
      const ogVal = getCaseInsensitiveProp(fetchedRow, 'og_image') ||
                    getCaseInsensitiveProp(fetchedRow, 'og_image_url') ||
                    getCaseInsensitiveProp(fetchedRow, 'twitter_image');

      console.log("[Supabase Assets] Extracted case-insensitive values:", { logoVal, homeVal, aboutVal, cvVal, faviconVal, ogVal });

      const favToUse = faviconVal || logoVal || homeVal;
      if (favToUse && typeof favToUse === 'string' && favToUse.trim() !== '') {
        console.log("[Supabase Assets Success] Updating document head assets:", favToUse.trim());
        updateFaviconInHead(favToUse.trim(), ogVal || logoVal || homeVal);
      }

      if (logoVal && logoVal.trim() !== "") {
        console.log("[Supabase Assets Success] Fetched latest logo_url from Supabase site_assets:", logoVal.trim());
        setLogoUrl(logoVal.trim());
      } else {
        console.warn("[Supabase Assets Warning] logo_url is empty or missing in the site_assets table row.");
      }
      if (cvVal && cvVal.trim() !== "") {
        console.log("[Supabase Assets Success] Fetched latest CV from Supabase site_assets:", cvVal.trim());
        setCvUrl(cvVal.trim());
      }
      if (homeVal && homeVal.trim() !== "") {
        setHomeImageUrl(homeVal.trim());
      }
      if (aboutVal && aboutVal.trim() !== "") {
        setAboutImageUrl(aboutVal.trim());
        setAboutImage(aboutVal.trim()); // Keep aboutImage in sync
      }
    } else {
      console.error(
        "[Supabase Assets Error] Failed to retrieve any rows from 'site_assets' table. " +
        "Please ensure there is at least one row in the 'site_assets' table and that RLS is disabled or has a policy allowing SELECT for anon roles.\n" +
        "Errors logged during attempts:\n" + 
        errorDetails.map((msg, i) => `  ${i + 1}. ${msg}`).join("\n")
      );
    }
  };

  // Function to save/update site_assets in Supabase (written specifically to fix the logo sync bug)
  const saveSupabaseAssets = async (newLogoUrl: string | null) => {
    console.log("[Supabase Assets Save] Initiating update...", { newLogoUrl });
    
    let success = false;
    
    // Attempt 1: JS Client SDK
    try {
      // First fetch rows to see if we have an existing row to update
      const { data, error } = await supabaseClient
        .from('site_assets')
        .select('*');
        
      if (!error && data && data.length > 0) {
        // A row exists. Let's find any column that behaves as an ID or primary key
        const row = data[0];
        const idKey = Object.keys(row).find(k => k.toLowerCase() === 'id');
        const idVal = idKey ? row[idKey] : null;
        
        let updateQuery;
        if (idVal !== null && idVal !== undefined) {
          updateQuery = supabaseClient
            .from('site_assets')
            .update({ logo_url: newLogoUrl })
            .eq(idKey!, idVal);
        } else {
          // If no id column exists, update all rows
          updateQuery = supabaseClient
            .from('site_assets')
            .update({ logo_url: newLogoUrl });
        }
        
        const { error: updateErr } = await updateQuery;
        if (updateErr) {
          console.error("[Supabase Assets Save Error] SDK update failed:", updateErr);
        } else {
          console.log("[Supabase Assets Save Success] SDK update completed.");
          success = true;
        }
      } else if (!error) {
        // Table is empty, insert a new row
        const { error: insertErr } = await supabaseClient
          .from('site_assets')
          .insert([{ logo_url: newLogoUrl }]);
          
        if (insertErr) {
          console.error("[Supabase Assets Save Error] SDK insert failed:", insertErr);
        } else {
          console.log("[Supabase Assets Save Success] SDK insert completed.");
          success = true;
        }
      } else {
        console.error("[Supabase Assets Save Error] SDK select check failed:", error);
      }
    } catch (err) {
      console.error("[Supabase Assets Save Exception] SDK execution error:", err);
    }

    // Attempt 2: REST fallback (if SDK attempt failed)
    if (!success) {
      try {
        console.log("[Supabase Assets Save] Attempting REST API fallback...");
        // Fetch to see if row exists
        const restGetUrl = `${SUPABASE_URL}/rest/v1/site_assets?select=*`;
        const getResponse = await fetch(restGetUrl, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (getResponse.ok) {
          const text = await getResponse.text();
          const rows = text ? JSON.parse(text) : [];
          
          if (rows && rows.length > 0) {
            const row = rows[0];
            const idKey = Object.keys(row).find(k => k.toLowerCase() === 'id');
            const idVal = idKey ? row[idKey] : null;
            
            const restPatchUrl = (idVal !== null && idVal !== undefined)
              ? `${SUPABASE_URL}/rest/v1/site_assets?${idKey}=eq.${idVal}`
              : `${SUPABASE_URL}/rest/v1/site_assets`;
              
            console.log(`[Supabase Assets Save] REST Patch: ${restPatchUrl}`);
            const patchResponse = await fetch(restPatchUrl, {
              method: 'PATCH',
              headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ logo_url: newLogoUrl })
            });
            
            if (patchResponse.ok) {
              console.log("[Supabase Assets Save Success] REST fallback PATCH completed.");
              success = true;
            } else {
              const errText = await patchResponse.text();
              console.error("[Supabase Assets Save Error] REST fallback PATCH failed:", patchResponse.status, errText);
            }
          } else {
            // Table is empty, insert a row
            const restPostUrl = `${SUPABASE_URL}/rest/v1/site_assets`;
            console.log(`[Supabase Assets Save] REST Post: ${restPostUrl}`);
            const postResponse = await fetch(restPostUrl, {
              method: 'POST',
              headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
              },
              body: JSON.stringify({ logo_url: newLogoUrl })
            });
            
            if (postResponse.ok) {
              console.log("[Supabase Assets Save Success] REST fallback POST completed.");
              success = true;
            } else {
              const errText = await postResponse.text();
              console.error("[Supabase Assets Save Error] REST fallback POST failed:", postResponse.status, errText);
            }
          }
        } else {
          const errText = await getResponse.text();
          console.error("[Supabase Assets Save Error] REST check failed:", getResponse.status, errText);
        }
      } catch (err) {
        console.error("[Supabase Assets Save Exception] REST fallback execution error:", err);
      }
    }
  };

  // Function to fetch reviews from Supabase dynamically
  const fetchSupabaseReviews = async () => {
    console.log("[Supabase Reviews] Initiating fetch for 'reviews' table...");
    
    let fetchedRows: any[] = [];
    let errorDetails: string[] = [];

    // Helper to get properties case-insensitively
    const getCaseInsensitiveProp = (obj: any, keyName: string) => {
      if (!obj) return undefined;
      const lowerKey = keyName.toLowerCase();
      for (const k of Object.keys(obj)) {
        if (k.toLowerCase() === lowerKey) {
          return obj[k];
        }
      }
      return undefined;
    };

    // Attempt 1: JS Client SDK
    try {
      console.log("[Supabase Reviews] Attempt 1: Querying via JS Client SDK from table 'reviews' sorted by created_at desc...");
      const { data, error } = await supabaseClient
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        const errMsg = `SDK Error: [${error.code}] ${error.message} (Details: ${error.details || 'none'}, Hint: ${error.hint || 'none'})`;
        console.error("[Supabase Reviews Error] SDK fetch encountered an error:", errMsg);
        errorDetails.push(errMsg);
      } else if (data) {
        console.log(`[Supabase Reviews Success] ${data.length} reviews loaded via SDK`);
        fetchedRows = data;
      }
    } catch (err: any) {
      const excMsg = `SDK Exception: ${err.message || err}`;
      console.error("[Supabase Reviews Error] SDK fetch threw an exception:", excMsg);
      errorDetails.push(excMsg);
    }

    // Attempt 2: REST API fallback (if Attempt 1 didn't yield any row or failed)
    if (fetchedRows.length === 0) {
      try {
        const restUrl = `${SUPABASE_URL}/rest/v1/reviews?select=*&order=created_at.desc`;
        console.log(`[Supabase Reviews] Attempt 2: Querying via fallback REST API: ${restUrl}`);
        
        const response = await fetch(restUrl, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const text = await response.text();
          if (text) {
            const parsed = JSON.parse(text);
            if (parsed) {
              console.log(`[Supabase Reviews Success] ${parsed.length} reviews loaded via REST fallback`);
              fetchedRows = parsed;
            }
          }
        } else {
          const errText = await response.text();
          const restErrorMsg = `REST fallback HTTP Error ${response.status} (${response.statusText}): ${errText}`;
          console.error("[Supabase Reviews Error] REST fallback fetch failed:", restErrorMsg);
          errorDetails.push(restErrorMsg);
        }
      } catch (err: any) {
        const excMsg = `REST Exception: ${err.message || err}`;
        console.error("[Supabase Reviews Error] REST fallback fetch threw an exception:", excMsg);
        errorDetails.push(excMsg);
      }
    }

    // Apply fetched values
    if (fetchedRows && fetchedRows.length > 0) {
      const mappedReviews: Review[] = fetchedRows.map((row: any) => {
        const idVal = getCaseInsensitiveProp(row, 'id') || Math.random().toString(36).substr(2, 9);
        const createdAtVal = getCaseInsensitiveProp(row, 'created_at') || new Date().toISOString();
        const emailVal = getCaseInsensitiveProp(row, 'email') || "";
        const ratingVal = getCaseInsensitiveProp(row, 'rating');
        const opinionVal = getCaseInsensitiveProp(row, 'opinion') || "";

        // Extracted display name logic
        const emailPrefix = emailVal ? emailVal.split('@')[0] : "Anonymous Client";
        const displayName = emailPrefix.split('.').map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

        return {
          id: String(idVal),
          name: displayName,
          email: emailVal,
          rating: ratingVal === null || ratingVal === undefined ? null : Number(ratingVal),
          comment: opinionVal,
          date: new Date(createdAtVal).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        };
      });

      console.log("[Supabase Reviews Success] Mapped reviews for state:", mappedReviews);
      setReviews(mappedReviews);
    } else {
      console.warn("[Supabase Reviews] No reviews found or table is empty in reviews table.");
      setReviews([]);
    }
  };

  // Function to submit review to Supabase
  const handleReviewSubmit = async (rating: number | null, opinion: string, email: string) => {
    const ratingVal = (rating === 0 || rating === null) ? null : rating;
    const opinionVal = opinion && opinion.trim() !== "" ? opinion.trim() : null;
    const emailVal = email && email.trim() !== "" ? email.trim() : null;

    console.log("[Supabase Review Submit] Initiating insert...", { ratingVal, opinionVal, emailVal });
    
    let success = false;
    let insertedRow: any = null;

    // Attempt 1: SDK
    try {
      const { data, error } = await supabaseClient
        .from('reviews')
        .insert([
          {
            rating: ratingVal,
            opinion: opinionVal,
            email: emailVal
          }
        ])
        .select();

      if (error) {
        console.error("[Supabase Review Error] SDK insert failed:", error);
      } else {
        console.log("[Supabase Review Success] SDK insert succeeded:", data);
        insertedRow = data?.[0];
        success = true;
      }
    } catch (err) {
      console.error("[Supabase Review Exception] SDK insert exception:", err);
    }

    // Attempt 2: REST fallback
    if (!success) {
      try {
        const restUrl = `${SUPABASE_URL}/rest/v1/reviews`;
        const response = await fetch(restUrl, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            rating: ratingVal,
            opinion: opinionVal,
            email: emailVal
          })
        });

        if (response.ok) {
          const text = await response.text();
          const parsed = text ? JSON.parse(text) : [];
          console.log("[Supabase Review Success] REST fallback insert succeeded:", parsed);
          insertedRow = parsed?.[0];
          success = true;
        } else {
          const errText = await response.text();
          console.error("[Supabase Review Error] REST fallback insert failed:", response.status, errText);
        }
      } catch (err) {
        console.error("[Supabase Review Exception] REST fallback insert exception:", err);
      }
    }

    // Always fetch latest reviews list
    await fetchSupabaseReviews();
    return true;
  };

  // Verifier to log logo_url, home_image_url, and about_image_url values and check if applied to the image elements
  useEffect(() => {
    console.log("[Image State Update Logs]");
    console.log("  - Current logoUrl state:", logoUrl);
    console.log("  - Current homeImageUrl state:", homeImageUrl);
    console.log("  - Current aboutImageUrl state:", aboutImageUrl);
    
    // Find image elements and log their actual src attributes to verify they are applied
    const timeoutId = setTimeout(() => {
      const logoImgs = document.querySelectorAll('img[alt="Logo"], img[alt="Logo Preview"]');
      if (logoImgs.length > 0) {
        logoImgs.forEach((img, idx) => {
          console.log(`[Logo Verification] Logo Image Element ${idx + 1} src matches:`, (img as HTMLImageElement).src);
        });
      } else {
        console.warn("[Logo Verification] Warning: No DOM logo image elements with alt='Logo' or 'Logo Preview' found in the current view.");
      }
      
      const homeImg = document.querySelector('img[alt="Abu Hanif Profile"]');
      if (homeImg) {
        console.log("[Home Image Verification] Homepage profile image element src matches:", (homeImg as HTMLImageElement).src);
      }
      
      const aboutImg = document.querySelector('img[alt="Abu Hanif - Senior Post-Production Specialist"]');
      if (aboutImg) {
        console.log("[About Image Verification] About page profile image element src matches:", (aboutImg as HTMLImageElement).src);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [logoUrl, homeImageUrl, aboutImageUrl]);

  // Initialize DB and load data
  useEffect(() => {
    // Request persistent storage to prevent browser from clearing data
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(persistent => {
        if (persistent) console.log("Storage will not be cleared except by explicit user action");
        else console.log("Storage may be cleared under storage pressure");
      });
    }

    const request = indexedDB.open('PortfolioDB', 4); // Bump version
    
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('projects')) {
        db.createObjectStore('projects', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('reviews')) {
        db.createObjectStore('reviews', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
    };

    request.onsuccess = (e: any) => {
      const db = e.target.result;
      
      const loadAll = async () => {
        try {
          // Load Projects
          const projectTx = db.transaction('projects', 'readonly');
          const savedProjects = await new Promise<ProjectItem[]>((resolve, reject) => {
            const req = projectTx.objectStore('projects').getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
          });

          let dbProjects = savedProjects || [];
          if (savedProjects && savedProjects.length > 0) {
            setProjects(savedProjects);
            // Ensure categories list covers only existing project categories
            const projectCats = [...new Set(savedProjects.map((p) => p.category))].filter(Boolean);
            setCategories(projectCats);
          } else {
            // Default start data
            dbProjects = [
              { 
                id: 'p1-1', 
                title: "Cinematic Travel Film Editing Showcase", 
                category: "CINEMATIC", 
                img: "https://img.youtube.com/vi/Fm7fS-E0Vn8/maxresdefault.jpg", 
                videoUrl: "https://www.youtube.com/watch?v=Fm7fS-E0Vn8",
                type: 'video' 
              },
              {
                id: 'p1-corp',
                title: "Dynamic Brand Story Masterpiece",
                category: "CORPORATE VIDEO",
                img: "https://img.youtube.com/vi/1O0_o-8tO-s/maxresdefault.jpg", 
                videoUrl: "https://www.youtube.com/watch?v=1O0_o-8tO-s",
                type: 'video'
              }
            ];
            setProjects(dbProjects);
            setCategories(["CINEMATIC", "CORPORATE VIDEO"]);
          }

          // Fetch dynamically from Supabase
          await Promise.allSettled([
            fetchSupabasePortfolio(),
            fetchSupabaseSettings(),
            fetchSupabaseAssets(),
            fetchSupabaseReviews()
          ]);

          // Load Reviews
          const reviewTx = db.transaction('reviews', 'readonly');
          const savedReviews = await new Promise<Review[]>((resolve) => {
            const req = reviewTx.objectStore('reviews').getAll();
            req.onsuccess = () => resolve(req.result || []);
          });
          setReviews(savedReviews);

          // Load Settings
          const settingsTx = db.transaction('settings', 'readonly');
          const savedAbout = await new Promise<string | null>((resolve) => {
            const req = settingsTx.objectStore('settings').get('aboutImage');
            req.onsuccess = () => resolve(req.result);
          });
          if (savedAbout && savedAbout.startsWith('data:image/')) {
            setAboutImage(savedAbout);
          }

          // Always fetch latest logo_url dynamically from Supabase site_assets on load.
          // Do not read or restore the logo from IndexedDB cache.

          const savedBestWorks = await new Promise<string[] | null>((resolve) => {
            const req = settingsTx.objectStore('settings').get('bestWorks');
            req.onsuccess = () => resolve(req.result || null);
          });
          if (savedBestWorks && savedBestWorks.length > 0) {
            setBestWorks(savedBestWorks);
          } else {
            const defaultBests = savedProjects ? savedProjects.filter(p => p.type === 'video').slice(0, 4).map(p => p.id) : [];
            setBestWorks(defaultBests);
          }

          setIsLoaded(true);
          console.log("Database initialized and data loaded");
        } catch (err) {
          console.error("Failed to load data from IndexedDB", err);
          setIsLoaded(true); // Still enable app but maybe show warning
        }
      };

      loadAll();
    };
    
    request.onerror = (e) => {
      console.error("IndexedDB open error", e);
      setIsLoaded(true);
    };
  }, []);

  // Real-time subscription and polling for changes in public.PORTFOLIO & site_settings tables
  useEffect(() => {
    const portfolioChannel = supabaseClient
      .channel('supabase-portfolio-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'PORTFOLIO' }, (payload) => {
        console.log('[Supabase Realtime] Change detected in public.PORTFOLIO table:', payload);
        fetchSupabasePortfolio();
      })
      .subscribe((status) => {
        console.log(`[Supabase Realtime] Portfolio subscription status: ${status}`);
      });

    const categoriesChannel = supabaseClient
      .channel('supabase-categories-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, (payload) => {
        console.log('[Supabase Realtime] Change detected in public.categories table:', payload);
        fetchSupabasePortfolio();
      })
      .subscribe((status) => {
        console.log(`[Supabase Realtime] Categories subscription status: ${status}`);
      });

    const settingsChannel = supabaseClient
      .channel('supabase-settings-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, (payload) => {
        console.log('[Supabase Realtime] Change detected in public.site_settings table:', payload);
        fetchSupabaseSettings();
      })
      .subscribe((status) => {
        console.log(`[Supabase Realtime] Settings subscription status: ${status}`);
      });

    const assetsChannel = supabaseClient
      .channel('supabase-assets-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_assets' }, (payload) => {
        console.log('[Supabase Realtime] Change detected in public.site_assets table:', payload);
        fetchSupabaseAssets();
      })
      .subscribe((status) => {
        console.log(`[Supabase Realtime] Assets subscription status: ${status}`);
      });

    const reviewsChannel = supabaseClient
      .channel('supabase-reviews-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, (payload) => {
        console.log('[Supabase Realtime] Change detected in public.reviews table:', payload);
        fetchSupabaseReviews();
      })
      .subscribe((status) => {
        console.log(`[Supabase Realtime] Reviews subscription status: ${status}`);
      });

    // Poll every 6 seconds as a robust fallback in case WebSockets/Replication are disabled
    const intervalId = setInterval(() => {
      fetchSupabasePortfolio();
      fetchSupabaseSettings();
      fetchSupabaseAssets();
      fetchSupabaseReviews();
    }, 6000);

    return () => {
      supabaseClient.removeChannel(portfolioChannel);
      supabaseClient.removeChannel(categoriesChannel);
      supabaseClient.removeChannel(settingsChannel);
      supabaseClient.removeChannel(assetsChannel);
      supabaseClient.removeChannel(reviewsChannel);
      clearInterval(intervalId);
    };
  }, []);

  const [isSaving, setIsSaving] = useState(false);

  // Sync Projects, Reviews & Settings to IndexedDB
  useEffect(() => {
    if (!isLoaded) return;

    let timeoutId: any;
    
    const sync = async () => {
      setIsSaving(true);
      const request = indexedDB.open('PortfolioDB', 4);
      request.onsuccess = (e: any) => {
        const db = e.target.result;
        const tx = db.transaction(['projects', 'reviews', 'settings'], 'readwrite');
        
        tx.oncomplete = () => {
          setIsSaving(false);
          console.log('Database synced successfully');
        };
        
        tx.onerror = (err: any) => {
          setIsSaving(false);
          console.error('Database sync failed', err);
        };

        const projectStore = tx.objectStore('projects');
        projectStore.clear().onsuccess = () => {
          projects.forEach(p => projectStore.add(p));
        };

        const reviewStore = tx.objectStore('reviews');
        reviewStore.clear().onsuccess = () => {
          reviews.forEach(r => reviewStore.add(r));
        };

        const settingsStore = tx.objectStore('settings');
        settingsStore.put(aboutImage, 'aboutImage');
        // Skipped putting logoUrl in settingsStore to ensure no local caching of logoUrl
        settingsStore.put(bestWorks, 'bestWorks');
      };
    };

    // Debounce saves
    timeoutId = setTimeout(sync, 1000);

    // Also persist categories to localStorage
    localStorage.setItem('categories', JSON.stringify(categories));

    return () => clearTimeout(timeoutId);
  }, [projects, reviews, aboutImage, logoUrl, categories, isLoaded, bestWorks]);

  // Group projects by category (supporting any present and future folders dynamically)
  const allFolderNames: string[] = [];
  const folderSeen = new Set<string>();

  categories.forEach(cat => {
    if (cat && cat.trim()) {
      const upper = cat.trim().toUpperCase();
      if (!folderSeen.has(upper)) {
        folderSeen.add(upper);
        allFolderNames.push(cat.trim());
      }
    }
  });

  projects.forEach(p => {
    if (p.category && p.category.trim()) {
      const upper = p.category.trim().toUpperCase();
      if (!folderSeen.has(upper)) {
        folderSeen.add(upper);
        allFolderNames.push(p.category.trim());
      }
    }
  });

  const groupedProjects = allFolderNames.map(cat => {
    const normFolderCat = cat.trim().toUpperCase();
    const subItems = projects.filter(p => {
      const normProjCat = p.category ? p.category.trim().toUpperCase() : '';
      return normProjCat === normFolderCat || 
             (normFolderCat.length > 3 && normProjCat.includes(normFolderCat)) || 
             (normProjCat.length > 3 && normFolderCat.includes(normProjCat));
    });

    // Sort videos inside every folder by newest upload first
    const sortedSubItems = [...subItems].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeA && timeB && !isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
        return timeB - timeA; // newest first
      }
      // Fallback: extract numbers or compare IDs descending
      const strA = String(a.id || '');
      const strB = String(b.id || '');
      const numA = parseInt(strA.replace(/\D/g, ''), 10);
      const numB = parseInt(strB.replace(/\D/g, ''), 10);
      if (!isNaN(numA) && !isNaN(numB) && numA !== 0 && numB !== 0 && numA !== numB) {
        return numB - numA;
      }
      return strB.localeCompare(strA, undefined, { numeric: true, sensitivity: 'base' });
    });
    
    // Choose a gorgeous default photo fallback for each category if no custom cover_image_url is set
    let fallbackImg = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200";
    const upperCat = cat.toUpperCase();
    if (upperCat.includes('WEDDING')) {
      fallbackImg = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200";
    } else if (upperCat.includes('COMMERCIAL')) {
      fallbackImg = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200";
    } else if (upperCat.includes('PODCAST')) {
      fallbackImg = "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=1200";
    } else if (upperCat.includes('TRAVEL') || upperCat.includes('CINEMATIC')) {
      fallbackImg = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200";
    } else if (upperCat.includes('REAL ESTATE') || upperCat.includes('REALESTATE')) {
      fallbackImg = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200";
    } else if (upperCat.includes('CORPORATE')) {
      fallbackImg = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200";
    } else if (upperCat.includes('SOCIAL')) {
      fallbackImg = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1200";
    } else if (upperCat.includes('YOUTUBE')) {
      fallbackImg = "https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?auto=format&fit=crop&q=80&w=1200";
    } else if (upperCat.includes('ANIMATED')) {
      fallbackImg = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200";
    } else if (upperCat.includes('DOCUMENTARY')) {
      fallbackImg = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200";
    } else if (upperCat.includes('NATURAL')) {
      fallbackImg = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200";
    } else if (upperCat.includes('PROMOTIONAL')) {
      fallbackImg = "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1200";
    }

    // Always use categories.cover_image_url if present; never use YouTube thumbnails for folder covers
    const customCategoryCover = categoryCovers[normFolderCat] || categoryCovers[cat.trim()];
    const folderImg = (customCategoryCover && typeof customCategoryCover === 'string' && customCategoryCover.trim() !== '')
      ? customCategoryCover.trim()
      : fallbackImg;

    return {
      id: cat,
      title: cat,
      category: "FOLDER",
      type: 'folder' as const,
      img: folderImg,
      subItems: sortedSubItems
    };
  });

  const activeFolder = groupedProjects.find(f => f.id === selectedCategoryId);

  const [stats, setStats] = useState<UserStats>({ xp: 0, level: 1, unlockedBadges: ['New Observer'] });
  const [notifs, setNotifs] = useState<Notification[]>([]);

  // Secret Admin Toggle (Click footer logo 3 times)
  const [adminClicks, setAdminClicks] = useState(0);
  const triggerAdmin = () => {
    setAdminClicks(prev => {
      const next = prev + 1;
      if (next >= 3) {
        setIsAdmin(!isAdmin);
        addNotification(isAdmin ? "Viewer Mode" : "Admin Mode", isAdmin ? "Switched to public view." : "Manage projects unlocked.");
        return 0;
      }
      return next;
    });
  };

  // Gamification: Earn XP on page change
  useEffect(() => {
    setStats(s => {
      const newXp = s.xp + 10;
      const newLevel = Math.floor(newXp / 50) + 1;
      const badges = [...s.unlockedBadges];
      return { xp: newXp, level: newLevel, unlockedBadges: badges };
    });
    window.scrollTo(0, 0); // Reset scroll on page change
  }, [currentPage]);

  const [selectedRating, setSelectedRating] = useState(0);
  const [isEmailSending, setIsEmailSending] = useState(false);

  const addNotification = (title: string, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifs(prev => [{ id, title, message, time: 'Just now' }, ...prev.slice(0, 4)]);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setNotifs(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEmailSending) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    setIsEmailSending(true);

    try {
      // Compose Draft in mailto link format nicely
      const subject = `Portfolio Project Inquiry from ${name}`;
      const mailBody = `Hello Hanif,\n\nI would like to get in touch with you regarding a project.\n\nHere are my details:\n- Name: ${name}\n- Phone: ${phone}\n- Email: ${email}\n\nMessage:\n${message}\n\nSent from Portfolio Contact Form.`;
      const mailtoLink = `mailto:mdabuhanifsarker91@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
      
      window.location.href = mailtoLink;
      
      addNotification("Form Submission Opened", "Opening your email app with prefilled details!");
      form.reset();
    } catch (error: any) {
      console.error("Mail Draft Error:", error);
      addNotification("Error", "Could not open email application automatically.");
    } finally {
      setIsEmailSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010107] selection:bg-primary selection:text-black overflow-x-hidden relative">
      <Navbar currentPage={currentPage} setPage={setPage} onOpenMenu={() => setIsMenuOpen(true)} logoUrl={logoUrl} />
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} setPage={setPage} currentPage={currentPage} />
      
      {/* Floating WhatsApp Chat Button - Compact & Animated */}
      <motion.a
        href="https://wa.me/8801870766945"
        target="_blank"
        rel="noreferrer"
        initial={{ opacity: 0, scale: 0.5, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 md:bottom-6 right-6 z-[100] group"
      >
        <div className="relative w-14 h-14 flex items-center justify-center">
          {/* Animated "Lighting Edge" Border */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500 via-primary to-[#00dbe7] animate-border-beam opacity-0 group-hover:opacity-100 transition-opacity blur-[2px]" />
          <div className="absolute inset-[2px] rounded-full bg-[#131313] z-10" />
          
          <div className="relative z-20 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 overflow-hidden">
             <MessageSquare fill="currentColor" size={24} />
             
             {/* Online status indicator */}
             <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
             </span>
          </div>
          
          {/* "Live Chat" tooltip on hover */}
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-xl border border-white/10 px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all text-[10px] font-black text-primary uppercase tracking-widest whitespace-nowrap pointer-events-none">
            Live Chat
          </div>
        </div>
      </motion.a>

      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="pt-24 min-h-screen"
        >
          {currentPage === 'home' && (
            <>
              <Hero 
                aboutImage={homeImageUrl}
                setPage={setPage}
                cvUrl={cvUrl}
                onAboutMe={() => {
                  setPage('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
              />
              <BestWorksSection 
                isAdmin={isAdmin}
                projects={projects} 
                setProjects={setProjects}
                categories={categories}
                setCategories={setCategories}
                bestWorks={bestWorks} 
                setBestWorks={setBestWorks}
                setActiveVideo={setActiveVideo} 
                setPage={setPage}
                setSelectedCategoryId={setSelectedCategoryId}
                addNotification={addNotification}
                siteSettings={siteSettings}
              />
              <ReviewsSection 
                reviews={reviews}
                setReviews={setReviews}
                selectedRating={selectedRating}
                setSelectedRating={setSelectedRating}
                addNotification={addNotification}
                onSubmitReview={handleReviewSubmit}
                showReviewList={false}
              />
              <ContactSection handleEmailSubmit={handleEmailSubmit} isSending={isEmailSending} />
            </>
          )}

          {currentPage === 'projects' && (
            <Portfolio 
              isAdmin={isAdmin} 
              projects={projects} 
              setProjects={setProjects} 
              groupedProjects={groupedProjects}
              selectedCategoryId={selectedCategoryId}
              setSelectedCategoryId={setSelectedCategoryId}
              categories={categories}
              setCategories={setCategories}
              addNotification={addNotification}
              isSaving={isSaving}
              logoUrl={logoUrl}
              setLogoUrl={setLogoUrl}
              onSaveLogoUrl={saveSupabaseAssets}
              activeVideo={activeVideo}
              setActiveVideo={setActiveVideo}
              bestWorks={bestWorks}
              setBestWorks={setBestWorks}
              supabaseStatus={supabaseStatus}
              onRefreshSupabase={fetchSupabasePortfolio}
            />
          )}
          
          {currentPage === 'reviews' && (
            <div className="py-24 md:py-32 px-6 md:px-12 max-w-5xl mx-auto space-y-24">
                <header className="text-center space-y-6">
                  <h2 className="text-5xl md:text-8xl font-bold text-white tracking-tighter leading-none -letter-spacing-[0.03em]">
                    Client <br/><span className="text-[#4F8CFF]">Experiences.</span>
                  </h2>
                </header>

                {/* Review Submission Box */}
                <div className="bg-[#171C22] border border-[#252D37] p-8 md:p-12 rounded-[22px] space-y-12 mt-[-42px] shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight">Leave a Rating</h3>
                    <div className="flex justify-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star}
                          onClick={() => {
                            const form = document.getElementById('review-form') as HTMLFormElement;
                            if (form) {
                              form.dataset.rating = star.toString();
                              setSelectedRating(star);
                            }
                          }}
                          className={`p-1 transition-all hover:scale-125 active:scale-95 cursor-pointer ${selectedRating >= star ? 'text-[#4F8CFF]' : 'text-slate-700 hover:text-slate-500'}`}
                        >
                          <Star size={36} fill={selectedRating >= star ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] font-bold text-[#697586] uppercase tracking-widest italic">Pick your score</p>
                  </div>

                  <form 
                    id="review-form"
                    className="grid grid-cols-1 gap-8"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const emailVal = (formData.get('userEmail') as string || "").trim();
                      const opinionVal = (formData.get('userComment') as string || "").trim();
                      
                      if (selectedRating === 0 && opinionVal === "") {
                        alert("Please select a rating, write an opinion, or both!");
                        return;
                      }
                      
                      const success = await handleReviewSubmit(selectedRating, opinionVal, emailVal);
                      if (success) {
                        addNotification("Review Posted", "Thank you for your valuable feedback!");
                        setSelectedRating(0);
                        (e.target as HTMLFormElement).reset();
                      }
                    }}
                  >
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-[#9CA8B8] uppercase tracking-widest">Your Email (Optional)</label>
                      <input 
                        type="email" 
                        name="userEmail" 
                        className="w-full bg-[#11161C] border border-[#252D37] rounded-[14px] px-4 py-3 text-white text-base focus:outline-none focus:border-[#4F8CFF] transition-all font-medium placeholder:text-slate-600" 
                        placeholder="alex@example.com" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-[#9CA8B8] uppercase tracking-widest">Your Opinion</label>
                      <textarea 
                        name="userComment" 
                        rows={4} 
                        className="w-full bg-[#11161C] border border-[#252D37] rounded-[14px] p-4 text-white text-base focus:outline-none focus:border-[#4F8CFF] transition-all font-medium resize-none placeholder:text-slate-600" 
                        placeholder="How was your experience working with me?" 
                      />
                    </div>
                    <div>
                      <motion.button 
                        whileHover={{ scale: 1.02, y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 15 
                        }}
                        type="submit"
                        className="w-full py-4 bg-[#4F8CFF] hover:bg-[#72A8FF] text-white rounded-full font-bold uppercase text-xs tracking-widest shadow-[0_10px_30px_rgba(79,140,255,0.15)] transition-all cursor-pointer"
                      >
                        Post My Review
                      </motion.button>
                    </div>
                  </form>
                </div>

                {/* Review List */}
                <ReviewList reviews={reviews} />
              </div>
          )}

          {currentPage === 'about' && (
            <div className="py-24 md:py-32 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center max-w-7xl mx-auto">
              <div className="aspect-[3/4] bg-[#171C22] border border-[#252D37] relative p-2 md:p-3 rounded-[22px] overflow-hidden group shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_60px_rgba(79,140,255,0.1)] transition-all duration-500">
                {aboutImageUrl ? (
                  <img 
                    src={aboutImageUrl} 
                    className="w-full h-full object-cover rounded-[14px] relative z-10"
                    alt="Abu Hanif - Senior Post-Production Specialist" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full rounded-[14px] bg-[#12161B] animate-pulse flex items-center justify-center relative z-10">
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay z-[5]" />
                 
                 {isAdmin && (
                   <div 
                     className="absolute inset-0 bg-black/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-6 z-20"
                   >
                     <label 
                       htmlFor="about-upload" 
                       className="flex flex-col items-center justify-center cursor-pointer text-white hover:text-[#4F8CFF] transition-all group/btn"
                     >
                       <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2 group-hover/btn:scale-110 group-hover/btn:bg-white/20 transition-all text-[#4F8CFF]">
                         <Upload size={18} />
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-widest">Change Photo</span>
                     </label>
                     <input 
                       type="file" 
                       id="about-upload" 
                       className="hidden" 
                       accept="image/*"
                       onChange={(e) => {
                         const file = e.target.files?.[0];
                         if (file) {
                           const reader = new FileReader();
                           reader.onloadend = () => {
                             const base64String = reader.result as string;
                             setAboutImage(base64String);
                             setAboutImageUrl(base64String);
                             addNotification("Photo Changed", "Your profile photo has been updated successfully.");
                           };
                           reader.readAsDataURL(file);
                         }
                       }}
                     />
                     
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         e.preventDefault();
                         setAboutImage(null);
                         setAboutImageUrl(null);
                         addNotification("Photo Cleared", "Profile photo cleared.");
                       }}
                       className="flex flex-col items-center justify-center cursor-pointer text-red-400 hover:text-red-350 transition-all group/btn"
                     >
                       <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center mb-1.5 group-hover/btn:scale-110 group-hover/btn:bg-red-500/20 transition-all">
                         <Trash2 size={14} />
                       </div>
                       <span className="text-[9px] font-bold uppercase tracking-widest">Clear Photo</span>
                     </button>
                   </div>
                 )}
               </div>
               <div className="space-y-6 md:space-y-8">
                 <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-none -letter-spacing-[0.03em]">ABU<br/><span className="text-[#4F8CFF]">HANIF.</span></h2>
                 <div className="h-0 w-24 border-t border-[#252D37]" />
                 <p className="text-[#9CA8B8] text-lg md:text-xl leading-relaxed font-medium">
                   Expert Video Editor and Visual Director elevating brand stories.
                 </p>
                 <p className="text-[#697586] text-sm md:text-base leading-relaxed font-medium">
                   Experienced Video Editor with 2+ years of mastery in Premiere Pro, After Effects, and DaVinci Resolve. I specialize in blending technical precision with artistic storytelling to deliver high-quality, cinematic results.
                 </p>
               </div>
             </div>
          )}

          {currentPage === 'contact' && (
            <div className="py-8 animate-fade-in">
              <ContactSection handleEmailSubmit={handleEmailSubmit} isSending={isEmailSending} />
            </div>
          )}


        </motion.main>
      </AnimatePresence>

      <MobileNav current={currentPage} setPage={setPage} />

      {/* Global Success Notification Popups */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notifs.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="glass-card px-6 py-4 rounded-2xl bg-black/90 border border-primary/30 shadow-2xl flex items-center gap-4 min-w-[280px]"
            >
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-white font-black text-[10px] uppercase tracking-widest">{notif.title}</p>
                <p className="text-slate-400 text-[10px] font-medium mt-0.5">{notif.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <footer className="py-24 md:py-32 px-6 md:px-12 border-t border-[#252D37] bg-[#090B0E] space-y-24">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 md:gap-12">
          {/* Col 1: About */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-fit">
              <div 
                className="text-white font-bold text-4xl md:text-5xl tracking-tight select-none text-center mb-6 -letter-spacing-[0.03em]"
              >
                ABU HANIF
              </div>
              <p className="text-[#9CA8B8] text-sm leading-relaxed font-medium max-w-sm text-center mx-auto md:mx-0">
                Senior Post-Production Specialist dedicated to cinematic excellence. I specialize in 
                high-end video editing and color grading, transforming creative visions into 
                compelling visual narratives with technical precision.
              </p>
            </div>
          </div>

          {/* Col 2: Categories (Folders) */}
          <div className="flex flex-col items-center">
            <div className="w-fit">
              <h4 className="text-white font-bold text-lg uppercase tracking-tight text-center mb-6">Collections</h4>
              <ul className="space-y-3 text-left md:pl-2">
                {groupedProjects.map((folder) => (
                  <li 
                    key={folder.id} 
                    onClick={() => {
                        setPage('projects');
                        setSelectedCategoryId(folder.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-3 text-[#9CA8B8] text-sm font-medium hover:text-[#4F8CFF] transition-all cursor-pointer group"
                  >
                    <div className="w-1.5 h-1.5 bg-[#4F8CFF] rounded-full shrink-0 group-hover:scale-150 transition-transform" />
                    {folder.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 3: Skills */}
          <div className="flex flex-col items-center">
            <div className="w-fit">
              <h4 className="text-white font-bold text-lg uppercase tracking-tight text-center mb-6">Skills</h4>
              <ul className="space-y-3 text-left md:pl-2">
                {['Premiere Pro', 'After Effects', 'CapCut', 'DaVinci Resolve'].map((skill) => (
                  <li 
                    key={skill}
                    className="text-[#9CA8B8] text-sm font-medium transition-all duration-300 text-center md:text-left block"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 4: Navigation & CTA */}
          <div className="flex flex-col items-center md:items-end">
            <div className="w-fit">
              <h4 className="text-white font-bold text-lg uppercase tracking-tight text-center mb-6">Navigation</h4>
              <div className="flex flex-col items-center justify-center gap-3 text-center mb-8">
                {(['projects', 'reviews', 'contact', 'about'] as Page[]).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[#9CA8B8] hover:text-[#4F8CFF] transition-colors text-sm font-medium text-center cursor-pointer"
                  >
                    {page === 'projects' ? 'PORTFOLIO' : page.toUpperCase()}
                  </button>
                ))}
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPage('contact')}
                className="w-full bg-[#4F8CFF] hover:bg-[#72A8FF] text-white px-10 py-3.5 h-[48px] rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-250 shadow-[0_10px_30px_rgba(79,140,255,0.15)] flex items-center justify-center touch-manipulation cursor-pointer"
              >
                HIRE ME
              </motion.button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-12">
          <div className="flex flex-wrap justify-center gap-4 md:gap-5 max-w-full">
            {[
              { Icon: FaFacebook, url: 'https://www.facebook.com/profile.php?id=61592538396121', color: '#1877F2' },
              { Icon: FaYoutube, url: 'https://www.youtube.com/@Abu_Hanif_Sarker', color: '#FF0000' },
              { Icon: FaInstagram, url: 'https://www.instagram.com/editor_abu.hanif/', color: '#E4405F' },
              { Icon: FaPinterest, url: 'https://www.pinterest.com/mdabuhanifsarker', color: '#BD081C' },
              { Icon: FaLinkedin, url: 'https://www.linkedin.com/in/mdabuhanifsarker/', color: '#0A66C2' },
              { Icon: FaDribbble, url: 'https://dribbble.com/abu-hanif-sarker', color: '#EA4C89' },
              { Icon: FaBehance, url: 'https://www.behance.net/mdabuhanifsarker', color: '#0057FF' },
              { Icon: FaGithub, url: 'https://github.com/mdabuhanifsarker', color: '#FFFFFF' },
              { Icon: FaTelegramPlane, url: 'https://t.me/mdabuhanifsarker', color: '#26A5E4' },
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 md:w-14 md:h-14 glass-card flex items-center justify-center rounded-full text-slate-400 hover:border-primary/40 transition-all border-white/5 bg-white/[0.03]"
                style={{ color: social.color }}
              >
                <social.Icon size={20} />
              </motion.a>
            ))}
          </div>
          <div className="flex flex-col items-center gap-4 border-t border-white/5 pt-12 w-full">
             <p className="text-[#cbcbcb] font-sans text-[10px] md:text-xs uppercase tracking-[0.4em]">
               © 2024 HANIF. ALL PRECISION RESERVED.
             </p>
          </div>
        </div>
      </footer>

      {/* Global Video Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={handleCloseVideoModal}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full max-w-6xl max-h-[90vh] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center"
            >
              <button 
                onClick={handleCloseVideoModal}
                className="absolute top-6 right-6 z-20 p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-[#63e5f1] hover:text-black transition-all border border-white/10"
              >
                <X size={20} />
              </button>
              
              <div className="w-full flex items-center justify-center">
                <VideoPlayerWrapper 
                  src={activeVideo} 
                  addNotification={addNotification}
                  onError={(e: any) => {
                    const target = e.target as HTMLVideoElement;
                    console.error("Video failed to load", target.error);
                    addNotification("Video Error", "The video file format is unsupported or the link is broken.");
                    handleCloseVideoModal();
                  }} 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
