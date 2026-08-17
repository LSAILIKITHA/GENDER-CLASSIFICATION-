import React, { useState } from 'react';
import { ArrowLeftRight, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';

export default function NameComparison() {
  const [name1, setName1] = useState('Aditya');
  const [name2, setName2] = useState('Arjun');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleCompare = async (e) => {
    if (e) e.preventDefault();
    if (!name1.trim() || !name2.trim()) {
      setError('Please enter two names to compare.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/name/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name1: name1.trim(), name2: name2.trim() }),
      });

      const res = await response.json();
      if (!response.ok || !res.success) {
        throw new Error(res.error || 'Failed to compare names');
      }

      setData(res);
    } catch (err) {
      setError(err.message || 'Error communicating with comparison engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-[#F0F6FC] tracking-tight font-['Outfit']">
          Side-by-Side Name Intelligence Comparison
        </h2>
        <p className="text-[#8B949E] text-sm max-w-xl mx-auto">
          Compare gender associations, similarity algorithms (Levenshtein, Jaro-Winkler, Soundex), origins, and etymology.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-[#161B22] p-6 sm:p-8 rounded-2xl border border-[#30363D] shadow-2xl">
        <form onSubmit={handleCompare} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#8B949E] mb-2 uppercase tracking-wider">
                First Name
              </label>
              <input
                type="text"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                placeholder="e.g. Aditya"
                className="w-full bg-[#0D1117] border border-[#30363D] px-4 py-3 rounded-xl text-[#F0F6FC] font-medium focus:outline-none focus:border-[#C7ED3D]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8B949E] mb-2 uppercase tracking-wider">
                Second Name
              </label>
              <input
                type="text"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                placeholder="e.g. Arjun"
                className="w-full bg-[#0D1117] border border-[#30363D] px-4 py-3 rounded-xl text-[#F0F6FC] font-medium focus:outline-none focus:border-[#C7ED3D]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-[#C7ED3D] hover:bg-[#D4F455] text-[#0D1117] font-extrabold text-sm shadow-lg shadow-[#C7ED3D]/25 flex items-center space-x-2 transition transform active:scale-95"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0D1117]" />
                  <span>Comparing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#0D1117]" />
                  <span>Compare Names</span>
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

      {/* Results View */}
      {data && (
        <div className="space-y-6">
          
          {/* Similarity Summary Card */}
          <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#30363D] pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-[#8B949E]">Similarity Classification</span>
                <h3 className="text-2xl font-black text-[#F0F6FC] font-['Outfit']">
                  {data.comparison.classification} <span className="font-mono text-[#C7ED3D]">({data.comparison.similarity_percentage}%)</span>
                </h3>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-md bg-[#21262D] border border-[#30363D] text-[#C7ED3D] font-semibold">
                  Phonetic Match: {data.comparison.phonetic_match ? 'Yes (Same Soundex)' : 'No'}
                </span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D]">
                <span className="text-[10px] uppercase font-bold text-[#8B949E] block">Jaro-Winkler</span>
                <span className="text-lg font-black text-[#C7ED3D] font-mono">{Math.round(data.comparison.jaro_winkler_similarity * 100)}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D]">
                <span className="text-[10px] uppercase font-bold text-[#8B949E] block">Levenshtein</span>
                <span className="text-lg font-black text-[#58A6FF] font-mono">{Math.round(data.comparison.levenshtein_similarity * 100)}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D]">
                <span className="text-[10px] uppercase font-bold text-[#8B949E] block">N-Gram Jaccard</span>
                <span className="text-lg font-black text-[#3FB950] font-mono">{Math.round(data.comparison.ngram_jaccard_similarity * 100)}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D]">
                <span className="text-[10px] uppercase font-bold text-[#8B949E] block">Soundex Codes</span>
                <span className="text-sm font-bold text-[#F0F6FC] font-mono">{data.comparison.soundex_code1} / {data.comparison.soundex_code2}</span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Intelligence Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name 1 Intelligence */}
            <div className="bg-[#161B22] p-6 rounded-2xl space-y-4 border border-[#30363D]">
              <div className="flex items-center justify-between">
                <h4 className="text-2xl font-black text-[#F0F6FC] font-['Outfit'] capitalize">{data.name1_intelligence.name}</h4>
                <span className="px-3 py-1 rounded-md bg-[#58A6FF]/10 border border-[#58A6FF]/30 text-[#58A6FF] text-xs font-mono font-bold uppercase">
                  {data.name1_intelligence.associated_gender}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 rounded-lg bg-[#0D1117] border border-[#30363D]/60 font-mono text-xs">
                  <span className="text-[#8B949E]">Confidence Score:</span>
                  <span className="font-bold text-[#F0F6FC]">{data.name1_intelligence.confidence_score}%</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-[#0D1117] border border-[#30363D]/60 font-mono text-xs">
                  <span className="text-[#8B949E]">Model Agreement:</span>
                  <span className="font-bold text-[#3FB950]">{data.name1_intelligence.model_agreement}%</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-[#0D1117] border border-[#30363D]/60 font-mono text-xs">
                  <span className="text-[#8B949E]">Reliability Level:</span>
                  <span className="font-bold text-[#C7ED3D] capitalize">{data.name1_intelligence.reliability?.level}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D]/60 space-y-1">
                  <span className="text-xs uppercase font-bold text-[#8B949E] block">Origin & Meaning</span>
                  <span className="text-xs text-[#F0F6FC] block font-medium">{data.name1_intelligence.origin?.region} ({data.name1_intelligence.origin?.language})</span>
                  <p className="text-xs text-[#8B949E]">{data.name1_intelligence.meaning?.text}</p>
                </div>
              </div>
            </div>

            {/* Name 2 Intelligence */}
            <div className="bg-[#161B22] p-6 rounded-2xl space-y-4 border border-[#30363D]">
              <div className="flex items-center justify-between">
                <h4 className="text-2xl font-black text-[#F0F6FC] font-['Outfit'] capitalize">{data.name2_intelligence.name}</h4>
                <span className="px-3 py-1 rounded-md bg-[#C7ED3D]/10 border border-[#C7ED3D]/30 text-[#C7ED3D] text-xs font-mono font-bold uppercase">
                  {data.name2_intelligence.associated_gender}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 rounded-lg bg-[#0D1117] border border-[#30363D]/60 font-mono text-xs">
                  <span className="text-[#8B949E]">Confidence Score:</span>
                  <span className="font-bold text-[#F0F6FC]">{data.name2_intelligence.confidence_score}%</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-[#0D1117] border border-[#30363D]/60 font-mono text-xs">
                  <span className="text-[#8B949E]">Model Agreement:</span>
                  <span className="font-bold text-[#3FB950]">{data.name2_intelligence.model_agreement}%</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-[#0D1117] border border-[#30363D]/60 font-mono text-xs">
                  <span className="text-[#8B949E]">Reliability Level:</span>
                  <span className="font-bold text-[#C7ED3D] capitalize">{data.name2_intelligence.reliability?.level}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0D1117] border border-[#30363D]/60 space-y-1">
                  <span className="text-xs uppercase font-bold text-[#8B949E] block">Origin & Meaning</span>
                  <span className="text-xs text-[#F0F6FC] block font-medium">{data.name2_intelligence.origin?.region} ({data.name2_intelligence.origin?.language})</span>
                  <p className="text-xs text-[#8B949E]">{data.name2_intelligence.meaning?.text}</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
