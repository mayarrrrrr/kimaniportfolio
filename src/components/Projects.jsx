import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, X,
  Image, Film, Star, Play,
  Loader2, AlertCircle, FolderOpen, ChevronLeft,
  Heart, Bird, Home, Calendar,Landmark
} from 'lucide-react';

import { useProjects }       from './useProjects';
import UploadModal           from './Uploadmodal';
import EditModal             from './Editmodal';
import ProgressiveImage      from './Progressiveimage';
import { gridThumb, blurPlaceholder, lightboxSrc } from './Mediautils';
import { extractVideoThumbnail } from './VideoThumbnail';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../firebase';

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden  : { opacity: 0, y: 48 },
  visible : (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.82, delay: i * 0.08, ease },
  }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };

/* ─── Folder definitions ────────────────────────────────────────── */
export const FOLDERS = [
  {
    key   : 'humanitarian',
    label : 'Humanitarian',
    icon  : Heart,
    color : '#ef4444',
    glow  : 'rgba(239,68,68,0.25)',
    desc  : 'Stories of people & communities',
  },
  {
  key   : 'culture',
  label : 'Culture',
  icon  : Landmark,
  color : '#f59e0b',
  glow  : 'rgba(245,158,11,0.25)',
  desc  : 'Art, traditions & cultural stories',
},
  {
    key   : 'wildlife',
    label : 'Wildlife',
    icon  : Bird,
    color : '#22c55e',
    glow  : 'rgba(34,197,94,0.25)',
    desc  : 'Nature & wildlife photography',
  },
  {
    key   : 'real estate',
    label : 'Real Estate',
    icon  : Home,
    color : '#3b82f6',
    glow  : 'rgba(59,130,246,0.25)',
    desc  : 'Architecture & property',
  },
  {
    key   : 'events',
    label : 'Events',
    icon  : Calendar,
    color : '#a855f7',
    glow  : 'rgba(168,85,247,0.25)',
    desc  : 'Weddings, concerts & celebrations',
  },
];

