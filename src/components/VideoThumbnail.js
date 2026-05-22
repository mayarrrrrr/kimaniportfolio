/**
 * extractVideoThumbnail(videoUrl, seekTime?)
 * ─────────────────────────────────────────
 * Seeks a <video> element to `seekTime` (default 1 s), draws a frame onto a
 * hidden <canvas>, and returns a base-64 JPEG data-URL suitable for use as
 * an <img src>.
 *
 * Works for:
 *  • Firebase Storage URLs (same-origin or CORS-enabled)
 *  • Any direct MP4 / WebM URL the browser can load
 *
 * Returns null if the video cannot be loaded or CORS blocks the canvas read.
 */
export async function extractVideoThumbnail(videoUrl, seekTime = 1) {
  return new Promise((resolve) => {
    if (!videoUrl) { resolve(null); return; }

    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';   // needed for canvas.toDataURL on Firebase URLs
    video.preload    = 'metadata';
    video.muted      = true;
    video.playsInline = true;

    const cleanup = () => {
      video.removeEventListener('seeked',   onSeeked);
      video.removeEventListener('error',    onError);
      video.removeEventListener('loadedmetadata', onMeta);
      video.src = '';
    };

    const onError = () => { cleanup(); resolve(null); };

    const onSeeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width  = video.videoWidth  || 640;
        canvas.height = video.videoHeight || 360;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        cleanup();
        resolve(dataUrl);
      } catch {
        // Canvas tainted (CORS) or other draw error
        cleanup();
        resolve(null);
      }
    };

    const onMeta = () => {
      // Clamp seek time to actual duration
      video.currentTime = Math.min(seekTime, video.duration * 0.25 || seekTime);
    };

    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('seeked',         onSeeked);
    video.addEventListener('error',          onError);

    video.src = videoUrl;
  });
}