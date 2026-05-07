import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  ExternalLink,
  Code2,
  Cloud,
  Globe,
  X,
} from "lucide-react";
import ndrt1 from '../assets/ndrt1.jpeg'
import ndrt7 from '../assets/ndrt7.jpeg'
import ndrt2 from '../assets/ndrt2.jpeg'
import ndrt3 from '../assets/ndrt3.jpeg';
import ndrt4 from '../assets/ndrt4.jpeg';
import ndrt5 from '../assets/ndrt5.jpeg';
import ndrt6 from '../assets/ndrt6.jpeg';
import prepare1 from '../assets/prepare1.jpeg';
import prepare2 from '../assets/prepare2.jpeg';
import prepare3 from '../assets/prepare3.jpeg';
import prepare4 from '../assets/prepare4.jpeg';
import prepare5 from '../assets/prepare5.jpeg';
import rise1 from "../assets/rise1.jpeg"
import rise2 from "../assets/rise2.jpeg"
import rise3 from "../assets/rise3.jpeg"
import rise4 from "../assets/rise4.jpeg"
import rise5 from "../assets/rise5.jpeg"
import rise6 from "../assets/rise6.jpeg"
import rise7 from "../assets/rise7.jpeg"


const techProjects = {
  webApps: [
    {
      title: "Ecommerce App(Bonmaj)",
      description:
        "Scalable backend API with authentication and role-based access.",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
      tech: ["React JS", "Python Flask", "Cloudinary"],
    },

    // {
    //   title: "Portfolio Website",
    //   description:
    //     "Modern responsive portfolio with premium UI and animations.",
    //   image:
    //     "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    //   tech: ["React", "Tailwind"],
    // },
  ],

  cloudProjects: [
    {
      title: "AWS Cloud Deployment",
      description:
        "Cloud-ready deployment using EC2, S3 and Docker containers.",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
      tech: ["AWS", "Docker", "Linux"],
    },
  ],
};

const prProjects = [
  {
    title: "National Disaster Response Team  Orientation",
    cover:
      ndrt3,

    images: [
      ndrt1,ndrt2,ndrt3,ndrt4,ndrt5,ndrt6,ndrt7
    ],
  },

  {
    title: "PREPARE",
    cover:
      prepare1,

    images: [
      prepare1,prepare2,prepare3,prepare4,prepare5
    ],
  },

  {
    title: "RISE",
    cover:
     rise2,

    images: [
      rise2,rise6,rise4,rise7,rise3,rise5,rise1
    ],
  },
];


