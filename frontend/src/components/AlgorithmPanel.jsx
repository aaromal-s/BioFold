import React from "react";
import { SparklesIcon, AdjustmentsHorizontalIcon, ChartBarIcon, CubeIcon } from "@heroicons/react/24/outline";

const ALGORITHMS = [
  { id: "tsne", name: "t-SNE" },
  { id: "umap", name: "UMAP" },
  { id: "isomap", name: "Isomap" },
  { id: "autoencoder", name: "PyTorch AE" },
  { id: "pca_umap", name: "PCA + UMAP" },
  { id: "pca", name: "Pure PCA" }
];

const AlgorithmPanel = ({ algorithmInfo, isProcessing, params, setParams }) => {
  const updateParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="glass-card p-6 animate-fade-in mt-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-200 flex items-center">
          <span className="bg-purple-500/20 text-purple-400 p-1.5 rounded-lg mr-2">
            <SparklesIcon className="w-5 h-5" />
          </span>
          Analysis Settings
        </h3>
        {algorithmInfo && (
          <div className="text-right">
            <p className="text-sm text-slate-300">
              Features: <span className="text-cyan-400 font-bold px-2 py-1 bg-cyan-500/10 rounded">{algorithmInfo.n_components_after_preprocessing}</span>
            </p>
          </div>
        )}
      </div>

      {/* Preprocessing Settings */}
      <div className="space-y-3 border-t border-slate-700/50 pt-4">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center">
          <AdjustmentsHorizontalIcon className="w-4 h-4 mr-1"/> Preprocessing
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Missing Values</label>
            <select 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-slate-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              value={params.imputation}
              onChange={(e) => updateParam("imputation", e.target.value)}
              disabled={isProcessing}
            >
              <option value="mean">Mean Imputation</option>
              <option value="median">Median Imputation</option>
              <option value="drop">Drop Rows</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Scaling</label>
            <select 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-slate-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              value={params.scaler}
              onChange={(e) => updateParam("scaler", e.target.value)}
              disabled={isProcessing}
            >
              <option value="standard">Standard (Z-score)</option>
              <option value="minmax">Min-Max (0-1)</option>
              <option value="log2">Log2 Transform</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rendering Mode */}
      <div className="space-y-3 border-t border-slate-700/50 pt-4">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center">
          <CubeIcon className="w-4 h-4 mr-1"/> Rendering Mode
        </h4>
        <div className="flex space-x-2">
          {[2, 3].map(dim => (
             <button
             key={dim}
             onClick={() => updateParam("n_components", dim)}
             disabled={isProcessing}
             className={`flex-1 p-2 rounded-lg text-sm transition-all border ${
               params.n_components === dim || (dim === 2 && !params.n_components)
                 ? "bg-purple-500/20 border-purple-500 text-purple-300"
                 : "bg-slate-800 border-slate-700 text-slate-400 hover:border-purple-500/50"
             }`}
           >
             {dim}D Projection
           </button>
          ))}
        </div>
      </div>

      {/* Algorithm Settings */}
      <div className="space-y-3 border-t border-slate-700/50 pt-4">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center">
          <ChartBarIcon className="w-4 h-4 mr-1"/> Reduction Algorithm
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {ALGORITHMS.map((algo) => (
            <button
              key={algo.id}
              onClick={() => updateParam("algorithm", algo.id)}
              disabled={isProcessing}
              className={`p-2 rounded-lg text-sm transition-all border ${
                params.algorithm === algo.id
                  ? "bg-purple-500/20 border-purple-500 text-purple-300"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:border-purple-500/50"
              }`}
            >
              {algo.name}
            </button>
          ))}
        </div>

        {/* Dynamic Hyperparameters */}
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 mt-2">
          {params.algorithm === "tsne" && (
            <div>
              <label className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Perplexity</span>
                <span className="text-cyan-400">{params.perplexity}</span>
              </label>
              <input 
                type="range" min="5" max="50" step="1" 
                className="w-full accent-cyan-500"
                value={params.perplexity}
                onChange={(e) => updateParam("perplexity", e.target.value)}
                disabled={isProcessing}
              />
            </div>
          )}
          {(params.algorithm === "umap" || params.algorithm === "pca_umap") && (
            <div className="space-y-3">
              <div>
                <label className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Neighbors</span>
                  <span className="text-cyan-400">{params.n_neighbors}</span>
                </label>
                <input 
                  type="range" min="2" max="100" step="1" 
                  className="w-full accent-cyan-500"
                  value={params.n_neighbors}
                  onChange={(e) => updateParam("n_neighbors", e.target.value)}
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Min Distance</span>
                  <span className="text-cyan-400">{params.min_dist}</span>
                </label>
                <input 
                  type="range" min="0.0" max="1.0" step="0.1" 
                  className="w-full accent-cyan-500"
                  value={params.min_dist}
                  onChange={(e) => updateParam("min_dist", e.target.value)}
                  disabled={isProcessing}
                />
              </div>
            </div>
          )}
          {params.algorithm === "isomap" && (
            <div>
              <label className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Neighbors</span>
                <span className="text-cyan-400">{params.n_neighbors}</span>
              </label>
              <input 
                type="range" min="2" max="100" step="1" 
                className="w-full accent-cyan-500"
                value={params.n_neighbors}
                onChange={(e) => updateParam("n_neighbors", e.target.value)}
                disabled={isProcessing}
              />
            </div>
          )}
          {params.algorithm === "autoencoder" && (
            <div>
              <label className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Training Epochs</span>
                <span className="text-cyan-400">{params.epochs || 50}</span>
              </label>
              <input 
                type="range" min="10" max="200" step="10" 
                className="w-full accent-cyan-500"
                value={params.epochs || 50}
                onChange={(e) => updateParam("epochs", e.target.value)}
                disabled={isProcessing}
              />
            </div>
          )}
          {params.algorithm === "pca" && (
            <p className="text-xs text-slate-500 italic">No hyperparameters for PCA.</p>
          )}
        </div>
      </div>

      {/* Clustering Settings */}
      <div className="space-y-3 border-t border-slate-700/50 pt-4">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Post-Clustering
        </h4>
        <div className="flex space-x-2">
          {["none", "kmeans", "dbscan"].map(mode => (
             <button
             key={mode}
             onClick={() => updateParam("clustering", mode)}
             disabled={isProcessing}
             className={`flex-1 p-2 rounded-lg text-sm transition-all border capitalize ${
               params.clustering === mode
                 ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                 : "bg-slate-800 border-slate-700 text-slate-400 hover:border-cyan-500/50"
             }`}
           >
             {mode}
           </button>
          ))}
        </div>
        
        {params.clustering === "kmeans" && (
           <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 mt-2">
             <label className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Number of Clusters (K)</span>
                <span className="text-cyan-400">{params.n_clusters}</span>
              </label>
              <input 
                type="range" min="2" max="20" step="1" 
                className="w-full accent-cyan-500"
                value={params.n_clusters}
                onChange={(e) => updateParam("n_clusters", e.target.value)}
                disabled={isProcessing}
              />
           </div>
        )}
        
        {params.clustering === "dbscan" && (
           <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 mt-2">
             <label className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Epsilon (eps)</span>
                <span className="text-cyan-400">{params.eps}</span>
              </label>
              <input 
                type="range" min="0.1" max="5.0" step="0.1" 
                className="w-full accent-cyan-500"
                value={params.eps}
                onChange={(e) => updateParam("eps", e.target.value)}
                disabled={isProcessing}
              />
           </div>
        )}
      </div>

    </div>
  );
};

export default AlgorithmPanel;
