/**
 * MuxPlayer.jsx
 * ─────────────────────────────────────────────────────────────────────
 * Adaptive HLS video player powered by Mux + hls.js.
 * Falls back to native <video> on Safari (which supports HLS natively).
 *
 * Install:
 *   npm install hls.js
 *
 * Usage:
 *   <MuxPlayer
 *     playbackId={project.muxPlaybackId}
 *     poster={muxThumbnail(project.muxPlaybackId)}
 *     autoPlay={false}
 *   />
 */

import { useEffect, useRef } from 'react';
import { muxStreamUrl } from './Mediautils';

const MuxPlayer = ({
  playbackId,
  poster,
  autoPlay = false,
  className = '',
  style = {},
}) => {
  const videoRef = useRef(null);
  const hlsRef   = useRef(null);

  useEffect(() => {
    if (!playbackId || !videoRef.current) return;

    const src = muxStreamUrl(playbackId);
    const video = videoRef.current;

    const initHls = async () => {
      // Safari plays HLS natively
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        return;
      }

      // Everyone else: use hls.js
      const Hls = (await import('hls.js')).default;

      if (!Hls.isSupported()) {
        console.warn('HLS not supported in this browser');
        video.src = src;
        return;
      }

      const hls = new Hls({
        // Start with the lowest quality, ramp up fast
        startLevel      : -1,       // auto
        capLevelToPlayerSize: true, // never load quality higher than the player size
        maxBufferLength : 30,       // buffer 30s ahead max
      });

      hls.loadSource(src);
      hls.attachMedia(video);
      hlsRef.current = hls;

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.error('HLS fatal error:', data);
          hls.destroy();
        }
      });
    };

    initHls();

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [playbackId]);

  return (
    <video
      ref={videoRef}
      poster={poster}
      controls
      autoPlay={autoPlay}
      playsInline
      className={`w-full h-full ${className}`}
      style={style}
    />
  );
};

export default MuxPlayer;