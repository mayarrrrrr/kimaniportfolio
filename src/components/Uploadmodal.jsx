import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X, Star, Upload, Image, Film, Loader2, Link, FileUp,
  Heart, Bird, Home, Calendar,
} from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

/* ── Folder definitions (keep in sync with Projects.jsx) ─────────── */
export const Folders = [
  { key: 'humanitarian', label: 'Humanitarian', icon: Heart,    color: '#ef4444' },
  { key: 'wildlife',     label: 'Wildlife',     icon: Bird,     color: '#22c55e' },
  { key: 'real estate',  label: 'Real Estate',  icon: Home,     color: '#3b82f6' },
  { key: 'events',       label: 'Events',       icon: Calendar, color: '#a855f7' },
];

/* ── URL helpers ─────────────────────────────────────────────────── */
const detectSource = (url) => {
  if (/youtube\.com|youtu\.be/.test(url))   return 'youtube';
  if (/vimeo\.com/.test(url))               return 'vimeo';
  if (/flickr\.com|staticflickr/.test(url)) return 'flickr';
  return 'direct';
};

const toEmbedUrl = (url, source) => {
  if (source === 'youtube') {
    const id = url.match(/(?:v=|youtu\.be\/)([^&?/\s]+)/)?.[1];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }
  if (source === 'vimeo') {
    const id = url.match(/vimeo\.com\/(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : url;
  }
  return url;
};

const SOURCE_LABELS = {
  youtube: 'YouTube',
  vimeo:   'Vimeo',
  flickr:  'Flickr',
  direct:  'Direct URL',
};

/* ── Component ───────────────────────────────────────────────────── */
const UploadModal = ({ onClose, onCreate, dark, defaultFolder = null }) => {
  const fileRef  = useRef(null);
  const thumbRef = useRef(null);

  /* type & input mode */
  const [type,      setType]      = useState('photo');
  const [inputMode, setInputMode] = useState('file');

  /* file upload state */
  const [file,      setFile]      = useState(null);
  const [thumb,     setThumb]     = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [thumbPrev, setThumbPrev] = useState(null);

  /* url state */
  const [urlValue,    setUrlValue]    = useState('');
  const [videoSource, setVideoSource] = useState('youtube');

  /* meta fields */
  const [title,    setTitle]    = useState('');
  const [desc,     setDesc]     = useState('');
  const [featured, setFeatured] = useState(false);

  /* ★ folder selection — required */
  const [folder, setFolder] = useState(defaultFolder ?? '');

  /* upload state */
  const [progress,  setProgress]  = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState('');

  /* cleanup object URLs */
  useEffect(() => () => {
    if (preview)   URL.revokeObjectURL(preview);
    if (thumbPrev) URL.revokeObjectURL(thumbPrev);
  }, [preview, thumbPrev]);

  /* reset file/url state when mode or type changes */
  useEffect(() => {
    setFile(null); setPreview(null);
    setThumb(null); setThumbPrev(null);
    setUrlValue(''); setError('');
  }, [inputMode, type]);

  /* theme tokens */
  const bg      = dark ? '#111'                   : '#fff';
  const text    = dark ? '#fff'                   : '#111';
  const muted   = dark ? 'rgba(255,255,255,0.4)'  : 'rgba(0,0,0,0.4)';
  const border  = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';
  const inputBg = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';

  /* handlers */
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type.startsWith('video') && f.size > 500 * 1024 * 1024) {
      setError('Video exceeds 500 MB'); return;
    }
    if (f.type.startsWith('image') && f.size > 20 * 1024 * 1024) {
      setError('Image exceeds 20 MB'); return;
    }
    setError('');
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleThumb = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setThumb(f);
    setThumbPrev(URL.createObjectURL(f));
  };

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setUrlValue(val);
    setVideoSource(detectSource(val));
    setError('');
  };

  const handleSubmit = async () => {
    /* Validation */
    if (!title.trim())  { setError('Title is required');             return; }
    if (!folder)        { setError('Please select a folder/category'); return; }
    if (inputMode === 'url') {
      if (!urlValue.trim()) { setError('Please paste a URL'); return; }
      try { new URL(urlValue); } catch { setError('Invalid URL'); return; }
    }
    if (inputMode === 'file' && !file) {
      setError('Please select a file'); return;
    }

    try {
      setUploading(true);
      const src = detectSource(urlValue);

      const meta = {
        title:       title.trim(),
        description: desc.trim(),
        type,
        featured,
        /* folder becomes the single tag so filtering works */
        tags: [folder],
        ...(inputMode === 'url' && {
          url:         urlValue.trim(),
          videoSource: src,
          embedUrl:    toEmbedUrl(urlValue.trim(), src),
        }),
      };

      await onCreate(
        meta,
        inputMode === 'file' ? file  : null,
        inputMode === 'file' ? thumb : null,
        (pct) => setProgress(pct),
      );

      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  /* derived */
  const detectedLabel = urlValue ? SOURCE_LABELS[detectSource(urlValue)] : null;
  const embedPreviewUrl = (() => {
    if (!urlValue || inputMode !== 'url') return null;
    const src = detectSource(urlValue);
    if (src === 'youtube' || src === 'vimeo') return toEmbedUrl(urlValue, src);
    return null;
  })();
  const directImgPreview = (() => {
    if (!urlValue || inputMode !== 'url') return null;
    const src = detectSource(urlValue);
    if (src === 'flickr' || src === 'direct') return urlValue;
    return null;
  })();

  const selectedFolder = Folders.find(f => f.key === folder);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.5, ease }}
        className="relative w-full max-w-xl rounded-[2rem] overflow-hidden"
        style={{ background: bg, border: `1px solid ${border}`, boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6"
          style={{ borderBottom: `1px solid ${border}` }}>
          <div>
            <p className="text-[9px] uppercase tracking-[0.5em] text-orange-400 mb-1">Owner Upload</p>
            <h2 className="text-xl font-black uppercase" style={{ color: text, fontFamily: 'Georgia, serif' }}>
              Add Project
            </h2>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: inputBg, color: muted }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* Type toggle */}
          <div className="flex gap-2">
            {['photo', 'video'].map(t => (
              <button key={t} onClick={() => setType(t)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs uppercase tracking-widest font-semibold"
                style={{
                  background: type === t ? '#f97316' : inputBg,
                  color:      type === t ? '#fff'    : muted,
                  border:     `1px solid ${type === t ? '#f97316' : border}`,
                }}>
                {t === 'photo' ? <Image size={14} /> : <Film size={14} />}
                {t}
              </button>
            ))}
          </div>

          {/* Input mode toggle */}
          <div className="flex gap-2">
            {[
              { key: 'file', icon: FileUp, label: 'File Upload' },
              { key: 'url',  icon: Link,   label: 'Paste URL'   },
            ].map(({ key, icon: Icon, label }) => (
              <button key={key} onClick={() => setInputMode(key)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] uppercase tracking-widest font-semibold transition-all"
                style={{
                  background: inputMode === key ? 'rgba(249,115,22,0.15)' : inputBg,
                  color:      inputMode === key ? '#f97316'               : muted,
                  border:     `1px solid ${inputMode === key ? 'rgba(249,115,22,0.5)' : border}`,
                }}>
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* FILE MODE */}
          {inputMode === 'file' && (
            <>
              <div
                onClick={() => fileRef.current.click()}
                className="relative cursor-pointer rounded-2xl overflow-hidden flex items-center justify-center"
                style={{ height: 180, background: inputBg, border: `2px dashed ${preview ? '#f97316' : border}` }}
              >
                {preview ? (
                  type === 'photo'
                    ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    : <video src={preview} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                ) : (
                  <div className="text-center">
                    <Upload size={28} className="mx-auto mb-2" style={{ color: muted }} />
                    <p className="text-xs uppercase tracking-widest" style={{ color: muted }}>
                      Click to select {type}
                    </p>
                  </div>
                )}
                <input ref={fileRef} type="file"
                  accept={type === 'photo' ? 'image/*' : 'video/*'}
                  onChange={handleFile} className="hidden" />
              </div>

              {type === 'video' && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: muted }}>
                    Video Thumbnail
                  </p>
                  <div
                    onClick={() => thumbRef.current.click()}
                    className="cursor-pointer rounded-xl overflow-hidden flex items-center justify-center"
                    style={{ height: 90, background: inputBg, border: `1px dashed ${border}` }}
                  >
                    {thumbPrev
                      ? <img src={thumbPrev} alt="thumbnail" className="w-full h-full object-cover" />
                      : <p className="text-[10px] uppercase tracking-widest" style={{ color: muted }}>
                          Select thumbnail image
                        </p>
                    }
                    <input ref={thumbRef} type="file" accept="image/*" onChange={handleThumb} className="hidden" />
                  </div>
                </div>
              )}
            </>
          )}

          {/* URL MODE */}
          {inputMode === 'url' && (
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="url"
                  placeholder={
                    type === 'photo'
                      ? 'Paste a Flickr or direct image URL…'
                      : 'Paste a YouTube or Vimeo URL…'
                  }
                  value={urlValue}
                  onChange={handleUrlChange}
                  className="w-full px-5 py-3.5 rounded-xl text-sm outline-none pr-28"
                  style={{ background: inputBg, border: `1px solid ${urlValue ? '#f97316' : border}`, color: text }}
                />
                {detectedLabel && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-widest px-2 py-1 rounded-full"
                    style={{ background: 'rgba(249,115,22,0.18)', color: '#f97316' }}>
                    {detectedLabel}
                  </span>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {(type === 'video'
                  ? ['https://youtube.com/watch?v=…', 'https://vimeo.com/…']
                  : ['https://flickr.com/photos/…', 'https://live.staticflickr.com/…']
                ).map(hint => (
                  <span key={hint}
                    className="text-[9px] px-2.5 py-1 rounded-full"
                    style={{ background: inputBg, color: muted, border: `1px solid ${border}` }}>
                    {hint}
                  </span>
                ))}
              </div>

              {embedPreviewUrl && (
                <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9', background: '#000' }}>
                  <iframe src={embedPreviewUrl} title="preview"
                    allow="autoplay; fullscreen" allowFullScreen
                    style={{ width: '100%', height: '100%', border: 'none' }} />
                </div>
              )}
              {directImgPreview && (
                <div className="rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{ height: 180, background: inputBg, border: `1px solid ${border}` }}>
                  <img src={directImgPreview} alt="URL preview"
                    className="max-w-full max-h-full object-contain rounded-2xl"
                    onError={e => { e.currentTarget.style.display = 'none'; }} />
                </div>
              )}
            </div>
          )}

          {/* Title */}
          <input
            value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Project title *"
            className="w-full px-5 py-3.5 rounded-xl text-sm outline-none"
            style={{ background: inputBg, border: `1px solid ${title ? '#f97316' : border}`, color: text }}
          />

          {/* Description */}
          <textarea
            rows={3} value={desc} onChange={e => setDesc(e.target.value)}
            placeholder="Short description"
            className="w-full px-5 py-3.5 rounded-xl text-sm outline-none resize-none"
            style={{ background: inputBg, border: `1px solid ${border}`, color: text }}
          />

          {/* ★ Folder selector — REQUIRED ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: muted }}>
                Folder
              </p>
              <span className="text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest"
                style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
                Required
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Folders.map(f => {
                const Icon      = f.icon;
                const selected  = folder === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => { setFolder(f.key); setError(''); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all"
                    style={{
                      background : selected ? `${f.color}18` : inputBg,
                      border     : `1.5px solid ${selected ? f.color : border}`,
                      boxShadow  : selected ? `0 0 0 1px ${f.color}30` : 'none',
                    }}
                  >
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: selected ? `${f.color}22` : 'transparent',
                        border    : `1px solid ${selected ? f.color : border}`,
                      }}>
                      <Icon size={14} style={{ color: selected ? f.color : muted }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide leading-tight"
                        style={{ color: selected ? f.color : text }}>
                        {f.label}
                      </p>
                    </div>
                    {selected && (
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="ml-auto w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: f.color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected folder confirmation pill */}
            {selectedFolder && (
              <motion.div
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="mt-2.5 flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: `${selectedFolder.color}12`, border: `1px solid ${selectedFolder.color}30`, width: 'fit-content' }}
              >
                <selectedFolder.icon size={11} style={{ color: selectedFolder.color }} />
                <p className="text-[10px] uppercase tracking-widest" style={{ color: selectedFolder.color }}>
                  Will appear in {selectedFolder.label}
                </p>
              </motion.div>
            )}
          </div>

          {/* Featured toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div onClick={() => setFeatured(!featured)}
              className="w-10 h-6 rounded-full transition-all duration-300 flex items-center px-1"
              style={{ background: featured ? '#f97316' : inputBg, border: `1px solid ${featured ? '#f97316' : border}` }}>
              <motion.div
                animate={{ x: featured ? 16 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="w-4 h-4 rounded-full bg-white shadow"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Star size={13} style={{ color: featured ? '#f97316' : muted }} />
              <span className="text-xs uppercase tracking-[0.2em]" style={{ color: featured ? '#f97316' : muted }}>
                Featured
              </span>
            </div>
          </label>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs"
            >
              {error}
            </motion.p>
          )}

          {/* Progress bar */}
          {uploading && (
            <div>
              <div className="flex justify-between text-[10px] mb-2" style={{ color: muted }}>
                <span>Uploading…</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: inputBg }}>
                <motion.div
                  animate={{ width: `${progress}%` }}
                  className="h-full"
                  style={{ background: 'linear-gradient(90deg,#f97316,#ea580c)' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 pt-5 flex gap-3" style={{ borderTop: `1px solid ${border}` }}>
          <button onClick={onClose} disabled={uploading}
            className="flex-1 py-3.5 rounded-2xl text-xs uppercase tracking-widest font-semibold transition-all"
            style={{ background: inputBg, color: muted, border: `1px solid ${border}` }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={uploading}
            className="flex-1 py-3.5 rounded-2xl text-xs uppercase tracking-widest font-semibold text-white flex items-center justify-center gap-2 transition-all"
            style={{ background: uploading ? 'rgba(249,115,22,0.5)' : 'linear-gradient(135deg,#f97316,#ea580c)' }}>
            {uploading
              ? <><Loader2 size={15} className="animate-spin" />{progress}%</>
              : <><Upload size={15} />{inputMode === 'url' ? 'Save' : 'Upload'}</>
            }
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UploadModal;