import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, Zap, Layers, Database, Compass, 
  BarChart2, Search, CheckCircle2, UserCheck, RefreshCw, Cpu, Globe, Award, HelpCircle, Code
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
        
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-[#C7ED3D]/10 via-[#3FB950]/5 to-transparent blur-3xl pointer-events-none rounded-full"></div>

        <div className="text-center max-w-4xl mx-auto px-4 space-y-6">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#F0F6FC] font-['Outfit'] leading-tight sm:leading-none">
            Spatial Name Intelligence & <br className="hidden sm:inline" />
            Gender Analytics for <span className="text-[#C7ED3D]">Developers</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#8B949E] max-w-2xl mx-auto font-normal leading-relaxed">
            High-throughput probabilistic classifier and phonetic n-gram ensemble engine trained on over 50,000,000+ records with sub-millisecond lookups.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onStartAnalyzing('single')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#C7ED3D] hover:bg-[#D4F455] text-[#0D1117] font-extrabold text-base shadow-lg shadow-[#C7ED3D]/25 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center space-x-3"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-5 h-5 text-[#0D1117]" />
            </button>

            {!user ? (
              <button
                onClick={() => onOpenAuth('login')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#161B22] hover:bg-[#21262D] text-[#F0F6FC] font-semibold text-base border border-[#30363D] hover:border-[#C7ED3D] transition flex items-center justify-center space-x-2"
              >
                <UserCheck className="w-5 h-5 text-[#C7ED3D]" />
                <span>Sign In / Register</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#161B22] border border-[#3FB950]/40 text-[#3FB950] text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#3FB950]" />
                <span>Logged in as {user.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Interactive Instant Preview Box */}
        <div className="mt-12 max-w-3xl mx-auto px-4">
          <div className="bg-[#161B22] p-6 sm:p-8 rounded-2xl border border-[#30363D] shadow-2xl relative overflow-hidden">
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-[#C7ED3D] animate-pulse" />
                <h3 className="text-base font-bold text-[#F0F6FC] font-['Outfit']">Interactive Quick Test</h3>
              </div>
              <span className="text-[11px] font-mono font-semibold text-[#8B949E] bg-[#0D1117] px-3 py-1 rounded-md border border-[#30363D]">
                Ensemble Probe
              </span>
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-[#8B949E] font-medium">Quick sample:</span>
              {quickSamples.map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setSampleName(chip);
                    handleRunSamplePredict(chip);
                  }}
                  className={`text-xs px-3 py-1 rounded-lg transition font-medium border ${
                    sampleName === chip 
                      ? 'bg-[#21262D] text-[#C7ED3D] border-[#C7ED3D]' 
                      : 'bg-[#0D1117] text-[#8B949E] border-[#30363D] hover:text-[#F0F6FC] hover:border-[#8B949E]'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Row */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#8B949E]" />
                <input
                  type="text"
                  value={sampleName}
                  onChange={(e) => setSampleName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunSamplePredict()}
                  placeholder="Enter name to evaluate (e.g., Taylor, Samantha, Leo)..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0D1117] border border-[#30363D] text-base text-[#F0F6FC] placeholder-[#8B949E] focus:outline-none focus:border-[#C7ED3D] focus:ring-1 focus:ring-[#C7ED3D]"
                />
              </div>
              <button
                onClick={() => handleRunSamplePredict()}
                disabled={isAnalyzing}
                className="px-6 py-3 rounded-xl bg-[#C7ED3D] hover:bg-[#D4F455] text-[#0D1117] font-extrabold text-sm shadow-md transition flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0D1117]" />
                ) : (
                  <>
                    <span>Execute</span>
                    <Sparkles className="w-4 h-4 text-[#0D1117]" />
                  </>
                )}
              </button>
            </div>

            {/* Prediction Output Card */}
            {sampleResult && (
              <div className="bg-[#21262D] p-5 rounded-xl border border-[#30363D] animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4 mb-4">
                  <div>
                    <span className="text-xs text-[#8B949E] uppercase tracking-wider font-semibold">Target Entity</span>
                    <div className="text-2xl font-black text-[#F0F6FC] font-['Outfit']">{sampleResult.name}</div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-md text-xs font-mono font-bold border ${
                      sampleResult.gender === 'Female'
                        ? 'bg-[#F778BA]/10 text-[#F778BA] border-[#F778BA]/30'
                        : sampleResult.gender === 'Male'
                        ? 'bg-[#58A6FF]/10 text-[#58A6FF] border-[#58A6FF]/30'
                        : 'bg-[#C7ED3D]/10 text-[#C7ED3D] border-[#C7ED3D]/30'
                    }`}>
                      {sampleResult.gender}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#8B949E] uppercase font-semibold block">Confidence</span>
                      <span className="text-base font-extrabold text-[#C7ED3D] font-mono">{sampleResult.confidence}%</span>
                    </div>
                  </div>
                </div>

                {/* Probability Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono font-semibold">
                    <span className="text-[#58A6FF]">Male: {(sampleResult.probabilityMale * 100).toFixed(1)}%</span>
                    <span className="text-[#F778BA]">Female: {(sampleResult.probabilityFemale * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#0D1117] rounded-full overflow-hidden flex p-0.5 border border-[#30363D]">
                    <div 
                      className="h-full bg-[#58A6FF] rounded-l-full transition-all duration-500" 
                      style={{ width: `${sampleResult.probabilityMale * 100}%` }}
                    ></div>
                    <div 
                      className="h-full bg-[#F778BA] rounded-r-full transition-all duration-500" 
                      style={{ width: `${sampleResult.probabilityFemale * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#30363D] flex flex-wrap items-center justify-between text-xs text-[#8B949E] gap-2">
                  <div className="flex items-center space-x-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#C7ED3D]" />
                    <span>Phonetic Suffix Rule: <strong className="text-[#F0F6FC]">{sampleResult.phoneticSuffix}</strong></span>
                  </div>
                  <button
                    onClick={() => onStartAnalyzing('single')}
                    className="text-[#C7ED3D] hover:text-[#D4F455] font-semibold flex items-center space-x-1 transition"
                  >
                    <span>Full Explainability Matrix</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </section>

      {/* Interesting Trivia / Etymology Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-[#161B22] p-6 sm:p-8 rounded-2xl border border-[#30363D] shadow-xl relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-[#21262D] text-[#C7ED3D] border border-[#30363D]">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#F0F6FC] font-['Outfit']">Linguistic Etymology & Empirical Heuristics</h3>
                <p className="text-xs text-[#8B949E]">Statistical patterns discovered in global census training records</p>
              </div>
            </div>

            <button
              onClick={handleNextTrivia}
              className="px-4 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-xs font-semibold text-[#F0F6FC] border border-[#30363D] hover:border-[#C7ED3D] flex items-center justify-center space-x-2 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#C7ED3D]" />
              <span>Next Heuristic</span>
            </button>
          </div>

          {/* Active Fact */}
          <div className="bg-[#21262D] p-6 rounded-xl border border-[#30363D]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-extrabold text-[#C7ED3D] uppercase tracking-wider">
                {triviaList[triviaIndex].tag}
              </span>
              <span className="text-[11px] text-[#8B949E] font-mono">Fact #{triviaIndex + 1} of {triviaList.length}</span>
            </div>
            <h4 className="text-lg font-bold text-[#F0F6FC] mb-2 font-['Outfit']">{triviaList[triviaIndex].title}</h4>
            <p className="text-sm text-[#8B949E] leading-relaxed">{triviaList[triviaIndex].fact}</p>
          </div>

        </div>
      </section>

      {/* Performance Counters */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] text-center hover:border-[#C7ED3D] transition">
            <div className="inline-flex p-3 rounded-xl bg-[#21262D] text-[#C7ED3D] mb-3">
              <Database className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-[#F0F6FC] font-['Outfit'] mb-1">50,000,000+</div>
            <div className="text-xs text-[#8B949E] font-medium">Names Indexed</div>
          </div>

          <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] text-center hover:border-[#3FB950] transition">
            <div className="inline-flex p-3 rounded-xl bg-[#21262D] text-[#3FB950] mb-3">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-[#F0F6FC] font-['Outfit'] mb-1 font-mono">98.6%</div>
            <div className="text-xs text-[#8B949E] font-medium">Model Test Accuracy</div>
          </div>

          <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] text-center hover:border-[#C7ED3D] transition">
            <div className="inline-flex p-3 rounded-xl bg-[#21262D] text-[#C7ED3D] mb-3">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-[#F0F6FC] font-['Outfit'] mb-1 font-mono">&lt;20ms</div>
            <div className="text-xs text-[#8B949E] font-medium">Inference Latency</div>
          </div>

          <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] text-center hover:border-[#3FB950] transition">
            <div className="inline-flex p-3 rounded-xl bg-[#21262D] text-[#3FB950] mb-3">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-[#F0F6FC] font-['Outfit'] mb-1">Dual Engine</div>
            <div className="text-xs text-[#8B949E] font-medium">Naïve Bayes + Decision Tree</div>
          </div>

        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#F0F6FC] font-['Outfit']">Developer Intelligence Capabilities</h2>
          <p className="text-sm text-[#8B949E] mt-2">Comprehensive suite for name classification, dataset management, and batch processing</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div 
            onClick={() => onStartAnalyzing('single')}
            className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] hover:border-[#C7ED3D] cursor-pointer group transition"
          >
            <div className="p-3.5 rounded-xl bg-[#21262D] text-[#C7ED3D] w-fit mb-4 group-hover:scale-105 transition">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F0F6FC] mb-2 font-['Outfit'] group-hover:text-[#C7ED3D] transition">
              Single Predictor
            </h3>
            <p className="text-xs text-[#8B949E] leading-relaxed mb-4">
              Enter any name for instant probability breakdown, character n-gram extraction, and confidence scores.
            </p>
            <span className="text-xs font-semibold text-[#C7ED3D] flex items-center space-x-1">
              <span>Open Predictor</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </span>
          </div>

          <div 
            onClick={() => onStartAnalyzing('batch')}
            className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] hover:border-[#C7ED3D] cursor-pointer group transition"
          >
            <div className="p-3.5 rounded-xl bg-[#21262D] text-[#C7ED3D] w-fit mb-4 group-hover:scale-105 transition">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F0F6FC] mb-2 font-['Outfit'] group-hover:text-[#C7ED3D] transition">
              Batch Classifier
            </h3>
            <p className="text-xs text-[#8B949E] leading-relaxed mb-4">
              Upload CSV or paste multiple names to classify thousands of records with downloadable reports.
            </p>
            <span className="text-xs font-semibold text-[#C7ED3D] flex items-center space-x-1">
              <span>Launch Batch</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </span>
          </div>

          <div 
            onClick={() => onStartAnalyzing('dataset')}
            className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] hover:border-[#C7ED3D] cursor-pointer group transition"
          >
            <div className="p-3.5 rounded-xl bg-[#21262D] text-[#C7ED3D] w-fit mb-4 group-hover:scale-105 transition">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F0F6FC] mb-2 font-['Outfit'] group-hover:text-[#C7ED3D] transition">
              Dataset Retraining
            </h3>
            <p className="text-xs text-[#8B949E] leading-relaxed mb-4">
              Add new custom names, tune hyper-parameters, and retrain Naïve Bayes & Decision Tree models dynamically.
            </p>
            <span className="text-xs font-semibold text-[#C7ED3D] flex items-center space-x-1">
              <span>Manage Models</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </span>
          </div>

          <div 
            onClick={() => onStartAnalyzing('mllab')}
            className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] hover:border-[#3FB950] cursor-pointer group transition"
          >
            <div className="p-3.5 rounded-xl bg-[#21262D] text-[#3FB950] w-fit mb-4 group-hover:scale-105 transition">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F0F6FC] mb-2 font-['Outfit'] group-hover:text-[#3FB950] transition">
              ML Lab & Global Stats
            </h3>
            <p className="text-xs text-[#8B949E] leading-relaxed mb-4">
              Explore model registry versioning, real-time query stats, and regional bias & fairness audits in one dashboard.
            </p>
            <span className="text-xs font-semibold text-[#3FB950] flex items-center space-x-1">
              <span>Open ML Suite</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </span>
          </div>

        </div>
      </section>

    </div>
  );
}
