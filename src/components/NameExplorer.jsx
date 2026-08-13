import React, { useState, useEffect } from 'react';
import { Compass, Search, Globe, Tag, Sparkles, BookOpen, RefreshCw } from 'lucide-react';

export default function NameExplorer() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    fetchExplorerData();
  }, []);

  const fetchExplorerData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/explorer');
      const data = await response.json();
      if (data.success && data.catalog) {
        setCatalog(data.catalog);
      }
    } catch (err) {
      console.error('Failed to load explorer catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  // Catalog is already an array of {name, prediction, confidence, origin, category, meaning}
  const filteredNames = catalog.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.origin && item.origin.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (item.meaning && item.meaning.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCat = selectedCategory === 'ALL' || item.origin?.toUpperCase() === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Curated Intelligence Catalog</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
          Global Name Intelligence Catalog
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          Browse verified name meanings, historical backgrounds, regional popularity metrics, and classifications.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search names, origins, or meanings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-input px-4 py-2.5 pl-10 rounded-xl text-white text-xs font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'SANSKRIT', 'LATIN', 'GREEK', 'GERMANIC'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Catalog Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          <span className="text-slate-400 text-sm font-medium">Loading Name Intelligence Catalog...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNames.map((item) => (
            <div key={item.name} className="glass-card p-6 rounded-3xl space-y-4 relative flex flex-col justify-between">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white capitalize font-['Outfit']">{item.name}</h3>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase">
                    {item.origin || 'Vedic/Global'}
                  </span>
                </div>

                <p className="text-slate-300 text-xs font-medium leading-relaxed">
                  {item.meaning || 'Popular personal name with rich cultural significance.'}
                </p>
              </div>

              {/* Regional popularity preview */}
              {item.regional && (
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Regional Index</span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(item.regional).slice(0, 3).map(([reg, val]) => (
                      <span key={reg} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] border border-slate-800 font-semibold">
                        {reg}: {val}%
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
