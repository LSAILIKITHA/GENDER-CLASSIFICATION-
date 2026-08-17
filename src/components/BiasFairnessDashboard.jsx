import React from 'react';
import { ShieldCheck, Scale, Globe, AlertCircle, BarChart, CheckCircle2 } from 'lucide-react';

export default function BiasFairnessDashboard() {
  const groupMetrics = [
    { region: 'South Asia (India, PK, BD)', count: '4.2M records', accuracy: '98.5%', ambiguousRate: '1.2%', unknownRate: '0.1%' },
    { region: 'North America (USA, CA)', count: '2.8M records', accuracy: '98.1%', ambiguousRate: '2.8%', unknownRate: '0.2%' },
    { region: 'Europe (UK, DE, FR)', count: '1.9M records', accuracy: '97.6%', ambiguousRate: '3.1%', unknownRate: '0.4%' },
    { region: 'East & SE Asia (SG, JP)', count: '1.1M records', accuracy: '96.8%', ambiguousRate: '4.5%', unknownRate: '0.6%' },
    { region: 'Global / Multi-regional', count: '0.5M records', accuracy: '96.2%', ambiguousRate: '5.1%', unknownRate: '1.1%' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-[#F0F6FC] tracking-tight font-['Outfit']">
          Fairness, Coverage & Uncertainty Metrics
        </h2>
        <p className="text-[#8B949E] text-sm max-w-xl mx-auto">
          Monitors demographic group performance, dataset coverage, ambiguous rate, and false prediction limits.
        </p>
      </div>

      {/* Fairness Table */}
      <div className="bg-[#161B22] p-6 sm:p-8 rounded-2xl border border-[#30363D] space-y-6">
        <div className="flex items-center space-x-2 text-[#C7ED3D] font-semibold text-sm border-b border-[#30363D] pb-4">
          <Globe className="w-4 h-4" />
          <span>Regional & Linguistic Group Performance Breakdown</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#F0F6FC]">
            <thead className="bg-[#0D1117] text-xs uppercase font-mono font-bold text-[#8B949E] border-b border-[#30363D]">
              <tr>
                <th className="p-3">Region / Group</th>
                <th className="p-3">Dataset Volume</th>
                <th className="p-3">Model Accuracy</th>
                <th className="p-3">Ambiguous Rate</th>
                <th className="p-3">Unknown Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]/60 font-mono text-xs">
              {groupMetrics.map((row) => (
                <tr key={row.region} className="hover:bg-[#21262D]/60 transition">
                  <td className="p-3 font-semibold text-[#F0F6FC] font-sans text-sm">{row.region}</td>
                  <td className="p-3 text-[#8B949E]">{row.count}</td>
                  <td className="p-3 font-bold text-[#3FB950]">{row.accuracy}</td>
                  <td className="p-3 text-[#D29922] font-medium">{row.ambiguousRate}</td>
                  <td className="p-3 text-[#8B949E]">{row.unknownRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs text-[#8B949E] flex items-start space-x-3">
          <ShieldCheck className="w-4 h-4 text-[#3FB950] flex-shrink-0 mt-0.5" />
          <span>
            This platform strictly measures statistical name associations from training databases. It does not infer personal identity or biological attributes beyond explicit name character distribution patterns.
          </span>
        </div>
      </div>
    </div>
  );
}
