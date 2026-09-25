import React, { useState } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import FileUpload from "../components/FileUpload";
import DatasetInfo from "../components/DatasetInfo";
import AlgorithmPanel from "../components/AlgorithmPanel";
import StatusIndicator from "../components/StatusIndicator";
import VisualizationPanel from "../components/VisualizationPanel";
import HowItWorks from "../components/HowItWorks";
import { useProcessing } from "../hooks/useProcessing";
import { saveSession } from "../services/api";
import { BookmarkIcon } from "@heroicons/react/24/outline";

const Visualizer = () => {
  const [params, setParams] = useState({
    algorithm: "tsne",
    imputation: "mean",
    scaler: "standard",
    perplexity: 30,
    n_neighbors: 15,
    min_dist: 0.1,
    clustering: "none",
    n_clusters: 5,
    eps: 0.5,
    epochs: 50,
    n_components: 2
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState(null);
  
  const {
    uploadStatus,
    analyzeStatus,
    visualizeStatus,
    uploadProgress,
    datasetInfo,
    algorithmInfo,
    plotData,
    error,
    pipelineSteps,
    handleUpload,
    handleVisualize,
    handleDownload,
    handleRemove,
    clearError
  } = useProcessing();

  const isProcessing = analyzeStatus === "running" || visualizeStatus === "running" || uploadStatus === "uploading";
  const canRun = uploadStatus === "done" && !isProcessing;

  const onRunVisualization = () => {
    setSaveSuccess(false);
    setSelectedIndices(null);
    handleVisualize({ ...params, selected_indices: [] });
  };

  const onReAnalyzeLasso = () => {
    if (!selectedIndices || selectedIndices.length === 0) return;
    setSaveSuccess(false);
    handleVisualize({ ...params, selected_indices: selectedIndices });
  };

  const handleSaveSession = async () => {
    if (!datasetInfo || !plotData) return;
    setIsSaving(true);
    try {
      await saveSession({
        name: `Session - ${new Date().toLocaleString()}`,
        dataset_name: datasetInfo.filename,
        params: params,
        processed_file: plotData.processed_filename
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-200">Analysis Workspace</h1>
        <p className="text-slate-400 mt-2">Configure and run your manifold learning pipeline.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 relative items-start">
        {/* Left Column: Controls (Sticky) */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <FileUpload 
            onUpload={handleUpload}
            onRemove={handleRemove}
            status={uploadStatus}
            progress={uploadProgress}
            filename={datasetInfo?.filename}
            error={error}
            onClearError={clearError}
          />
          
          <DatasetInfo info={datasetInfo} />
          
          <AlgorithmPanel 
            algorithmInfo={algorithmInfo}
            isProcessing={isProcessing}
            params={params}
            setParams={setParams}
          />
          
          <StatusIndicator steps={pipelineSteps} />

          <button
            onClick={onRunVisualization}
            disabled={!canRun}
            className="w-full btn-primary text-lg flex items-center justify-center py-4 mt-6 disabled:opacity-50"
          >
            {isProcessing ? (
               <span className="flex items-center">
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Processing Data...
               </span>
            ) : (
              <span className="flex items-center">
                <PlayIcon className="w-6 h-6 mr-2" />
                Run Visualization
              </span>
            )}
          </button>

          {plotData && (
             <div className="flex space-x-2 mt-3">
               <button
                 onClick={handleSaveSession}
                 disabled={isSaving || saveSuccess}
                 className={`flex-1 text-sm font-medium py-3 rounded-xl flex items-center justify-center transition-all ${
                   saveSuccess 
                   ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50" 
                   : "bg-slate-800 border border-slate-700 text-slate-300 hover:border-purple-500/50"
                 }`}
               >
                 <BookmarkIcon className="w-4 h-4 mr-2" />
                 {saveSuccess ? "Saved!" : (isSaving ? "Saving..." : "Save Session")}
               </button>
               {selectedIndices && selectedIndices.length > 0 && (
                 <button
                   onClick={onReAnalyzeLasso}
                   className="flex-1 bg-pink-500/20 border border-pink-500/50 text-pink-400 text-sm font-medium py-3 rounded-xl flex items-center justify-center hover:bg-pink-500/30 transition-all"
                 >
                   Re-Analyze Selection ({selectedIndices.length})
                 </button>
               )}
             </div>
          )}
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-8 min-h-[700px] h-full flex flex-col">
          <VisualizationPanel 
            status={visualizeStatus} 
            plotData={plotData} 
            onDownload={handleDownload}
            onSelected={setSelectedIndices}
          />
        </div>
      </div>
      <HowItWorks />
    </div>
  );
};

export default Visualizer;
