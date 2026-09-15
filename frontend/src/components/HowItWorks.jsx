import React, { useState } from "react";
import { QuestionMarkCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const STEPS = [
  { title: "File Upload", desc: "Upload CSV or Excel data. Validates format and minimum size." },
  { title: "Validation", desc: "Checks for required numeric columns and viable data structures." },
  { title: "Preprocessing", desc: "Cleans data: imputes missing values, drops constants, scales features." },
  { title: "Algorithm Routing", desc: "Selects t-SNE, UMAP, or PCA+UMAP adaptively based on dataset size." },
  { title: "2D Visualization", desc: "Reduces data to 2 dimensions for interactive WebGL rendering." }
];

const HowItWorks = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`transition-all duration-300 ease-in-out glass-card overflow-hidden shadow-2xl ${
        isOpen ? "w-80 opacity-100 mb-4" : "w-0 h-0 opacity-0 mb-0 border-0"
      }`}>
        <div className="p-5">
          <h3 className="font-semibold text-slate-200 mb-4 flex items-center border-b border-slate-700 pb-2">
            <span className="bg-cyan-500/20 text-cyan-400 p-1 rounded-md mr-2">
              <QuestionMarkCircleIcon className="w-5 h-5" />
            </span>
            Pipeline Architecture
          </h3>
          <div className="space-y-4 relative">
            <div className="absolute top-2 bottom-2 left-[9px] w-0.5 bg-slate-700 z-0"></div>
            {STEPS.map((step, idx) => (
              <div key={idx} className="flex relative z-10">
                <div className="w-5 h-5 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-bold mr-3 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-300">{step.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-0 right-0 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-cyan-400 rounded-full p-3 shadow-lg transition-transform hover:scale-105 float-animation"
      >
        {isOpen ? <ChevronDownIcon className="w-6 h-6" /> : <QuestionMarkCircleIcon className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default HowItWorks;
