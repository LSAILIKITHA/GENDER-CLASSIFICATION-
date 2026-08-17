import React, { useState, useEffect } from 'react';
import { Cpu, Layers, GitBranch, CheckCircle2, RefreshCw, BarChart2, ShieldAlert } from 'lucide-react';

export default function ModelLab() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/models');
      const data = await response.json();
      if (response.ok && data.success) {
        setModels(data.models);
      } else {
        throw new Error(data.error || 'Failed to fetch model registry');
      }
    } catch (err) {
      setError(err.message || 'Failed to load model registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-[#F0F6FC] tracking-tight font-['Outfit']">
          Model Registry & Versioning Control
        </h2>
        <p className="text-[#8B949E] text-sm max-w-xl mx-auto">
          Monitor model accuracy, precision, recall, F1 scores, confusion matrices, and production deployments.
        </p>
      </div>

      {/* Model Registry List */}
      <div className="bg-[#161B22] p-6 sm:p-8 rounded-2xl border border-[#30363D] space-y-6">
        <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
          <div className="flex items-center space-x-2 text-[#C7ED3D] font-semibold text-sm">
            <GitBranch className="w-4 h-4" />
            <span>Registered Model Versions</span>
          </div>
          <button
            onClick={fetchModels}
            className="px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#F0F6FC] border border-[#30363D] text-xs font-medium flex items-center space-x-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#C7ED3D] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] text-sm flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-[#8B949E] text-sm flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#C7ED3D]" />
            <span>Loading model registry...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {models.map((m) => (
              <div key={m.model_id} className="bg-[#0D1117] p-5 rounded-xl border border-[#30363D] space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-black text-[#F0F6FC] font-['Outfit']">{m.version}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#21262D] text-[#8B949E] font-mono font-medium border border-[#30363D]">
                        {m.model_id}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold uppercase ${m.status === 'Production' ? 'bg-[#3FB950]/10 text-[#3FB950] border border-[#3FB950]/30' : 'bg-[#21262D] text-[#8B949E]'}`}>
                        {m.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#8B949E]">{m.algorithm} • Dataset Size: {m.dataset_size?.toLocaleString()} names</p>
                  </div>

                  <div className="flex items-center space-x-4 font-mono">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#8B949E] block">Accuracy</span>
                      <span className="text-xl font-black text-[#3FB950]">{m.accuracy}%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#8B949E] block">F1 Score</span>
                      <span className="text-xl font-black text-[#C7ED3D]">{m.f1_score}%</span>
                    </div>
                  </div>
                </div>

                {/* Confusion Matrix Card */}
                {m.confusion_matrix && (
                  <div className="p-3 rounded-xl bg-[#161B22] border border-[#30363D] text-xs space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#8B949E] block">Confusion Matrix Matrix</span>
                    <div className="grid grid-cols-2 gap-2 text-center font-mono">
                      <div className="p-2 rounded bg-[#3FB950]/10 text-[#3FB950] border border-[#3FB950]/20">
                        True Positive: {m.confusion_matrix.tp || 0}
                      </div>
                      <div className="p-2 rounded bg-[#F85149]/10 text-[#F85149] border border-[#F85149]/20">
                        False Positive: {m.confusion_matrix.fp || 0}
                      </div>
                      <div className="p-2 rounded bg-[#F85149]/10 text-[#F85149] border border-[#F85149]/20">
                        False Negative: {m.confusion_matrix.fn || 0}
                      </div>
                      <div className="p-2 rounded bg-[#3FB950]/10 text-[#3FB950] border border-[#3FB950]/20">
                        True Negative: {m.confusion_matrix.tn || 0}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
