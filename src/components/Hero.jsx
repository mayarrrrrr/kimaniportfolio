import {
  Download,
  Mail,
  Play,
  Plus,
  ArrowRight,
  Moon,
  Sun,
} from "lucide-react";

import { motion } from "framer-motion";
import { useState } from "react";

import hero from "../assets/kelvin.jpeg";
import CV from "../assets/Kelvinkimani.pdf";
import demoVideo from "../assets/showreeel.mp4";

const Hero = () => {
  const [darkMode, setDarkMode] = useState(true);

  const theme = darkMode
    ? {
        bg: "bg-black",
        text: "text-white",
        secondary: "text-white/70",
        card: "bg-white/5 border-white/10",
        button:
          "bg-orange-500 hover:bg-orange-400 text-white",
        secondaryBtn:
          "bg-white/5 border-white/10 hover:bg-white/10 text-white",
        overlay:
          "bg-gradient-to-r from-orange-950/40 via-black/40 to-black",
      }
    : {
        bg: "bg-[#f4efe7]",
        text: "text-[#1a1a1a]",
        secondary: "text-[#444]",
        card: "bg-white/40 border-black/10",
        button:
          "bg-[#1a1a1a] hover:bg-black text-white",
        secondaryBtn:
          "bg-white/40 border-black/10 hover:bg-white/70 text-[#111]",
        overlay:
          "bg-gradient-to-r from-orange-200/30 via-white/20 to-white",
      };

  return (
    <section
      id="home"
      className={`relative min-h-screen overflow-hidden transition-all duration-700 ${theme.bg}`}
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <img
          src={hero}
          alt=""
          className={`
            w-full h-full object-cover scale-105
            ${darkMode ? "opacity-40" : "opacity-20"}
          `}
        />

        {/* cinematic overlay */}
        <div
          className={`absolute inset-0 ${theme.overlay}`}
        ></div>

        {/* film grain */}
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:14px_14px]"></div>
      </div>

      {/* TOP BAR */}
      <div
        className={`
          absolute top-0 left-0 w-full z-40
          flex justify-between items-center
          px-5 lg:px-10 py-5
          text-[10px] uppercase tracking-[0.3em]
          ${theme.secondary}
        `}
      >
        <div className="flex gap-6">
          
          <span>F 2.8</span>
          <span>1/125</span>
          
        </div>

        {/* DARK MODE TOGGLE */}
        {/* <button
          onClick={() => setDarkMode(!darkMode)}
          className={`
            w-12 h-12 rounded-full
            border flex items-center justify-center
            backdrop-blur-xl transition-all duration-300
            ${theme.card}
          `}
        >
          {darkMode ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button> */}
        <span>ISO 800</span>
        
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-20 container mx-auto px-5 lg:px-10 py-32 flex flex-col justify-center min-h-screen">
        
        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-16"
        >
          <h1
            className={`
              text-5xl
              sm:text-7xl
              lg:text-[8rem]
              font-black
              uppercase
              leading-[0.9]
              tracking-tight
              ${theme.text}
            `}
          >
            Cinematic
            <br />
            Stories
          </h1>

          <div className="mt-5 flex items-center gap-3 text-orange-400 tracking-[0.3em] uppercase text-xs">
            <div className="w-12 h-[1px] bg-orange-400"></div>
            Kelvin Kimani — Audio Visual Technician
          </div>
        </motion.div>

        {/* FLOATING CARDS */}
        <div className="relative flex flex-col lg:flex-row items-start gap-6">
          
          {/* LEFT CARD */}
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            whileHover={{ y: -10 }}
            className={`
              w-full lg:w-[320px]
              h-[380px]
              rounded-[2rem]
              overflow-hidden
              border backdrop-blur-2xl
              relative group transition-all duration-500
              ${theme.card}
            `}
          >
            <img
              src={hero}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition duration-700"
            />

            <div className="absolute inset-0 bg-black/30"></div>

            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/60">
                  Collection
                </p>

                <h2 className="mt-3 text-3xl font-semibold text-white">
                  Visual
                  <br />
                  Production
                </h2>
              </div>

              <div className="space-y-2 text-xs uppercase tracking-[0.2em] text-white/70">
                <p>Photography</p>
                <p>Film Direction</p>
                <p>Sound Design</p>
                <p>Live Sessions</p>
              </div>
            </div>
          </motion.div>

          {/* PLUS */}
          <motion.div
            animate={{
              opacity: [0.2, 1, 0.2],
              rotate: [0, 90, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
            }}
            className="hidden lg:flex absolute left-[36%] top-1/2 -translate-y-1/2 text-white/40"
          >
            <Plus size={28} strokeWidth={1} />
          </motion.div>

          {/* VIDEO CARD */}
          <motion.div
            initial={{ opacity: 0, x: 70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            whileHover={{ y: -10 }}
            className={`
              w-full lg:w-[430px]
              h-[380px]
              rounded-[2rem]
              overflow-hidden
              border backdrop-blur-2xl
              relative
              ${theme.card}
            `}
          >
            {/* VIDEO */}
            <video
              src={demoVideo}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Glow */}
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-500/20 blur-3xl"></div>

            <div className="relative z-10 h-full p-6 flex flex-col justify-between">
              
              <div className="flex justify-between">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/70">
                  Video Track
                </p>

                <p className="text-[10px] text-white/50">
                  LIVE SESSION
                </p>
              </div>

              {/* waveform */}
              <div className="flex items-center justify-center gap-[3px] h-28">
                {[20, 45, 70, 30, 100, 50, 80, 35, 90, 40].map(
                  (height, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [
                          `${height}px`,
                          `${height + 20}px`,
                          `${height}px`,
                        ],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        delay: i * 0.1,
                      }}
                      className="w-[4px] rounded-full bg-orange-300"
                    />
                  )
                )}
              </div>

              {/* bottom controls */}
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-white hover:text-orange-300 transition">
                  <Play size={18} fill="white" />
                  Playing
                </button>

                <span className="text-xs text-white/50">
                  00:17
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-14 flex flex-col sm:flex-row gap-5"
        >
          <a href={CV} download>
            <button
              className={`
                px-8 py-4 rounded-full
                flex items-center gap-3
                uppercase tracking-[0.2em]
                text-sm font-medium
                transition-all duration-300
                hover:scale-105
                ${theme.button}
              `}
            >
              <Download size={18} />
              Download CV
            </button>
          </a>

          <a href="#contact">
            <button
              className={`
                px-8 py-4 rounded-full border
                backdrop-blur-xl
                flex items-center gap-3
                uppercase tracking-[0.2em]
                text-sm font-medium
                transition-all duration-300
                hover:scale-105
                ${theme.secondaryBtn}
              `}
            >
              <Mail size={18} />
              Contact
            </button>
          </a>

          <button
            className={`
              group flex items-center gap-3
              uppercase tracking-[0.2em]
              text-sm transition-all
              ${theme.secondary}
            `}
            id="#projects"
            href="#projects"
          >
            Explore Projects

            <ArrowRight
              size={18}
              className="group-hover:translate-x-2 transition"
            />
          </button>
        </motion.div>
      </div>

      {/* cinematic fade */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
};

export default Hero;