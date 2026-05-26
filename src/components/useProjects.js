

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy, limit, startAfter,
  onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject,
} from 'firebase/storage';
import { db, storage } from '../firebase';
import imageCompression from 'browser-image-compression';


const PAGE_SIZE   = 12;
const CLOUD       = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = 'portflio_photos'; // your unsigned preset name

/* ─── upload photo to Cloudinary ─────────────────────────────── */
const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error('Compression failed:', error);
    return file;
  }
};

const uploadToCloudinary = (file, onProgress) =>
  new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', UPLOAD_PRESET);
    form.append('folder', 'projects/photos');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        // res.public_id  → store in Firestore as cloudinaryId
        // res.secure_url → fallback if transforms fail
        resolve({ cloudinaryId: res.public_id, url: res.secure_url });
      } else {
        reject(new Error(`Cloudinary upload failed: ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during Cloudinary upload'));
    xhr.send(form);
  });

/* ─── upload video to Firebase Storage (master copy) ─────────── */
const uploadVideoMaster = (file, onProgress) =>
  new Promise((resolve, reject) => {
    const ext      = file.name.split('.').pop();
    const filename = `${Date.now()}.${ext}`;
    const path     = `projects/videos/masters/${filename}`;
    const task     = uploadBytesResumable(ref(storage, path), file);

    task.on(
      'state_changed',
      (snap) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      async () => {
        const downloadUrl = await getDownloadURL(task.snapshot.ref);
        resolve({ storagePath: path, downloadUrl });
      }
    );
  });

/* ────────────────────────────────────────────────────────────────
   HOOK
──────────────────────────────────────────────────────────────── */
export const useProjects = (filterType = null) => {
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore]     = useState(true);
  const [error, setError]         = useState(null);

  const lastDocRef    = useRef(null);
  const unsubRef      = useRef(null);

  /* ── build base query ─────────────────────────────────────── */
  const buildQuery = useCallback((afterDoc = null) => {
    let q = query(
      collection(db, 'projects'),
      orderBy('createdAt', 'desc'),
      limit(PAGE_SIZE)
    );
    if (afterDoc) q = query(q, startAfter(afterDoc));
    return q;
  }, []);

  /* ── initial real-time listener (first page) ──────────────── */
  useEffect(() => {
    setLoading(true);
    setProjects([]);
    lastDocRef.current = null;
    setHasMore(true);

    // Unsubscribe previous listener
    unsubRef.current?.();

    const q = buildQuery();
    unsubRef.current = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      lastDocRef.current = snap.docs[snap.docs.length - 1] ?? null;
      setProjects(docs);
      setHasMore(snap.docs.length === PAGE_SIZE);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsubRef.current?.();
  }, [buildQuery]);

  /* ── load next page (append, no real-time on older pages) ─── */
  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || !lastDocRef.current) return;
    setLoadingMore(true);
    try {
      const q = buildQuery(lastDocRef.current);
      // one-shot fetch for subsequent pages
      const { getDocs } = await import('firebase/firestore');
      const snap = await getDocs(q);
      const newDocs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      lastDocRef.current = snap.docs[snap.docs.length - 1] ?? null;
      setProjects((prev) => {
        // deduplicate in case real-time listener already added some
        const ids = new Set(prev.map((p) => p.id));
        return [...prev, ...newDocs.filter((d) => !ids.has(d.id))];
      });
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, buildQuery]);

  /* ── CREATE photo ─────────────────────────────────────────── */
  const createPhoto = useCallback(async (meta, file, onProgress) => {
  const compressedFile = await compressImage(file);

  const { cloudinaryId, url } =
    await uploadToCloudinary(compressedFile, onProgress);

  await addDoc(collection(db, 'projects'), {
    ...meta,
    type: 'photo',
    cloudinaryId,
    url,
    muxPlaybackId: null,
    muxAssetId: null,
    storagePath: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}, []);

  /* ── CREATE video ─────────────────────────────────────────── */
  /**
   * Flow:
   * 1. Upload video master to Firebase Storage (progress tracked)
   * 2. Save a Firestore doc with status: 'processing'
   * 3. A Cloud Function (muxIngest) watches for new docs with status
   *    'processing', sends the Storage URL to Mux, then updates the
   *    doc with muxPlaybackId once Mux finishes encoding.
   *
   * The grid shows a "Processing…" state until muxPlaybackId is set.
   */
  const createVideo = useCallback(async (meta, file, thumbFile, onProgress) => {
  // ─────────────────────────────────────────────
  // CASE 1: EXTERNAL VIDEO (YouTube / Vimeo)
  // ─────────────────────────────────────────────
  const MAX_SIZE = 100 * 1024 * 1024;

if (file.size > MAX_SIZE) {
  throw new Error('Video must be under 100MB');
}

if (file.type !== 'video/mp4') {
  throw new Error('Only MP4 videos are allowed');
}

  if (!file) {
    await addDoc(collection(db, 'projects'), {
      ...meta,
      type: 'video',
      cloudinaryId: null,
      storagePath: null,
      muxPlaybackId: null,
      muxAssetId: null,
      status: 'ready', // instantly ready
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return;
  }

  // ─────────────────────────────────────────────
  // CASE 2: FILE UPLOAD VIDEO
  // ─────────────────────────────────────────────
  const { storagePath, downloadUrl } = await uploadVideoMaster(file, onProgress);

  let thumbCloudinaryId = null;
  if (thumbFile) {
    const t = await uploadToCloudinary(thumbFile, null);
    thumbCloudinaryId = t.cloudinaryId;
  }

  await addDoc(collection(db, 'projects'), {
    ...meta,
    type: 'video',
    url: downloadUrl,
    storagePath,
    thumbCloudinaryId,
    muxPlaybackId: null,
    muxAssetId: null,
    status: 'processing',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}, []);

  /* ── UPDATE metadata ──────────────────────────────────────── */
  const updateProject = useCallback(async (id, data) => {
    await updateDoc(doc(db, 'projects', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }, []);

  /* ── DELETE ───────────────────────────────────────────────── */
  const deleteProject = useCallback(async (project) => {
    // 1. Delete Storage master (videos)
    if (project.storagePath) {
      try { await deleteObject(ref(storage, project.storagePath)); } catch (_) {}
    }
    // 2. Firestore doc — Mux asset deletion is handled by Cloud Function
    await deleteDoc(doc(db, 'projects', project.id));
    // Note: Cloudinary deletion requires signed API calls — do via Cloud Function
    // or manually in Cloudinary dashboard. For a portfolio this is fine.
  }, []);

  /* ── client-side type filter (no extra Firestore index needed) */
  const filtered = filterType
    ? projects.filter((p) => p.type === filterType)
    : projects;

  return {
    projects: filtered,
    allProjects: projects,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMore,
    createPhoto,
    createVideo,
    updateProject,
    deleteProject,
  };
};