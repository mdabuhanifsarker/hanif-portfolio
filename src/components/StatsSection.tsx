import React, { useRef, useState, useEffect } from 'react';
import { motion, animate, useInView } from 'motion/react';
import { User, Folder, DollarSign, Users, CheckCircle2 } from 'lucide-react';

interface SiteSettings {
  clients: string | number;
  projects: string | number;
  income: string | number;
}

const AnimatedCounter = ({ targetValue, trigger }: { targetValue: string | number; trigger: boolean }) => {
  const [count, setCount] = useState(0);
  
  const strVal = targetValue ? targetValue.toString().trim() : '0';
  // Parse numeric part
  const numericPart = parseInt(strVal.replace(/\D/g, '')) || 0;
  // Get suffix (like "$+" or "+")
  const suffix = strVal.replace(/[0-9]/g, '');

  useEffect(() => {
    if (!trigger) return;

    let isCancelled = false;
    const controls = animate(0, numericPart, {
      duration: 2.0,
      ease: "easeOut",
      onUpdate: (latest) => {
        if (!isCancelled) {
          setCount(Math.round(latest));
        }
      }
    });
    return () => {
      isCancelled = true;
      controls.stop();
    };
  }, [numericPart, trigger]);

  // If not triggered yet, show 0 with suffix
  const currentCount = trigger ? count : 0;

  // Preserve leading zeros if any, e.g. "05" -> target numeric length is 2, pad with 0
  const numericStr = strVal.replace(/\D/g, '');
  const targetLen = numericStr.length;
  const hasLeadingZero = strVal.startsWith('0') && targetLen > 1;
  const displayCount = hasLeadingZero 
    ? currentCount.toString().padStart(targetLen, '0') 
    : currentCount.toString();

  const isPrefix = strVal.startsWith('$');
  if (isPrefix) {
    return (
      <span>
        ${displayCount}
        {suffix.replace('$', '')}
      </span>
    );
  }
  return (
    <span>
      {displayCount}
      {suffix}
    </span>
  );
};

const formatValue = (val: string | number, fallback: string) => {
  if (val === undefined || val === null || val === '') return fallback;
  const str = val.toString().trim();
  if (/^\d$/.test(str)) {
    return `0${str}`;
  }
  return str;
};

