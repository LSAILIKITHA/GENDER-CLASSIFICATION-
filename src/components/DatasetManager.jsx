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
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
          <Database className="w-3.5 h-3.5" />
          <span>Dataset Expansion & Accuracy Pipeline</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
          Dataset & Retraining Manager
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          Add new training samples to <code className="text-indigo-300">Names_dataset.csv</code> and retrain the character n-gram ML model on demand to boost accuracy.
        </p>
      </div>

      {/* Dataset Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-xs uppercase font-bold text-slate-400">Total Dataset Names</span>
          <p className="text-3xl font-black text-white">{stats ? stats.total_records.toLocaleString() : '108,908'}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Indexed Ground Truth</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-xs uppercase font-bold text-slate-400">Female Names</span>
          <p className="text-3xl font-black text-pink-400">{stats ? stats.female_count.toLocaleString() : '66,533'}</p>
          <span className="text-[10px] text-slate-400 font-semibold">
            {stats ? roundPct(stats.female_count, stats.total_records) : '61.1'}% of dataset
          </span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-xs uppercase font-bold text-slate-400">Male Names</span>
          <p className="text-3xl font-black text-blue-400">{stats ? stats.male_count.toLocaleString() : '42,375'}</p>
          <span className="text-[10px] text-slate-400 font-semibold">
            {stats ? roundPct(stats.male_count, stats.total_records) : '38.9'}% of dataset
          </span>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-xs uppercase font-bold text-slate-400">Model Accuracy</span>
          <p className="text-3xl font-black text-emerald-400">{stats ? stats.model_accuracy : '87.46'}%</p>
          <span className="text-[10px] text-indigo-300 font-semibold">Char N-Gram (2-5) + MNB</span>
        </div>

      </div>

      {/* Alert Banners */}
      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Single Name Add Form */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
            <PlusCircle className="w-4 h-4" />
            <span>Add Single Name Entry</span>
          </div>

          <form onSubmit={handleAddSingle} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Likitha, Siddharth, Ananya..."
                className="w-full glass-input px-4 py-3 rounded-2xl text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Gender Classification
              </label>
              <select
                value={newGender}
                onChange={(e) => setNewGender(e.target.value)}
                className="w-full glass-input px-4 py-3 rounded-2xl text-white text-sm bg-slate-900"
              >
                <option value="f">Female (f)</option>
                <option value="m">Male (m)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={processing || retraining}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg transition"
            >
              {processing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Retraining Model...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Name & Retrain Model</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bulk Names Add Form */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
            <Layers className="w-4 h-4" />
            <span>Batch Add Names</span>
          </div>

          <form onSubmit={handleAddBulk} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Paste Multiple Names (One per line or comma-separated)
              </label>
              <textarea
                rows={3}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`Aarav\nIshan\nVihaan...`}
                className="w-full glass-input p-3 rounded-2xl text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Gender Classification for Batch
              </label>
              <select
                value={bulkGender}
                onChange={(e) => setBulkGender(e.target.value)}
                className="w-full glass-input px-4 py-3 rounded-2xl text-white text-sm bg-slate-900"
              >
                <option value="f">Female (f)</option>
                <option value="m">Male (m)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={processing || retraining}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg transition"
            >
              {processing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Retraining Model...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Batch Add & Retrain Model</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>

      {/* Manual Retrain Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-white font-bold text-base font-['Outfit']">Force Retrain ML Model</h4>
          <p className="text-slate-400 text-xs">
            Re-scans <code className="text-indigo-300">Names_dataset.csv</code>, fits character 2-5 n-grams, evaluates test accuracy, and hot-reloads model weights.
          </p>
        </div>

        <button
          onClick={handleManualRetrain}
          disabled={retraining || processing}
          className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition whitespace-nowrap"
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
