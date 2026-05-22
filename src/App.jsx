import { useEffect, useState } from "react";
import AOS from 'aos'
import 'aos/dist/aos.css'
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills"
import Projects from "./components/Projects"
import Contact from './components/Contact'
import Experience from "./components/Experience";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { Home } from "lucide-react";


const App=()=>{
  const [darkMode, setDarkMode] = useState(true)
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(()=>{
    AOS.init({
      duration: 1000,
      once: false,
      offset: 100 

    });
    document.documentElement.classList.add('dark');
  },[])

  useEffect(()=>{
    AOS.refresh()
  },[darkMode])

  const toggleDarkMode = () =>{
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={
      darkMode ? 'bg-linear-to-br from-gray-900 via-[#0d182e] to-gray-900 min-h-screen' : 'bg-linear-to-br from-gray-50 to-blue-50 min-h-screen'
    }>
      <Navbar darkMode={darkMode} token={token} toggleDarkMode={toggleDarkMode} />
      <Hero darkMode={darkMode}/>
      <About darkMode={darkMode}/>
      <Skills darkMode={darkMode}/>
      <Experience darkMode={darkMode}/>
      <Projects darkMode={darkMode}/>

      <Contact darkMode={darkMode} />
      
      
  </div>
  )
}

export default App;