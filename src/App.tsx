import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wirshemphpkyyzpexzoa.supabase.co";
const SUPABASE_KEY = "sb_publishable_tWJ1SIXe6zQbL2qpAW6xpw_XKYw58Jk";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

function getYouTubeId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

import { motion, AnimatePresence, Reorder } from 'motion/react';
import { getTravelRecommendation } from './services/geminiService';
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

// @ts-ignore
import defaultProfileImg from './assets/images/hanif.png';
// @ts-ignore
import defaultLogoImg from './assets/images/logo.png';

// --- Types ---
type Page = 'home' | 'projects' | 'reviews' | 'about' | 'contact';

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  img: string;
  videoUrl?: string | Blob;
  type: 'video' | 'folder';
  subItems?: ProjectItem[];
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] h-screen"
        />
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-screen w-80 bg-[#0a0a0a] border-l border-white/5 z-[101] p-12 flex flex-col gap-12"
        >
          <div className="flex justify-between items-center">
            <span className="text-primary font-black text-xl tracking-tighter">NAVIGATE</span>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {(['home', 'projects', 'reviews', 'about', 'contact'] as Page[]).map((item) => (
              <button
                key={item}
                onClick={() => { setPage(item); onClose(); }}
                className={`text-left text-4xl font-black tracking-tighter transition-all hover:translate-x-2 ${
                  currentPage === item ? 'text-[#63e5f1]' : 'text-slate-200 hover:text-[#63e5f1]'
                }`}
              >
                {item === 'reviews' ? 'REVIEWS' : item.toUpperCase()}
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
                   className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-[#63e5f1] transition-colors cursor-pointer"
                 >
                   <item.Icon size={20} />
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
  const displayLogo = logoUrl || defaultLogoImg;
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-6 md:py-8 bg-[#0B132B] backdrop-blur-xl border-b border-white/5">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 text-[#63e5f1] font-black text-xl md:text-2xl tracking-tight cursor-pointer hover:brightness-110 transition-all"
        onClick={() => setPage('home')}
      >
        {displayLogo && (
          <img 
            src={displayLogo} 
            alt="Logo" 
            referrerPolicy="no-referrer"
            className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-full border border-white/10 animate-pulse bg-slate-900" 
          />
        )}
        ABU HANIF
      </motion.div>
      
      <div className="hidden md:flex gap-10">
        {(['home', 'projects', 'contact', 'reviews', 'about'] as Page[]).map((item) => (
          <button
            key={item}
            onClick={() => setPage(item)}
            className={`nav-btn font-medium uppercase text-xs tracking-widest transition-colors ${
              currentPage === item ? 'text-[#63e5f1]' : 'text-slate-400 hover:text-[#63e5f1]'
            }`}
          >
            {item === 'reviews' ? 'Reviews' : (item === 'projects' ? 'Portfolio' : item.charAt(0).toUpperCase() + item.slice(1))}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <motion.button
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => {
    window.location.href = "mailto:mdabuhanifsarker91@gmail.com";
  }}
  className="hidden md:block bg-[#E1EE7E] text-[#0B132B] px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-[#E1EE7E]/20"
>
  Hire Me
</motion.button>
        
        <button 
          onClick={onOpenMenu}
          className="p-3 bg-white/5 rounded-2xl text-white hover:bg-white/10 transition-all border border-white/10"
        >
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};

const MobileNav = ({ current, setPage }: { current: Page, setPage: (p: Page) => void }) => (
  <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass-card px-8 py-4 flex gap-8 shadow-2xl border-white/10 bg-[#131313]/80 backdrop-blur-2xl">
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
        className={`p-2 rounded-full transition-all ${current === item.id ? 'bg-[#63e5f1]/20 text-[#63e5f1] scale-110' : 'text-slate-500'}`}
      >
        <item.icon size={20} />
      </button>
    ))}
  </div>
);

// --- Sections ---

const Hero = ({ onAboutMe, aboutImage }: { onAboutMe: () => void, aboutImage: string }) => (
  <section className="flex flex-col pt-4 md:pt-6 pb-12 px-6 md:px-12 relative overflow-hidden bg-[#010107]">
    <div className="absolute top-1/4 -right-20 w-64 md:w-96 h-64 md:h-96 bg-primary/20 blur-[80px] md:blur-[120px] rounded-full" />
    
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="lg:col-span-7 space-y-8"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[91px] xl:leading-[127px] font-black text-[#e7e7e7] tracking-tighter">
          I'm a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#00dbe7] neon-glow">Video Editor</span>
        </h1>
        
        <p className="text-[#c3c3c3] text-lg md:text-xl max-w-2xl leading-relaxed">
          I specialize in high-end video editing, color grading, and motion design 
          for luxury brands and high-fidelity cinematic storytelling.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAboutMe}
            className="bg-[#E1EE7E] text-[#0B132B] px-6 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            about me <ArrowRight size={18} />
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="lg:col-span-5 flex justify-center lg:justify-end w-full"
      >
        {/* Sleek Cinematic Camera Lens / Viewfinder style frame */}
        <div className="relative group w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center p-4">
          {/* Outer elegant spinning viewfinder ring (360 rotational slow motion) */}
          <div className="absolute inset-0 rounded-full border border-dashed border-white/10 animate-[spin_120s_linear_infinite] pointer-events-none" />
          
          {/* Sleek luxury backlight - very soft, premium professional vignette glow */}
          <div className="absolute inset-4 rounded-full bg-cyan-500/5 blur-2xl group-hover:bg-cyan-500/15 transition-all duration-700" />
          <div className="absolute inset-4 rounded-full bg-[#E1EE7E]/5 blur-3xl group-hover:bg-[#E1EE7E]/10 transition-all duration-700" />
          
          {/* Inner concentric metal ring */}
          <div className="w-[92%] h-[92%] rounded-full p-1 bg-gradient-to-tr from-white/10 via-white/5 to-white/15 relative z-10 shadow-2xl shadow-black/80">
            <div className="w-full h-full rounded-full overflow-hidden border border-white/20 relative bg-[#060814]">
              {/* Image with scale-x-[-1] to flip it horizontally, satisfying the character orientation requirement */}
              <img 
                src={aboutImage} 
                className="w-full h-full object-cover rounded-full scale-x-[-1] hover:scale-x-[-1] hover:scale-105 transition-transform duration-700"
                alt="My Profile Photo"
              />
            </div>
          </div>
          
        </div>
      </motion.div>
    </div>
  </section>
);

const BestWorksSection = ({ 
  projects, 
  bestWorks, 
  setActiveVideo, 
  setPage,
  addNotification
}: { 
  projects: ProjectItem[], 
  bestWorks: string[], 
  setActiveVideo: (url: string | Blob | null) => void, 
  setPage: (p: Page) => void,
  addNotification: any
}) => {
  const videoProjects = projects.filter(p => p.type === 'video');
  const bestProjects = videoProjects.filter(p => bestWorks.includes(p.id));

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

  let displayProjects: ProjectItem[] = [];
  if (bestProjects.length > 0) {
    displayProjects = bestProjects.slice(0, 2);
  } else if (videoProjects.length > 0) {
    displayProjects = videoProjects.slice(0, 2);
  }

  if (displayProjects.length < 2) {
    const symbolsNeeded = 2 - displayProjects.length;
    displayProjects = [...displayProjects, ...defaultBestVideos.slice(0, symbolsNeeded)];
  }

  return (
    <section className="pt-16 md:pt-24 pb-12 md:pb-16 px-6 md:px-12 max-w-7xl mx-auto space-y-10">
      <div className="flex justify-center text-center w-full">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-widest leading-none">
          BEST <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#00dbe7] font-semibold">WORKS</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {displayProjects.map((project, idx) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              if (project.videoUrl) {
                setActiveVideo(project.videoUrl);
              } else {
                addNotification("No Video", "This project doesn't have an associated video yet.");
              }
            }}
            className="glass-card aspect-video relative group overflow-hidden cursor-pointer rounded-[2rem] border-white/5 hover:border-primary/30 active:scale-95 transition-all duration-500"
          >
            <img 
              src={project.img} 
              className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:opacity-100 transition-all duration-700" 
              alt={project.title} 
              referrerPolicy="no-referrer"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col gap-2">
              <span className="text-[9px] font-black text-[#63e5f1] uppercase tracking-[0.3em] bg-[#63e5f1]/10 border border-[#63e5f1]/20 rounded-full px-3 py-1 w-fit">
                {project.category}
              </span>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug">{project.title}</h3>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="w-16 h-16 bg-primary/10 backdrop-blur-2xl rounded-full flex items-center justify-center text-primary border border-primary/40 shadow-2xl shadow-primary/20">
                <Play fill="currentColor" size={24} className="ml-1" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-2 md:pt-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setPage('projects');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="bg-[#E1EE7E] text-[#0B132B] px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:brightness-110 shadow-2xl shadow-[#E1EE7E]/20 transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
        >
          Visit Portfolio <ArrowRight size={18} />
        </motion.button>
      </div>
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
    <section className="py-12 md:py-20 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        
        {/* Left Side: Contact Info & Let's talk */}
        <div className="glass-card p-8 sm:p-10 md:p-12 bg-[#0d1527] border-white/5 rounded-[2rem] flex flex-col justify-between space-y-10">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-snug">
              Let's talk
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
              I will get back to you within 2 hours.
            </p>
          </div>

          <div className="space-y-6">
            {/* Call */}
            <div className="flex items-center gap-5">
              <a 
                href="https://wa.me/8801870766945"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-450 border border-emerald-500/20 shrink-0 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer"
                style={{ color: '#10b981' }}
              >
                <Phone size={20} />
              </a>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Call or WhatsApp Me At</p>
                <a 
                  href="https://wa.me/8801870766945"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white font-black text-sm sm:text-lg block truncate hover:text-emerald-400 transition-colors"
                >
                  01870766945
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-5">
              <a 
                href="#contact-form"
                onClick={handleEmailClick}
                className="w-12 h-12 bg-[#00dbe7]/10 rounded-full flex items-center justify-center text-[#38bdf8] border border-sky-500/20 shrink-0 hover:bg-[#38bdf8]/10 hover:border-[#38bdf8]/40 transition-all cursor-pointer"
              >
                <Mail size={20} />
              </a>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Me At</p>
                <a 
                  href="#contact-form" 
                  onClick={handleEmailClick}
                  className="text-white font-black text-xs sm:text-lg block truncate hover:text-[#38bdf8] transition-colors cursor-pointer"
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
              <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 border border-purple-500/20 shrink-0 group-hover/location:bg-purple-500/20 group-hover/location:border-purple-500/40 transition-all">
                <MapPin size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover/location:text-purple-400 transition-colors">Location</p>
                <p className="text-white font-black text-sm sm:text-lg truncate group-hover/location:text-purple-300 transition-colors">Gazipur, Dhaka, Bangladesh</p>
              </div>
            </a>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Follow Me:</h4>
            <div className="flex flex-wrap gap-3">
              {[
                { Icon: FaFacebook, url: 'https://www.facebook.com/md.abu.hanif.sarker.676754/', color: '#1877F2' },
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
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white hover:border-white/20 transition-all"
                  style={{ color: social.color }}
                >
                  <social.Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div id="contact-form" className="glass-card p-8 sm:p-10 md:p-12 bg-[#0d1527] border-white/5 rounded-[2rem]">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-snug mb-8">
            Mail Me
          </h2>
          <form 
            onSubmit={handleEmailSubmit} 
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400">Your Name</label>
                <input 
                  id="contact-name"
                  name="name" 
                  required 
                  disabled={isSending}
                  className="w-full bg-[#070b14] border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-sky-500/50 text-white transition-all font-medium disabled:opacity-50" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400">Phone Number</label>
                <input 
                  name="phone" 
                  required 
                  disabled={isSending}
                  className="w-full bg-[#070b14] border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-sky-500/50 text-white transition-all font-medium disabled:opacity-50" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400">Email Address</label>
              <input 
                name="email" 
                type="email" 
                required 
                disabled={isSending}
                className="w-full bg-[#070b14] border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-sky-500/50 text-white transition-all font-medium disabled:opacity-50" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400">Your Message</label>
              <textarea 
                name="message" 
                required 
                rows={5} 
                disabled={isSending}
                className="w-full bg-[#070b14] border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-sky-500/50 text-white resize-none transition-all font-medium disabled:opacity-50" 
              />
            </div>

            <motion.button 
              whileHover={isSending ? {} : { scale: 1.02 }}
              whileTap={isSending ? {} : { scale: 0.98 }}
              type="submit" 
              disabled={isSending}
              className={`w-full ${isSending ? 'bg-slate-700 cursor-not-allowed text-slate-400' : 'bg-sky-500 hover:bg-sky-400 text-white'} py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-sky-500/10 flex items-center justify-center gap-3`}
            >
              {isSending ? (
                <>
                  Sending Message...
                  <span className="animate-spin rounded-full h-3 w-3 border-2 border-slate-400 border-t-white" />
                </>
              ) : (
                <>
                  Send Message <Send size={15} />
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
  activeVideo,
  setActiveVideo,
  bestWorks,
  setBestWorks
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
  activeVideo: string | Blob | null,
  setActiveVideo: (url: string | Blob | null) => void,
  bestWorks: string[],
  setBestWorks: React.Dispatch<React.SetStateAction<string[]>>
}) => {
  const activeFolder = groupedProjects.find(f => f.id === selectedCategoryId);

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

  const currentVideos = selectedCategoryId ? activeFolder?.subItems || [] : groupedProjects;

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 space-y-12 md:space-y-16 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {selectedCategoryId && (
                <button 
                onClick={() => setSelectedCategoryId(null)}
                className="p-3 bg-[#e1ee7e] rounded-full text-black hover:brightness-110 transition-all flex items-center justify-center shadow-lg shadow-[#e1ee7e]/20"
              >
                <ArrowRight size={20} className="rotate-180" />
              </button>
            )}
            <h2 className="text-4xl md:text-5xl font-black text-[#63e5f1] tracking-tighter">
              {activeFolder ? activeFolder.title : "Creative Showcase"}
            </h2>
          </div>
          <p className="text-slate-500 font-medium tracking-wide text-xs md:text-sm uppercase max-w-xl">
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
                className="glass-card aspect-video relative group overflow-hidden cursor-pointer rounded-[1.5rem] md:rounded-[2rem] border-white/5 hover:border-primary/30 active:scale-95 transition-all duration-500"
              >
                <motion.img 
                  initial={{ scale: 1.15 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  src={project.img} 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100" 
                  alt={project.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent flex flex-col justify-end p-6 md:p-10">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-primary text-[9px] md:text-[10px] font-black tracking-[0.2em]">{project.category}</p>
                    {project.type === 'folder' && <Grid size={12} className="text-primary" />}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white flex flex-row items-center justify-between w-full gap-4">
                    <span className="truncate">{project.title}</span>
                    {project.videoUrl && typeof project.videoUrl === 'string' && (
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.videoUrl as string, '_blank');
                        }}
                        className="flex-shrink-0 px-3 py-1.5 bg-black/60 hover:bg-[#63e5f1] hover:text-black rounded-xl text-[#63e5f1] transition-all font-sans text-[10px] uppercase tracking-widest flex items-center gap-1.5 pointer-events-auto border border-[#63e5f1]/20 active:scale-95 shadow-md"
                        title="Watch directly on YouTube"
                      >
                        Link <ArrowRight size={10} className="-rotate-45" />
                      </span>
                    )}
                  </h3>
                </div>
                
                {/* Admin Actions Removed from card hover per user request */}

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 backdrop-blur-2xl rounded-full flex items-center justify-center text-primary border border-primary/40 shadow-2xl shadow-primary/20">
                    {project.type === 'folder' ? <Maximize2 size={24} /> : <Play fill="currentColor" size={28} />}
                  </div>
                </div>
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
                          <img src={proj.img} className="w-full h-full object-cover" alt={proj.title} />
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
                    {logoUrl || defaultLogoImg ? (
                      <div className="relative group">
                        <img 
                          src={logoUrl || defaultLogoImg} 
                          alt="Logo Preview" 
                          referrerPolicy="no-referrer"
                          className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-full bg-black border border-white/10" 
                        />
                        {logoUrl && (
                          <button 
                            onClick={() => setLogoUrl(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
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
                            reader.onloadend = () => {
                              const base64String = reader.result as string;
                              setLogoUrl(base64String);
                              addNotification("Logo Updated", "Your site logo has been changed successfully.");
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
                                <img src={project.img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
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
  const [currentPage, setPageInternal] = useState<Page>(() => {
    const hash = window.location.hash.replace('#', '') as Page;
    const validPages: Page[] = ['home', 'projects', 'reviews', 'about', 'contact'];
    return validPages.includes(hash) ? hash : 'home';
  });

  const setPage = (newPage: Page) => {
    setPageInternal(newPage);
    const validPages: Page[] = ['home', 'projects', 'reviews', 'about', 'contact'];
    if (validPages.includes(newPage)) {
      if (newPage === 'home') {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
      } else {
        window.location.hash = newPage;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as Page;
      const validPages: Page[] = ['home', 'projects', 'reviews', 'about', 'contact'];
      const pageToSet = validPages.includes(hash) ? hash : 'home';
      setPageInternal(pageToSet);
      window.scrollTo({ top: 0, behavior: 'instant' as any });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  // Collect all project categories to ensure none are missing from the UI
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('categories');
    const defaultCats = ['PODCAST', 'ANIMATED VIDEO', 'WEDDING VIDEO', 'CORPORATE VIDEO', 'DOCUMENTARY VIDEO', 'NATURAL VIDEO'];
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultCats;
      }
    }
    return defaultCats;
  });

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [aboutImage, setAboutImage] = useState(defaultProfileImg);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [bestWorks, setBestWorks] = useState<string[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | Blob | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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
            // Ensure categories list covers all project categories
            const projectCats = [...new Set(savedProjects.map((p) => p.category))];
            setCategories(prev => [...new Set([...prev, ...projectCats])]);
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
          }

          // Fetch real-time videos from Supabase
          try {
            console.log("[Supabase Sync] Starting fetch for 'Videos' table...");
            // Query public.Videos first, falling back to public.videos if needed
            let sbVideos: any[] = [];
            let loadedSuccessfully = false;

            const tableNamesToTry = ['Videos', 'videos'];

            for (const tableName of tableNamesToTry) {
              if (loadedSuccessfully) break;
              
              const restUrl = `${SUPABASE_URL}/rest/v1/${tableName}?select=*`;
              console.log(`[Supabase Sync] Attempting fetch from table '${tableName}'...`);

              // 1. Attempt standard HTTP REST GET as requested
              try {
                console.log(`[Supabase Sync] Executing REST API GET request for ${tableName}:`, restUrl);
                const response = await fetch(restUrl, {
                  method: 'GET',
                  headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                  }
                });

                console.log(`[Supabase Sync] REST API Response status for ${tableName}: ${response.status} (${response.statusText})`);

                if (response.ok) {
                  const textData = await response.text();
                  if (textData) {
                    try {
                      sbVideos = JSON.parse(textData);
                      console.log(`[Supabase Sync] Successfully loaded ${sbVideos.length} raw video rows from REST API (${tableName}):`, sbVideos);
                      loadedSuccessfully = true;
                      break;
                    } catch (jsonErr) {
                      console.error(`[Supabase Sync] JSON parse error on REST response (${tableName}):`, jsonErr);
                    }
                  } else {
                    console.warn(`[Supabase Sync] Received empty body from REST API for ${tableName}.`);
                    loadedSuccessfully = true;
                    break;
                  }
                } else {
                  console.warn(`[Supabase Sync] REST API HTTP error for ${tableName}:`, response.status, await response.text());
                }
              } catch (fetchErr) {
                console.error(`[Supabase Sync] HTTP REST API network request failed for ${tableName}:`, fetchErr);
              }

              // 2. Fallback to @supabase/supabase-js library client if REST fetch had issues
              if (!loadedSuccessfully) {
                console.log(`[Supabase Sync] Falling back to standard Supabase Client SDK select for '${tableName}'...`);
                const { data: sdkData, error: sdkErr } = await supabaseClient
                  .from(tableName)
                  .select('*');
                
                if (sdkErr) {
                  console.error(`[Supabase Sync] SDK fallback option also errored out for ${tableName}:`, sdkErr);
                } else if (sdkData) {
                  sbVideos = sdkData;
                  console.log(`[Supabase Sync] Successfully loaded ${sbVideos.length} rows via SDK client fallback for ${tableName}:`, sdkData);
                  loadedSuccessfully = true;
                  break;
                }
              }
            }

            // 3. Process records if retrieval was successful
            if (loadedSuccessfully) {
              const mappedSbProjects: ProjectItem[] = sbVideos.map((v: any, idx: number) => {
                const keys = Object.keys(v);
                let titleKey = keys.find(k => ['title', 'name', 'video_title', 'youtube_title'].includes(k.toLowerCase())) || 'title';
                let linkKey = keys.find(k => ['url', 'link', 'youtube_url', 'youtube_link', 'video_url', 'video_link', 'href'].includes(k.toLowerCase())) || 'link';
                let catKey = keys.find(k => ['category', 'cat', 'genre', 'video_category', 'tag'].includes(k.toLowerCase())) || 'category';

                const title = v[titleKey] || 'Untitled YouTube video';
                const link = v[linkKey] || '';
                
                // Parse and normalize the category (e.g. "Podcast" -> "PODCAST")
                let rawCategory = v[catKey] || 'PODCAST';
                let dbCategory = rawCategory.toString().trim().toUpperCase();

                const ytid = getYouTubeId(link);
                // Use maxresdefault for a high-definition stunning thumbnail option
                const thumb = ytid 
                  ? `https://img.youtube.com/vi/${ytid}/maxresdefault.jpg`
                  : "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800";

                console.log(`[Supabase Mapping] Row #${idx}: Title="${title}" | Link="${link}" | normalized Category="${dbCategory}"`);

                return {
                  id: `sb-${v.id || idx}`,
                  title: title,
                  category: dbCategory,
                  img: thumb,
                  videoUrl: link,
                  type: 'video' as const
                };
              });

              // Add unique categories from Supabase to the categories panel dynamically
              const sbCategories = [...new Set(mappedSbProjects.map(p => p.category))];
              console.log("[Supabase Sync] Loaded categories from database mapping:", sbCategories);

              setCategories(prev => {
                const filteredPrev = prev.filter(cat => cat !== "SUPABASE FEED");
                const combined = [...filteredPrev, ...sbCategories];
                return [...new Set(combined)];
              });

              setProjects(prev => {
                // Filter out default offline mockups and former Supabase entries, keeping existing user custom structural folders if any
                const filtered = prev.filter(p => !p.id.toString().startsWith('sb-') && p.type !== 'video');
                console.log(`[Supabase Sync] Completed update to local projects. Retaining ${filtered.length} items, importing ${mappedSbProjects.length} new items.`);
                return [...filtered, ...mappedSbProjects];
              });
            }
          } catch (supaErr) {
            console.error("[Supabase Sync] Failed to connect or query Supabase database safely", supaErr);
          }

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
          } else {
            setAboutImage(defaultProfileImg);
          }

          const savedLogo = await new Promise<string | null>((resolve) => {
            const req = settingsTx.objectStore('settings').get('logoUrl');
            req.onsuccess = () => resolve(req.result);
          });
          if (savedLogo) setLogoUrl(savedLogo);

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
        if (logoUrl) settingsStore.put(logoUrl, 'logoUrl');
        settingsStore.put(bestWorks, 'bestWorks');
      };
    };

    // Debounce saves
    timeoutId = setTimeout(sync, 1000);

    // Also persist categories to localStorage
    localStorage.setItem('categories', JSON.stringify(categories));

    return () => clearTimeout(timeoutId);
  }, [projects, reviews, aboutImage, logoUrl, categories, isLoaded, bestWorks]);

  // Group projects by category
  const groupedProjects = categories.map(cat => ({
    id: cat,
    title: cat,
    category: "FOLDER",
    type: 'folder' as const,
    img: projects.find(p => p.category === cat)?.img || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200",
    subItems: projects.filter(p => p.category === cat)
  }));

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
      if (newLevel > s.level) {
        addNotification(`Leveled Up!`, `You reached Level ${newLevel}. Exploring like a pro.`);
      }
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
                aboutImage={aboutImage}
                onAboutMe={() => {
                  setPage('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
              />
              <BestWorksSection 
                projects={projects} 
                bestWorks={bestWorks} 
                setActiveVideo={setActiveVideo} 
                setPage={setPage}
                addNotification={addNotification}
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
              activeVideo={activeVideo}
              setActiveVideo={setActiveVideo}
              bestWorks={bestWorks}
              setBestWorks={setBestWorks}
            />
          )}
          
          {currentPage === 'reviews' && (
            <div className="py-24 md:py-32 px-6 md:px-12 max-w-5xl mx-auto space-y-24">
              <header className="text-center space-y-6">
                <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">Client <br/><span className="text-[#63e5f1] not-italic" style={{ fontFamily: 'Arial' }}>Experiences.</span></h2>
              </header>

              {/* Review Submission Box */}
              <div className="glass-card p-8 md:p-16 rounded-[3rem] bg-black/40 border-white/10 space-y-12 mt-[-42px]">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Leave a Rating</h3>
                  <div className="flex justify-center gap-1">
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
                        className={`p-1 transition-all hover:scale-125 active:scale-95 ${selectedRating >= star ? 'text-[#63e5f1]' : 'text-slate-700 hover:text-slate-500'}`}
                      >
                        <Star size={40} fill={selectedRating >= star ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Pick your score</p>
                </div>

                <form 
                  id="review-form"
                  className="grid grid-cols-1 gap-8"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (selectedRating === 0) {
                      alert("Please select a rating!");
                      return;
                    }
                    const formData = new FormData(e.currentTarget);
                    const currentUserEmail = "mdabuhanifsarker91@gmail.com";
                    const currentUserName = currentUserEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
                    
                    const newReview: Review = {
                      id: Math.random().toString(36).substr(2, 9),
                      name: currentUserName,
                      email: currentUserEmail,
                      rating: selectedRating,
                      comment: formData.get('userComment') as string,
                      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    };
                    setReviews(prev => [newReview, ...prev]);
                    addNotification("Review Posted", "Thank you for your valuable feedback!");
                    setSelectedRating(0);
                    (e.target as HTMLFormElement).reset();
                  }}
                >
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Your Opinion</label>
                    <textarea name="userComment" required rows={4} className="w-full bg-white/5 border border-white/5 rounded-3xl py-4 px-6 text-white text-lg focus:outline-none focus:border-primary/50 transition-all font-bold resize-none placeholder:text-slate-700" placeholder="How was your experience working with me?" />
                  </div>
                  <div>
                    <motion.button 
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 10 
                      }}
                      type="submit"
                      className="w-full py-6 bg-[#e1ee7e] text-black rounded-full font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-[#e1ee7e]/20 hover:brightness-110 transition-all pl-0"
                    >
                      Post My Review
                    </motion.button>
                  </div>
                </form>
              </div>

              {/* Review List */}
              <div className="space-y-12">
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Community Voice ({reviews.length})</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[#63e5f1] font-black text-xl">{(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1)}</div>
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Average Score</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <AnimatePresence>
                    {reviews.map((rev, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={rev.id} 
                        className="glass-card p-10 rounded-[2.5rem] bg-white/[0.02] border-white/5 space-y-6 group hover:border-[#63e5f1]/20 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4 items-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#63e5f1]/20 to-[#63e5f1]/5 rounded-2xl flex items-center justify-center text-[#63e5f1] font-black text-xl border border-[#63e5f1]/20 uppercase">
                              {rev.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-white font-black text-lg tracking-tight uppercase">{rev.name}</p>
                              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{rev.email.replace(/(.{3}).*(@.*)/, '$1***$2')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 bg-[#63e5f1]/10 px-4 py-2 rounded-xl">
                            <Star size={12} fill="currentColor" className="text-[#63e5f1]" />
                            <span className="text-[#63e5f1] font-black text-sm">{rev.rating}.0</span>
                          </div>
                        </div>
                        <div className="relative text-slate-300 font-medium leading-relaxed italic text-lg border-l-2 border-[#63e5f1]/20 pl-6 py-2">
                          "{rev.comment}"
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] pt-4">
                          <span>Verified Experience</span>
                          <span>{rev.date}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {reviews.length === 0 && (
                    <div className="py-20 text-center glass-card border-dashed border-white/10 rounded-[3rem]">
                      <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">No reviews yet. Be the first to share your experience!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentPage === 'about' && (
            <div className="py-24 md:py-32 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center max-w-7xl mx-auto">
              <div className="aspect-[3/4] glass-card relative p-2 md:p-3 rounded-[2rem] md:rounded-[3rem] overflow-hidden group">
                <div className="absolute inset-[-100%] rounded-full bg-gradient-to-tr from-[#63e5f1] via-[#e1ee7e] to-[#63e5f1] animate-border-beam opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-[60px] z-0" />
                <img 
                   src={aboutImage} 
                   className="w-full h-full object-cover rounded-[1.5rem] md:rounded-[2.5rem] grayscale hover:grayscale-0 transition-all duration-1000 relative z-10"
                   alt="Abu Hanif - Senior Post-Production Specialist" 
                 />
                 <div className="absolute inset-0 bg-[#aaabad]/20 mix-blend-overlay z-[5]" />
                 
                 {isAdmin && (
                   <div 
                     className="absolute inset-0 bg-black/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-6 z-20"
                   >
                     <label 
                       htmlFor="about-upload" 
                       className="flex flex-col items-center justify-center cursor-pointer text-white hover:text-[#63e5f1] transition-all group/btn"
                     >
                       <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2 group-hover/btn:scale-110 group-hover/btn:bg-white/20 transition-all text-primary">
                         <Upload size={20} />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest">Change Photo</span>
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
                         setAboutImage(defaultProfileImg);
                         addNotification("Photo Reset", "Profile photo restored to your default actual photo.");
                       }}
                       className="flex flex-col items-center justify-center cursor-pointer text-red-400 hover:text-red-300 transition-all group/btn"
                     >
                       <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center mb-1.5 group-hover/btn:scale-110 group-hover/btn:bg-red-500/20 transition-all">
                         <RotateCcw size={16} />
                       </div>
                       <span className="text-[9px] font-black uppercase tracking-widest">Reset Default</span>
                     </button>
                   </div>
                 )}
               </div>
               <div className="space-y-6 md:space-y-8">
                 <h2 className="text-6xl md:text-8xl font-black text-[#63e5f1] tracking-tighter leading-none">ABU<br/><span className="text-[#63e5f1]">HANIF.</span></h2>
                 <div className="h-0 w-24 border-t-2 border-dashed border-[#63e5f1]" />
                 <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
                   Expert Video Editor and Visual Director elevating brand stories.
                 </p>
                 <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                   Experienced Video Editor with 2+ years of mastery in Premiere Pro, After Effects, and DaVinci Resolve. I specialize in blending technical precision with artistic storytelling to deliver high-quality, cinematic results.
                 </p>
               </div>
             </div>
          )}

          {currentPage === 'contact' && (
            <div className="py-12 md:py-20 animate-fade-in">
               <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-4">
                 <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#63e5f1] tracking-widest leading-none uppercase mb-2">
                   CONTACT <span className="text-[#63e5f1] font-semibold">ME.</span>
                 </h2>
               </div>
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

      <footer className="py-24 md:py-32 px-6 md:px-12 border-t border-white/5 bg-[#0B132B] space-y-24">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 md:gap-12">
          {/* Col 1: About */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-fit">
              <div 
                onClick={triggerAdmin}
                className="text-white font-black text-4xl md:text-5xl tracking-tight cursor-pointer hover:text-[#63e5f1] transition-all select-none text-center mb-6"
              >
                ABU HANIF
              </div>
              <p className="text-slate-400 text-sm leading-relaxed font-medium max-w-sm text-center mx-auto md:mx-0">
                Senior Post-Production Specialist dedicated to cinematic excellence. I specialize in 
                high-end video editing and color grading, transforming creative visions into 
                compelling visual narratives with technical precision.
              </p>
            </div>
          </div>

          {/* Col 2: Categories (Folders) */}
          <div className="flex flex-col items-center">
            <div className="w-fit">
              <h4 className="text-white font-black text-lg uppercase tracking-tight text-center mb-6">Collections</h4>
              <ul className="space-y-3 text-left md:pl-2">
                {groupedProjects.map((folder) => (
                  <li 
                    key={folder.id} 
                    onClick={() => {
                        setPage('projects');
                        setSelectedCategoryId(folder.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-3 text-slate-400 text-sm font-medium hover:text-[#63e5f1] transition-all cursor-pointer group"
                  >
                    <div className="w-1.5 h-1.5 bg-[#63e5f1] rounded-full shrink-0 group-hover:scale-150 transition-transform" />
                    {folder.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 3: Skills */}
          <div className="flex flex-col items-center">
            <div className="w-fit">
              <h4 className="text-white font-black text-lg uppercase tracking-tight text-center mb-6">Skills</h4>
              <ul className="space-y-3 text-left md:pl-2">
                {['Premiere Pro', 'After Effects', 'CapCut', 'DaVinci Resolve'].map((skill) => (
                  <li 
                    key={skill}
                    className="text-slate-400 text-sm font-medium transition-all duration-300 text-center md:text-left block"
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
              <h4 className="text-white font-black text-lg uppercase tracking-tight text-center mb-6">Navigation</h4>
              <div className="flex flex-col gap-3 text-left mb-8 md:pl-4">
                {(['projects', 'reviews', 'contact', 'about'] as Page[]).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-400 hover:text-[#63e5f1] transition-colors text-sm font-bold uppercase tracking-widest text-left"
                  >
                    {page === 'reviews' ? 'Reviews' : (page === 'projects' ? 'Portfolio' : page === 'about' ? 'About' : page.charAt(0).toUpperCase() + page.slice(1))}
                  </button>
                ))}
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage('contact')}
                className="w-full bg-[#E1EE7E] text-[#0B132B] px-10 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-xl shadow-[#E1EE7E]/20"
              >
                HIRE ME
              </motion.button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-12">
          <div className="flex flex-wrap justify-center gap-4 md:gap-5 max-w-full">
            {[
              { Icon: FaFacebook, url: 'https://www.facebook.com/md.abu.hanif.sarker.676754/', color: '#1877F2' },
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
              onClick={() => setActiveVideo(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full max-w-6xl max-h-[90vh] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center"
            >
              <button 
                onClick={() => setActiveVideo(null)}
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
                    setActiveVideo(null);
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
