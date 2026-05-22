import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';

const Skills = ({ darkMode }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const lightY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  const initialSkills = [
    {
      title: 'Photography',
      description: 'Capturing cinematic frames with storytelling composition.',
      tag: 'Still · Frame · Light',
      index: '01',
      color: '#f97316',
    },
    {
      title: 'Videography',
      description: 'Creating immersive visuals through motion and atmosphere.',
      tag: 'Motion · Scene · Flow',
      index: '02',
      color: '#fb923c',
    },
    {
      title: 'Film Direction',
      description: 'Directing visual narratives with emotional depth.',
      tag: 'Vision · Depth · Emotion',
      index: '03',
      color: '#f59e0b',
    },
    {
      title: 'Color Grading',
      description: 'Crafting cinematic moods through light and tone.',
      tag: 'Tone · Mood · Grade',
      index: '04',
      color: '#ea580c',
    },
    {
      title: 'Sound Design',
      description: 'Designing audio experiences that elevate visuals.',
      tag: 'Audio · Texture · Space',
      index: '05',
      color: '#d97706',
    },
  ];

  const [cards, setCards] = useState(initialSkills);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCardClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const updated = [...cards];
    const firstCard = updated.shift();
    updated.push(firstCard);
    setCards(updated);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const isDark = darkMode;

  /* ─── FADE-UP VARIANTS ─── */
  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative min-h-screen overflow-hidden"
      style={{ background: isDark ? '#080808' : '#f0ebe2' }}
    >
      {/* ── PARALLAX FILM STRIP BACKGROUND ── */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        {/* Film strip left */}
        <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col gap-0">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 h-20 border-r-2 flex flex-col justify-around px-1"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)' }}
            >
              <div className="w-3 h-3 rounded-sm" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)' }} />
              <div className="w-3 h-3 rounded-sm" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)' }} />
            </div>
          ))}
        </div>

        {/* Film strip right */}
        <div className="absolute right-0 top-0 bottom-0 w-16 flex flex-col gap-0">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 h-20 border-l-2 flex flex-col justify-around px-1 items-end"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)' }}
            >
              <div className="w-3 h-3 rounded-sm" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)' }} />
              <div className="w-3 h-3 rounded-sm" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)' }} />
            </div>
          ))}
        </div>

        {/* Diagonal scan lines overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)',
          }}
        />
      </motion.div>

      {/* ── LIGHT LEAKS & ORBS ── */}
      <motion.div style={{ y: lightY }} className="absolute inset-0 pointer-events-none">
        {/* Main orange glow – top left */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)', filter: 'blur(80px)' }}
        />

        {/* Amber glow – bottom right */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.38, 0.2] }}
          transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', filter: 'blur(90px)' }}
        />

        {/* Cool counter-light – center */}
        <motion.div
          animate={{ opacity: [0.08, 0.18, 0.08] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, #1d4ed8 0%, transparent 70%)', filter: 'blur(120px)' }}
        />
      </motion.div>

      {/* ── FLOATING FILM META TAGS ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 7 }}
          className="absolute top-24 right-24 hidden lg:flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
            REC · 24fps
          </span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 9, delay: 1 }}
          className="absolute bottom-32 right-20 hidden lg:block"
        >
          <p className="text-[9px] tracking-[0.5em] uppercase" style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>
            SCENE 01 / TAKE 01
          </p>
        </motion.div>

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 6, delay: 2 }}
          className="absolute bottom-40 left-20 hidden lg:block"
        >
          <p className="text-[9px] tracking-[0.5em] uppercase" style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>
            ISO 800 · f/1.8 · 1/500
          </p>
        </motion.div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-20 max-w-7xl mx-auto px-8 lg:px-16 py-28">

        {/* ── SECTION HEADER ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-24"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
            <div className="h-[1px] w-10 bg-orange-400" />
            <span className="text-[10px] uppercase tracking-[0.5em] text-orange-400">
              Expertise
            </span>
            <div className="h-[1px] w-10 bg-orange-400 opacity-40" />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-6xl lg:text-8xl font-black uppercase leading-[0.85] tracking-tight"
            style={{
              color: isDark ? '#fff' : '#111',
              fontFamily: "'Georgia', serif",
            }}
          >
            Creative
            <br />
            <span
              style={{
                WebkitTextStroke: isDark ? '2px rgba(255,255,255,0.15)' : '2px rgba(0,0,0,0.1)',
                color: 'transparent',
              }}
            >
              Skillset
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-6 max-w-md text-sm leading-relaxed"
            style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)' }}
          >
            A visual director's toolkit — from the first frame to the final cut, every skill is a lens on the world.
          </motion.p>
        </motion.div>

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: STACKED POLAROID CARDS */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="relative h-[520px] flex items-center justify-center"
          >
            {/* Rotating reel decoration */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 50, ease: 'linear' }}
              className="absolute -top-8 -left-8 w-40 h-40 rounded-full opacity-20"
              style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}` }}
            >
              <div className="absolute inset-4 rounded-full" style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}` }} />
              <div className="absolute inset-8 rounded-full" style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}` }} />
            </motion.div>

            {/* Soft card glow */}
            <div
              className="absolute w-72 h-72 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.25) 0%, transparent 70%)', filter: 'blur(50px)' }}
            />

            <AnimatePresence>
              {cards.map((card, index) => (
                <motion.div
                  key={card.title}
                  onClick={handleCardClick}
                  initial={{ opacity: 0, y: 80, scale: 0.85 }}
                  animate={{
                    opacity: Math.max(0, 1 - index * 0.18),
                    y: index * 28,
                    scale: 1 - index * 0.045,
                    rotate: index % 2 === 0 ? -5 + index * 0.5 : 5 - index * 0.5,
                    zIndex: cards.length - index,
                  }}
                  exit={{ opacity: 0, y: -120, scale: 0.8, rotate: -15, transition: { duration: 0.5 } }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={index === 0 ? { y: -12, scale: 1.02, rotate: -3 } : {}}
                  className="absolute cursor-pointer"
                  style={{ transformOrigin: 'center bottom' }}
                >
                  {/* POLAROID CARD */}
                  <div
                    className="relative w-[280px] sm:w-[320px] rounded-2xl overflow-hidden"
                    style={{
                      background: isDark
                        ? 'linear-gradient(145deg, #1c1c1c, #111)'
                        : 'linear-gradient(145deg, #fff, #f5f0e8)',
                      boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
                      padding: '14px 14px 28px',
                    }}
                  >
                    {/* Tape strip */}
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-7 rotate-[-3deg]"
                      style={{ background: 'rgba(249,115,22,0.3)', backdropFilter: 'blur(2px)', borderRadius: '2px' }}
                    />

                    {/* Image area */}
                    <div className="relative w-full h-52 rounded-xl overflow-hidden">
                      {/* Cinematic gradient placeholder */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(135deg, ${card.color}33 0%, #000 60%, ${card.color}22 100%)`,
                        }}
                      />

                      {/* Grid texture */}
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                          backgroundSize: '20px 20px',
                        }}
                      />

                      {/* Film grain */}
                      <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
                          backgroundSize: '150px 150px',
                        }}
                      />

                      {/* Large index number */}
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ fontSize: '8rem', fontWeight: 900, color: 'rgba(255,255,255,0.06)', fontFamily: 'Georgia, serif', lineHeight: 1 }}
                      >
                        {card.index}
                      </div>

                      {/* Orange glow bottom */}
                      <div
                        className="absolute -bottom-4 -right-4 w-40 h-40 rounded-full"
                        style={{ background: `radial-gradient(circle, ${card.color}55, transparent 70%)`, filter: 'blur(20px)' }}
                      />

                      {/* REC indicator */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[9px] uppercase tracking-[0.3em] text-white/60">REC</span>
                      </div>

                      {/* Tag top right */}
                      <div className="absolute top-3 right-3">
                        <div
                          className="px-2 py-1 rounded text-[9px] uppercase tracking-widest"
                          style={{ background: 'rgba(0,0,0,0.5)', color: card.color, backdropFilter: 'blur(8px)' }}
                        >
                          {card.index}
                        </div>
                      </div>

                      {/* Bottom gradient overlay */}
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
                    </div>

                    {/* Card content */}
                    <div className="pt-5 px-2">
                      <p className="text-[9px] uppercase tracking-[0.4em]" style={{ color: card.color }}>
                        {card.tag}
                      </p>
                      <h2
                        className="mt-2 text-2xl font-black uppercase"
                        style={{ color: isDark ? '#fff' : '#111', fontFamily: 'Georgia, serif' }}
                      >
                        {card.title}
                      </h2>
                      <p className="mt-2 text-xs leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                        {card.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Click hint */}
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -bottom-10 flex items-center gap-2"
            >
              <div className="w-4 h-4 rounded-full border" style={{ borderColor: 'rgba(249,115,22,0.5)' }} />
              <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
                Click to cycle
              </span>
            </motion.div>
          </motion.div>

          {/* RIGHT: SKILL LIST + STATS */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-6"
          >
            {/* Skill rows */}
            {initialSkills.map((skill, i) => (
              <motion.div
                key={skill.title}
                variants={fadeUp}
                custom={i}
                className="group flex items-center gap-5 p-5 rounded-2xl cursor-default transition-all duration-300"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                  border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)',
                }}
                whileHover={{
                  background: isDark ? 'rgba(249,115,22,0.07)' : 'rgba(249,115,22,0.06)',
                  borderColor: `${skill.color}44`,
                  x: 6,
                }}
              >
                {/* Number */}
                <span
                  className="text-xs font-black tabular-nums"
                  style={{ color: skill.color, fontFamily: 'Georgia, serif', minWidth: '24px' }}
                >
                  {skill.index}
                </span>

                {/* Divider */}
                <div className="w-px h-8" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

                {/* Text */}
                <div className="flex-1">
                  <p
                    className="text-sm font-bold uppercase tracking-wider"
                    style={{ color: isDark ? '#fff' : '#111' }}
                  >
                    {skill.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                    {skill.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${85 + i * 3}%` }}
                    transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}99)` }}
                  />
                </div>
              </motion.div>
            ))}

            {/* Stats row */}
            <motion.div
              variants={fadeUp}
              custom={6}
              className="grid grid-cols-3 gap-4 pt-4"
            >
              {[
                { value: '200+', label: 'Projects' },
                { value: '8 yrs', label: 'Experience' },
                { value: '4K', label: 'Resolution' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-2xl"
                  style={{
                    background: isDark ? 'rgba(249,115,22,0.06)' : 'rgba(249,115,22,0.07)',
                    border: '1px solid rgba(249,115,22,0.15)',
                  }}
                >
                  <p className="text-2xl font-black" style={{ color: '#f97316', fontFamily: 'Georgia, serif' }}>
                    {stat.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.3em] mt-1" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── BOTTOM CINEMATIC QUOTE ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="mt-32 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-orange-400 mb-4">
              Motion · Light · Sound
            </p>
            <h2
              className="text-5xl lg:text-6xl font-black leading-[0.9] uppercase"
              style={{ color: isDark ? '#fff' : '#111', fontFamily: 'Georgia, serif' }}
            >
              Every frame
              <br />
              <span
                style={{
                  WebkitTextStroke: isDark ? '1.5px rgba(255,255,255,0.2)' : '1.5px rgba(0,0,0,0.15)',
                  color: 'transparent',
                }}
              >
                tells a story.
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-[1px] w-16" style={{ background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }} />
            <p className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
              Visual Storytelling
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;