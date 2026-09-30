import React from "react";
import { CheckIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const StatusIndicator = ({ steps }) => {
  return (
    <div className="glass-card p-6 animate-fade-in mt-6">
      <h3 className="text-sm font-medium text-slate-400 mb-4 tracking-wider uppercase">Pipeline Status</h3>
      
      <div className="space-y-4 relative">
        {/* Connecting line */}
        <div className="absolute top-4 bottom-4 left-[11px] w-0.5 bg-white/10 z-0"></div>

        {steps.map((step, index) => {
          const isDone = step.status === "done";
          const isActive = step.status === "active";
          const isError = step.status === "error";

          let circleColor = "border-white/20 bg-white/5";
          let textColor = "text-slate-500";
          
          if (isDone) {
            circleColor = "border-emerald-500 bg-emerald-500/20";
            textColor = "text-slate-100";
          } else if (isActive) {
            circleColor = "border-violet-500 bg-violet-600";
            textColor = "text-violet-400 font-medium";
          } else if (isError) {
            circleColor = "border-red-500 bg-red-500/20";
            textColor = "text-red-400";
          }

          return (
            <div key={step.id} className="flex items-center relative z-10">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-300 flex-shrink-0 ${circleColor} ${
                  isActive ? "shadow-[0_0_10px_#8B5CF6]" : ""
                }`}
              >
                {isDone && <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />}
                {isActive && <ArrowPathIcon className="w-3.5 h-3.5 text-violet-400 animate-spin" />}
              </div>
              <span className={`text-sm transition-colors duration-300 ${textColor}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusIndicator;
