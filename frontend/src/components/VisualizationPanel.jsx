import React, { useMemo } from "react";
import Plot from "react-plotly.js";
import { ArrowDownTrayIcon, PresentationChartLineIcon } from "@heroicons/react/24/outline";

const VisualizationPanel = ({ status, plotData, onDownload }) => {
  // Memoize plot layout and config for performance
  const { data, layout, config } = useMemo(() => {
    if (!plotData || !plotData.points) return { data: [], layout: {}, config: {} };

    // Group points by label for distinct colors/legend entries
    const groups = {};
    plotData.points.forEach((p) => {
      const label = p.label !== undefined && p.label !== "" ? p.label : "Unlabeled";
      if (!groups[label]) {
        const isLarge = plotData.n_points > 5000;
        groups[label] = { 
          x: [], y: [], text: [], 
          type: isLarge ? "scattergl" : "scatter", 
          mode: "markers", name: label, 
          marker: { size: isLarge ? 3 : 6, opacity: 0.8 } 
        };
      }
      groups[label].x.push(p.x);
      groups[label].y.push(p.y);
      groups[label].text.push(`Point: ${p.label}`); // Tooltip text
    });

    const plotDataArray = Object.values(groups);

    const layout = {
      autosize: true,
      margin: { t: 40, r: 20, l: 40, b: 40 },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      font: { family: "Inter, sans-serif", color: "#94A3B8" },
      hovermode: "closest",
      xaxis: {
        gridcolor: "#334155",
        zerolinecolor: "#475569",
        showticklabels: false,
        title: { text: "Dimension 1", font: { color: "#64748B" } },
      },
      yaxis: {
        gridcolor: "#334155",
        zerolinecolor: "#475569",
        showticklabels: false,
        title: { text: "Dimension 2", font: { color: "#64748B" } },
      },
      legend: {
        orientation: "v",
        y: 1,
        yanchor: "top",
        x: 1.02,
        xanchor: "left",
        font: { color: "#E2E8F0" },
      },
    };

    const config = {
      responsive: true,
      displaylogo: false,
      modeBarButtonsToRemove: ["lasso2d", "select2d"],
    };

    return { data: plotDataArray, layout, config };
  }, [plotData]);

  if (status === "idle" && !plotData) {
    return (
      <div className="h-full min-h-[500px] glass-card flex flex-col items-center justify-center p-8 border-dashed border-slate-600 animate-fade-in">
        <div className="bg-slate-800 p-6 rounded-full mb-6 relative">
          <PresentationChartLineIcon className="w-16 h-16 text-slate-500" />
          <div className="absolute top-0 right-0 w-4 h-4 bg-cyan-500 rounded-full border-2 border-slate-900 shadow-[0_0_10px_#06B6D4]"></div>
        </div>
        <h3 className="text-xl font-medium text-slate-300 mb-2">Visualization Workspace</h3>
        <p className="text-slate-500 text-center max-w-sm">
          Upload a dataset and configure the algorithm to generate an interactive 2D manifold projection.
        </p>
      </div>
    );
  }

  if (status === "running") {
    return (
      <div className="h-full min-h-[500px] glass-card flex flex-col items-center justify-center relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 skeleton opacity-30"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-24 h-24 mb-6 pulse-ring">
            <div className="absolute inset-0 bg-slate-800 rounded-full flex items-center justify-center z-10">
              <PresentationChartLineIcon className="w-10 h-10 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <h3 className="text-xl font-medium text-cyan-400 mb-2">Computing Manifold...</h3>
          <p className="text-slate-400 text-sm">
            Applying dimensionality reduction. This may take a moment for larger datasets.
          </p>
        </div>
      </div>
    );
  }

  if (plotData) {
    return (
      <div className="h-full flex flex-col animate-fade-in">
        <div className="glass-card flex-grow relative p-2 min-h-[500px] overflow-hidden group">
          
          <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-lg border border-slate-700 shadow-lg pointer-events-none">
            <h4 className="text-slate-200 font-semibold flex items-center">
              <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 shadow-[0_0_8px_#22D3EE]"></span>
              {plotData.algorithm_used.toUpperCase()} Projection
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {plotData.n_points.toLocaleString()} points visualized
            </p>
          </div>

          <Plot
            data={data}
            layout={layout}
            config={config}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
            className="plotly-container"
          />
        </div>

        {/* Info Bar & Downloads */}
        <div className="mt-4 glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm font-medium text-slate-400 flex divide-x divide-slate-600">
            <span className="pr-4 tracking-wide">
              Algorithm: <span className="text-cyan-400">{plotData.algorithm_used.toUpperCase()}</span>
            </span>
            <span className="px-4 tracking-wide">
              Data points: <span className="text-slate-200">{plotData.n_points.toLocaleString()}</span>
            </span>
            <span className="pl-4 tracking-wide">
              Time: <span className="text-emerald-400">{plotData.elapsed_seconds}s</span>
            </span>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onDownload}
              className="btn-outline flex items-center py-2 text-sm"
              title="Download 2D coordinates as CSV"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
              Dataset
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default VisualizationPanel;
