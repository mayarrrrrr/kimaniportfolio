/**
 * mediaUtils.js
 * ─────────────────────────────────────────────────────────────────────
 * Helpers for Cloudinary image transforms and Mux video URLs.
 *
 * ENV VARS (add to your .env):
 *   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *   VITE_MUX_ENV_KEY=your_mux_env_key   ← from Mux dashboard → Environments
 */

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

/* ─────────────────────────────────────────────────────────────────
   CLOUDINARY — IMAGE TRANSFORMS
   
   Cloudinary public_id is stored in Firestore as `cloudinaryId`.
   e.g.  "projects/photos/portrait_001"
   
   We never serve the raw upload URL. Instead we build transform URLs
   so the CDN delivers exactly the right size for each context.
───────────────────────────────────────────────────────────────────*/

/**
 * Build a Cloudinary image URL with transforms.
 * @param {string} publicId   - e.g. "projects/photos/portrait_001"
 * @param {object} opts
 *   width    {number}  - resize width in px
 *   quality  {string}  - 'auto' (default) | 'auto:low' | 80 etc.
 *   format   {string}  - 'auto' serves WebP/AVIF automatically
 *   crop     {string}  - 'fill' | 'fit' | 'thumb'
 *   gravity  {string}  - 'auto' (face-aware) | 'center'
 *   blur     {number}  - blur amount (for placeholders)
 */
export const cloudinaryImage = (publicId, opts = {}) => {
  if (!publicId || !CLOUD) return '';

  const {
    width   = 800,
    quality = 'auto',
    format  = 'auto',
    crop    = 'fill',
    gravity = 'auto',
    blur,
  } = opts;

  const transforms = [
    `w_${width}`,
    `q_${quality}`,
    `f_${format}`,
    `c_${crop}`,
    `g_${gravity}`,
    blur ? `e_blur:${blur}` : null,
  ].filter(Boolean).join(',');

  return `https://res.cloudinary.com/${CLOUD}/image/upload/${transforms}/${publicId}`;
};

/**
 * Grid thumbnail — 600px wide, auto WebP, face-aware crop.
 */
export const gridThumb = (publicId) =>
  cloudinaryImage(publicId, { width: 600, crop: 'fill', gravity: 'auto' });

/**
 * Lightbox — full quality, up to 2400px wide.
 */
export const lightboxSrc = (publicId) =>
  cloudinaryImage(publicId, { width: 2400, quality: 'auto', crop: 'fit' });

/**
 * Blur placeholder — tiny 40px, blurred. Loads in <1 KB.
 */
export const blurPlaceholder = (publicId) =>
  cloudinaryImage(publicId, { width: 40, quality: 'auto:low', blur: 1000 });

/**
 * Video poster from Cloudinary (for non-Mux videos).
 */
export const cloudinaryVideoPoster = (publicId) => {
  if (!publicId || !CLOUD) return '';
  return `https://res.cloudinary.com/${CLOUD}/video/upload/so_1,w_600,f_auto/${publicId}.jpg`;
};

/* ─────────────────────────────────────────────────────────────────
   MUX — VIDEO URLS
   
   Mux stores videos and gives you:
     - playbackId   → used for HLS streaming + thumbnails
     - assetId      → used for management API
   
   Both are stored in Firestore when the video is uploaded.
───────────────────────────────────────────────────────────────────*/

/**
 * Mux HLS stream URL. Works with video.js or hls.js.
 * The player adapts quality automatically to the viewer's connection.
 */
export const muxStreamUrl = (playbackId) =>
  `https://stream.mux.com/${playbackId}.m3u8`;

/**
 * Mux poster/thumbnail at a specific time (default 1 second in).
 * Width is served from Mux's CDN.
 */
export const muxThumbnail = (playbackId, opts = {}) => {
  const { time = 1, width = 600 } = opts;
  return `https://image.mux.com/${playbackId}/thumbnail.jpg?time=${time}&width=${width}`;
};

/**
 * Mux animated GIF preview (shown on hover in the grid).
 * Automatically loops a 3-second preview.
 */
export const muxAnimatedPreview = (playbackId) =>
  `https://image.mux.com/${playbackId}/animated.gif?width=400&fps=12&start=2&end=5`;