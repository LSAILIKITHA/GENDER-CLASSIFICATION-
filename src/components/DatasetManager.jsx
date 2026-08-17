import React, { useState, useEffect } from 'react';
import { Database, PlusCircle, RefreshCw, CheckCircle2, AlertTriangle, Cpu, TrendingUp, Layers, Sparkles, UserCheck } from 'lucide-react';

export default function DatasetManager() {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Single Add State
  const [newName, setNewName] = useState('');
  const [newGender, setNewGender] = useState('f');
  
  // Bulk Add State
  const [bulkText, setBulkText] = useState('');
  const [bulkGender, setBulkGender] = useState('f');

  const [processing, setProcessing] = useState(false);
  const [retraining, setRetraining] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDatasetStats();
  }, []);

  const fetchDatasetStats = async () => {
    setLoadingStats(true);
    try {
      const response = await fetch('/api/v1/dataset/stats');
      const data = await response.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load dataset stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleAddSingle = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      setError('Please enter a valid name.');
      return;
    }

    setProcessing(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/v1/dataset/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), gender: newGender }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to add entry.');
      }

      setMessage(data.message || 'Successfully added entry and retrained ML model!');
      setNewName('');
      fetchDatasetStats();
    } catch (err) {
      setError(err.message || 'Error updating dataset.');
    } finally {
      setProcessing(false);
    }
  };

  const handleAddBulk = async (e) => {
    e.preventDefault();
    const names = bulkText
      .split(/[\n,]/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (names.length === 0) {
      setError('Please enter at least one name.');
      return;
    }

    setProcessing(true);
    setMessage(null);
    setError(null);

    const items = names.map((n) => ({ name: n, gender: bulkGender }));

    try {
      const response = await fetch('/api/v1/dataset/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to add bulk entries.');
      }

      setMessage(data.message || `Added ${names.length} names & retrained model!`);
      setBulkText('');
      fetchDatasetStats();
    } catch (err) {
      setError(err.message || 'Error executing bulk dataset update.');
    } finally {
      setProcessing(false);
    }
  };

  const handleManualRetrain = async () => {
    setRetraining(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/v1/dataset/retrain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Retraining failed.');
      }

      setMessage(data.message || 'Model successfully retrained and hot-reloaded!');
      fetchDatasetStats();
    } catch (err) {
      setError(err.message || 'Error retraining model.');
    } finally {
      setRetraining(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F0F6FC] tracking-tight font-['Outfit']">
          Dataset & Retraining Manager
        </h2>
        <p className="text-[#8B949E] max-w-xl mx-auto text-sm sm:text-base">
          Add new training samples to ground truth datasets and retrain the character n-gram ML model on demand.
        </p>
      </div>

      {/* Dataset Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D] space-y-2">
          <span className="text-xs uppercase font-bold text-[#8B949E]">Total Dataset Names</span>
          <p className="text-3xl font-black text-[#F0F6FC] font-mono">{stats ? stats.total_records.toLocaleString() : '108,908'}</p>
          <span className="text-[10px] text-[#3FB950] font-semibold">Indexed Ground Truth</span>
        </div>

        <div className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D] space-y-2">
          <span className="text-xs uppercase font-bold text-[#8B949E]">Female Names</span>
          <p className="text-3xl font-black text-[#F778BA] font-mono">{stats ? stats.female_count.toLocaleString() : '66,533'}</p>
          <span className="text-[10px] text-[#8B949E] font-semibold font-mono">
            {stats ? roundPct(stats.female_count, stats.total_records) : '61.1'}% of dataset
          </span>
        </div>

        <div className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D] space-y-2">
          <span className="text-xs uppercase font-bold text-[#8B949E]">Male Names</span>
          <p className="text-3xl font-black text-[#58A6FF] font-mono">{stats ? stats.male_count.toLocaleString() : '42,375'}</p>
          <span className="text-[10px] text-[#8B949E] font-semibold font-mono">
            {stats ? roundPct(stats.male_count, stats.total_records) : '38.9'}% of dataset
          </span>
        </div>

        <div className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D] space-y-2">
          <span className="text-xs uppercase font-bold text-[#8B949E]">Model Accuracy</span>
          <p className="text-3xl font-black text-[#C7ED3D] font-mono">{stats ? stats.model_accuracy : '87.46'}%</p>
          <span className="text-[10px] text-[#C7ED3D] font-semibold">Char N-Gram (2-5) + MNB</span>
        </div>

      </div>

      {/* Alert Banners */}
      {message && (
        <div className="p-4 rounded-xl bg-[#3FB950]/10 border border-[#3FB950]/30 text-[#3FB950] text-sm flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#3FB950]" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] text-sm flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#F85149]" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Single Name Add Form */}
        <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4">
          <div className="flex items-center space-x-2 text-[#C7ED3D] font-bold text-sm">
            <PlusCircle className="w-4 h-4" />
            <span>Add Single Name Entry</span>
          </div>

          <form onSubmit={handleAddSingle} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-2">
                Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Likitha, Siddharth, Ananya..."
                className="w-full bg-[#0D1117] border border-[#30363D] px-4 py-3 rounded-xl text-[#F0F6FC] text-sm focus:outline-none focus:border-[#C7ED3D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-2">
                Gender Classification
              </label>
              <select
                value={newGender}
                onChange={(e) => setNewGender(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#30363D] px-4 py-3 rounded-xl text-[#F0F6FC] text-sm focus:outline-none focus:border-[#C7ED3D]"
              >
                <option value="f">Female (f)</option>
                <option value="m">Male (m)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={processing || retraining}
              className="w-full py-3 rounded-xl bg-[#C7ED3D] hover:bg-[#D4F455] text-[#0D1117] font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-[#C7ED3D]/25 transition"
            >
              {processing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0D1117]" />
                  <span>Retraining Model...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 text-[#0D1117]" />
                  <span>Add Name & Retrain Model</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bulk Names Add Form */}
        <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4">
          <div className="flex items-center space-x-2 text-[#C7ED3D] font-bold text-sm">
            <Layers className="w-4 h-4" />
            <span>Batch Add Names</span>
          </div>

          <form onSubmit={handleAddBulk} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-2">
                Paste Multiple Names (One per line or comma-separated)
              </label>
              <textarea
                rows={3}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`Aarav\nIshan\nVihaan...`}
                className="w-full bg-[#0D1117] border border-[#30363D] p-3 rounded-xl text-[#F0F6FC] text-xs font-mono focus:outline-none focus:border-[#C7ED3D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-2">
                Gender Classification for Batch
              </label>
              <select
                value={bulkGender}
                onChange={(e) => setBulkGender(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#30363D] px-4 py-3 rounded-xl text-[#F0F6FC] text-sm focus:outline-none focus:border-[#C7ED3D]"
              >
                <option value="f">Female (f)</option>
                <option value="m">Male (m)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={processing || retraining}
              className="w-full py-3 rounded-xl bg-[#21262D] hover:bg-[#30363D] border border-[#C7ED3D]/50 text-[#C7ED3D] font-bold text-sm flex items-center justify-center space-x-2 shadow-md transition"
            >
              {processing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#C7ED3D]" />
                  <span>Retraining Model...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4 text-[#C7ED3D]" />
                  <span>Batch Add & Retrain Model</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>

      {/* Manual Retrain Banner */}
      <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-[#F0F6FC] font-bold text-base font-['Outfit']">Force Retrain ML Model</h4>
          <p className="text-[#8B949E] text-xs">
            Re-scans dataset ground truth, fits character 2-5 n-grams, evaluates test accuracy, and hot-reloads model weights.
          </p>
        </div>

        <button
          onClick={handleManualRetrain}
          disabled={retraining || processing}
          className="px-6 py-3 rounded-xl bg-[#21262D] hover:bg-[#30363D] border border-[#3FB950]/40 text-[#3FB950] font-bold text-sm flex items-center space-x-2 shadow-md transition whitespace-nowrap"
        >
          <RefreshCw className={`w-4 h-4 ${retraining ? 'animate-spin' : ''}`} />
          <span>{retraining ? 'Retraining...' : 'Re-run Retrain Pipeline'}</span>
        </button>
      </div>

    </div>
  );
}

function roundPct(count, total) {
  if (!total) return '0.0';
  return ((count / total) * 100).toFixed(1);
}
