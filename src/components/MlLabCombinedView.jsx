import React, { useState, useEffect } from 'react';
import {
  Cpu, BarChart2, Scale, GitBranch, RefreshCw, Activity, Database, Globe,
  ShieldCheck, CheckCircle2, ShieldAlert, PieChart, Layers, Plus, ArrowRight,
  TrendingUp, Award, HelpCircle
} from 'lucide-react';
import ModelLab from './ModelLab';
import AnalyticsView from './AnalyticsView';
import BiasFairnessDashboard from './BiasFairnessDashboard';

export default function MlLabCombinedView({ initialSubTab = 'modellab' }) {
  const [subTab, setSubTab] = useState(initialSubTab);

  // Sync subTab if initialSubTab prop changes
  useEffect(() => {
    if (['modellab', 'analytics', 'fairness', 'all'].includes(initialSubTab)) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const subTabs = [
    {
      id: 'modellab',
      label: 'ML Model Lab',
      shortLabel: 'Model Registry',
      icon: Cpu,
      badge: 'v2.4 Production',
      badgeColor: 'bg-[#C7ED3D]/10 text-[#C7ED3D] border-[#C7ED3D]/30'
    },
    {
      id: 'analytics',
      label: 'Global Stats',
      shortLabel: 'Analytics',
      icon: BarChart2,
      badge: 'Live Metrics',
      badgeColor: 'bg-[#58A6FF]/10 text-[#58A6FF] border-[#58A6FF]/30'
    },
    {
      id: 'fairness',
      label: 'Bias & Fairness',
      shortLabel: 'Fairness',
      icon: Scale,
      badge: 'Ethical AI',
      badgeColor: 'bg-[#3FB950]/10 text-[#3FB950] border-[#3FB950]/30'
    },
    {
      id: 'all',
      label: 'All-in-One Dashboard',
      shortLabel: 'Full View',
      icon: Layers,
      badge: '3-in-1 Suite',
      badgeColor: 'bg-[#C7ED3D]/10 text-[#C7ED3D] border-[#C7ED3D]/30'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Hero Banner */}
      <div className="bg-[#161B22] p-6 sm:p-8 rounded-2xl border border-[#30363D] relative overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#C7ED3D]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-[#3FB950]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F0F6FC] tracking-tight font-['Outfit']">
              ML Lab, Global Stats & Fairness
            </h2>
            <p className="text-[#8B949E] text-sm sm:text-base max-w-2xl font-medium">
              Monitor production Naïve Bayes & Ensemble model performance, query statistics across 10.48M ground truth names, and audit regional bias metrics in one workspace.
            </p>
          </div>

          {/* Quick Metrics Cards on Banner */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto shrink-0 font-mono">
            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-center">
              <div className="text-[10px] uppercase font-bold text-[#8B949E]">Model Accuracy</div>
              <div className="text-xl font-black text-[#3FB950] font-['Outfit']">98.2%</div>
              <div className="text-[9px] text-[#8B949E]">v2.4 Ensemble</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-center">
              <div className="text-[10px] uppercase font-bold text-[#8B949E]">Index Dataset</div>
              <div className="text-xl font-black text-[#C7ED3D] font-['Outfit']">10.48M</div>
              <div className="text-[9px] text-[#8B949E]">Ground Truth</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-center">
              <div className="text-[10px] uppercase font-bold text-[#8B949E]">Demographic</div>
              <div className="text-xl font-black text-[#58A6FF] font-['Outfit']">98.5%</div>
              <div className="text-[9px] text-[#8B949E]">Fairness Rating</div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs Switcher */}
        <div className="mt-8 pt-6 border-t border-[#30363D] flex items-center justify-center md:justify-start overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center space-x-2 bg-[#0D1117] p-1.5 rounded-xl border border-[#30363D]">
            {subTabs.map((t) => {
              const Icon = t.icon;
              const isActive = subTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSubTab(t.id)}
                  className={`flex items-center space-x-2.5 px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#21262D] text-[#C7ED3D] border border-[#C7ED3D]/50 shadow-sm scale-[1.02]'
                      : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#161B22]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C7ED3D]' : 'text-[#8B949E]'}`} />
                  <span>{t.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md border font-mono hidden lg:inline-block ${t.badgeColor}`}>
                    {t.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tab Content Display */}
      <div className="transition-all duration-300">
        {subTab === 'modellab' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-bold text-[#F0F6FC] font-['Outfit'] flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-[#C7ED3D]" />
                <span>Model Registry, Confusion Matrix & Evaluation Suite</span>
              </h3>
              <span className="text-xs text-[#8B949E] font-medium font-mono">10.48M Trained Baseline</span>
            </div>
            <ModelLab />
          </div>
        )}

        {subTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-bold text-[#F0F6FC] font-['Outfit'] flex items-center space-x-2">
                <BarChart2 className="w-5 h-5 text-[#C7ED3D]" />
                <span>Global System Analytics & Query Intelligence</span>
              </h3>
              <span className="text-xs text-[#8B949E] font-medium font-mono">Real-time SQLite Search Logs</span>
            </div>
            <AnalyticsView />
          </div>
        )}

        {subTab === 'fairness' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-bold text-[#F0F6FC] font-['Outfit'] flex items-center space-x-2">
                <Scale className="w-5 h-5 text-[#C7ED3D]" />
                <span>Demographic Fairness, Bias Auditing & Regional Coverage</span>
              </h3>
              <span className="text-xs text-[#8B949E] font-medium font-mono">5 Regional Datasets Audited</span>
            </div>
            <BiasFairnessDashboard />
          </div>
        )}

        {subTab === 'all' && (
          <div className="space-y-12 animate-fadeIn">
            {/* Section 1: Model Lab */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-[#21262D] text-[#C7ED3D] border border-[#30363D]">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#F0F6FC] font-['Outfit']">1. ML Model Lab & Registry</h3>
                    <p className="text-xs text-[#8B949E]">Model versions, confusion matrix, precision, recall & F1 scores</p>
                  </div>
                </div>
                <button
                  onClick={() => setSubTab('modellab')}
                  className="text-xs text-[#C7ED3D] hover:text-[#D4F455] font-semibold flex items-center space-x-1"
                >
                  <span>Expand Model Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <ModelLab />
            </div>

            {/* Section 2: Global Stats */}
            <div className="space-y-4 pt-6 border-t border-[#30363D]">
              <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-[#21262D] text-[#C7ED3D] border border-[#30363D]">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#F0F6FC] font-['Outfit']">2. Global System Analytics</h3>
                    <p className="text-xs text-[#8B949E]">Classification distributions, query volume, average confidence & top names</p>
                  </div>
                </div>
                <button
                  onClick={() => setSubTab('analytics')}
                  className="text-xs text-[#C7ED3D] hover:text-[#D4F455] font-semibold flex items-center space-x-1"
                >
                  <span>Expand Global Stats</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <AnalyticsView />
            </div>

            {/* Section 3: Bias & Fairness */}
            <div className="space-y-4 pt-6 border-t border-[#30363D]">
              <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-[#21262D] text-[#C7ED3D] border border-[#30363D]">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#F0F6FC] font-['Outfit']">3. Bias & Fairness Audit</h3>
                    <p className="text-xs text-[#8B949E]">Demographic group accuracy, regional breakdown & ambiguity thresholds</p>
                  </div>
                </div>
                <button
                  onClick={() => setSubTab('fairness')}
                  className="text-xs text-[#C7ED3D] hover:text-[#D4F455] font-semibold flex items-center space-x-1"
                >
                  <span>Expand Bias & Fairness</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <BiasFairnessDashboard />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
