

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Tag, Star, Loader2 } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

const EditModal = ({ project, onClose, onUpdate, dark }) => {
  const [title, setTitle]       = useState(project.title || '');
  const [desc, setDesc]         = useState(project.description || '');
  const [tags, setTags]         = useState((project.tags || []).join(', '));
  const [featured, setFeatured] = useState(project.featured || false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');

  const bg      = dark ? '#111'  : '#fff';
  const text    = dark ? '#fff'  : '#111';
  const muted   = dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  const border  = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';
  const inputBg = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';

  const handleSave = async () => {
    if (!title.trim()) { setError('Title is required.'); return; }
    setSaving(true);
    setError('');
    try {
      await onUpdate(project.id, {
        title: title.trim(),
        description: desc.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        featured,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease }}
        className="w-full max-w-md rounded-[2rem] overflow-hidden"
        style={{ background: bg, border: `1px solid ${border}`, boxShadow: '0 40px 100px rgba(0,0,0,0.4)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6"
          style={{ borderBottom: `1px solid ${border}` }}>
          <div>
            <p className="text-[9px] uppercase tracking-[0.5em] text-orange-400 mb-1">Editing</p>
            <h2 className="text-xl font-black uppercase" style={{ color: text, fontFamily: 'Georgia, serif' }}>
              Edit Project
            </h2>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: inputBg, color: muted }}>
            <X size={16} />
          </button>
        </div>

        <div className="px-8 py-6 space-y-4">
          {/* Preview thumb */}
          {(project.thumbnailUrl || project.url) && project.type === 'photo' && (
            <img src={project.url} className="w-full h-36 object-cover rounded-xl" alt="" />
          )}
          {project.thumbnailUrl && project.type === 'video' && (
            <img src={project.thumbnailUrl} className="w-full h-36 object-cover rounded-xl" alt="" />
          )}

          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Project title *"
            className="w-full px-5 py-3.5 rounded-xl text-sm outline-none"
            style={{ background: inputBg, border: `1px solid ${border}`, color: text }} />

          <textarea value={desc} onChange={e => setDesc(e.target.value)}
            placeholder="Description" rows={3}
            className="w-full px-5 py-3.5 rounded-xl text-sm outline-none resize-none"
            style={{ background: inputBg, border: `1px solid ${border}`, color: text }} />

          <div className="flex items-center gap-3">
            <Tag size={14} style={{ color: muted, flexShrink: 0 }} />
            <input value={tags} onChange={e => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="flex-1 px-5 py-3.5 rounded-xl text-sm outline-none"
              style={{ background: inputBg, border: `1px solid ${border}`, color: text }} />
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

          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>

        <div className="px-8 pb-8 pt-2 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl text-xs uppercase tracking-widest"
            style={{ background: inputBg, color: muted, border: `1px solid ${border}` }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3.5 rounded-2xl text-xs uppercase tracking-widest text-white flex items-center justify-center gap-2"
            style={{ background: saving ? 'rgba(249,115,22,0.5)' : 'linear-gradient(135deg,#f97316,#ea580c)' }}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditModal;