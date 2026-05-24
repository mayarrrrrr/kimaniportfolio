import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Pencil } from 'lucide-react';
import { useRef, useState } from 'react';

import about from '../assets/heroo.jpeg';

/* ── shared easing ── */
const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 56 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.13, ease },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

/* ── little stat pill ── */
const Stat = ({ value, label, color, dark }) => (
  <div
    className="flex flex-col items-center justify-center px-5 py-4 rounded-2xl"
    style={{
      background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
      border: `1px solid ${color}33`,
    }}
  >
    <span className="text-3xl font-black" style={{ color, fontFamily: 'Georgia, serif' }}>
      {value}
    </span>
    <span
      className="text-[9px] uppercase tracking-[0.4em] mt-1"
      style={{ color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}
    >
      {label}
    </span>
  </div>
);

const About = ({ darkMode }) => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const imgY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);
  const glowY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  /* ─────────────────────────────────────────────
     AUTH (DISABLED FOR TESTING)
     ───────────────────────────────────────────── */

  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const unsub = onAuthStateChanged(auth, (u) => setUser(u));
  //   return () => unsub();
  // }, []);

  // const handleLogin = async () => {
  //   try {
  //     await signInWithPopup(auth, provider);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const handleLogout = async () => {
  //   await signOut(auth);
  // };

  const user = null; // TEMP: no authentication
  const allowedEmail = 'akokajiek@outlook.com';
  const canEdit = false; // TEMP: disable editing

  /* ── UI STATE ── */
  const [aboutText, setAboutText] = useState(
    `Kelvin Kimani is a Nairobi-based creative focused on audio visual production, cinematic storytelling, photography, and live event experiences.`
  );

  const dark = darkMode;
  const text = dark ? '#ffffff' : '#111111';
  const muted = dark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.42)';
  const cardBg = dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.55)';
  const cardBorder = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen overflow-hidden flex items-center"
      style={{ background: dark ? '#080808' : '#f0ebe2' }}
    >
      {/* BACKGROUND EFFECTS */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none" />

      {/* MAIN CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-8 lg:px-16 py-28 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -70 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1 }}
          viewport={{ once: true }}
          className="relative flex justify-center"
        >
          <motion.div style={{ y: imgY }} className="relative w-full max-w-[420px] rounded-[2rem] overflow-hidden">
            <img src={about} alt="Kelvin Kimani" className="w-full h-[560px] object-cover" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

            <div className="absolute bottom-0 p-6">
              <h3 className="text-white text-2xl font-black uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                Kelvin Kimani
              </h3>
              <p className="text-white/50 text-xs uppercase">Nairobi, Kenya</p>
            </div>
          </motion.div>
        </motion.div>

        {/* CONTENT */}
        <motion.article
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h1
            variants={fadeUp}
            className="text-5xl lg:text-7xl font-black uppercase"
            style={{ color: text, fontFamily: 'Georgia, serif' }}
          >
            Capturing Stories Through Visuals
          </motion.h1>

          {/* BIO */}
          <motion.div
            variants={fadeUp}
            className="mt-8 p-7 rounded-3xl"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            {canEdit ? (
              <textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                className="w-full min-h-[180px] bg-transparent outline-none"
                style={{ color: text }}
              />
            ) : (
              <p style={{ color: muted, whiteSpace: 'pre-line' }}>{aboutText}</p>
            )}

            {canEdit && (
              <div className="mt-3 text-orange-400 text-xs uppercase flex items-center gap-2">
                <Pencil size={12} />
                Editing Mode
              </div>
            )}
          </motion.div>

          {/* CTA */}
          <a href='https://www.linkedin.com/in/kelvin-kimani-5b8623190/'>
          <motion.button
            variants={fadeUp}
            className="mt-8 px-8 py-4 rounded-full text-white uppercase tracking-widest flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}
          >
            Explore Journey
            <ArrowRight size={16} />
          </motion.button>
          </a>
        </motion.article>
      </div>
    </section>
  );
};

export default About;