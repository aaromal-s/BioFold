import React, { useCallback, useRef } from "react";
import { CloudArrowUpIcon, DocumentIcon, XCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const FileUpload = ({ onUpload, onRemove, status, progress, filename, error, onClearError }) => {
  const fileInputRef = useRef(null);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (status === "uploading") return;

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        onUpload(droppedFiles[0]);
      }
    },
    [onUpload, status]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    if (status !== "uploading") {
      fileInputRef.current.click();
    }
  };

  if (status === "done" && filename) {
    return (
      <div className="glass-card p-6 flex items-center justify-between animate-fade-in">
        <div className="flex items-center space-x-4">
          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30">
            <CheckCircleIcon className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-slate-200 font-medium">{filename}</h3>
            <p className="text-emerald-400 text-sm flex items-center mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
              Upload complete
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fileInputRef.current.click()}
            className="btn-secondary text-sm"
          >
            Change File
          </button>
          {onRemove && (
            <button
              onClick={onRemove}
              className="btn-secondary text-sm !bg-red-500/10 !text-red-400 !border-red-500/30 hover:!bg-red-500/20"
              title="Remove File"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          accept=".csv,.xlsx,.xls"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
    );
  }

  return (
    <div className="relative group animate-fade-in">
      <div
        className={`glass-card p-8 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          status === "uploading"
            ? "border-cyan-500/50 bg-slate-800/80 cursor-wait"
            : "border-slate-600 hover:border-cyan-500 hover:bg-slate-800/80"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={openFileDialog}
      >
        <input
          type="file"
          className="hidden"
          accept=".csv,.xlsx,.xls"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={status === "uploading"}
        />

        {status === "uploading" ? (
          <div className="w-full text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
                <DocumentIcon className="w-6 h-6 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <p className="text-cyan-400 font-medium mb-3">Uploading {progress}%</p>
            <div className="w-full max-w-xs mx-auto bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-slate-700/50 p-4 rounded-2xl mb-4 group-hover:scale-110 group-hover:bg-cyan-500/10 transition-all duration-300">
              <CloudArrowUpIcon className="w-10 h-10 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-lg font-medium text-slate-200 mb-2 group-hover:text-cyan-300 transition-colors">
              Drag & Drop to Upload
            </p>
            <p className="text-slate-400 text-sm mb-4">or click to browse</p>
            <div className="flex space-x-2 text-xs font-medium text-slate-500">
              <span className="bg-slate-700/50 px-2 py-1 rounded">CSV</span>
              <span className="bg-slate-700/50 px-2 py-1 rounded">Excel</span>
              <span className="bg-slate-700/50 px-2 py-1 rounded">Max 500MB</span>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="absolute -bottom-16 left-0 right-0 animate-slide-up">
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <XCircleIcon className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button onClick={onClearError} className="hover:text-red-300 transition-colors">
              <XCircleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
