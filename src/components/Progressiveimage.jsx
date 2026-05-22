/**
 * ProgressiveImage.jsx
 * ─────────────────────────────────────────────────────────────────────
 * Renders a blurred placeholder instantly, then swaps to full image
 * once it loads. Zero layout shift. Works with Cloudinary's blur
 * transform for sub-1KB placeholders.
 *
 * Usage:
 *   <ProgressiveImage
 *     src={gridThumb(project.cloudinaryId)}
 *     placeholderSrc={blurPlaceholder(project.cloudinaryId)}
 *     alt={project.title}
 *   />
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ProgressiveImage = ({
  src,
  placeholderSrc,
  alt = '',
  className = '',
  style = {},
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError]   = useState(false);

  // Preload the full image off-screen
  useEffect(() => {
    if (!src) return;
    setLoaded(false);
    const img = new Image();
    img.src = src;
    img.onload  = () => setLoaded(true);
    img.onerror = () => setError(true);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>

      {/* Blurred placeholder — always rendered, fades out */}
      {placeholderSrc && (
        <motion.img
          src={placeholderSrc}
          alt=""
          aria-hidden
          animate={{ opacity: loaded ? 0 : 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'blur(20px)', transform: 'scale(1.05)' }}
        />
      )}

      {/* Full image — fades in once loaded */}
      {!error && (
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-full object-cover"
        />
      )}

      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.2)' }}>
          <span className="text-[10px] uppercase tracking-widest opacity-40">
            Image unavailable
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressiveImage;