import { useState, useCallback } from "react";
import {
  uploadFile,
  analyzeDataset,
  visualizeDataset,
  downloadProcessed,
  removeFile,
} from "../services/api";

const INITIAL_STEPS = [
  { id: "upload", label: "File Uploaded", status: "pending" },
  { id: "validate", label: "Data Validated", status: "pending" },
  { id: "preprocess", label: "Preprocessing...", status: "pending" },
  { id: "algorithm", label: "Running Algorithm", status: "pending" },
  { id: "plot", label: "Generating Plot", status: "pending" },
];

export function useProcessing() {
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle | uploading | done | error
  const [analyzeStatus, setAnalyzeStatus] = useState("idle");
  const [visualizeStatus, setVisualizeStatus] = useState("idle");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [algorithmInfo, setAlgorithmInfo] = useState(null);
  const [plotData, setPlotData] = useState(null);
  const [processedFilename, setProcessedFilename] = useState(null);
  const [currentFilename, setCurrentFilename] = useState(null);
  const [error, setError] = useState(null);
  const [pipelineSteps, setPipelineSteps] = useState(INITIAL_STEPS);

  const updateStep = useCallback((id, status) => {
    setPipelineSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const resetAll = useCallback(() => {
    setUploadStatus("idle");
    setAnalyzeStatus("idle");
    setVisualizeStatus("idle");
    setUploadProgress(0);
    setDatasetInfo(null);
    setAlgorithmInfo(null);
    setPlotData(null);
    setProcessedFilename(null);
    setCurrentFilename(null);
    setError(null);
    setPipelineSteps(INITIAL_STEPS);
  }, []);

  const handleUpload = useCallback(async (file) => {
    try {
      setError(null);
      setUploadStatus("uploading");
      setUploadProgress(0);
      setPipelineSteps(INITIAL_STEPS);

      const result = await uploadFile(file, (pct) => setUploadProgress(pct));

      if (!result.success) throw new Error(result.error);

      setDatasetInfo(result.data);
      setCurrentFilename(result.data.filename);
      setUploadStatus("done");
      updateStep("upload", "done");
      updateStep("validate", "done");
    } catch (err) {
      setUploadStatus("error");
      updateStep("upload", "error");
      setError(err.message || "Upload failed");
    }
  }, [updateStep]);

  const handleVisualize = useCallback(
    async (params = {}) => {
      if (!currentFilename) {
        setError("Please upload a file first");
        return;
      }

      try {
        setError(null);
        setPlotData(null);

        // Step 1: Analyze
        setAnalyzeStatus("running");
        updateStep("preprocess", "active");

        const analyzeResult = await analyzeDataset(currentFilename);
        if (!analyzeResult.success) throw new Error(analyzeResult.error);

        setAlgorithmInfo(analyzeResult.data);
        setAnalyzeStatus("done");
        updateStep("preprocess", "done");
        updateStep("algorithm", "active");

        // Step 2: Visualize
        setVisualizeStatus("running");
        const vizResult = await visualizeDataset(
          currentFilename,
          params
        );
        if (!vizResult.success) throw new Error(vizResult.error);

        updateStep("algorithm", "done");
        updateStep("plot", "active");

        setPlotData(vizResult.data);
        setProcessedFilename(vizResult.data.processed_filename);
        setVisualizeStatus("done");
        updateStep("plot", "done");
      } catch (err) {
        setAnalyzeStatus("error");
        setVisualizeStatus("error");
        setError(err.message || "Visualization failed");
        setPipelineSteps((prev) =>
          prev.map((s) => (s.status === "active" ? { ...s, status: "error" } : s))
        );
      }
    },
    [currentFilename, updateStep]
  );

  const handleDownload = useCallback(() => {
    if (processedFilename) {
      downloadProcessed(processedFilename);
    }
  }, [processedFilename]);

  const handleRemove = useCallback(async () => {
    if (currentFilename) {
      try {
        await removeFile(currentFilename);
      } catch (err) {
        console.error("Failed to remove file:", err);
      }
    }
    resetAll();
  }, [currentFilename, resetAll]);

  return {
    // Statuses
    uploadStatus,
    analyzeStatus,
    visualizeStatus,
    uploadProgress,
    // Data
    datasetInfo,
    algorithmInfo,
    plotData,
    processedFilename,
    currentFilename,
    error,
    pipelineSteps,
    // Actions
    handleUpload,
    handleVisualize,
    handleDownload,
    handleRemove,
    resetAll,
    clearError,
  };
}
