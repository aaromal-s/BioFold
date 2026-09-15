import React, { useState } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import FileUpload from "../components/FileUpload";
import DatasetInfo from "../components/DatasetInfo";
import AlgorithmPanel from "../components/AlgorithmPanel";
import StatusIndicator from "../components/StatusIndicator";
import VisualizationPanel from "../components/VisualizationPanel";
import HowItWorks from "../components/HowItWorks";
import { useProcessing } from "../hooks/useProcessing";

const Visualizer = () => {
  const [algorithmOverride, setAlgorithmOverride] = useState(null);
  
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
    handleVisualize(algorithmOverride);
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
            onOverrideChange={setAlgorithmOverride}
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
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-8 min-h-[700px] h-full flex flex-col">
          <VisualizationPanel 
            status={visualizeStatus} 
            plotData={plotData} 
            onDownload={handleDownload} 
          />
        </div>
      </div>
      <HowItWorks />
    </div>
  );
};

export default Visualizer;