/* ─── Folder row (cinematic list style) ─────────────────────────── */
const FolderCard = ({ folder, projects, dark, onClick, index }) => {
  const [hovering, setHovering] = useState(false);
  const Icon  = folder.icon;

  const count = projects.filter(p =>
    p.tags?.some(t => t.toLowerCase() === folder.key)
  ).length;

  // collect up to 3 sample thumbnails for the preview strip
  const samples = projects
    .filter(p =>
      p.tags?.some(t => t.toLowerCase() === folder.key) &&
      (p.cloudinaryId || p.thumbnailUrl || p.url)
    )
    .slice(0, 1)
    .map(p => p.cloudinaryId ? gridThumb(p.cloudinaryId) : p.thumbnailUrl ?? p.url);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.015, x: 6 }}
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="flex items-center justify-between px-6 py-5 rounded-2xl border cursor-pointer transition-all"
      style={{
        background  : hovering
          ? dark ? `rgba(255,255,255,0.055)` : `rgba(255,255,255,0.85)`
          : dark ? 'rgba(255,255,255,0.03)'  : 'rgba(255,255,255,0.6)',
        borderColor : hovering
          ? folder.color + '55'
          : dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        backdropFilter: 'blur(20px)',
        boxShadow: hovering
          ? `0 0 0 1px ${folder.color}22, 0 12px 40px rgba(0,0,0,0.15)`
          : 'none',
        transition: 'all 0.35s ease',
      }}
    >
      {/* Left — icon + label */}
      <div className="flex items-center gap-5">
        {/* Icon badge */}
        <motion.div
          animate={{ scale: hovering ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `${folder.color}18`,
            border    : `1px solid ${folder.color}35`,
          }}
        >
          <Icon size={18} style={{ color: folder.color }} />
        </motion.div>

        {/* Text */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em]"
            style={{ color: folder.color }}>
            {count} {count === 1 ? 'item' : 'items'}
          </p>
          <p className="text-lg font-bold mt-0.5 uppercase tracking-wide"
            style={{ color: dark ? '#fff' : '#111', fontFamily: 'Georgia, serif' }}>
            {folder.label}
          </p>
          <p className="text-[11px] mt-0.5"
            style={{ color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
            {folder.desc}
          </p>
        </div>
      </div>

      {/* Right — thumbnail strip + arrow */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Thumbnail strip */}
        {samples.length > 0 && (
          <div className="flex -space-x-3">
            {samples.map((src, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                style={{
                  border  : `2px solid ${dark ? '#111' : '#f0ebe2'}`,
                  zIndex  : samples.length - i,
                  opacity : hovering ? 1 : 0.7,
                  transform: hovering ? `translateX(${i * -2}px)` : 'none',
                  transition: `all 0.35s ease ${i * 0.04}s`,
                }}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Arrow */}
        <motion.span
          animate={{ x: hovering ? 4 : 0, opacity: hovering ? 1 : 0.5 }}
          transition={{ duration: 0.3 }}
          className="text-xl"
          style={{ color: '#f97316' }}
        >
          →
        </motion.span>
      </div>
    </motion.div>
  );
};

/* ─── Status badge ──────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  if (status === 'ready' || !status) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
      {status === 'processing' && (
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-orange-400" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/60">Processing…</p>
        </div>
      )}
      {status === 'error' && (
        <div className="flex flex-col items-center gap-2">
          <AlertCircle size={28} className="text-red-400" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-red-400">Upload failed</p>
        </div>
      )}
    </div>
  );
};

/* ─── Project card ──────────────────────────────────────────────── */
const ProjectCard = ({ project, canEdit, onEdit, onDelete, onPreview, dark }) => {
  const [hovering, setHovering]         = useState(false);
  const [confirming, setConfirming]     = useState(false);
  const [autoThumb, setAutoThumb]       = useState(null);
  const [thumbLoading, setThumbLoading] = useState(false);

  const isPhoto   = project.type === 'photo';
  const isYT      = !isPhoto && project.videoSource === 'youtube';
  const isVimeo   = !isPhoto && project.videoSource === 'vimeo';
  const isDirect  = !isPhoto && !isYT && !isVimeo;

  const ytThumb = isYT && project.embedUrl
    ? `https://img.youtube.com/vi/${project.embedUrl.split('/').pop()}/maxresdefault.jpg`
    : null;

  const thumbSrc = isPhoto
    ? (project.cloudinaryId ? gridThumb(project.cloudinaryId) : project.url)
    : (project.thumbnailUrl ?? ytThumb ?? autoThumb ?? null);

  const placeholder = isPhoto && project.cloudinaryId
    ? blurPlaceholder(project.cloudinaryId)
    : null;

  useEffect(() => {
    if (!isDirect || project.thumbnailUrl || !project.url) return;
    let cancelled = false;
    setThumbLoading(true);
    extractVideoThumbnail(project.url, 1).then((dataUrl) => {
      if (!cancelled) { setAutoThumb(dataUrl); setThumbLoading(false); }
    });
    return () => { cancelled = true; };
  }, [isDirect, project.thumbnailUrl, project.url]);

  const canPreview = !!project.url || !!project.cloudinaryId;

  // folder color accent
  const folderDef = FOLDERS.find(f =>
    project.tags?.some(t => t.toLowerCase() === f.key)
  );

  return (
    <motion.div
      layout
      variants={fadeUp}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { setHovering(false); setConfirming(false); }}
      className="relative group rounded-2xl overflow-hidden cursor-pointer"
      style={{
        aspectRatio: '4/3',
        background: dark ? '#1a1a1a' : '#e8e2d8',
        boxShadow: hovering
          ? '0 28px 65px rgba(0,0,0,0.55)'
          : '0 6px 24px rgba(0,0,0,0.18)',
        transition: 'box-shadow 0.4s ease',
      }}
    >
      {/* Thumbnail */}
      {thumbSrc ? (
        <ProgressiveImage
          src={thumbSrc}
          placeholderSrc={placeholder}
          alt={project.title}
          className="absolute inset-0 w-full h-full"
          style={{
            transform: hovering ? 'scale(1.055)' : 'scale(1)',
            transition: 'transform 0.7s ease',
          }}
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2"
          style={{
            background: thumbLoading
              ? 'linear-gradient(135deg,#1f1a14,#0f0f0f)'
              : 'linear-gradient(135deg,#1a1a1a,#0f0f0f)',
          }}
        >
          {thumbLoading ? (
            <Loader2 size={26} className="animate-spin" style={{ color: 'rgba(249,115,22,0.5)' }} />
          ) : (
            <>
              {isPhoto
                ? <Image size={36} style={{ color: 'rgba(255,255,255,0.08)' }} />
                : <Film  size={36} style={{ color: 'rgba(255,255,255,0.08)' }} />
              }
              <p className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.15)' }}>
                {project.title}
              </p>
            </>
          )}
        </div>
      )}

      {/* Film grain */}
      <div className="absolute inset-0 opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: '150px 150px',
        }}
      />

      {/* Hover gradient */}
      <motion.div
        animate={{ opacity: hovering ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
        onClick={() => canPreview && onPreview(project)}
      />

      {/* Processing overlay */}
      {project.status === 'processing' && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={() => canPreview && onPreview(project)}
        >
          <Play size={32} style={{ color: '#f97316' }} />
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/50">Tap to play</p>
        </div>
      )}

      {project.status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="flex flex-col items-center gap-2">
            <AlertCircle size={28} className="text-red-400" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-red-400">Upload failed</p>
          </div>
        </div>
      )}

      {/* Featured badge */}
      {project.featured && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(249,115,22,0.88)', backdropFilter: 'blur(8px)' }}>
          <Star size={9} className="text-white" />
          <span className="text-[9px] uppercase tracking-widest text-white">Featured</span>
        </div>
      )}

      {/* Type badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}>
        {isPhoto
          ? <Image size={10} className="text-orange-400" />
          : <Play  size={10} className="text-orange-400" />
        }
        <span className="text-[9px] uppercase tracking-widest text-white/65">
          {isPhoto ? 'Photo' : 'Video'}
        </span>
      </div>

      {/* Play button overlay for ready videos */}
      {!isPhoto && project.status !== 'processing' && (
        <motion.div
          animate={{ opacity: hovering ? 1 : 0, scale: hovering ? 1 : 0.85 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(249,115,22,0.92)', backdropFilter: 'blur(8px)' }}>
            <Play size={22} className="text-white ml-1" />
          </div>
        </motion.div>
      )}

      {/* Bottom info on hover */}
      <motion.div
        animate={{ opacity: hovering ? 1 : 0, y: hovering ? 0 : 8 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 inset-x-0 p-5 pointer-events-none"
      >
        <p className="text-white font-bold text-sm uppercase tracking-wide"
          style={{ fontFamily: 'Georgia, serif' }}>
          {project.title}
        </p>
        {project.description && (
          <p className="text-white/55 text-xs mt-1 line-clamp-2">{project.description}</p>
        )}
        {/* Folder tag pill */}
        {folderDef && (
          <div className="flex gap-1 mt-2">
            <span className="text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1"
              style={{ background: `${folderDef.color}30`, color: folderDef.color }}>
              <folderDef.icon size={8} />
              {folderDef.label}
            </span>
          </div>
        )}
      </motion.div>

      {/* Owner controls */}
      {canEdit && (
        <motion.div
          animate={{ opacity: hovering ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="absolute top-10 right-3 flex flex-col gap-2"
        >
          <button
            onClick={e => { e.stopPropagation(); onEdit(project); }}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}
          >
            <Pencil size={13} className="text-white" />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              if (confirming) onDelete(project);
              else setConfirming(true);
            }}
            title={confirming ? 'Click again to confirm' : 'Delete'}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{
              background: confirming ? 'rgba(239,68,68,0.9)' : 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Trash2 size={13} className="text-white" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

/* ─── Lightbox ──────────────────────────────────────────────────── */
const Lightbox = ({ project, onClose }) => {
  const isPhoto = project.type === 'photo';
  const isYT    = !isPhoto && project.videoSource === 'youtube';
  const isVimeo = !isPhoto && project.videoSource === 'vimeo';
  const isVideo = !isPhoto && !isYT && !isVimeo;

  const [imgSrc, setImgSrc] = useState(
    project.cloudinaryId ? lightboxSrc(project.cloudinaryId) : project.url ?? null
  );
  const handleImgError = () => {
    if (imgSrc !== project.url && project.url) setImgSrc(project.url);
    else setImgSrc(null);
  };

  const videoSrc = project.url;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.96)', backdropFilter: 'blur(24px)' }}
      onClick={onClose}
    >
      <button onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all"
        style={{ background: 'rgba(255,255,255,0.12)' }}>
        <X size={18} className="text-white" />
      </button>

      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.4, ease }}
        onClick={e => e.stopPropagation()}
        className="w-full rounded-2xl overflow-hidden"
        style={{ maxWidth: isPhoto ? '1200px' : '960px', maxHeight: '88vh' }}
      >
        {isPhoto && imgSrc && (
          <img src={imgSrc} alt={project.title} onError={handleImgError}
            className="w-full h-auto object-contain rounded-2xl"
            style={{ maxHeight: '88vh' }} />
        )}
        {isPhoto && !imgSrc && (
          <div className="flex items-center justify-center py-32 rounded-2xl" style={{ background: '#111' }}>
            <p className="text-white/40 text-sm uppercase tracking-widest">Image unavailable</p>
          </div>
        )}
        {isVideo && videoSrc && (
          <video src={videoSrc} controls autoPlay playsInline
            className="w-full rounded-2xl"
            style={{ maxHeight: '88vh', background: '#000' }}>
            Your browser does not support the video tag.
          </video>
        )}
        {isYT && project.embedUrl && (
          <div style={{ position: 'relative', paddingTop: '56.25%' }}>
            <iframe src={`${project.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
              title={project.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', borderRadius: '1rem' }} />
          </div>
        )}
        {isVimeo && project.embedUrl && (
          <div style={{ position: 'relative', paddingTop: '56.25%' }}>
            <iframe src={`${project.embedUrl}?autoplay=1&title=0&byline=0&portrait=0`}
              title={project.title}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', borderRadius: '1rem' }} />
          </div>
        )}
        {!imgSrc && !videoSrc && !project.embedUrl && (
          <div className="flex items-center justify-center py-20 rounded-2xl" style={{ background: '#111' }}>
            <p className="text-white/40 text-sm uppercase tracking-widest">Media unavailable</p>
          </div>
        )}
      </motion.div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none px-8 max-w-xl">
        <p className="text-white font-bold uppercase tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
          {project.title}
        </p>
        {project.description && (
          <p className="text-white/40 text-sm mt-1">{project.description}</p>
        )}
      </div>
    </motion.div>
  );
};

/* ─── Infinite scroll sentinel ──────────────────────────────────── */
const LoadMoreSentinel = ({ onVisible }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(); },
      { rootMargin: '400px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [onVisible]);
  return <div ref={ref} />;
};

/* ─── Projects (main) ───────────────────────────────────────────── */
const Projects = ({ darkMode }) => {
  const dark  = darkMode;
  const base  = dark ? '#080808' : '#f0ebe2';
  const text  = dark ? '#ffffff' : '#111111';
  const muted = dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';

  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const email = user?.email?.toLowerCase().trim();
      const isAdmin =
        email === "kelvkim.mwangi@gmail.com" ||
        email === "akokmayar607@gmail.com";
      setCanEdit(isAdmin);
    });
    return unsub;
  }, []);

  const [tab, setTab]               = useState('photo');
  // activeFolder = folder key string, or null (showing folder grid)
  const [activeFolder, setActiveFolder] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [editing, setEditing]       = useState(null);
  const [preview, setPreview]       = useState(null);

  const {
    projects, loading, loadingMore, hasMore, error,
    loadMore, createPhoto, createVideo, updateProject, deleteProject,
  } = useProjects(tab);

  // When tab changes, reset active folder
  useEffect(() => { setActiveFolder(null); }, [tab]);

  // Projects filtered by active folder
  const visibleProjects = activeFolder
    ? projects.filter(p => p.tags?.some(t => t.toLowerCase() === activeFolder))
    : projects;

  const activeFolderDef = FOLDERS.find(f => f.key === activeFolder);

  const handleCreate = useCallback(async (meta, file, thumbFile, onProgress) => {
    if (meta.type === 'photo') {
      await createPhoto(meta, file, onProgress);
    } else {
      await createVideo(meta, file, thumbFile, onProgress);
    }
  }, [createPhoto, createVideo]);

  const handleDelete = useCallback(async (project) => {
    try { await deleteProject(project); } catch (e) { console.error(e); }
  }, [deleteProject]);

  return (
    <section id="projects" className="relative min-h-screen overflow-hidden"
      style={{ background: base }}>

      {/* Light leaks */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale:[1,1.2,1], opacity:[0.18,0.34,0.18] }}
          transition={{ repeat:Infinity, duration:10, ease:'easeInOut' }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background:'radial-gradient(circle,#f97316 0%,transparent 70%)', filter:'blur(90px)' }}
        />
        <motion.div
          animate={{ scale:[1,1.15,1], opacity:[0.15,0.26,0.15] }}
          transition={{ repeat:Infinity, duration:13, ease:'easeInOut', delay:3 }}
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full"
          style={{ background:'radial-gradient(circle,#f59e0b 0%,transparent 70%)', filter:'blur(100px)' }}
        />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,.5) 2px,rgba(255,255,255,.5) 4px)' }} />
      </div>

      {/* Film strips */}
      <div className="absolute inset-0 pointer-events-none">
        {['left-0 border-r-2','right-0 border-l-2'].map((cls,s) => (
          <div key={s} className={`absolute ${cls} top-0 bottom-0 w-14 flex flex-col`}
            style={{ borderColor: dark?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.06)' }}>
            {Array.from({length:24}).map((_,i) => (
              <div key={i} className="flex-shrink-0 h-20 flex flex-col justify-around px-1"
                style={{ alignItems:s===1?'flex-end':'flex-start' }}>
                {[0,1].map(d=>(
                  <div key={d} className="w-3 h-3 rounded-sm"
                    style={{ background:dark?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.04)' }}/>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-8 lg:px-16 py-28">

        {/* Header */}
        <motion.div variants={stagger} initial="hidden"
          whileInView="visible" viewport={{ once:true, amount:0.3 }} className="mb-16">
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
            <div className="h-[1px] w-10 bg-orange-400" />
            <span className="text-[10px] uppercase tracking-[0.5em] text-orange-400">Portfolio</span>
            <div className="h-[1px] w-10 bg-orange-400 opacity-40" />
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8" style={{ pointerEvents: 'auto' }}>
            <motion.h1 variants={fadeUp} custom={1}
              className="text-6xl lg:text-8xl font-black uppercase leading-[0.88] tracking-tight"
              style={{ color:text, fontFamily:'Georgia, serif' }}>
              Visual
              <br />
              <span style={{ WebkitTextStroke: dark?'2px rgba(255,255,255,0.15)':'2px rgba(0,0,0,0.1)', color:'transparent' }}>
                Projects
              </span>
            </motion.h1>

            <div className="flex items-center gap-3">
              {canEdit && (
                <motion.button
                  key="upload-btn"
                  onClick={() => setShowUpload(true)}
                  className="relative z-50 flex bg-orange-400 items-center gap-2 px-5 py-3 rounded-full text-xs uppercase tracking-widest font-semibold text-white"
                >
                  <Plus size={14} /> Upload
                </motion.button>
              )}

              <motion.button variants={fadeUp} custom={3}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => canEdit ? signOut(auth) : signInWithPopup(auth, provider)}
                className="flex items-center gap-2 px-5 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all"
                style={{
                  background: canEdit ? 'rgba(239,68,68,0.15)' : dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
                  color: canEdit ? '#f87171' : muted,
                  border: `1px solid ${canEdit ? 'rgba(239,68,68,0.3)' : dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}>
                {canEdit ? 'Sign out' : 'Admin'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
          transition={{ duration:0.7, ease }} viewport={{ once:true }}
          className="flex gap-3 mb-12">
          {[
            { key:'photo', label:'Photos', icon:Image },
            { key:'video', label:'Videos', icon:Film },
          ].map(({ key, label, icon:Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-full text-xs uppercase tracking-[0.3em] font-semibold transition-all duration-300"
              style={{
                background: tab===key ? '#f97316' : dark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.05)',
                color: tab===key ? '#fff' : muted,
                border: `1px solid ${tab===key?'#f97316':dark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)'}`,
                boxShadow: tab===key?'0 8px 28px rgba(249,115,22,0.3)':'none',
              }}>
              <Icon size={14} />
              {label}
            </button>
          ))}
        </motion.div>

        {/* ── Folder breadcrumb ── */}
        <AnimatePresence mode="wait">
          {activeFolder && (
            <motion.div
              key="breadcrumb"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-3 mb-8"
            >
              <button
                onClick={() => setActiveFolder(null)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-all"
                style={{
                  background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
                  color: muted,
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}
              >
                <ChevronLeft size={13} />
                All Folders
              </button>
              <div className="h-[1px] w-6" style={{ background: activeFolderDef?.color || '#f97316' }} />
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-widest font-semibold"
                style={{
                  background: `${activeFolderDef?.color || '#f97316'}18`,
                  color: activeFolderDef?.color || '#f97316',
                  border: `1px solid ${activeFolderDef?.color || '#f97316'}40`,
                }}>
                {activeFolderDef && <activeFolderDef.icon size={12} />}
                {activeFolderDef?.label}
              </div>
              <span className="text-[10px] uppercase tracking-widest" style={{ color: muted }}>
                {visibleProjects.length} {visibleProjects.length === 1 ? 'item' : 'items'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main content area ── */}
        {loading ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 size={30} className="animate-spin text-orange-400" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <AlertCircle size={28} style={{ color:'rgba(239,68,68,0.7)' }} />
            <p className="text-sm uppercase tracking-widest" style={{ color:muted }}>
              Failed to load — check Firestore rules
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* ── FOLDER GRID VIEW ── */}
            {!activeFolder ? (
              <motion.div
                key="folders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex flex-col gap-3 max-w-3xl mx-auto w-full">
                  {FOLDERS.map((folder, i) => (
                    <FolderCard
                      key={folder.key}
                      folder={folder}
                      projects={projects}
                      dark={dark}
                      index={i}
                      onClick={() => setActiveFolder(folder.key)}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              /* ── FOLDER CONTENTS VIEW ── */
              <motion.div
                key={`folder-${activeFolder}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {visibleProjects.length === 0 ? (
                  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                    className="flex flex-col items-center justify-center py-40 gap-5">
                    <FolderOpen size={44} style={{ color: activeFolderDef?.color || 'rgba(255,255,255,0.08)' }} />
                    <p className="text-sm uppercase tracking-[0.4em]" style={{ color:muted }}>
                      No {tab}s in {activeFolderDef?.label} yet
                    </p>
                    {canEdit && (
                      <button onClick={() => setShowUpload(true)}
                        className="mt-2 px-6 py-3 rounded-full text-white text-xs uppercase tracking-widest"
                        style={{ background: activeFolderDef?.color || '#f97316' }}>
                        Upload First {tab === 'photo' ? 'Photo' : 'Video'}
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      variants={stagger} initial="hidden" animate="visible"
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                      <AnimatePresence>
                        {visibleProjects.map((p) => (
                          <ProjectCard key={p.id} project={p}
                            canEdit={canEdit} dark={dark}
                            onEdit={setEditing}
                            onDelete={handleDelete}
                            onPreview={setPreview}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.div>

                    {hasMore && <LoadMoreSentinel onVisible={loadMore} />}
                    {loadingMore && (
                      <div className="flex justify-center mt-10">
                        <Loader2 size={22} className="animate-spin text-orange-400" />
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Bottom bar */}
        <motion.div initial={{ opacity:0, y:30 }}
          whileInView={{ opacity:1, y:0 }}
          transition={{ duration:0.9, ease }} viewport={{ once:true }}
          className="mt-24 flex items-center justify-between"
          style={{ borderTop:`1px solid ${dark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.07)'}`, paddingTop:'1.5rem' }}>
          <p className="text-[9px] uppercase tracking-[0.5em]" style={{ color:muted }}>
            Motion · Light · Sound
          </p>
          <motion.div animate={{ opacity:[0.3,1,0.3] }} transition={{ repeat:Infinity, duration:3 }}
            className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <p className="text-[9px] uppercase tracking-[0.5em]" style={{ color:muted }}>
              Scene 03 / Projects
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showUpload && (
          <UploadModal dark={dark} onCreate={handleCreate}
            onClose={() => setShowUpload(false)}
            defaultFolder={activeFolder}
          />
        )}
        {editing && (
          <EditModal dark={dark} project={editing}
            onUpdate={updateProject} onClose={() => setEditing(null)} />
        )}
        {preview && (
          <Lightbox project={preview} onClose={() => setPreview(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;