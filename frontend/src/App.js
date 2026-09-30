import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Visualizer from "./pages/Visualizer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { checkHealth } from "./services/api";
import "./styles/main.css";

const Navigation = ({ backendOnline }) => (
  <nav className="fixed w-full z-50 bg-white/5 backdrop-blur-md border-b border-white/10 transition-all duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-3">
          <span className="text-2xl drop-shadow-[0_0_10px_rgba(139, 92, 246,0.8)]">🧬</span>
          <span className="font-bold text-xl tracking-tight text-white">
            BioManifold
          </span>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-violet-600 text-violet-400 text-xs font-semibold border border-violet-500">
            v1.0 Beta
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/visualizer" className="nav-link">Visualizer</Link>
          
          <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-white/10">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="text-sm font-medium bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/10 transition-all duration-300 hover:scale-105">Get Started</Link>
          </div>

          <div className="flex items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/10 ml-4 hidden lg:flex">
            <span className="text-xs text-slate-400 mr-2">API</span>
            <div className="relative flex items-center justify-center">
              {backendOnline ? (
                <>
                  <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_8px_#EF4444]"></span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

function App() {
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const verifyHealth = async () => {
      try {
        const res = await checkHealth();
        if (mounted) setBackendOnline(res.success);
      } catch (e) {
        if (mounted) setBackendOnline(false);
      }
    };

    verifyHealth();
    // Poll every 30 seconds
    const interval = setInterval(verifyHealth, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#030303] text-slate-100">
        <Navigation backendOnline={backendOnline} />
        
        <main className="flex-grow pt-16 relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/visualizer" element={<Visualizer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        <footer className="bg-white/5 border-t border-white/10 py-6 text-center text-slate-500 text-sm">
          <p>© 2026 BioManifold System. Adaptive 2D Manifold Visualization for Biological Data.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