export default function Projects({ darkMode }) {
  const [activeTab, setActiveTab] = useState("tech");
  const [selectedPR, setSelectedPR] = useState(null);
  

  return (
    <section
      id="projects"
      className="py-24 relative overflow-hidden"
      style={{
        backgroundColor: darkMode ? "#111827" : "#f9fafb",
      }}
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-500/10 blur-3xl rounded-full"></div>

      <div className="container mx-auto px-5 relative z-10">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              color: darkMode ? "white" : "#111827",
            }}
          >
            My{" "}
            <span
              style={{
                background:
                  "linear-gradient(to right,#f97316,#f59e0b)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Projects
            </span>
          </h1>

          <p
            className="max-w-2xl mx-auto text-lg"
            style={{
              color: darkMode ? "#d1d5db" : "#4b5563",
            }}
          >
            A blend of technical development and communications-driven
            documentation work.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-14">
          <div
            className={`flex rounded-2xl p-2 border ${
              darkMode
                ? "bg-gray-900 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <button
              onClick={() => setActiveTab("tech")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "tech"
                  ? "bg-orange-500 text-white"
                  : darkMode
                  ? "text-gray-300"
                  : "text-gray-700"
              }`}
            >
              Tech Projects
            </button>

            <button
              onClick={() => setActiveTab("pr")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "pr"
                  ? "bg-orange-500 text-white"
                  : darkMode
                  ? "text-gray-300"
                  : "text-gray-700"
              }`}
            >
              PR Projects
            </button>
          </div>
        </div>

        {/* TECH PROJECTS */}
        {activeTab === "tech" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-20"
          >
            {/* Web Apps */}
            <div>
              <div className="flex items-center gap-3 mb-10">
                <Globe className="text-orange-500" />
                <h2
                  className="text-3xl font-bold"
                  style={{
                    color: darkMode ? "white" : "#111827",
                  }}
                >
                  Web Applications
                </h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {techProjects.webApps.map((project, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -10 }}
                    className={`rounded-3xl overflow-hidden border backdrop-blur-xl group ${
                      darkMode
                        ? "bg-gray-900/60 border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-64 w-full object-cover group-hover:scale-110 transition duration-700"
                      />
                    </div>

                    <div className="p-7">
                      <h3
                        className="text-2xl font-bold mb-3"
                        style={{
                          color: darkMode ? "white" : "#111827",
                        }}
                      >
                        {project.title}
                      </h3>

                      <p
                        className="mb-5"
                        style={{
                          color: darkMode
                            ? "#d1d5db"
                            : "#4b5563",
                        }}
                      >
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-3 mb-6">
                        {project.tech.map((tech, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 rounded-full text-sm bg-orange-500/10 text-orange-500"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        <a href="https://github.com/mayarrrrrr/BONMAJ">
                        <button className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition">
                          <Code2 size={18} />
                          Code
                        </button>
                        </a>
                        <a href="https://bonmaj.vercel.app/client">
                        <button className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition"><ExternalLink size={18} />
                          Live
                          
                        </button>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CLOUD PROJECTS */}
            <div> 
              <div className="flex items-center gap-3 mb-10">
                <Cloud className="text-orange-500" />

                <h2
                  className="text-3xl font-bold"
                  style={{
                    color: darkMode ? "white" : "#111827",
                  }}
                >
                  Cloud Projects
                </h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {techProjects.cloudProjects.map((project, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -10 }}
                    className={`rounded-3xl overflow-hidden border ${
                      darkMode
                        ? "bg-gray-900/60 border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-64 w-full object-cover"
                    />

                    <div className="p-7">
                      <h3
                        className="text-2xl font-bold mb-3"
                        style={{
                          color: darkMode ? "white" : "#111827",
                        }}
                      >
                        {project.title}
                      </h3>

                      <p
                        style={{
                          color: darkMode
                            ? "#d1d5db"
                            : "#4b5563",
                        }}
                      >
                        {project.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* PR PROJECTS */}
        {activeTab === "pr" && (
  <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {prProjects.map((project, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -10 }}
          onClick={() => setSelectedPR(project)}
          className={`rounded-3xl border overflow-hidden group cursor-pointer ${
            darkMode
              ? "bg-gray-900/60 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="relative overflow-hidden">
            <img
              src={project.cover}
              alt={project.title}
              className="h-64 w-full object-cover group-hover:scale-110 transition duration-700"
            />

            <div className="absolute top-4 left-4 bg-orange-500 text-white p-3 rounded-2xl">
              <Folder size={22} />
            </div>
          </div>

          <div className="p-6">
            <h3
              className="text-2xl font-bold"
              style={{
                color: darkMode ? "white" : "#111827",
              }}
            >
              {project.title}
            </h3>

            <p
              className="mt-3"
              style={{
                color: darkMode ? "#d1d5db" : "#4b5563",
              }}
            >
              Click to view documentation gallery
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>

    {/* MODAL / FOLDER VIEW */}
    {selectedPR && (
      <div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
        onClick={() => setSelectedPR(null)}
      >
        <div
          className={`max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-8 ${
            darkMode ? "bg-gray-900" : "bg-white"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2
              className="text-3xl font-bold"
              style={{ color: darkMode ? "white" : "#111827" }}
            >
              {selectedPR.title}
            </h2>

            <button
              onClick={() => setSelectedPR(null)}
              className="bg-orange-500 text-white px-4 py-2 rounded-xl"
            >
              Close
            </button>
          </div>

          {/* Images Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {selectedPR.images.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-full h-64 object-cover rounded-2xl hover:scale-105 transition duration-500"
              />
            ))}
          </div>
        </div>
      </div>
    )}
  </>
)}
      </div>
    </section>
  );
}