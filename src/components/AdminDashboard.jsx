import { motion } from "framer-motion";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white px-10 py-16">

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-black uppercase"
      >
        Admin Studio
      </motion.h1>

      <p className="text-gray-400 mt-2">
        Manage projects, media, and cinematic content
      </p>

      {/* CONTROL GRID */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">

        <div className="p-6 border border-white/10 rounded-xl">
          <h2 className="text-xl font-bold">➕ Add Project</h2>
          <p className="text-sm text-gray-400 mt-2">
            Upload new films, photos, or reels
          </p>
        </div>

        <div className="p-6 border border-white/10 rounded-xl">
          <h2 className="text-xl font-bold">✏️ Edit Projects</h2>
          <p className="text-sm text-gray-400 mt-2">
            Modify existing cinematic entries
          </p>
        </div>

        <div className="p-6 border border-white/10 rounded-xl">
          <h2 className="text-xl font-bold">🗑 Delete Projects</h2>
          <p className="text-sm text-gray-400 mt-2">
            Remove outdated content
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;