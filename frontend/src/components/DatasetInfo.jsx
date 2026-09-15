import React from "react";
import { TableCellsIcon, HashtagIcon, ExclamationTriangleIcon, CalculatorIcon } from "@heroicons/react/24/outline";

const DatasetInfoCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-700 hover:bg-slate-700/50 transition-colors flex items-center group">
    <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 mr-4 group-hover:scale-110 transition-transform`}>
      <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className="text-slate-200 text-xl font-semibold tracking-tight">{value.toLocaleString()}</p>
    </div>
  </div>
);

const DatasetInfo = ({ info }) => {
  if (!info) return null;

  return (
    <div className="glass-card p-6 animate-fade-in mt-6">
      <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center">
        <span className="bg-cyan-500/20 text-cyan-400 p-1.5 rounded-lg mr-2">
          <TableCellsIcon className="w-5 h-5" />
        </span>
        Dataset Configuration
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <DatasetInfoCard 
          icon={HashtagIcon} 
          label="Total Rows" 
          value={info.rows} 
          colorClass="bg-blue-500 text-blue-400"
        />
        <DatasetInfoCard 
          icon={TableCellsIcon} 
          label="Total Columns" 
          value={info.columns} 
          colorClass="bg-purple-500 text-purple-400"
        />
        <DatasetInfoCard 
          icon={CalculatorIcon} 
          label="Numeric Features" 
          value={info.numeric_features} 
          colorClass="bg-emerald-500 text-emerald-400"
        />
        <DatasetInfoCard 
          icon={ExclamationTriangleIcon} 
          label="Missing Values" 
          value={info.missing_values} 
          colorClass={info.missing_values > 0 ? "bg-amber-500 text-amber-400" : "bg-slate-500 text-slate-400"}
        />
      </div>

      {info.missing_values > 0 && (
        <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-sm text-amber-400 flex items-start">
          <ExclamationTriangleIcon className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>
            Missing values detected. The engine will automatically impute these using column means during preprocessing.
          </p>
        </div>
      )}
    </div>
  );
};

export default DatasetInfo;
