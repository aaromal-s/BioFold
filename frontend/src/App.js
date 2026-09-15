import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Visualizer from "./pages/Visualizer";
import { checkHealth } from "./services/api";
import "./styles/main.css";

const Navigation = ({ backendOnline }) => (
  <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 transition-all duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-3">
          <span className="text-2xl drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">🧬</span>
          <span className="font-bold text-xl tracking-tight text-white">
            BioManifold
          </span>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/30">
            v1.0 Beta
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="nav-link text-slate-300 hover:text-cyan-400 font-medium">Home</Link>
          <Link to="/visualizer" className="nav-link text-slate-300 hover:text-cyan-400 font-medium">Visualizer</Link>
          
          <div className="flex items-center bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 ml-4">
            <span className="text-xs text-slate-400 mr-2">Backend</span>
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
      <div className="min-h-screen flex flex-col bg-[#0F172A] text-slate-200">
        <Navigation backendOnline={backendOnline} />
        
        <main className="flex-grow pt-16 relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/visualizer" element={<Visualizer />} />
          </Routes>
        </main>

        <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
          <p>© 2026 BioManifold System. Adaptive 2D Manifold Visualization for Biological Data.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
