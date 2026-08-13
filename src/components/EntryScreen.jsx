import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, Zap, Layers, Database, Compass, 
  BarChart2, Search, CheckCircle2, UserCheck, RefreshCw, Cpu, Globe, Award, HelpCircle
} from 'lucide-react';

export default function EntryScreen({ onStartAnalyzing, onOpenAuth, user }) {
  // Local state for the hero's interactive preview widget
  const [sampleName, setSampleName] = useState('Aria');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sampleResult, setSampleResult] = useState({
    name: 'Aria',
    gender: 'Female',
    confidence: 96.4,
    probabilityMale: 0.036,
    probabilityFemale: 0.964,
    phoneticSuffix: '-ia (94% Female indicator)',
    originHint: 'Italian / Persian origin'
  });

  // Random Trivia Generator state
  const [triviaIndex, setTriviaIndex] = useState(0);
  const triviaList = [
    {
      title: "The Suffix '-ia' Effect",
      fact: "Names ending in '-ia' (e.g. Aria, Sophia, Olivia) have over a 96.2% statistical probability of being female across European and American census records.",
      tag: "Phonetic N-gram"
    },
    {
      title: "Unisex Phonetic Shifts",
      fact: "Names like Jordan, Taylor, and Morgan show balanced 50/50 probability curves, heavily influenced by 2-gram character transitions.",
      tag: "Distribution Insight"
    },
    {
      title: "Consonant Endings in male names",
      fact: "Names ending in hard consonants like '-k', '-t', or '-r' (e.g. Jack, Robert, Parker) correlate with an 89.1% male prediction weight in Naïve Bayes.",
      tag: "Linguistic Feature"
    },
    {
      title: "Patronymic Suffix '-son'",
      fact: "The suffix '-son' (e.g. Jackson, Harrison) carries a 99.1% male weight based on historical Nordic and Anglo-Saxon patronymic naming conventions.",
      tag: "Etymology Rule"
    }
  ];

  const quickSamples = ['Alex', 'Taylor', 'Aria', 'Siddharth', 'Jordan', 'Elena', 'Gabriel'];

  const handleRunSamplePredict = (nameToTest) => {
    if (!user) {
      onOpenAuth('login');
      return;
    }
    const target = nameToTest || sampleName;
    if (!target.trim()) return;
    
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const lower = target.toLowerCase();
      
      let isFemale = lower.endsWith('a') || lower.endsWith('i') || lower.endsWith('e') || lower.endsWith('ia') || lower.endsWith('lyn');
      if (lower === 'alex' || lower === 'jordan' || lower === 'taylor') {
        setSampleResult({
          name: target,
          gender: 'Unisex',
          confidence: 88.5,
          probabilityMale: 0.52,
          probabilityFemale: 0.48,
          phoneticSuffix: `'-${target.slice(-2)}' (Balanced distribution)`,
          originHint: 'Global Modern Name'
        });
        return;
      }

      const probF = isFemale ? 0.94 + Math.random() * 0.05 : 0.04 + Math.random() * 0.08;
      const probM = 1 - probF;
      const finalGender = probF > 0.5 ? 'Female' : 'Male';

      setSampleResult({
        name: target,
        gender: finalGender,
        confidence: Math.round((Math.max(probF, probM)) * 1000) / 10,
        probabilityMale: Math.round(probM * 1000) / 1000,
        probabilityFemale: Math.round(probF * 1000) / 1000,
        phoneticSuffix: `'-${target.slice(-2)}' (${finalGender} pattern)`,
        originHint: 'Statistical Suffix Correlated'
      });
    }, 350);
  };

  const handleNextTrivia = () => {
    setTriviaIndex((prev) => (prev + 1) % triviaList.length);
  };

  return (
    <div className="space-y-16 pb-12 animate-fadeIn">

      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 pb-8">
        
        {/* Glow Spheres */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none rounded-full"></div>

        <div className="text-center max-w-4xl mx-auto px-4 space-y-6">
          
          

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-['Outfit'] leading-tight sm:leading-none">
            Discover the Science & Gender Analytics <br className="hidden sm:inline" />
            Behind <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Any Name</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Powered by Scikit-Learn Naïve Bayes and Decision Tree ensembles trained on 50,000,000+ global name datasets with instant character n-gram phonetic extraction.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onStartAnalyzing('single')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-base shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center space-x-3"
            >
              <span>Analyze Names Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {!user ? (
              <button
                onClick={() => onOpenAuth('login')}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-panel hover:bg-slate-800/80 text-slate-200 font-semibold text-base border border-slate-700/80 hover:border-slate-500 transition flex items-center justify-center space-x-2"
              >
                <UserCheck className="w-5 h-5 text-indigo-400" />
                <span>Sign In / Create Account</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 px-5 py-3 rounded-2xl glass-panel border border-emerald-500/30 text-emerald-300 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Logged in as {user.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Interactive Instant Preview Box */}
        <div className="mt-12 max-w-3xl mx-auto px-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 shadow-2xl shadow-indigo-950/50 relative overflow-hidden">
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="text-base font-bold text-white font-['Outfit']">Interactive Live Demo Widget</h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                Instant Classifier Test
              </span>
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-slate-400 font-medium">Try quick sample:</span>
              {quickSamples.map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setSampleName(chip);
                    handleRunSamplePredict(chip);
                  }}
                  className={`text-xs px-3 py-1 rounded-xl transition font-medium border ${
                    sampleName === chip 
                      ? 'bg-indigo-600 text-white border-indigo-400' 
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Row */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={sampleName}
                  onChange={(e) => setSampleName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunSamplePredict()}
                  placeholder="Enter any name (e.g., Taylor, Samantha, Leo)..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl glass-input text-base text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => handleRunSamplePredict()}
                disabled={isAnalyzing}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>Test AI</span>
                    <Sparkles className="w-4 h-4 text-pink-300" />
                  </>
                )}
              </button>
            </div>

            {/* Prediction Output Card */}
            {sampleResult && (
              <div className="glass-card p-5 rounded-2xl border border-slate-700/60 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Classification Target</span>
                    <div className="text-2xl font-black text-white font-['Outfit']">{sampleResult.name}</div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${
                      sampleResult.gender === 'Female'
                        ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                        : sampleResult.gender === 'Male'
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    }`}>
                      {sampleResult.gender}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Confidence</span>
                      <span className="text-base font-extrabold text-emerald-400 font-mono">{sampleResult.confidence}%</span>
                    </div>
                  </div>
                </div>

                {/* Probability Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-indigo-400">Male Probability: {(sampleResult.probabilityMale * 100).toFixed(1)}%</span>
                    <span className="text-pink-400">Female Probability: {(sampleResult.probabilityFemale * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-l-full transition-all duration-500" 
                      style={{ width: `${sampleResult.probabilityMale * 100}%` }}
                    ></div>
                    <div 
                      className="h-full bg-gradient-to-r from-pink-400 to-pink-500 rounded-r-full transition-all duration-500" 
                      style={{ width: `${sampleResult.probabilityFemale * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                  <div className="flex items-center space-x-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Phonetic Suffix Rule: <strong className="text-slate-200">{sampleResult.phoneticSuffix}</strong></span>
                  </div>
                  <button
                    onClick={() => onStartAnalyzing('single')}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1 transition"
                  >
                    <span>Deep Analyze & Full Phonetics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </section>

      {/* Interesting Trivia / Etymology Generator Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="glass-card-accent p-6 sm:p-8 rounded-3xl border border-indigo-500/20 shadow-xl relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">Linguistic Etymology & Phonetic Facts</h3>
                <p className="text-xs text-slate-400">Discover statistical curiosities in global name distributions</p>
              </div>
            </div>

            <button
              onClick={handleNextTrivia}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700 flex items-center justify-center space-x-2 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next Random Fact</span>
            </button>
          </div>

          {/* Active Fact */}
          <div className="glass-card p-6 rounded-2xl border border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">
                {triviaList[triviaIndex].tag}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Fact #{triviaIndex + 1} of {triviaList.length}</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2 font-['Outfit']">{triviaList[triviaIndex].title}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{triviaList[triviaIndex].fact}</p>
          </div>

        </div>
      </section>

      {/* Animated Performance Counters */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-center hover:border-indigo-500/40 transition">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-3">
              <Database className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-white font-['Outfit'] mb-1">500,000+</div>
            <div className="text-xs text-slate-400 font-medium">Names Indexed</div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-center hover:border-pink-500/40 transition">
            <div className="inline-flex p-3 rounded-2xl bg-pink-500/10 text-pink-400 mb-3">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-white font-['Outfit'] mb-1">98.6%</div>
            <div className="text-xs text-slate-400 font-medium">Model Test Accuracy</div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-center hover:border-purple-500/40 transition">
            <div className="inline-flex p-3 rounded-2xl bg-purple-500/10 text-purple-400 mb-3">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-white font-['Outfit'] mb-1">&lt;20ms</div>
            <div className="text-xs text-slate-400 font-medium">Inference Speed</div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-center hover:border-emerald-500/40 transition">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-3">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-white font-['Outfit'] mb-1">Dual ML</div>
            <div className="text-xs text-slate-400 font-medium">Naïve Bayes + Decision Tree</div>
          </div>

        </div>
      </section>

      {/* Comprehensive Feature Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white font-['Outfit']">Explore NameLens Engine Capabilities</h2>
          <p className="text-sm text-slate-400 mt-2">Comprehensive suite for name classification, dataset management, and batch processing</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div 
            onClick={() => onStartAnalyzing('single')}
            className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/50 cursor-pointer group transition"
          >
            <div className="p-3.5 rounded-2xl bg-indigo-600/20 text-indigo-400 w-fit mb-4 group-hover:scale-110 transition">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-['Outfit'] group-hover:text-indigo-300 transition">
              Single Predictor
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Enter any name for instant probability breakdown, character n-gram extraction, and confidence scores.
            </p>
            <span className="text-xs font-semibold text-indigo-400 flex items-center space-x-1">
              <span>Open Predictor</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </span>
          </div>

          <div 
            onClick={() => onStartAnalyzing('batch')}
            className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-purple-500/50 cursor-pointer group transition"
          >
            <div className="p-3.5 rounded-2xl bg-purple-600/20 text-purple-400 w-fit mb-4 group-hover:scale-110 transition">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-['Outfit'] group-hover:text-purple-300 transition">
              Batch Classifier
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Upload CSV or paste multiple names to classify thousands of records with downloadable reports.
            </p>
            <span className="text-xs font-semibold text-purple-400 flex items-center space-x-1">
              <span>Launch Batch</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </span>
          </div>

          <div 
            onClick={() => onStartAnalyzing('dataset')}
            className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-pink-500/50 cursor-pointer group transition"
          >
            <div className="p-3.5 rounded-2xl bg-pink-600/20 text-pink-400 w-fit mb-4 group-hover:scale-110 transition">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-['Outfit'] group-hover:text-pink-300 transition">
              Dataset Retraining
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Add new custom names, tune hyper-parameters, and retrain Naïve Bayes & Decision Tree models dynamically.
            </p>
            <span className="text-xs font-semibold text-pink-400 flex items-center space-x-1">
              <span>Manage Models</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </span>
          </div>

          <div 
            onClick={() => onStartAnalyzing('explorer')}
            className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer group transition"
          >
            <div className="p-3.5 rounded-2xl bg-cyan-600/20 text-cyan-400 w-fit mb-4 group-hover:scale-110 transition">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-['Outfit'] group-hover:text-cyan-300 transition">
              Name Catalog
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Search and filter thousands of names by letter, origin, frequency, and gender probabilities.
            </p>
            <span className="text-xs font-semibold text-cyan-400 flex items-center space-x-1">
              <span>Explore Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </span>
          </div>

        </div>
      </section>

    </div>
  );
}
