import React from "react";
import { Link } from "react-router-dom";
import { SparklesIcon, ChartBarIcon, ArrowRightIcon, PresentationChartLineIcon } from "@heroicons/react/24/outline";
import GeneNetworkAnimation from "../components/GeneNetworkAnimation";

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <div
    className="glass-card p-8 animate-slide-up hover:-translate-y-2 transition-transform duration-300"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6">
      <Icon className="w-8 h-8 text-cyan-400" />
    </div>
    <h3 className="text-xl font-semibold text-slate-200 mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-between">
      {/* Background patterns & Animations */}
      <GeneNetworkAnimation />
      <div className="absolute inset-0 dots-pattern opacity-30 pointer-events-none z-0"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in">
          <div className="inline-flex items-center bg-slate-800 border border-slate-700 px-4 py-2 rounded-full mb-8 shadow-lg">
            <SparklesIcon className="w-5 h-5 text-cyan-400 mr-2" />
            <span className="text-slate-300 text-sm font-medium">BioManifold Engine v1.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Adaptive <span className="gradient-text">2D Manifold Visualization</span> System
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Upload high-dimensional biological data. It automatically preprocess and select the best algorithm to reveal hidden structures.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/visualizer" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto inline-flex items-center justify-center group">
              Launch Visualizer
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={SparklesIcon}
            title="Adaptive Algorithm Selection"
            description="Our engine profiles your dataset size automatically choosing between t-SNE, UMAP, or PCA+UMAP for optimal performance and quality."
            delay={100}
          />
          <FeatureCard
            icon={ChartBarIcon}
            title="Automated Preprocessing"
            description="Built-in data cleaning handles missing values, removes zero-variance genes, standardizes scales, and performs feature selection instantly."
            delay={200}
          />
          <FeatureCard
            icon={PresentationChartLineIcon}
            title="Interactive Explorer"
            description="Explore the 2D projection using modern WebGL plotting. Pan, zoom, and analyze cluster structures with zero lag."
            delay={300}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
