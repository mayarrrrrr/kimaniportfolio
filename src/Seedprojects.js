/**
 * seedProjects.js
 * ─────────────────────────────────────────────────────────────────────
 * Run this ONCE to seed Kelvin's existing Flickr photos and
 * YouTube / Vimeo videos into Firestore.
 *
 * HOW TO RUN:
 *   1. Paste this file into your browser console while on your
 *      portfolio site AND signed in as akokajiek@outlook.com
 *
 *   OR
 *
 *   2. Create a temporary React component that calls seedAll() on mount,
 *      visit the page once, then delete the component.
 *
 * BEFORE RUNNING:
 *   - Fill in your actual Flickr URLs and YouTube video IDs below
 *   - Make sure you are signed in as the owner (akokajiek@outlook.com)
 *   - Firestore security rules must be deployed
 * ─────────────────────────────────────────────────────────────────────
 */

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase.js'; // adjust path if needed

/* ═══════════════════════════════════════════════════════════════════
   1.  FLICKR PHOTOS
   ───────────────────────────────────────────────────────────────────
   How to get the direct image URL from Flickr:
     1. Open the photo on Flickr
     2. Click the download arrow (↓) → choose a size (Large 1600 or Original)
     3. Right-click the image → "Copy image address"
     4. Paste below as the `url` field

   The URL looks like:
     https://live.staticflickr.com/65535/12345678901_abcdef1234_b.jpg
                                                                 ^ size suffix
   Size suffixes:
     _b  = Large  (1024px)
     _h  = Large  (1600px)  ← recommended
     _k  = Large  (2048px)
     _o  = Original (full resolution)
═══════════════════════════════════════════════════════════════════ */

const flickrPhotos = [
  {
    title       : 'Golden Hour Portrait',
    description : 'A cinematic portrait captured during golden hour in Nairobi.',
    url         : 'https://www.flickr.com/photos/154940827@N06/53555619295/in/album-72177720315090355',
    tags        : ['portrait', 'golden-hour', 'nairobi'],
    featured    : true,
  },
  {
    title       : 'Live Event Coverage',
    description : 'Behind the scenes at a Nairobi live production.',
    url         : 'https://live.staticflickr.com/REPLACE/WITH/YOUR/FLICKR/URL.jpg',
    tags        : ['live-event', 'production'],
    featured    : false,
  },
  // ─── Add more photos here ───────────────────────────────────────
  // {
  //   title       : '',
  //   description : '',
  //   url         : 'https://live.staticflickr.com/...',
  //   tags        : [],
  //   featured    : false,
  // },
];

/* ═══════════════════════════════════════════════════════════════════
   2.  YOUTUBE / VIMEO VIDEOS
   ───────────────────────────────────────────────────────────────────
   These are EMBEDDED videos — no file upload needed.
   We store the embed URL and thumbnail, and play them in an iframe.

   YouTube:
     Video URL  : https://www.youtube.com/watch?v=VIDEO_ID
     Embed URL  : https://www.youtube.com/embed/VIDEO_ID
     Thumbnail  : https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg

   Vimeo:
     Video URL  : https://vimeo.com/VIDEO_ID
     Embed URL  : https://player.vimeo.com/video/VIDEO_ID
     Thumbnail  : get from https://vimeo.com/api/v2/video/VIDEO_ID.json
                  (look for "thumbnail_large" field)

   In the Projects grid, these will show the thumbnail.
   In the lightbox, they will open in an iframe player.
   Set videoSource: 'youtube' or 'vimeo' so the player knows
   which embed format to use.
═══════════════════════════════════════════════════════════════════ */

const externalVideos = [
  {
    title        : 'Wedding Highlight Reel',
    description  : 'A cinematic wedding film shot in Nairobi.',
    videoSource  : 'youtube',                        // 'youtube' | 'vimeo'
    videoId      : 'REPLACE_WITH_YOUTUBE_VIDEO_ID',  // just the ID, e.g. 'dQw4w9WgXcQ'
    embedUrl     : 'https://www.youtube.com/embed/REPLACE_WITH_YOUTUBE_VIDEO_ID',
    thumbnailUrl : 'https://img.youtube.com/vi/REPLACE_WITH_YOUTUBE_VIDEO_ID/maxresdefault.jpg',
    tags         : ['humanitarian', 'wildlife', 'real estate','events'],
    featured     : true,
  },
  {
    title        : 'Corporate Brand Film',
    description  : 'Brand storytelling for a Nairobi tech company.',
    videoSource  : 'vimeo',
    videoId      : 'REPLACE_WITH_VIMEO_VIDEO_ID',
    embedUrl     : 'https://player.vimeo.com/video/REPLACE_WITH_VIMEO_VIDEO_ID',
    thumbnailUrl : 'https://REPLACE_WITH_VIMEO_THUMBNAIL_URL.jpg',
    tags         : ['corporate', 'brand', 'film'],
    featured     : false,
  },
  // ─── Add more videos here ───────────────────────────────────────
];

/* ═══════════════════════════════════════════════════════════════════
   3.  SEED FUNCTIONS — do not edit below this line
═══════════════════════════════════════════════════════════════════ */

const seedPhotos = async () => {
  console.log(`Seeding ${flickrPhotos.length} Flickr photos...`);

  for (const photo of flickrPhotos) {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        // content
        title          : photo.title,
        description    : photo.description,
        tags           : photo.tags || [],
        featured       : photo.featured || false,

        // type
        type           : 'photo',
        status         : 'ready',

        // delivery — served from Flickr CDN, no Cloudinary needed
        url            : photo.url,
        cloudinaryId   : null,   // null = no Cloudinary transforms
                                 // ProgressiveImage falls back to url

        // video fields (unused for photos)
        muxPlaybackId  : null,
        muxAssetId     : null,
        storagePath    : null,
        embedUrl       : null,
        thumbnailUrl   : null,
        videoSource    : null,

        // timestamps
        createdAt      : serverTimestamp(),
        updatedAt      : serverTimestamp(),
      });

      console.log(`✓ Photo saved: "${photo.title}" → ${docRef.id}`);
    } catch (err) {
      console.error(`✗ Failed to save "${photo.title}":`, err.message);
    }
  }
};

const seedVideos = async () => {
  console.log(`Seeding ${externalVideos.length} external videos...`);

  for (const video of externalVideos) {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        // content
        title          : video.title,
        description    : video.description,
        tags           : video.tags || [],
        featured       : video.featured || false,

        // type
        type           : 'video',
        status         : 'ready',           // already hosted externally — no processing needed

        // delivery
        url            : video.embedUrl,    // used for iframe src in lightbox
        embedUrl       : video.embedUrl,
        thumbnailUrl   : video.thumbnailUrl,
        videoSource    : video.videoSource, // 'youtube' | 'vimeo'
        videoId        : video.videoId,

        // unused for external videos
        cloudinaryId   : null,
        muxPlaybackId  : null,
        muxAssetId     : null,
        storagePath    : null,

        // timestamps
        createdAt      : serverTimestamp(),
        updatedAt      : serverTimestamp(),
      });

      console.log(`✓ Video saved: "${video.title}" → ${docRef.id}`);
    } catch (err) {
      console.error(`✗ Failed to save "${video.title}":`, err.message);
    }
  }
};

export const seedAll = async () => {
  console.log('═══ Starting seed ═══');
  await seedPhotos();
  await seedVideos();
  console.log('═══ Seed complete ═══');
  console.log('Refresh your portfolio to see the projects.');
};

// ─── If running directly in browser console ──────────────────────
// After importing, call: seedAll()