import React, { useRef, useState, useEffect } from 'react';
import { motion, animate, useInView } from 'motion/react';
import { Users, Folder, CheckCircle2, Clock } from 'lucide-react';

interface SiteSettings {
  clients?: string | number;
  projects?: string | number;
  hours?: string | number;
}

const AnimatedCounter = ({ targetValue, trigger }: { targetValue: string | number; trigger: boolean }) => {
  const [count, setCount] = useState(0);
  
  const strVal = targetValue !== undefined && targetValue !== null ? targetValue.toString().trim() : '0';
  // Parse numeric part
  const numericPart = parseInt(strVal.replace(/\D/g, '')) || 0;
  // Get suffix (like "+" or "%")
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

const formatValue = (val: string | number | undefined | null, fallback: string) => {
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
    hidden: { opacity: 0, scale: 0.9, y: 15 },
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
    <div ref={ref} className="mt-16 sm:mt-24 w-full max-w-5xl mx-auto px-3 sm:px-6 space-y-8 sm:space-y-10">
      {/* Section Header Matching Reference: STATI (white) + STICS (lime green) */}
      <div className="flex justify-center text-center w-full relative">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#F5F7FA] tracking-tight leading-none font-['Space_Grotesk'] -mb-[25px]">
          STATI<span className="text-[#B7E36A]">STICS</span>
        </h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative bg-[#0E131A] backdrop-blur-2xl border border-[#B7E36A]/20 rounded-[1.75rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.7),0_0_50px_rgba(183,227,106,0.08)]"
      >
        {/* Soft neon corner glows */}
        <div className="absolute -top-12 -left-12 w-44 h-44 bg-[#B7E36A]/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-[#B7E36A]/20 blur-3xl rounded-full pointer-events-none" />
        
        {/* Glowing corner accent lines on top-left and bottom-right */}
        <div className="absolute top-0 left-0 w-24 sm:w-36 h-[2.5px] bg-gradient-to-r from-[#B7E36A] via-[#C8F27A] to-transparent" />
        <div className="absolute top-0 left-0 w-[2.5px] h-24 sm:h-36 bg-gradient-to-b from-[#B7E36A] via-[#C8F27A] to-transparent" />
        
        <div className="absolute bottom-0 right-0 w-24 sm:w-36 h-[2.5px] bg-gradient-to-l from-[#B7E36A] to-transparent" />
        <div className="absolute bottom-0 right-0 w-[2.5px] h-24 sm:h-36 bg-gradient-to-t from-[#B7E36A] to-transparent" />

        {/* 3 Columns Grid with subtle vertical dividers */}
        <div className="grid grid-cols-3 divide-x divide-white/10">
          
          {/* Card 1: Clients */}
          <motion.div variants={cardVariants} className="flex flex-col items-center justify-between py-6 sm:py-9 px-2 sm:px-6">
            {/* Top Header */}
            <div className="flex flex-col items-center justify-center space-y-1.5 sm:space-y-2">
              <span className="text-white font-bold text-[11px] sm:text-sm md:text-base tracking-wider uppercase font-['Space_Grotesk'] text-center">
                CLIENTS
              </span>
              <div className="w-6 sm:w-8 h-[2.5px] bg-[#B7E36A] rounded-full shadow-[0_0_8px_rgba(183,227,106,0.9)]" />
            </div>

            {/* Center Icon */}
            <div className="my-5 sm:my-8">
              <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-[#151D27] border border-[#B7E36A]/40 flex items-center justify-center shadow-[0_0_20px_rgba(183,227,106,0.18)]">
                <Users className="w-5 h-5 sm:w-7 sm:h-7 text-[#B7E36A]" />
              </div>
            </div>

            {/* Bottom Number & Label */}
            <div className="flex flex-col items-center text-center space-y-1.5 sm:space-y-2">
              <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white font-['Space_Grotesk'] tracking-tight leading-none">
                <AnimatedCounter targetValue={formatValue(siteSettings?.clients, '05')} trigger={isInView} />
              </div>
              <p className="text-[8px] sm:text-[11px] md:text-xs font-bold text-[#94A3B8] uppercase tracking-wider leading-tight font-['Space_Grotesk']">
                HAPPY CLIENTS
              </p>
              <div className="w-7 sm:w-10 h-[2.5px] sm:h-[3px] bg-[#B7E36A] rounded-full shadow-[0_0_8px_rgba(183,227,106,0.9)] mt-2 sm:mt-3" />
            </div>
          </motion.div>

          {/* Card 2: Projects */}
          <motion.div variants={cardVariants} className="flex flex-col items-center justify-between py-6 sm:py-9 px-2 sm:px-6">
            {/* Top Header */}
            <div className="flex flex-col items-center justify-center space-y-1.5 sm:space-y-2">
              <span className="text-white font-bold text-[11px] sm:text-sm md:text-base tracking-wider uppercase font-['Space_Grotesk'] text-center">
                PROJECTS
              </span>
              <div className="w-6 sm:w-8 h-[2.5px] bg-[#B7E36A] rounded-full shadow-[0_0_8px_rgba(183,227,106,0.9)]" />
            </div>

            {/* Center Icon */}
            <div className="my-5 sm:my-8">
              <div className="relative w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-[#151D27] border border-[#B7E36A]/40 flex items-center justify-center shadow-[0_0_20px_rgba(183,227,106,0.18)]">
                <Folder className="w-5 h-5 sm:w-7 sm:h-7 text-[#B7E36A]" />
                <div className="absolute -bottom-0.5 -right-0.5 bg-[#0E131A] rounded-full p-0.5">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-[#B7E36A]" />
                </div>
              </div>
            </div>

            {/* Bottom Number & Label */}
            <div className="flex flex-col items-center text-center space-y-1.5 sm:space-y-2">
              <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white font-['Space_Grotesk'] tracking-tight leading-none">
                <AnimatedCounter targetValue={formatValue(siteSettings?.projects, '56')} trigger={isInView} />
              </div>
              <p className="text-[8px] sm:text-[11px] md:text-xs font-bold text-[#94A3B8] uppercase tracking-wider leading-tight font-['Space_Grotesk']">
                COMPLETED PROJECTS
              </p>
              <div className="w-7 sm:w-10 h-[2.5px] sm:h-[3px] bg-[#B7E36A] rounded-full shadow-[0_0_8px_rgba(183,227,106,0.9)] mt-2 sm:mt-3" />
            </div>
          </motion.div>

          {/* Card 3: Hours */}
          <motion.div variants={cardVariants} className="flex flex-col items-center justify-between py-6 sm:py-9 px-2 sm:px-6">
            {/* Top Header */}
            <div className="flex flex-col items-center justify-center space-y-1.5 sm:space-y-2">
              <span className="text-white font-bold text-[11px] sm:text-sm md:text-base tracking-wider uppercase font-['Space_Grotesk'] text-center">
                HOURS
              </span>
              <div className="w-6 sm:w-8 h-[2.5px] bg-[#B7E36A] rounded-full shadow-[0_0_8px_rgba(183,227,106,0.9)]" />
            </div>

            {/* Center Icon */}
            <div className="my-5 sm:my-8">
              <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-[#151D27] border border-[#B7E36A]/40 flex items-center justify-center shadow-[0_0_20px_rgba(183,227,106,0.18)]">
                <Clock className="w-5 h-5 sm:w-7 sm:h-7 text-[#B7E36A]" />
              </div>
            </div>

            {/* Bottom Number & Label */}
            <div className="flex flex-col items-center text-center space-y-1.5 sm:space-y-2">
              <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#B7E36A] font-['Space_Grotesk'] tracking-tight leading-none drop-shadow-[0_0_20px_rgba(183,227,106,0.4)]">
                <AnimatedCounter targetValue={formatValue(siteSettings?.hours, '200')} trigger={isInView} />
              </div>
              <p className="text-[8px] sm:text-[11px] md:text-xs font-bold text-[#94A3B8] uppercase tracking-wider leading-tight font-['Space_Grotesk']">
                TOTAL HOURS
              </p>
              <div className="w-7 sm:w-10 h-[2.5px] sm:h-[3px] bg-[#B7E36A] rounded-full shadow-[0_0_8px_rgba(183,227,106,0.9)] mt-2 sm:mt-3" />
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

