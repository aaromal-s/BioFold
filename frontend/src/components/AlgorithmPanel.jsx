import React, { useState, useEffect } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";

const ALGORITHMS = [
  {
    id: "tsne",
    name: "t-SNE",
    description: "Best for distinct clustering and local structure preservation. Ideal for < 1,000 samples.",
  },
  {
    id: "umap",
    name: "UMAP",
    description: "Fast, preserves global structure better, and maintains distinct clusters. Ideal for 1K - 10K samples.",
  },
  {
    id: "pca_umap",
    name: "PCA + UMAP",
    description: "Pre-reduces dimensionality with PCA before applying UMAP. Essential for large datasets (> 10K samples) to maintain speed.",
  },
  {
    id: "pca",
    name: "Pure PCA",
    description: "Linear dimensionality reduction. Extremely fast, but may not capture complex non-linear relationships.",
  }
];

const AlgorithmPanel = ({ algorithmInfo, isProcessing, onOverrideChange }) => {
  const [selectedAlgo, setSelectedAlgo] = useState("tsne");

  useEffect(() => {
    // Ensure an algorithm is explicitly selected
    onOverrideChange("tsne");
  }, [onOverrideChange]);

  const handleAlgoSelect = (algoId) => {
    setSelectedAlgo(algoId);
    onOverrideChange(algoId);
  };

  return (
    <div className="glass-card p-6 animate-fade-in mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-slate-200 flex items-center">
          <span className="bg-purple-500/20 text-purple-400 p-1.5 rounded-lg mr-2">
            <SparklesIcon className="w-5 h-5" />
          </span>
          Algorithm Selection
        </h3>
        
        {/* Info Display replacing the toggle switch */}
        {algorithmInfo && (
          <div className="text-right">
            <p className="text-sm text-slate-300">
              Active: <span className="text-cyan-400 font-bold px-2 py-1 bg-cyan-500/10 rounded">{algorithmInfo.algorithm_used.toUpperCase()}</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Features reduced: {algorithmInfo.n_components_after_preprocessing}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3">
          {ALGORITHMS.map((algo) => (
            <div
              key={algo.id}
              onClick={() => handleAlgoSelect(algo.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                selectedAlgo === algo.id
                  ? "bg-purple-500/10 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                  : "bg-slate-800 border-slate-700 hover:border-purple-500/50 hover:bg-slate-700/50"
              } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {selectedAlgo === algo.id && (
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
              )}
              <h4 className={`font-medium mb-1 ${selectedAlgo === algo.id ? "text-purple-400" : "text-slate-200"}`}>
                {algo.name}
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                {algo.description}
              </p>
            </div>
          ))}
        </div>
    </div>
  );
};

export default AlgorithmPanel;
