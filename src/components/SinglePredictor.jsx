import React, { useState } from 'react';
import { Search, Sparkles, Globe, User, AlertTriangle, ShieldCheck, Heart, Users, ArrowRight, RefreshCw, BookOpen, Compass, ChevronRight } from 'lucide-react';

const SAMPLE_NAMES = ['Adithya', 'Priya', 'Likitha', 'Alex', 'Arjun', 'Kavya', 'Taylor', 'Siddharth'];

const COUNTRIES = [
  'Global', 'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 
  'Germany', 'France', 'Japan', 'Brazil', 'South Africa'
];

export default function SinglePredictor() {
  const [nameInput, setNameInput] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('Global');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    const cleanName = nameInput.trim();
    if (!cleanName) {
      setError('Please enter a name to classify.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, country: selectedCountry }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to classify name');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Error communicating with NameLens AI Engine.');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = (sampleName) => {
    setNameInput(sampleName);
    setError(null);
  };

  const getGenderBadge = (gender) => {
    const g = (gender || '').toLowerCase();
    if (g.includes('female')) {
      return {
        bg: 'bg-pink-500/10 border-pink-500/30 text-pink-400',
        gradient: 'from-pink-500 to-rose-500',
        text: 'FEMALE',
        icon: '♀'
      };
    }
    if (g.includes('male')) {
      return {
        bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        gradient: 'from-blue-500 to-indigo-500',
        text: 'MALE',
        icon: '♂'
      };
    }
    return {
      bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      gradient: 'from-purple-500 to-indigo-500',
      text: 'NEUTRAL / UNCOMMON',
      icon: '⚥'
    };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Machine Learning Name Intelligence</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
          Instant Gender Association & Etymology
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          Analyze names across linguistic origins, cultural frequency, and gender associations powered by Scikit-Learn Naïve Bayes models.
        </p>
      </div>

      {/* Input Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        
        <form onSubmit={handlePredict} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Name Input field */}
            <div className="md:col-span-3 relative">
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Enter First or Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Adithya, Priya, Alex, Likitha..."
                  className="w-full glass-input px-4 py-3.5 pl-11 rounded-2xl text-white placeholder-slate-500 text-base font-medium"
                />
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Country Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Region / Origin
              </label>
              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full glass-input px-3.5 py-3.5 pr-8 rounded-2xl text-white text-sm font-medium appearance-none cursor-pointer bg-slate-900"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
                <Globe className="w-4 h-4 text-slate-400 absolute right-3 top-4 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Sample Pills & Submit Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Try:</span>
              {SAMPLE_NAMES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSampleClick(s)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium text-slate-300 transition"
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center space-x-2 transition transform active:scale-95"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing AI Model...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Classify Name</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Prediction Output Section */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Main Association Summary Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              
              {/* Left Column: Result & Badge */}
              <div className="space-y-4 md:col-span-2">
                <div className="flex items-center space-x-3">
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Analysis Result for</span>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-indigo-300 font-semibold border border-slate-700">
                    {result.query.country} Region
                  </span>
                </div>

                <div className="flex items-baseline space-x-4">
                  <h3 className="text-4xl sm:text-5xl font-black text-white font-['Outfit'] capitalize">
                    {result.query.name}
                  </h3>
                  
                  {(() => {
                    const badge = getGenderBadge(result.prediction.associated_gender);
                    return (
                      <span className={`inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full border text-sm font-extrabold uppercase tracking-wide shadow-md ${badge.bg}`}>
                        <span>{badge.icon}</span>
                        <span>{badge.text}</span>
                      </span>
                    );
                  })()}
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  Based on machine learning models and dataset indexing, <strong className="text-white">{result.query.name}</strong> shows a <strong className="text-indigo-400">{result.prediction.confidence_score}%</strong> statistical association with {result.prediction.associated_gender.toLowerCase()} name distributions.
                </p>

                {/* Warning message if low confidence */}
                {result.warning && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{result.warning}</span>
                  </div>
                )}
              </div>

              {/* Right Column: Circular Gauge Meter */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-indigo-500 transition-all duration-1000 ease-out"
                      strokeDasharray={`${result.prediction.confidence_score}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-white">{result.prediction.confidence_score}%</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Confidence</span>
                  </div>
                </div>

                {/* Probability Distribution Bar */}
                <div className="w-full mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>Male: {result.prediction.probability_distribution.Male}%</span>
                    <span>Female: {result.prediction.probability_distribution.Female}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${result.prediction.probability_distribution.Male}%` }}
                      className="bg-blue-500 h-full"
                      title={`Male: ${result.prediction.probability_distribution.Male}%`}
                    ></div>
                    <div
                      style={{ width: `${result.prediction.probability_distribution.Female}%` }}
                      className="bg-pink-500 h-full"
                      title={`Female: ${result.prediction.probability_distribution.Female}%`}
                    ></div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Intelligence Details Grid */}
          {result.intelligence && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Etymology & Meaning */}
              <div className="glass-card p-6 rounded-3xl space-y-4">
                <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>Meaning & Etymology</span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Origin & Language</span>
                    <p className="text-white font-medium">{result.intelligence.origin || 'Global'} ({result.intelligence.language || 'Multiple'})</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Meaning</span>
                    <p className="text-slate-200">{result.intelligence.meaning || 'N/A'}</p>
                  </div>
                  {result.intelligence.historical_context && (
                    <div>
                      <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Historical Context</span>
                      <p className="text-slate-400 text-xs leading-relaxed">{result.intelligence.historical_context}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Nicknames & Similar Names */}
              <div className="glass-card p-6 rounded-3xl space-y-4">
                <div className="flex items-center space-x-2 text-purple-400 font-semibold text-sm">
                  <Heart className="w-4 h-4" />
                  <span>Nicknames & Similar Variations</span>
                </div>

                {/* Nicknames */}
                {result.intelligence.nicknames && result.intelligence.nicknames.length > 0 && (
                  <div>
                    <span className="text-xs uppercase text-slate-400 font-bold tracking-wider block mb-2">Common Nicknames</span>
                    <div className="flex flex-wrap gap-2">
                      {result.intelligence.nicknames.map((nn) => (
                        <span key={nn} className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
                          {nn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Similar Names */}
                {result.intelligence.similar && result.intelligence.similar.length > 0 && (
                  <div>
                    <span className="text-xs uppercase text-slate-400 font-bold tracking-wider block mb-2">Similar Names</span>
                    <div className="space-y-2">
                      {result.intelligence.similar.map((sim) => (
                        <div key={sim.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/40 text-xs">
                          <span className="font-semibold text-white">{sim.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400">{sim.origin}</span>
                            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                              {sim.similarity}% match
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* Legal / Ethics Disclaimer */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span>{result.prediction.disclaimer}</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
