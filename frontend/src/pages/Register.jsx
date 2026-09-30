import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleRegister = (e) => {
    e.preventDefault();
    // Placeholder logic
    console.log("Registering", name, email, password);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#030303] py-20">
      <div className="absolute inset-0 dots-pattern opacity-30 pointer-events-none z-0"></div>
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 px-6">
        <div className="text-center mb-8">
          <span className="text-4xl drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]">🧬</span>
          <h2 className="text-3xl font-bold text-slate-100 mt-4 tracking-tight">Create an Account</h2>
          <p className="text-slate-400 mt-2">Join BioManifold to save and share your analyses.</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                placeholder="Dr. Jane Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                placeholder="you@university.edu"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                placeholder="Create a strong password"
                required
              />
            </div>

            <button type="submit" className="w-full btn-primary py-3 mt-4">
              Create Account
            </button>
          </form>

          <p className="text-xs text-slate-500 mt-6 text-center">
            By registering, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <p className="text-center text-slate-400 mt-8">
          Already have an account? <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