export const StatsSection = ({ siteSettings }: { siteSettings: SiteSettings }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Stagger wrapper variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  // Card scale pop-up animation - triggers once based on viewport
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 15 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15,
        mass: 1
      }
    }
  };

  return (
    <div ref={ref} className="mt-16 sm:mt-24 w-full max-w-4xl mx-auto px-2 sm:px-4 space-y-8 sm:space-y-10">
      <div className="flex justify-center text-center w-full relative">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#F5F7FA] tracking-tight leading-none font-['Space_Grotesk'] -mb-[25px]">
          STATIS<span className="text-[#B7E36A]">TICS</span>
        </h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative bg-[#181E25]/90 backdrop-blur-xl border border-[#B7E36A]/20 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.6),0_0_50px_rgba(183,227,106,0.1)]"
      >
        {/* Glow Effects at Corners */}
        <div className="absolute top-0 left-0 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-br from-[#B7E36A]/20 to-transparent blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-tl from-[#B7E36A]/15 to-transparent blur-3xl rounded-full pointer-events-none" />
        
        {/* High-tech glowing green edge highlights */}
        <div className="absolute top-0 left-0 w-1/3 h-[2px] sm:h-[2.5px] bg-gradient-to-r from-[#B7E36A] via-[#C8F27A] to-transparent" />
        <div className="absolute top-0 left-0 w-[2px] sm:w-[2.5px] h-1/3 bg-gradient-to-b from-[#B7E36A] via-[#C8F27A] to-transparent" />
        
        <div className="absolute bottom-0 right-0 w-1/3 h-[2px] sm:h-[2.5px] bg-gradient-to-l from-[#B7E36A] to-transparent" />
        <div className="absolute bottom-0 right-0 w-[2px] sm:w-[2.5px] h-1/3 bg-gradient-to-t from-[#B7E36A] to-transparent" />

        {/* Outer grid - Keep as 3 columns always (even on mobile) */}
        <div className="grid grid-cols-3 divide-x divide-white/10">
          
          {/* Card 1: Clients */}
          <motion.div variants={cardVariants} className="flex flex-col">
            {/* Header section - Perfectly centered */}
            <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 py-3 sm:py-5 px-1 sm:px-4 border-b border-white/10">
              <div className="flex items-center justify-center font-['Space_Grotesk']">
                <span className="text-[#F5F7FA] font-bold text-[9px] sm:text-xs md:text-sm tracking-wider uppercase text-center w-full">Clients</span>
              </div>
              <div className="w-6 sm:w-8 h-[2px] bg-[#B7E36A] shadow-[0_0_8px_rgba(183,227,106,0.8)]" />
            </div>
            {/* Body section - Perfectly centered */}
            <div className="flex flex-col items-center justify-center p-3 sm:p-8 text-center flex-grow space-y-3 sm:space-y-5 font-['Inter']">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-[#B7E36A]/30 flex items-center justify-center bg-[#B7E36A]/10 shadow-[0_0_15px_rgba(183,227,106,0.15)]">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-[#B7E36A] opacity-90 drop-shadow-[0_0_8px_rgba(183,227,106,0.5)]" />
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <div className="text-lg sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#F5F7FA] tracking-tight font-['Space_Grotesk']">
                  <AnimatedCounter targetValue={formatValue(siteSettings.clients, '05')} trigger={isInView} />
                </div>
                <p className="text-[7px] sm:text-[10px] md:text-xs font-bold text-[#A9B1BB] uppercase tracking-widest leading-none">Happy Clients</p>
              </div>
              <div className="w-6 sm:w-10 h-[2px] sm:h-[3px] bg-[#B7E36A] rounded-full shadow-[0_0_6px_rgba(183,227,106,0.6)]" />
            </div>
          </motion.div>

          {/* Card 2: Projects */}
          <motion.div variants={cardVariants} className="flex flex-col">
            {/* Header section - Perfectly centered */}
            <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 py-3 sm:py-5 px-1 sm:px-4 border-b border-white/10">
              <div className="flex items-center justify-center font-['Space_Grotesk']">
                <span className="text-[#F5F7FA] font-bold text-[9px] sm:text-xs md:text-sm tracking-wider uppercase text-center w-full">Projects</span>
              </div>
              <div className="w-6 sm:w-8 h-[2px] bg-[#B7E36A] shadow-[0_0_8px_rgba(183,227,106,0.8)]" />
            </div>
            {/* Body section - Perfectly centered */}
            <div className="flex flex-col items-center justify-center p-3 sm:p-8 text-center flex-grow space-y-3 sm:space-y-5 font-['Inter']">
              <div className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-[#B7E36A]/30 flex items-center justify-center bg-[#B7E36A]/10 shadow-[0_0_15px_rgba(183,227,106,0.15)]">
                <Folder className="w-4 h-4 sm:w-[22px] sm:h-[22px] text-[#B7E36A] opacity-90 drop-shadow-[0_0_8px_rgba(183,227,106,0.5)]" />
                <div className="absolute -bottom-0.5 -right-0.5 bg-[#10151C] rounded-full p-0.5 border border-[#B7E36A]/40">
                  <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#B7E36A]" />
                </div>
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <div className="text-lg sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#F5F7FA] tracking-tight font-['Space_Grotesk']">
                  <AnimatedCounter targetValue={formatValue(siteSettings.projects, '50+')} trigger={isInView} />
                </div>
                <p className="text-[7px] sm:text-[10px] md:text-xs font-bold text-[#A9B1BB] uppercase tracking-widest leading-none">Completed Projects</p>
              </div>
              <div className="w-6 sm:w-10 h-[2px] sm:h-[3px] bg-[#B7E36A] rounded-full shadow-[0_0_6px_rgba(183,227,106,0.6)]" />
            </div>
          </motion.div>

          {/* Card 3: Income */}
          <motion.div variants={cardVariants} className="flex flex-col">
            {/* Header section - Perfectly centered */}
            <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 py-3 sm:py-5 px-1 sm:px-4 border-b border-white/10">
              <div className="flex items-center justify-center font-['Space_Grotesk']">
                <span className="text-[#F5F7FA] font-bold text-[9px] sm:text-xs md:text-sm tracking-wider uppercase text-center w-full">Income</span>
              </div>
              <div className="w-6 sm:w-8 h-[2px] bg-[#B7E36A] shadow-[0_0_8px_rgba(183,227,106,0.8)]" />
            </div>
            {/* Body section - Perfectly centered */}
            <div className="flex flex-col items-center justify-center p-3 sm:p-8 text-center flex-grow space-y-3 sm:space-y-5 font-['Inter']">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-[#B7E36A]/30 flex items-center justify-center bg-[#B7E36A]/10 shadow-[0_0_15px_rgba(183,227,106,0.15)]">
                <DollarSign className="w-4 h-4 sm:w-[22px] sm:h-[22px] text-[#B7E36A] opacity-90 drop-shadow-[0_0_8px_rgba(183,227,106,0.5)]" />
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <div className="text-lg sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#B7E36A] tracking-tight font-['Space_Grotesk'] drop-shadow-[0_0_15px_rgba(183,227,106,0.25)]">
                  <AnimatedCounter targetValue={siteSettings.income} trigger={isInView} />
                </div>
                <p className="text-[7px] sm:text-[10px] md:text-xs font-bold text-[#A9B1BB] uppercase tracking-widest leading-none">Total Income</p>
              </div>
              <div className="w-6 sm:w-10 h-[2px] sm:h-[3px] bg-[#B7E36A] rounded-full shadow-[0_0_6px_rgba(183,227,106,0.6)]" />
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};
