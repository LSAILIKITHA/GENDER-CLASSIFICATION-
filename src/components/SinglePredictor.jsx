import React, { useState } from 'react';
import { Search, Sparkles, Globe, User, AlertTriangle, ShieldCheck, Heart, BookOpen, RefreshCw, Cpu, Layers, HelpCircle, Code, CheckCircle2 } from 'lucide-react';

const SAMPLE_NAMES = ['Adithya', 'Priya', 'Likitha', 'Alex', 'Jordan', 'Arjun', 'Kavya', 'Taylor', 'Dr. M. Adithya Dev Kumar'];

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
  const [explainMode, setExplainMode] = useState('simple'); // 'simple' | 'technical'

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
    const g = (gender || '').toUpperCase();
    if (g.includes('FEMALE')) {
      return {
        bg: 'bg-[#F778BA]/10 border-[#F778BA]/30 text-[#F778BA]',
        text: 'FEMALE',
        icon: '♀'
      };
    }
    if (g.includes('MALE') && !g.includes('AMBIGUOUS')) {
      return {
        bg: 'bg-[#58A6FF]/10 border-[#58A6FF]/30 text-[#58A6FF]',
        text: 'MALE',
        icon: '♂'
      };
    }
    if (g.includes('AMBIGUOUS')) {
      return {
        bg: 'bg-[#D29922]/10 border-[#D29922]/30 text-[#D29922]',
        text: 'AMBIGUOUS',
        icon: '⚥'
      };
    }
    return {
      bg: 'bg-[#8B949E]/10 border-[#8B949E]/30 text-[#8B949E]',
      text: 'UNKNOWN',
      icon: '?'
    };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F0F6FC] tracking-tight font-['Outfit']">
          Multi-Model Name Intelligence & Explainability
        </h2>
        <p className="text-[#8B949E] max-w-2xl mx-auto text-sm sm:text-base">
          Multi-model ensemble combining exact ground-truth lookups, character n-grams, Naïve Bayes, Decision Trees, and phonetic heuristics.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-[#161B22] p-6 sm:p-8 rounded-2xl border border-[#30363D] shadow-2xl relative overflow-hidden">
        
        <form onSubmit={handlePredict} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Name Input field */}
            <div className="md:col-span-3 relative">
              <label className="block text-xs font-semibold text-[#8B949E] mb-2 uppercase tracking-wider">
                Enter Given or Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Aditya, Likitha, Alex, Dr. M. Adithya Dev..."
                  className="w-full bg-[#0D1117] border border-[#30363D] px-4 py-3.5 pl-11 rounded-xl text-[#F0F6FC] placeholder-[#8B949E] text-base font-medium focus:outline-none focus:border-[#C7ED3D] focus:ring-1 focus:ring-[#C7ED3D]"
                />
                <User className="w-5 h-5 text-[#8B949E] absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Country Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#8B949E] mb-2 uppercase tracking-wider">
                Region Context
              </label>
              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-[#0D1117] border border-[#30363D] px-3.5 py-3.5 pr-8 rounded-xl text-[#F0F6FC] text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:border-[#C7ED3D]"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} className="bg-[#0D1117] text-[#F0F6FC]">
                      {c}
                    </option>
                  ))}
                </select>
                <Globe className="w-4 h-4 text-[#8B949E] absolute right-3 top-4 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Sample Pills & Submit Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#8B949E] font-medium">Try:</span>
              {SAMPLE_NAMES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSampleClick(s)}
                  className="px-2.5 py-1 rounded-lg bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] hover:border-[#C7ED3D] text-xs font-medium text-[#8B949E] hover:text-[#F0F6FC] transition"
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#C7ED3D] hover:bg-[#D4F455] text-[#0D1117] font-extrabold text-sm shadow-lg shadow-[#C7ED3D]/25 flex items-center justify-center space-x-2 transition transform active:scale-95"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0D1117]" />
                  <span>Ensemble Inference...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#0D1117]" />
                  <span>Analyze Name</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] text-sm flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#F85149]" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Prediction Output Section */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Main Association Summary Card */}
          <div className="bg-[#161B22] p-6 sm:p-8 rounded-2xl border border-[#30363D] relative overflow-hidden">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              
              {/* Left Column: Result & Badge */}
              <div className="space-y-4 md:col-span-2">
                <div className="flex items-center space-x-3">
                  <span className="text-xs uppercase font-bold text-[#8B949E] tracking-wider">Analysis Result for</span>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-[#21262D] text-[#C7ED3D] font-semibold border border-[#30363D]">
                    {result.query?.country || 'Global'} Region
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline gap-4">
                  <h3 className="text-4xl sm:text-5xl font-black text-[#F0F6FC] font-['Outfit'] capitalize">
                    {result.name || result.query?.name}
                  </h3>
                  
                  {(() => {
                    const badge = getGenderBadge(result.associated_gender || result.prediction?.associated_gender);
                    return (
                      <span className={`inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full border text-xs font-mono font-extrabold uppercase tracking-wide shadow-md ${badge.bg}`}>
                        <span>{badge.icon}</span>
                        <span>{badge.text}</span>
                      </span>
                    );
                  })()}
                </div>

                <p className="text-[#8B949E] text-sm leading-relaxed">
                  Name association calculated across ensemble sub-models for <strong className="text-[#F0F6FC]">{result.name}</strong>.
                  Confidence score is <strong className="text-[#C7ED3D]">{result.confidence_score}%</strong> with a <strong className="text-[#3FB950]">{result.reliability?.level?.toUpperCase() || 'HIGH'}</strong> reliability score.
                </p>

                {/* Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D]">
                    <span className="text-[10px] uppercase font-bold text-[#8B949E] block">Model Agreement</span>
                    <span className="text-lg font-black text-[#3FB950] font-mono">{result.model_agreement}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D]">
                    <span className="text-[10px] uppercase font-bold text-[#8B949E] block">Reliability Score</span>
                    <span className="text-lg font-black text-[#C7ED3D] font-mono">{Math.round((result.reliability?.score || 0.9) * 100)}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D] col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase font-bold text-[#8B949E] block">Normalized Token</span>
                    <span className="text-base font-bold text-[#F0F6FC] capitalize">{result.normalized_name}</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Probability Gauge & Bars */}
              <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#21262D]"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#C7ED3D] transition-all duration-1000 ease-out"
                      strokeDasharray={`${result.confidence_score}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-[#F0F6FC] font-mono">{result.confidence_score}%</span>
                    <span className="text-[10px] uppercase font-bold text-[#8B949E]">Confidence</span>
                  </div>
                </div>

                {/* Probability Distribution Bar */}
                <div className="w-full space-y-1.5">
                  <div className="flex justify-between text-xs font-mono font-medium text-[#8B949E]">
                    <span className="text-[#58A6FF]">Male: {result.probability_distribution?.Male}%</span>
                    <span className="text-[#F778BA]">Female: {result.probability_distribution?.Female}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#21262D] rounded-full overflow-hidden flex border border-[#30363D]">
                    <div
                      style={{ width: `${result.probability_distribution?.Male}%` }}
                      className="bg-[#58A6FF] h-full"
                    ></div>
                    <div
                      style={{ width: `${result.probability_distribution?.Female}%` }}
                      className="bg-[#F778BA] h-full"
                    ></div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Explainability (XAI) Section */}
          <div className="bg-[#161B22] p-6 sm:p-8 rounded-2xl border border-[#30363D] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#30363D] pb-4">
              <div className="flex items-center space-x-2.5">
                <Cpu className="w-5 h-5 text-[#C7ED3D]" />
                <h4 className="text-lg font-bold text-[#F0F6FC] font-['Outfit']">Explainability & Feature Contribution</h4>
              </div>

              <div className="flex items-center bg-[#0D1117] p-1 rounded-lg border border-[#30363D] text-xs">
                <button
                  type="button"
                  onClick={() => setExplainMode('simple')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition ${explainMode === 'simple' ? 'bg-[#21262D] text-[#C7ED3D] border border-[#C7ED3D]/40 shadow' : 'text-[#8B949E] hover:text-[#F0F6FC]'}`}
                >
                  Simple Explanation
                </button>
                <button
                  type="button"
                  onClick={() => setExplainMode('technical')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition ${explainMode === 'technical' ? 'bg-[#21262D] text-[#C7ED3D] border border-[#C7ED3D]/40 shadow' : 'text-[#8B949E] hover:text-[#F0F6FC]'}`}
                >
                  Technical Factors
                </button>
              </div>
            </div>

            {explainMode === 'simple' ? (
              <ul className="space-y-2.5 text-sm text-[#F0F6FC]">
                {result.explanation?.simple_factors?.map((factor, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3FB950] flex-shrink-0 mt-0.5" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-2 font-mono text-xs text-[#8B949E] bg-[#0D1117] p-4 rounded-xl border border-[#30363D]">
                {result.explanation?.technical_factors?.map((tf, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Code className="w-3.5 h-3.5 text-[#C7ED3D] flex-shrink-0" />
                    <span className="text-[#F0F6FC]">{tf}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sub-Models Agreement Breakdown */}
          {result.models && (
            <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4">
              <div className="flex items-center space-x-2 text-[#C7ED3D] font-semibold text-sm">
                <Layers className="w-4 h-4 text-[#C7ED3D]" />
                <span>Ensemble Model Agreement Breakdown</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#8B949E] block">10.48M Lookup</span>
                  <span className="text-sm font-bold text-[#F0F6FC] uppercase font-mono">{result.models.lookup?.prediction}</span>
                  <span className="text-[10px] text-[#8B949E] block font-mono">Conf: {Math.round(result.models.lookup?.confidence * 100)}%</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#8B949E] block">Naïve Bayes</span>
                  <span className="text-sm font-bold text-[#F0F6FC] uppercase font-mono">{result.models.naive_bayes?.prediction}</span>
                  <span className="text-[10px] text-[#8B949E] block font-mono">Conf: {Math.round(result.models.naive_bayes?.confidence * 100)}%</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#8B949E] block">Decision Tree</span>
                  <span className="text-sm font-bold text-[#F0F6FC] uppercase font-mono">{result.models.decision_tree?.prediction}</span>
                  <span className="text-[10px] text-[#8B949E] block font-mono">Conf: {Math.round(result.models.decision_tree?.confidence * 100)}%</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#21262D] border border-[#C7ED3D]/50 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#C7ED3D] block">Final Ensemble</span>
                  <span className="text-sm font-black text-[#C7ED3D] uppercase font-mono">{result.models.ensemble?.prediction}</span>
                  <span className="text-[10px] text-[#3FB950] block font-mono">Conf: {Math.round(result.models.ensemble?.confidence * 100)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Intelligence Details Grid */}
          {result.origin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Etymology & Meaning */}
              <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4">
                <div className="flex items-center space-x-2 text-[#C7ED3D] font-semibold text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>Meaning & Regional Etymology</span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs uppercase text-[#8B949E] font-bold tracking-wider">Region & Language</span>
                    <p className="text-[#F0F6FC] font-medium">{result.origin?.region} ({result.origin?.language})</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-[#8B949E] font-bold tracking-wider">Meaning</span>
                    <p className="text-[#8B949E]">{result.meaning?.text || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Security & Boundaries */}
              <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4 flex flex-col justify-between">
                <div className="flex items-center space-x-2 text-[#3FB950] font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Responsible AI & Boundaries</span>
                </div>

                <p className="text-xs text-[#8B949E] leading-relaxed">
                  This system predicts statistical gender association based strictly on name patterns and demographic datasets. It does not infer personal identity or biological attributes.
                </p>

                <div className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D] text-[11px] text-[#8B949E]">
                  {result.prediction?.disclaimer}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
