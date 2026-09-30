import React from "react";
import { Link } from "react-router-dom";
import { SparklesIcon, ChartBarIcon, ArrowRightIcon, PresentationChartLineIcon, MagnifyingGlassIcon, PlayCircleIcon, CheckCircleIcon, UserGroupIcon, BeakerIcon } from "@heroicons/react/24/outline";
import GeneNetworkAnimation from "../components/GeneNetworkAnimation";

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <div
    className="glass-card p-8 animate-slide-up hover:-translate-y-2 transition-transform duration-300 relative group overflow-hidden"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl group-hover:bg-fuchsia-500/20 transition-colors"></div>
    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 relative z-10">
      <Icon className="w-8 h-8 text-violet-400 group-hover:text-fuchsia-400 transition-colors" />
    </div>
    <h3 className="text-xl font-semibold text-slate-100 mb-3 relative z-10">{title}</h3>
    <p className="text-slate-400 leading-relaxed relative z-10">{description}</p>
  </div>
);

const UseCaseCard = ({ icon: Icon, title, description, tags }) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-violet-500/50 transition-colors group">
    <div className="flex items-center space-x-4 mb-4">
      <div className="p-3 bg-violet-500/10 rounded-xl">
        <Icon className="w-6 h-6 text-violet-400" />
      </div>
      <h4 className="text-lg font-semibold text-slate-200">{title}</h4>
    </div>
    <p className="text-slate-400 mb-6 text-sm leading-relaxed">{description}</p>
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 text-slate-300 text-xs rounded-full">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const StepComponent = ({ step, title, description }) => (
  <div className="flex flex-col items-center text-center max-w-xs relative">
    <div className="w-16 h-16 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-2xl font-bold text-violet-300 mb-6 relative z-10 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
      {step}
    </div>
    <h4 className="text-lg font-semibold text-slate-200 mb-2">{title}</h4>
    <p className="text-sm text-slate-400">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#030303]">
      {/* Background patterns & Animations */}
      <GeneNetworkAnimation />
      <div className="absolute inset-0 dots-pattern opacity-30 pointer-events-none z-0"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-600 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-fuchsia-600/30 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto mb-32 animate-fade-in">
          <div className="inline-flex items-center bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 shadow-lg hover:border-violet-500/50 transition-colors cursor-pointer">
            <SparklesIcon className="w-5 h-5 text-violet-400 mr-2" />
            <span className="text-slate-200 text-sm font-medium">BioManifold Engine v1.0 is live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Decode Complexity with <span className="gradient-text">Adaptive Manifolds</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            The ultra-premium dimensionality reduction suite for biological data. Instantly visualize, cluster, and discover biomarkers in high-dimensional datasets.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/visualizer" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto inline-flex items-center justify-center group">
              Launch Visualizer
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="btn-outline text-lg px-8 py-4 w-full sm:w-auto inline-flex items-center justify-center">
              <PlayCircleIcon className="w-5 h-5 mr-2" />
              Watch Demo
            </button>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Unparalleled Intelligence</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Our backend automatically profiles your datasets to execute the perfect preprocessing pipeline and visualization algorithm.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={SparklesIcon}
              title="Adaptive Algorithm Selection"
              description="The engine automatically chooses between t-SNE, UMAP, Autoencoders or Isomap depending on your dataset's shape and size."
              delay={100}
            />
            <FeatureCard
              icon={MagnifyingGlassIcon}
              title="Lasso Biomarker Discovery"
              description="Select spatial clusters directly on the interactive 3D plot to instantly run Random Forest feature importance algorithms."
              delay={200}
            />
            <FeatureCard
              icon={PresentationChartLineIcon}
              title="Real-time 3D Rendering"
              description="Explore the projection using hardware-accelerated WebGL. Pan, zoom, and analyze cluster structures with zero lag."
              delay={300}
            />
          </div>
        </div>

        {/* HOW IT WORKS (PIPELINE) */}
        <div className="mb-32 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent -translate-y-1/2 hidden md:block"></div>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">The Pipeline</h2>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12 relative z-10">
            <StepComponent step="1" title="Upload Matrix" description="Upload your raw CSV expression matrix or feature table. No complex formatting required." />
            <StepComponent step="2" title="Auto-Processing" description="Zero-variance removal, scaling, and PCA reduction happen automatically on the server." />
            <StepComponent step="3" title="Manifold Learning" description="The optimal topology algorithm executes in parallel to map data into 2D or 3D space." />
            <StepComponent step="4" title="Interactive Insights" description="Select clusters visually to extract top biological drivers using Random Forest classification." />
          </div>
        </div>

        {/* USE CASES */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Built for Biology</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <UseCaseCard 
              icon={BeakerIcon}
              title="Single-cell RNA-seq"
              description="Easily visualize tens of thousands of cells. The adaptive engine automatically scales up to UMAP for massive datasets, allowing you to clearly see distinct cell populations and trajectory gradients."
              tags={["Transcriptomics", "UMAP", "Cell Clustering"]}
            />
            <UseCaseCard 
              icon={UserGroupIcon}
              title="Flow & Mass Cytometry"
              description="Process complex multi-parameter flow cytometry data. Identify rare immune subsets and phenotypic variations without needing manual gating strategies."
              tags={["Immunology", "t-SNE", "FACS"]}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
