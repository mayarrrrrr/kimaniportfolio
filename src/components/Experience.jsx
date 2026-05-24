import {
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';

import { useRef } from 'react';

const Experience = ({ darkMode }) => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  const experiences = [
    {
      year: '2024 — Present',
      role: 'Audio Visual Technician',
      company: 'Kenya Red Cross',
      description:
        'Crafting cinematic multimedia content including documentaries, promotional reels, social media visuals, and storytelling campaigns focused on humanitarian impact and community engagement. Handles production conceptualization, editing workflows, platform optimization, and editorial storytelling.',
      tag: 'Documentary · Multimedia · Storytelling',
      color: '#f97316',
      type: 'Full-time',
      stack: [
        'Premiere Pro',
        'Storytelling',
        'Documentary',
        'Visual Editing',
      ],
    },

   

   
  ];

  const isDark = darkMode;

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative min-h-screen overflow-hidden"
      style={{
        background: isDark ? '#050505' : '#f3ede5',
      }}
    >
      {/* BACKGROUND */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Film strip */}
        <div className="absolute left-0 top-0 h-full w-16 flex flex-col">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="h-20 border-r flex flex-col justify-around px-1"
              style={{
                borderColor: isDark
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.06)',
              }}
            >
              <div className="w-3 h-3 rounded-sm bg-white/5" />
              <div className="w-3 h-3 rounded-sm bg-white/5" />
            </div>
          ))}
        </div>

        {/* Scan lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 4px)',
          }}
        />

        {/* Orange cinematic glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: 'easeInOut',
          }}
          className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(249,115,22,0.25), transparent 70%)',
            filter: 'blur(90px)',
          }}
        />

        {/* Blue glow */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.12, 0.2, 0.12],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: 'easeInOut',
          }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </motion.div>

      {/* FLOATING META */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="absolute top-24 right-20 hidden lg:block"
        >
          <p
            className="text-[10px] tracking-[0.5em] uppercase"
            style={{
              color: isDark
                ? 'rgba(255,255,255,0.25)'
                : 'rgba(0,0,0,0.25)',
            }}
          >
            REC • ARCHIVE
          </p>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
          className="absolute bottom-32 left-16 hidden lg:block"
        >
          <p
            className="text-[9px] tracking-[0.5em] uppercase"
            style={{
              color: isDark
                ? 'rgba(255,255,255,0.2)'
                : 'rgba(0,0,0,0.2)',
            }}
          >
            ISO 400 • CINEMA LOG
          </p>
        </motion.div>
      </div>

      {/* CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-8 lg:px-16 py-28">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-[1px] bg-orange-400" />

            <p className="text-[10px] uppercase tracking-[0.5em] text-orange-400">
              Career Journey
            </p>
          </div>

          <h1
            className="text-6xl lg:text-8xl font-black uppercase leading-[0.85]"
            style={{
              color: isDark ? '#fff' : '#111',
              fontFamily: 'Georgia, serif',
            }}
          >
            Work
            <br />

            <span
              style={{
                WebkitTextStroke: isDark
                  ? '2px rgba(255,255,255,0.15)'
                  : '2px rgba(0,0,0,0.1)',
                color: 'transparent',
              }}
            >
              Experience
            </span>
          </h1>

          <p
            className="mt-6 max-w-lg text-sm leading-relaxed"
            style={{
              color: isDark
                ? 'rgba(255,255,255,0.45)'
                : 'rgba(0,0,0,0.45)',
            }}
          >
            Capturing stories through motion, light, sound, and emotion —
            from humanitarian documentaries to cinematic productions.
          </p>
        </motion.div>

        {/* TIMELINE */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[22px] top-0 bottom-0 w-px"
            style={{
              background: isDark
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(0,0,0,0.1)',
            }}
          />

          <div className="space-y-16">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: index * 0.12,
                }}
                viewport={{ once: true, amount: 0.2 }}
                className="relative flex gap-8"
              >
                {/* Timeline Dot */}
                <div className="relative z-10 mt-4">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center border"
                    style={{
                      background: isDark ? '#111' : '#fff',
                      borderColor: `${exp.color}55`,
                      boxShadow: `0 0 25px ${exp.color}55`,
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                      }}
                      className="w-3 h-3 rounded-full"
                      style={{ background: exp.color }}
                    />
                  </div>
                </div>

                {/* CARD */}
                <motion.div
                  whileHover={{
                    y: -10,
                    borderColor: `${exp.color}55`,
                  }}
                  className="relative flex-1 rounded-[28px] p-8 overflow-hidden transition-all duration-500"
                  style={{
                    background: isDark
                      ? 'rgba(255,255,255,0.03)'
                      : 'rgba(255,255,255,0.6)',

                    border: isDark
                      ? '1px solid rgba(255,255,255,0.06)'
                      : '1px solid rgba(0,0,0,0.06)',

                    backdropFilter: 'blur(14px)',

                    boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
                  }}
                >
                  {/* Film grain */}
                  <div
                    className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{
                      backgroundImage:
                        'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                    }}
                  />

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 rounded-[28px] pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${exp.color}10 0%, transparent 50%)`,
                    }}
                  />

                  {/* TOP */}
                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                      <p
                        className="text-xs uppercase tracking-[0.4em]"
                        style={{ color: exp.color }}
                      >
                        {exp.year}
                      </p>

                      <h2
                        className="mt-2 text-3xl lg:text-4xl font-black uppercase leading-none"
                        style={{
                          color: isDark ? '#fff' : '#111',
                          fontFamily: 'Georgia, serif',
                        }}
                      >
                        {exp.role}
                      </h2>

                      <p
                        className="mt-2 text-sm uppercase tracking-[0.3em]"
                        style={{
                          color: isDark
                            ? 'rgba(255,255,255,0.4)'
                            : 'rgba(0,0,0,0.4)',
                        }}
                      >
                        {exp.company}
                      </p>

                      {/* TYPE */}
                      <div className="flex items-center gap-3 mt-4">
                        <div
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{ background: exp.color }}
                        />

                        <p
                          className="text-[10px] uppercase tracking-[0.35em]"
                          style={{
                            color: isDark
                              ? 'rgba(255,255,255,0.35)'
                              : 'rgba(0,0,0,0.35)',
                          }}
                        >
                          {exp.type}
                        </p>
                      </div>
                    </div>

                    {/* REC */}
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />

                      <p className="text-[10px] tracking-[0.3em] uppercase text-white/40">
                        Active
                      </p>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <p
                    className="relative z-10 mt-6 text-sm leading-relaxed max-w-2xl"
                    style={{
                      color: isDark
                        ? 'rgba(255,255,255,0.5)'
                        : 'rgba(0,0,0,0.55)',
                    }}
                  >
                    {exp.description}
                  </p>

                  {/* TAG */}
                  <div className="relative z-10 mt-6 inline-flex">
                    <div
                      className="px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.3em]"
                      style={{
                        background: `${exp.color}15`,
                        border: `1px solid ${exp.color}30`,
                        color: exp.color,
                      }}
                    >
                      {exp.tag}
                    </div>
                  </div>

                  {/* STACK */}
                  <div className="relative z-10 mt-8 flex flex-wrap gap-3">
                    {exp.stack.map((item) => (
                      <motion.div
                        key={item}
                        whileHover={{
                          y: -3,
                          scale: 1.03,
                        }}
                        className="px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.25em]"
                        style={{
                          background: `${exp.color}15`,
                          border: `1px solid ${exp.color}30`,
                          color: exp.color,
                        }}
                      >
                        {item}
                      </motion.div>
                    ))}
                  </div>

                  {/* TIMECODE */}
                  <div className="absolute bottom-5 right-6">
                    <p
                      className="text-[9px] tracking-[0.3em]"
                      style={{
                        color: isDark
                          ? 'rgba(255,255,255,0.2)'
                          : 'rgba(0,0,0,0.2)',
                      }}
                    >
                      00:0{index + 1}:24:08
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FOOTER QUOTE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-orange-400 mb-4">
            Motion · Light · Storytelling
          </p>

          <h2
            className="text-5xl lg:text-7xl font-black uppercase leading-[0.9]"
            style={{
              color: isDark ? '#fff' : '#111',
              fontFamily: 'Georgia, serif',
            }}
          >
            Every story
            <br />

            <span
              style={{
                WebkitTextStroke: isDark
                  ? '1.5px rgba(255,255,255,0.2)'
                  : '1.5px rgba(0,0,0,0.15)',
                color: 'transparent',
              }}
            >
              deserves cinematic emotion.
            </span>
          </h2>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;